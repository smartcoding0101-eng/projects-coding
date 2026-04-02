<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Persona;
use App\Models\KardexProducto;
use App\Models\LibroDiario;
use App\Services\EcommerceCheckoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class TriangulacionAuditTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Producto $producto;

    protected function setUp(): void
    {
        parent::setUp();

        // Configuración de Permisos y Roles para el Auditor
        $permission = Permission::create(['name' => 'gestionar usuarios']);
        $role = Role::create(['name' => 'SuperAdmin']);
        $role->givePermissionTo($permission);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SuperAdmin');

        // Crear Categoría Obligatoria
        $categoria = \App\Models\Categoria::create([
            'nombre' => 'Categoría de Auditoría',
            'slug' => 'categoria-auditoria',
            'descripcion' => 'Para pruebas de sistema'
        ]);

        // Configuración de Inventario Inicial
        $this->producto = Producto::create([
            'nombre' => 'Producto de Auditoría',
            'slug' => 'producto-auditoria',
            'codigo_sku' => 'AUDIT-001',
            'categoria_id' => $categoria->id,
            'stock_actual' => 100,
            'stock_minimo' => 5,
            'precio_general' => 100.00,
            'precio_asociado' => 90.00,
            'activo' => true
        ]);
    }

    /** @test */
    public function auditoria_kyc_automatizado_para_invitados(): void
    {
        $checkoutService = app(EcommerceCheckoutService::class);
        
        $datosCliente = [
            'nombre' => 'Auditor Invitado',
            'ci' => '9999999',
            'telefono' => '70000000',
            'direccion' => 'Calle Auditoria 123'
        ];

        $carrito = [
            ['id' => $this->producto->id, 'cantidad' => 2, 'precio' => 100.00]
        ];

        // Ejecutar Checkout
        $pedido = $checkoutService->procesarCheckout($datosCliente, $carrito, 'qr', ['metodo' => 'pick_up']);

        // 1. Verificar registro en tabla Personas (KYC)
        $this->assertDatabaseHas('personas', [
            'nombres' => 'Auditor Invitado',
            'ci' => '9999999'
        ]);

        $persona = Persona::where('ci', '9999999')->first();
        $this->assertEquals($persona->id, $pedido->persona_id);
    }

    /** @test */
    public function auditoria_segregacion_pago_qr_sin_salida_de_stock(): void
    {
        $pedido = Pedido::create([
            'user_id' => $this->admin->id,
            'numero_orden' => 'ORD-TEST-01',
            'total' => 500,
            'tipo_pago' => 'qr',
            'estado_pago' => 'pendiente_validacion',
            'estado_entrega' => 'por_recoger',
            'nombre_cliente' => 'Test',
            'ci_cliente' => '123'
        ]);

        $stockInicial = $this->producto->stock_actual;

        // Simular Validación de Pago por el Administrador
        $this->actingAs($this->admin)->post(route('admin.pedidos.validar', $pedido));

        $pedido->refresh();
        $this->producto->refresh();

        // 1. El pago debe estar validado
        $this->assertEquals('pagado', $pedido->estado_pago);

        // 2. EL STOCK DEBE SEGUIR IGUAL (SEGREGACIÓN)
        $this->assertEquals($stockInicial, $this->producto->stock_actual, 'ERROR DE AUDITORÍA: El pago de QR descontó stock indebidamente.');

        // 3. Debe existir registro en el Libro Diario
        $this->assertDatabaseHas('libro_diarios', [
            'referencia_id' => $pedido->id,
            'ingreso' => $pedido->total
        ]);
    }

    /** @test */
    public function auditoria_triangulacion_entrega_con_descuento_formal_y_kardex(): void
    {
        $pedido = Pedido::create([
            'user_id' => $this->admin->id,
            'numero_orden' => 'ORD-TEST-02',
            'total' => 100,
            'tipo_pago' => 'qr',
            'estado_pago' => 'pagado', // Ya pagado
            'estado_entrega' => 'por_recoger',
            'nombre_cliente' => 'Test',
            'ci_cliente' => '123'
        ]);

        \App\Models\PedidoDetalle::create([
            'pedido_id' => $pedido->id,
            'producto_id' => $this->producto->id,
            'cantidad' => 5,
            'precio_unitario' => 20,
            'subtotal' => 100
        ]);

        $stockAnteEntrega = $this->producto->stock_actual;

        // Simular Entrega Física
        $this->actingAs($this->admin)->post(route('admin.pedidos.entregar', $pedido));

        $this->producto->refresh();

        // 1. El stock debe haber disminuido ahora
        $this->assertEquals($stockAnteEntrega - 5, $this->producto->stock_actual);

        // 2. Debe existir registro en KardexProducto
        $this->assertDatabaseHas('kardex_productos', [
            'producto_id' => $this->producto->id,
            'tipo_movimiento' => 'egreso',
            'cantidad' => 5,
            'saldo_stock' => $this->producto->stock_actual
        ]);
    }

    /** @test */
    public function auditoria_estres_atomicidad_despachos_concurrentes(): void
    {
        // Simulamos 5 despachos de 10 unidades cada uno
        // El stock inicial es 100. Resultado final debe ser 50.
        
        for ($i=0; $i < 5; $i++) { 
            $pedido = Pedido::create([
                'user_id' => $this->admin->id,
                'numero_orden' => 'ORD-BURST-'.$i,
                'total' => 100,
                'tipo_pago' => 'qr',
                'estado_pago' => 'pagado',
                'estado_entrega' => 'por_recoger',
                'nombre_cliente' => 'Burst Test',
                'ci_cliente' => '123'
            ]);

            \App\Models\PedidoDetalle::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $this->producto->id,
                'cantidad' => 10,
                'precio_unitario' => 10,
                'subtotal' => 100
            ]);

            $this->actingAs($this->admin)->post(route('admin.pedidos.entregar', $pedido));
        }

        $this->producto->refresh();
        $this->assertEquals(50, $this->producto->stock_actual, 'ERROR DE INTEGRIDAD: Los despachos concurrentes fallaron en el cálculo de stock final.');
    }
}
