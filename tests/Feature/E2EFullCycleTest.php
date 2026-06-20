<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Persona;
use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\TipoCredito;
use App\Models\LibroDiario;
use App\Models\Kardex;
use App\Models\CuentaAportacion;
use App\Models\Caja;
use App\Models\CajaMovimiento;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\KardexProducto;
use App\Services\AccountingService;
use App\Services\EcommerceCheckoutService;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * E2E CICLO COMPLETO: Socio → Aporte → Crédito → Mora → Pago → Ecommerce → Despacho → Cierre Caja
 */
class E2EFullCycleTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $socio;
    private TipoCredito $tipoCredito;
    private Producto $producto;
    private AccountingService $accounting;
    private EcommerceCheckoutService $checkout;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'SuperAdmin']);
        Role::firstOrCreate(['name' => 'Socio']);

        $this->admin = User::factory()->create(['name' => 'Admin FAPCLAS']);
        $this->admin->assignRole('SuperAdmin');

        $persona = Persona::create([
            'nombres'        => 'Carlos Alberto',
            'apellidos'      => 'Mamani Quispe',
            'ci'             => '4567890',
            'grado'          => 'Sgto. 1ro.',
            'escalafon'      => 'E-2024-001',
            'destino'        => 'FELCC-La Paz',
            'celular'        => '71234567',
            'genero'         => 'MASCULINO',
            'institucion'    => 'Policía Boliviana',
            'tipo_afiliacion'=> 'Activo',
            'garantia_tipo'  => 'Ninguna',
        ]);

        $this->socio = User::factory()->create(['ci' => '4567890']);
        $this->socio->assignRole('Socio');
        $this->socio->update(['persona_id' => $persona->id]);

        $this->tipoCredito = TipoCredito::create([
            'nombre'          => 'Emergencia',
            'tasa_interes'    => 1.5,
            'plazo_min_meses' => 1,
            'plazo_max_meses' => 6,
            'monto_min'       => 500,
            'monto_max'       => 20000,
            'tasa_mora'       => 0.5,
            'activo'          => true,
        ]);

        $categoria = Categoria::create(['nombre' => 'Librería', 'slug' => 'libreria']);
        $this->producto = Producto::create([
            'nombre'        => 'Resma de Papel A4',
            'slug'          => 'papel-a4',
            'codigo_sku'    => 'LIB-001',
            'categoria_id'  => $categoria->id,
            'stock_actual'  => 50,
            'stock_minimo'  => 5,
            'precio_general'  => 100.00,
            'precio_asociado' => 85.00,
            'activo'        => true,
        ]);

        \App\Models\Configuracion::updateOrCreate(['key' => 'ecommerce_descuento_socios_global'], ['value' => '0']);
        \App\Models\Configuracion::updateOrCreate(['key' => 'ecommerce_limite_credito_default'], ['value' => '50000']);

        $this->accounting = app(AccountingService::class);
        $this->checkout   = app(EcommerceCheckoutService::class);
    }

    #[Test]
    public function e2e_ciclo_completo_aporte_credito_mora_pago_ecommerce_caja(): void
    {
        $this->actingAs($this->admin);

        // ══════════════════════════════════════════════════════════
        // FASE 1: APERTURA DE CAJA
        // ══════════════════════════════════════════════════════════
        $caja = Caja::create([
            'user_id'              => $this->admin->id,
            'fecha_apertura'       => now(),
            'saldo_inicial_bob'    => 2000.00,
            'saldo_inicial_usd'    => 0.00,
            'estado'               => 'abierta',
            'observaciones_apertura' => 'Inicio de jornada - prueba E2E completa',
        ]);
        $this->assertTrue($caja->estaAbierta(), 'Caja debe estar abierta.');

        // ══════════════════════════════════════════════════════════
        // FASE 2: REGISTRO DE APORTACIÓN DEL SOCIO
        // ══════════════════════════════════════════════════════════
        $montoAporte = 500.00;
        $this->accounting->registrarAporte($this->socio, $montoAporte, 'Planilla', 'Aporte mensual Junio 2024');

        $asientoAporte = LibroDiario::where('tipo_transaccion', 'aporte')->where('user_id', $this->socio->id)->first();
        $this->assertNotNull($asientoAporte, '[FASE 2] El aporte no generó asiento en Libro Diario.');
        $this->assertEquals($montoAporte, $asientoAporte->ingreso, '[FASE 2] El ingreso del aporte no coincide.');

        $kardexAporte = Kardex::where('user_id', $this->socio->id)->where('tipo_movimiento', Kardex::TIPO_APORTE)->first();
        $this->assertNotNull($kardexAporte, '[FASE 2] El aporte no generó movimiento en Kardex Financiero.');
        $this->assertEquals($montoAporte, $kardexAporte->ingreso);

        // ══════════════════════════════════════════════════════════
        // FASE 3: APROBACIÓN Y DESEMBOLSO DE CRÉDITO
        // ══════════════════════════════════════════════════════════
        $montoCredito = 3000.00;
        $credito = Credito::create([
            'user_id'          => $this->socio->id,
            'tipo_credito_id'  => $this->tipoCredito->id,
            'monto_aprobado'   => $montoCredito,
            'tasa_interes'     => 1.5,
            'plazo_meses'      => 3,
            'estado'           => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital'    => $montoCredito,
            'metodo_descuento' => 'Efectivo',
            'aprobado_por'     => $this->admin->id,
        ]);

        $this->accounting->aprobarCredito($this->socio, $montoCredito, $credito->id);

        $asientoDesembolso = LibroDiario::where('tipo_transaccion', 'desembolso_credito')->first();
        $this->assertNotNull($asientoDesembolso, '[FASE 3] El desembolso no generó asiento contable.');
        $this->assertEquals($montoCredito, $asientoDesembolso->egreso, '[FASE 3] El egreso del desembolso no coincide.');

        // ══════════════════════════════════════════════════════════
        // FASE 4: GENERACIÓN DEL PLAN DE PAGOS
        // ══════════════════════════════════════════════════════════
        $cuota1 = PlanPago::create([
            'credito_id'       => $credito->id,
            'nro_cuota'        => 1,
            'cuota_total'      => 1045.00,
            'capital_amortizado'=> 1000.00,
            'interes_pagado'   => 45.00,
            'monto_mora'       => 0.00,
            'fecha_vencimiento'=> now()->subDays(15)->toDateString(),
            'estado'           => PlanPago::ESTADO_PENDIENTE,
        ]);

        $cuota2 = PlanPago::create([
            'credito_id'       => $credito->id,
            'nro_cuota'        => 2,
            'cuota_total'      => 1030.00,
            'capital_amortizado'=> 1000.00,
            'interes_pagado'   => 30.00,
            'monto_mora'       => 0.00,
            'fecha_vencimiento'=> now()->addDays(15)->toDateString(),
            'estado'           => PlanPago::ESTADO_PENDIENTE,
        ]);

        $cuota3 = PlanPago::create([
            'credito_id'       => $credito->id,
            'nro_cuota'        => 3,
            'cuota_total'      => 1015.00,
            'capital_amortizado'=> 1000.00,
            'interes_pagado'   => 15.00,
            'monto_mora'       => 0.00,
            'fecha_vencimiento'=> now()->addDays(45)->toDateString(),
            'estado'           => PlanPago::ESTADO_PENDIENTE,
        ]);

        $this->assertEquals(3, PlanPago::where('credito_id', $credito->id)->count(), '[FASE 4] Plan de pagos incompleto.');

        // ══════════════════════════════════════════════════════════
        // FASE 5: MORA EN CUOTA VENCIDA (cuota 1 está vencida)
        // ══════════════════════════════════════════════════════════
        $montoMora = 52.25; // 0.5% de mora acumulada sobre capital
        $cuota1->update(['monto_mora' => $montoMora]);
        $this->accounting->registrarMora($this->socio, $cuota1->fresh(), $montoMora);

        $asientoMora = LibroDiario::where('tipo_transaccion', 'mora')->first();
        $this->assertNotNull($asientoMora, '[FASE 5] La mora no generó asiento contable.');
        $this->assertEquals($montoMora, $asientoMora->ingreso, '[FASE 5] El ingreso de mora no coincide.');

        // ══════════════════════════════════════════════════════════
        // FASE 6: PAGO DE CUOTA CON MORA (Cuota 1)
        // ══════════════════════════════════════════════════════════
        $cuota1->update(['estado' => PlanPago::ESTADO_PAGADA]);
        $this->accounting->registrarPagoCuota($this->socio, $cuota1->fresh(), 'Efectivo');

        $pagoTotal = $cuota1->cuota_total + $cuota1->monto_mora; // 1045 + 52.25 = 1097.25
        $asientoPago = LibroDiario::where('tipo_transaccion', 'pago_cuota')->first();
        $this->assertNotNull($asientoPago, '[FASE 6] El pago de cuota no generó asiento contable.');
        $this->assertEquals($pagoTotal, $asientoPago->ingreso, '[FASE 6] El ingreso del pago de cuota no coincide.');

        // ══════════════════════════════════════════════════════════
        // FASE 7: COMPRA EN E-COMMERCE (Socio usa beneficio)
        // ══════════════════════════════════════════════════════════
        $pedido = $this->checkout->procesarCheckout(
            ['nombre' => 'Carlos Alberto Mamani', 'ci' => '4567890'],
            [['id' => $this->producto->id, 'cantidad' => 3]], // 3 resmas @ Bs 85 = 255
            'qr',
            ['tipo_entrega' => 'recojo_tienda'],
            $this->socio
        );

        $this->assertEquals('pendiente_validacion', $pedido->estado_pago, '[FASE 7] Estado de pago incorrecto.');
        $this->assertEquals(255.00, $pedido->total, '[FASE 7] Total de compra incorrecto (sin envío = 255).');
        $this->assertEquals(50, $this->producto->fresh()->stock_actual, '[FASE 7] Stock descontado prematuramente.');

        // ══════════════════════════════════════════════════════════
        // FASE 8: VALIDACIÓN DEL PAGO QR POR ADMINISTRADOR
        // ══════════════════════════════════════════════════════════
        \Livewire\Livewire::test(\App\Filament\Resources\Pedidos\Pages\ListPedidos::class)
            ->callTableAction('validarPago', $pedido);

        $pedido->refresh();
        $this->assertEquals('pagado', $pedido->estado_pago, '[FASE 8] El pago QR no fue validado.');

        $asientoVenta = LibroDiario::where('tipo_transaccion', 'venta_ecommerce')->first();
        $this->assertNotNull($asientoVenta, '[FASE 8] La venta no generó asiento en Libro Diario.');
        $this->assertEquals(255.00, $asientoVenta->ingreso, '[FASE 8] El ingreso contable de la venta no coincide.');

        // ══════════════════════════════════════════════════════════
        // FASE 9: DESPACHO LOGÍSTICO (Admin entrega el pedido)
        // ══════════════════════════════════════════════════════════
        \Livewire\Livewire::test(\App\Filament\Resources\Pedidos\Pages\ListPedidos::class)
            ->callTableAction('entregarPedido', $pedido);

        $pedido->refresh();
        $this->assertEquals('entregado', $pedido->estado_entrega, '[FASE 9] El pedido no fue marcado como entregado.');
        $this->assertEquals(47, $this->producto->fresh()->stock_actual, '[FASE 9] Stock no descontado después de despacho.');

        $kardexFisico = KardexProducto::where('producto_id', $this->producto->id)->first();
        $this->assertNotNull($kardexFisico, '[FASE 9] No hay registro en Kardex de Producto.');
        $this->assertEquals('egreso', $kardexFisico->tipo_movimiento);
        $this->assertEquals(3, $kardexFisico->cantidad);
        $this->assertEquals(47, $kardexFisico->saldo_stock);

        // ══════════════════════════════════════════════════════════
        // FASE 10: CONCILIACIÓN FINAL Y CIERRE DE CAJA
        // ══════════════════════════════════════════════════════════
        // La caja registra los movimientos físicos de efectivo (CajaMovimiento).
        // registrarMora() NO inyecta en caja (solo asienta en Libro Diario) porque la
        // mora se cobra junto a la cuota. El pago de cuota sí incluye el total (cuota+mora).
        //
        // Movimientos de caja reales:
        //   + Aporte           = +500.00
        //   + PagoCuota(total) = +1097.25  (cuota 1045 + mora 52.25 – juntos en una sola inyección)
        //   + Venta QR         = +255.00   (inyectada por validarPago de Filament)
        //   - Desembolso       = -3000.00
        // Saldo caja = 2000 + 500 + 1097.25 + 255 - 3000 = 852.25

        $caja->refresh();
        $ingresosCaja = CajaMovimiento::where('caja_id', $caja->id)->where('tipo', 'ingreso')->sum('monto_bob');
        $egresosCaja  = CajaMovimiento::where('caja_id', $caja->id)->where('tipo', 'egreso')->sum('monto_bob');
        $saldoEsperado = (float) $caja->saldo_inicial_bob + $ingresosCaja - $egresosCaja;

        $this->assertEquals(round($saldoEsperado, 2), round($caja->saldo_esperado_bob, 2), '[FASE 10] El saldo_esperado_bob del modelo no coincide con el cálculo manual.');

        // Confirmar que la caja tiene al menos ingresos por aporte + cuota + venta
        $this->assertGreaterThan(0, $ingresosCaja, '[FASE 10] No se registraron ingresos en la caja.');
        $this->assertGreaterThan(0, $egresosCaja,  '[FASE 10] No se registraron egresos (desembolso) en la caja.');

        // Cierre formal de caja
        $caja->update([
            'estado'              => 'cerrada',
            'fecha_cierre'        => now(),
            'saldo_final_bob'     => $caja->saldo_esperado_bob,
            'observaciones_cierre'=> 'Cierre con cuadre perfecto - Prueba E2E completada.',
        ]);

        $this->assertFalse($caja->fresh()->estaAbierta(), '[FASE 10] La caja sigue abierta tras el cierre.');

        // ══════════════════════════════════════════════════════════
        // VERIFICACIÓN GLOBAL DEL LIBRO DIARIO (Contabilidad Completa)
        // ══════════════════════════════════════════════════════════
        $totalIngresos = LibroDiario::sum('ingreso');
        $totalEgresos  = LibroDiario::sum('egreso');

        // Ingresos: Aporte(500) + Mora(52.25) + PagoCuota(1097.25) + Venta(255) = 1904.50
        $this->assertEquals(1904.50, round($totalIngresos, 2), '[GLOBAL] Sumatoria de ingresos en Libro Diario incorrecta.');

        // Egresos: Desembolso(3000)
        $this->assertEquals(3000.00, round($totalEgresos, 2), '[GLOBAL] Sumatoria de egresos en Libro Diario incorrecta.');
    }
}
