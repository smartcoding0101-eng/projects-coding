<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Persona;
use App\Models\Caja;
use App\Models\CajaMovimiento;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\LibroDiario;
use App\Models\KardexProducto;
use App\Models\Kardex; // Kardex Financiero
use App\Services\EcommerceCheckoutService;
use App\Services\AccountingService;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RealE2ETransactionsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $socio;
    private Categoria $categoria;
    private Producto $producto;
    private EcommerceCheckoutService $checkoutService;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Inicializar Roles y Permisos de Seguridad
        Role::firstOrCreate(['name' => 'SuperAdmin']);
        Role::firstOrCreate(['name' => 'Socio']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SuperAdmin');

        $this->socio = User::factory()->create(['ci' => '10203040']);
        $this->socio->assignRole('Socio');

        $persona = Persona::create([
            'nombres' => 'Juan',
            'apellidos' => 'Perez Socio',
            'ci' => '10203040',
            'celular' => '78945612',
            'genero' => 'MASCULINO',
            'institucion' => 'Policía Boliviana',
            'tipo_afiliacion' => 'Activo',
            'garantia_tipo' => 'Ninguna'
        ]);
        $this->socio->update(['persona_id' => $persona->id]);

        $this->checkoutService = app(EcommerceCheckoutService::class);

        // 2. Configurar Productos de Prueba (Estetoscopio)
        $this->categoria = Categoria::create([
            'nombre' => 'Equipamiento Médico',
            'slug' => 'medico'
        ]);

        $this->producto = Producto::create([
            'nombre' => 'Estetoscopio Profesional',
            'slug' => 'estetoscopio-profesional',
            'codigo_sku' => 'MED-EST-01',
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 10,
            'stock_minimo' => 2,
            'precio_general' => 500.00,
            'precio_asociado' => 450.00,
            'activo' => true
        ]);
    }

    #[Test]
    public function auditoria_e2e_ciclo_transaccional_completo_compra_logistica_contabilidad(): void
    {
        // -------------------------------------------------------------
        // PASO 1: Apertura de Caja (Módulo Financiero / Caja)
        // -------------------------------------------------------------
        $caja = Caja::create([
            'user_id' => $this->admin->id,
            'fecha_apertura' => now(),
            'saldo_inicial_bob' => 1000.00,
            'saldo_inicial_usd' => 100.00,
            'estado' => 'abierta',
            'observaciones_apertura' => 'Apertura de caja para auditoría de transacciones'
        ]);

        $this->assertTrue($caja->estaAbierta());

        // -------------------------------------------------------------
        // PASO 2: Compra Comercial (E-commerce / Venta con QR)
        // -------------------------------------------------------------
        // El socio realiza la compra de 2 estetoscopios a precio de asociado (450 * 2 = 900 BOB) + envío (15 BOB) = 915 BOB.
        $carrito = [
            ['id' => $this->producto->id, 'cantidad' => 2]
        ];

        $logistica = [
            'tipo_entrega' => 'envio_domicilio',
            'direccion_envio' => 'Av. Hernando Siles #450, La Paz'
        ];

        $pedido = $this->checkoutService->procesarCheckout(
            ['nombre' => 'Juan Perez Socio', 'ci' => '10203040'],
            $carrito,
            'qr',
            $logistica,
            $this->socio
        );

        // Verificación de Venta & Segregación Inicial
        $this->assertEquals('qr', $pedido->tipo_pago);
        $this->assertEquals('pendiente_validacion', $pedido->estado_pago);
        $this->assertEquals('por_recoger', $pedido->estado_entrega);
        $this->assertEquals(915.00, $pedido->total);

        // Segregación de Inventario: El stock no disminuye físicamente hasta el despacho final
        $this->assertEquals(10, $this->producto->fresh()->stock_actual, 'ERROR: El inventario físico se descontó antes del despacho.');

        // -------------------------------------------------------------
        // PASO 3: Validación del Pago QR por el Administrador (Filament)
        // -------------------------------------------------------------
        $this->actingAs($this->admin);
        
        \Livewire\Livewire::test(\App\Filament\Resources\Pedidos\Pages\ListPedidos::class)
            ->callTableAction('validarPago', $pedido);

        $pedido->refresh();
        $this->assertEquals('pagado', $pedido->estado_pago, 'El pago del pedido no se marcó como PAGADO.');

        // -------------------------------------------------------------
        // PASO 4: Asentamiento Contable Automático (Libro Diario)
        // -------------------------------------------------------------
        // Al confirmarse el pago, se debe inyectar el dinero en la caja y asentar en el Libro Diario
        $asiento = LibroDiario::where('tipo_transaccion', 'venta_ecommerce')
            ->where('referencia_id', $pedido->id)
            ->first();

        $this->assertNotNull($asiento, 'ERROR CONTABLE: No se generó el asiento en el Libro Diario.');
        $this->assertEquals(915.00, $asiento->ingreso);
        $this->assertEquals(0.00, $asiento->egreso);

        // -------------------------------------------------------------
        // PASO 5: Despacho Físico y Descuento de Stock (Logística y Kardex)
        // -------------------------------------------------------------
        // El administrador despacha el producto de los almacenes
        \Livewire\Livewire::test(\App\Filament\Resources\Pedidos\Pages\ListPedidos::class)
            ->callTableAction('entregarPedido', $pedido);

        $pedido->refresh();
        $this->assertEquals('entregado', $pedido->estado_entrega, 'El pedido no cambió a estado ENTREGADO.');

        // Verificamos descuento del stock físico: Tenía 10, compró 2 -> Quedan 8
        $this->assertEquals(8, $this->producto->fresh()->stock_actual, 'ERROR LOGÍSTICO: El stock de inventario no coincide.');

        // Verificamos impacto formal en el Kardex de Producto
        $kardexFisico = KardexProducto::where('producto_id', $this->producto->id)->first();
        $this->assertNotNull($kardexFisico, 'ERROR LOGÍSTICO: No se generó el movimiento en el Kardex de Producto.');
        $this->assertEquals('egreso', $kardexFisico->tipo_movimiento);
        $this->assertEquals(2, $kardexFisico->cantidad);
        $this->assertEquals(8, $kardexFisico->saldo_stock);
    }
}
