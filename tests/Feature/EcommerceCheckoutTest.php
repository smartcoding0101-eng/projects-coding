<?php

namespace Tests\Feature;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Persona;
use App\Services\EcommerceCheckoutService;
use App\Services\AccountingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcommerceCheckoutTest extends TestCase
{
    use RefreshDatabase;

    private EcommerceCheckoutService $checkoutService;
    private array $datosCliente;
    private array $logistica;
    private Categoria $categoria;

    protected function setUp(): void
    {
        parent::setUp();

        $this->checkoutService = app(EcommerceCheckoutService::class);

        $this->categoria = Categoria::create([
            'nombre' => 'MTest',
            'slug' => 'mtest',
            'descripcion' => 'Test'
        ]);

        $this->datosCliente = [
            'nombre' => 'Test User',
            'ci' => '1234567',
            'telefono' => '70000000'
        ];

        $this->logistica = [
            'tipo_entrega' => 'recojo_tienda'
        ];
    }

    /** @test */
    public function checkout_invitado_crea_pedido_y_registra_persona()
    {
        $producto = Producto::create([
            'nombre' => 'Zapatos',
            'slug' => 'zapatos',
            'codigo_sku' => 'ZAP-01',
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 10,
            'stock_minimo' => 2,
            'precio_general' => 50.00,
            'precio_asociado' => 0,
            'activo' => true
        ]);

        $carrito = [['id' => $producto->id, 'cantidad' => 2]];

        $pedido = $this->checkoutService->procesarCheckout(
            $this->datosCliente,
            $carrito,
            'qr',
            $this->logistica
        );

        // Verifica que se creó el pedido
        $this->assertDatabaseHas('pedidos', [
            'id' => $pedido->id,
            'estado_pago' => 'pendiente_validacion',
            'total' => 100.00
        ]);

        // Verifica que se registró la Persona KYC
        $this->assertDatabaseHas('personas', [
            'ci' => '1234567',
            'nombres' => 'Test User'
        ]);

        // El stock físico no debe disminuir en checkout, solo en entrega
        $this->assertEquals(10, $producto->fresh()->stock_actual);
    }

    /** @test */
    public function checkout_falla_si_stock_insuficiente()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Stock insuficiente");

        $producto = Producto::create([
            'nombre' => 'Lentes',
            'slug' => 'lentes',
            'codigo_sku' => 'LEN-01',
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 2,
            'stock_minimo' => 1,
            'precio_general' => 50.00,
            'precio_asociado' => 0,
            'activo' => true
        ]);

        $carrito = [['id' => $producto->id, 'cantidad' => 5]]; // Stock insuficiente

        $this->checkoutService->procesarCheckout(
            $this->datosCliente,
            $carrito,
            'qr',
            $this->logistica
        );
    }

    /** @test */
    public function checkout_calcula_stock_dinamico_con_pedidos_pendientes()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Stock insuficiente");

        $producto = Producto::create([
            'nombre' => 'Reloj',
            'slug' => 'reloj',
            'codigo_sku' => 'REL-01',
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 5, // Tiene 5 físicos
            'stock_minimo' => 1,
            'precio_general' => 50.00,
            'precio_asociado' => 0,
            'activo' => true
        ]);

        // Persona 1 compra 3
        $this->checkoutService->procesarCheckout(
            $this->datosCliente,
            [['id' => $producto->id, 'cantidad' => 3]],
            'qr',
            $this->logistica
        );

        // Persona 2 intenta comprar 3, pero el stock disponible dinámico es solo 2.
        $this->checkoutService->procesarCheckout(
            $this->datosCliente,
            [['id' => $producto->id, 'cantidad' => 3]],
            'qr',
            $this->logistica
        );
    }
}
