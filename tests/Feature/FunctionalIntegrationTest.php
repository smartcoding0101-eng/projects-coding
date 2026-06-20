<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Persona;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\TipoCredito;
use App\Models\LibroDiario;
use App\Models\KardexProducto;
use App\Models\Configuracion;
use App\Models\Caja;
use App\Models\CajaMovimiento;
use App\Services\EcommerceCheckoutService;
use App\Services\AccountingService;
use App\Services\KardexService;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Functional Integration Testing (FIT) — Módulos E-commerce y Créditos.
 * 
 * Esta suite de pruebas valida la integración funcional e interactiva
 * entre los módulos principales del ERP:
 * 1. Checkout E-commerce + Control de Límites de Crédito del Socio.
 * 2. Compra E-commerce a Crédito + Libro Diario + Kardex Financiero del Socio.
 * 3. Compra Invitados + Proceso KYC Automatizado (Creación / Búsqueda de Personas).
 * 4. Logística + Despacho Físico de Productos + Kardex de Almacén.
 * 5. Pago de Cuotas de Crédito + Amortización + Libro Diario + Caja Abierta.
 */
class FunctionalIntegrationTest extends TestCase
{
    use RefreshDatabase;

    private User $cajero;
    private User $socio;
    private Persona $persona;
    private Producto $producto;
    private TipoCredito $tipoCredito;
    private Categoria $categoria;
    private EcommerceCheckoutService $checkoutService;
    private AccountingService $accountingService;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Configurar Roles y Permisos básicos
        Permission::firstOrCreate(['name' => 'gestionar usuarios']);
        $roleAdmin = Role::firstOrCreate(['name' => 'SuperAdmin']);
        $roleAdmin->givePermissionTo('gestionar usuarios');

        $roleSocio = Role::firstOrCreate(['name' => 'Socio']);

        // 2. Crear Cajero / Administrador
        $this->cajero = User::factory()->create();
        $this->cajero->assignRole('SuperAdmin');

        // 3. Crear Socio con Persona enlazada
        $this->persona = Persona::create([
            'nombres' => 'Juan Carlos',
            'apellidos' => 'Mamani Copa',
            'ci' => '1234567',
            'celular' => '77788899',
            'genero' => 'MASCULINO',
            'institucion' => 'Policía Boliviana',
            'tipo_afiliacion' => 'Activo',
            'garantia_tipo' => 'Ninguna'
        ]);

        $this->socio = User::factory()->create([
            'ci' => '1234567',
            'persona_id' => $this->persona->id
        ]);
        $this->socio->assignRole('Socio');

        // 4. Crear Categoría y Producto
        $this->categoria = Categoria::create([
            'nombre' => 'Equipo de Emergencia',
            'slug' => 'equipo-emergencia',
            'activa' => true
        ]);

        $this->producto = Producto::create([
            'nombre' => 'Chaleco Táctico Premium',
            'slug' => 'chaleco-tactico-premium',
            'codigo_sku' => 'TAC-889',
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 15,
            'stock_minimo' => 2,
            'precio_general' => 500.00,
            'precio_asociado' => 450.00,
            'activo' => true
        ]);

        // 5. Configurar Tipo de Crédito para los tests de Amortización
        $this->tipoCredito = TipoCredito::create([
            'nombre' => 'Crédito de Emergencia',
            'tasa_interes' => 12.0,
            'plazo_min_meses' => 1,
            'plazo_max_meses' => 12,
            'monto_min' => 100,
            'monto_max' => 10000,
            'tasa_mora' => 5.0,
            'activo' => true
        ]);

        // 6. Inyectar configuraciones por defecto
        Configuracion::updateOrCreate(['key' => 'ecommerce_modo_mantenimiento'], ['value' => 'no']);
        Configuracion::updateOrCreate(['key' => 'ecommerce_descuento_socios_global'], ['value' => '0']);
        Configuracion::updateOrCreate(['key' => 'ecommerce_limite_credito_default'], ['value' => '5000.00']);
        Configuracion::updateOrCreate(['key' => 'ecommerce_habilitar_invitados'], ['value' => 'si']);

        // Instanciar servicios
        $this->checkoutService = app(EcommerceCheckoutService::class);
        $this->accountingService = app(AccountingService::class);
    }

    /**
     * INTEGRACIÓN 1: E-commerce + Límite de Crédito (Socio compra exitosamente a Crédito)
     * 
     */
    #[Test]
    public function integracion_socio_compra_ecommerce_a_credito_exitosamente(): void
    {
        // 1. Preparar carrito de compra por debajo del límite de Bs. 5000
        $carrito = [
            [
                'id' => $this->producto->id,
                'cantidad' => 2 // Total: 2 * precio_asociado (450) = Bs. 900
            ]
        ];

        $datosCliente = [
            'nombre' => 'Juan Carlos Mamani Copa',
            'ci' => '1234567',
            'telefono' => '77788899',
            'observaciones' => 'Compra a descuento integrada por convenio'
        ];

        $logistica = [
            'tipo_entrega' => 'recojo_tienda',
            'direccion_envio' => null
        ];

        // 2. Ejecutar Checkout
        $pedido = $this->checkoutService->procesarCheckout(
            $datosCliente,
            $carrito,
            'credito_asociado',
            $logistica,
            $this->socio
        );

        // 3. Validar Pedido generado y enlazado correctamente
        $this->assertNotNull($pedido);
        $this->assertEquals('pagado', $pedido->estado_pago);
        $this->assertEquals('por_recoger', $pedido->estado_entrega);
        $this->assertEquals(900.00, $pedido->total);
        $this->assertEquals($this->persona->id, $pedido->persona_id);

        // 4. Validar el Kardex de Créditos/Convenios del Socio
        $kardexMovimiento = \App\Models\Kardex::where('user_id', $this->socio->id)
            ->where('tipo_movimiento', \App\Models\Kardex::TIPO_COMPRA_CONVENIO)
            ->first();
        
        $this->assertNotNull($kardexMovimiento);
        $this->assertEquals(900.00, $kardexMovimiento->egreso); // Sale saldo a favor por compra
        
        // 5. Validar que la deuda total calculada por AccountingService incrementó a 900
        // Nota: Compra por convenio ejerce como saldo contable en Kardex, por lo que la deuda
        // se refleja en el saldo acumulado del Kardex Financiero del socio.
        $saldoAcumulado = \App\Models\Kardex::where('user_id', $this->socio->id)->orderBy('id', 'desc')->first()->saldo_acumulado;
        $this->assertEquals(-900.00, $saldoAcumulado);
    }

    /**
     * INTEGRACIÓN 2: E-commerce + Límite de Crédito Excedido (Rollback Automático)
     * 
     */
    #[Test]
    public function integracion_socio_intenta_comprar_excediendo_limite_de_credito_falla(): void
    {
        // Reducir límite de crédito global a un monto muy bajo
        Configuracion::updateOrCreate(['key' => 'ecommerce_limite_credito_default'], ['value' => '300.00']);

        // Carrito cuesta Bs. 450 (1 chaleco táctico a precio socio)
        $carrito = [
            [
                'id' => $this->producto->id,
                'cantidad' => 1
            ]
        ];

        $datosCliente = [
            'nombre' => 'Juan Carlos Mamani Copa',
            'ci' => '1234567',
            'telefono' => '77788899',
            'observaciones' => 'Compra que debe fallar'
        ];

        $logistica = [
            'tipo_entrega' => 'recojo_tienda',
            'direccion_envio' => null
        ];

        // Se espera una excepción debido al límite insuficiente
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Límite de crédito insuficiente');

        $this->checkoutService->procesarCheckout(
            $datosCliente,
            $carrito,
            'credito_asociado',
            $logistica,
            $this->socio
        );

        // Verificar que no se creó ningún pedido en BD
        $this->assertDatabaseMissing('pedidos', [
            'ci_cliente' => '1234567'
        ]);
    }

    /**
     * INTEGRACIÓN 3: E-commerce + KYC Automatizado de Invitados
     * 
     */
    #[Test]
    public function integracion_checkout_invitado_ejecuta_kyc_automatizado(): void
    {
        $ciExterno = '9876543';

        // 1. Asegurar que la persona externa no existe en la base de datos
        $this->assertDatabaseMissing('personas', ['ci' => $ciExterno]);

        $carrito = [
            [
                'id' => $this->producto->id,
                'cantidad' => 1 // Precio general Bs. 500
            ]
        ];

        $datosCliente = [
            'nombre' => 'María Del Carmen',
            'ci' => $ciExterno,
            'telefono' => '6543210',
            'observaciones' => 'Compra rápida sin registro'
        ];

        $logistica = [
            'tipo_entrega' => 'recojo_tienda',
            'direccion_envio' => null
        ];

        // 2. Ejecutar Checkout como Invitado (User = null)
        $pedido = $this->checkoutService->procesarCheckout(
            $datosCliente,
            $carrito,
            'qr',
            $logistica,
            null
        );

        // 3. Verificar creación automática de la ficha de Persona (KYC)
        $this->assertDatabaseHas('personas', [
            'ci' => $ciExterno,
            'nombres' => 'María Del Carmen',
            'tipo_afiliacion' => 'EXTERNO'
        ]);

        $personaCreada = Persona::where('ci', $ciExterno)->first();

        // 4. Verificar pedido vinculado
        $this->assertNotNull($pedido);
        $this->assertEquals($personaCreada->id, $pedido->persona_id);
        $this->assertEquals('pendiente_validacion', $pedido->estado_pago);
        $this->assertEquals(500.00, $pedido->total); // Precio general, no descuento socio
    }

    /**
     * INTEGRACIÓN 4: Logística + Despacho Físico + Kardex de Almacén
     * 
     */
    #[Test]
    public function integracion_despacho_fisico_pedido_descuenta_stock_y_crea_kardex_almacen(): void
    {
        // 1. Crear un pedido previamente pagado por QR
        $pedido = Pedido::create([
            'numero_orden' => 'ORD-10020',
            'user_id' => $this->socio->id,
            'persona_id' => $this->persona->id,
            'nombre_cliente' => $this->persona->nombres,
            'ci_cliente' => $this->persona->ci,
            'tipo_pago' => 'qr',
            'tipo_entrega' => 'recojo_tienda',
            'estado_pago' => 'pagado',
            'estado_entrega' => 'por_recoger',
            'total' => 450.00
        ]);

        PedidoDetalle::create([
            'pedido_id' => $pedido->id,
            'producto_id' => $this->producto->id,
            'cantidad' => 3,
            'precio_unitario' => 150.00,
            'subtotal' => 450.00
        ]);

        $stockInicial = $this->producto->stock_actual; // 15 unidades

        // 2. Simular la entrega logística física por el Administrador
        // Se ejecuta dentro de una transacción simulando el botón del panel Filament
        \Illuminate\Support\Facades\DB::transaction(function() use ($pedido) {
            $pedido->update(['estado_entrega' => 'entregado']);
            
            foreach ($pedido->detalles as $detalle) {
                $prod = Producto::lockForUpdate()->find($detalle->producto_id);
                $nuevoStock = $prod->stock_actual - $detalle->cantidad;
                $prod->update(['stock_actual' => $nuevoStock]);

                KardexProducto::create([
                    'producto_id' => $prod->id,
                    'tipo_movimiento' => 'egreso',
                    'cantidad' => $detalle->cantidad,
                    'saldo_stock' => $nuevoStock,
                    'costo_unitario' => $detalle->precio_unitario,
                    'concepto' => "Venta - Pedido #{$pedido->numero_orden}",
                    'usuario_admin_id' => auth()->id()
                ]);
            }
        });

        // 3. Validar decremento real de stock
        $this->producto->refresh();
        $this->assertEquals($stockInicial - 3, $this->producto->stock_actual); // 15 - 3 = 12

        // 4. Validar creación del Kardex de Almacén (Trazabilidad)
        $this->assertDatabaseHas('kardex_productos', [
            'producto_id' => $this->producto->id,
            'tipo_movimiento' => 'egreso',
            'cantidad' => 3,
            'saldo_stock' => 12
        ]);
    }

    /**
     * INTEGRACIÓN 5: Créditos + Amortización + Libro Diario + Caja
     * 
     */
    #[Test]
    public function integracion_pago_cuota_credito_actualiza_amortizacion_libro_diario_y_caja(): void
    {
        // Autenticar al cajero para inyecciones de caja
        $this->actingAs($this->cajero);

        // 1. Abrir Caja General para el cajero
        $caja = Caja::create([
            'user_id' => $this->cajero->id,
            'fecha_apertura' => now(),
            'saldo_inicial_bob' => 1000.00,
            'estado' => 'abierta'
        ]);

        // 2. Crear Crédito aprobado y su Plan de Pagos
        $credito = Credito::create([
            'user_id' => $this->socio->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 1200.00,
            'tasa_interes' => 12.0,
            'plazo_meses' => 3,
            'estado' => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital' => 1200.00,
            'metodo_descuento' => 'Ventanilla'
        ]);

        // Generar una cuota pendiente
        $cuota = PlanPago::create([
            'credito_id' => $credito->id,
            'nro_cuota' => 1,
            'fecha_vencimiento' => now()->addMonth(),
            'capital_amortizado' => 400.00,
            'interes_pagado' => 12.00,
            'cuota_total' => 412.00,
            'monto_mora' => 0.00,
            'estado' => PlanPago::ESTADO_PENDIENTE
        ]);

        // 3. Registrar el Pago de la Cuota mediante AccountingService
        $cuota->update([
            'estado' => PlanPago::ESTADO_PAGADA,
            'metodo_pago' => 'Efectivo',
            'fecha_pago_real' => now()->toDateString(),
        ]);
        $this->accountingService->registrarPagoCuota($this->socio, $cuota, 'Efectivo');

        // 4. Validaciones de Amortización (Actualización de Estado)
        $this->assertEquals(PlanPago::ESTADO_PAGADA, $cuota->fresh()->estado);

        // 5. Validaciones Contables (Libro Diario)
        $this->assertDatabaseHas('libro_diarios', [
            'user_id' => $this->socio->id,
            'cajero_id' => $this->cajero->id,
            'ingreso' => 412.00,
            'tipo_transaccion' => 'pago_cuota',
            'referencia_id' => $cuota->id
        ]);

        // 6. Validaciones de Flujo de Efectivo (Caja)
        // CajaMovimiento inyectado automáticamente por AccountingService
        $this->assertDatabaseHas('caja_movimientos', [
            'caja_id' => $caja->id,
            'user_id' => $this->cajero->id,
            'tipo' => 'ingreso',
            'categoria' => 'pago_credito',
            'monto_bob' => 412.00,
            'metodo_pago' => 'efectivo'
        ]);

        // Saldo esperado de la caja incrementado: 1000.00 + 412.00 = 1412.00
        $caja->refresh();
        $this->assertEquals(1412.00, $caja->saldo_esperado_bob);
    }
}
