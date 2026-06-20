<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\TipoCredito;
use App\Models\LibroDiario;
use App\Models\Pedido;
use App\Services\AccountingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class LibroDiarioConsistenciaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $socio;
    private TipoCredito $tipoCredito;
    private AccountingService $accountingService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->accountingService = app(AccountingService::class);
        $this->admin = User::factory()->create();
        
        $this->socio = User::factory()->create([
            'ci' => '12345678',
            'grado' => 'Sgto.',
            'destino' => 'FELCC',
            'escalafon' => 'E-001',
        ]);

        $this->tipoCredito = TipoCredito::create([
            'nombre' => 'Consumo Test',
            'descripcion' => 'Para pruebas de consistencia contable',
            'tasa_interes' => 0.0,
            'plazo_min_meses' => 1,
            'plazo_max_meses' => 24,
            'monto_min' => 100,
            'monto_max' => 50000,
            'tasa_mora' => 0.0,
            'activo' => true,
        ]);
    }

    #[Test]
    public function auditoria_conciliacion_contable_libro_diario_vs_credito_y_cuotas(): void
    {
        $this->actingAs($this->admin);

        // 1. Crear Crédito y Simular Desembolso
        $credito = Credito::create([
            'user_id' => $this->socio->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 10000.00,
            'tasa_interes' => 0.0,
            'plazo_meses' => 2,
            'estado' => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital' => 10000.00,
            'metodo_descuento' => 'Planilla',
        ]);

        $cuota1 = PlanPago::create([
            'credito_id' => $credito->id,
            'nro_cuota' => 1,
            'cuota_total' => 5000.00,
            'capital_amortizado' => 5000.00,
            'interes_pagado' => 0.00,
            'monto_mora' => 0.00,
            'fecha_vencimiento' => now()->toDateString(),
            'estado' => PlanPago::ESTADO_PENDIENTE,
        ]);

        $cuota2 = PlanPago::create([
            'credito_id' => $credito->id,
            'nro_cuota' => 2,
            'cuota_total' => 5000.00,
            'capital_amortizado' => 5000.00,
            'interes_pagado' => 0.00,
            'monto_mora' => 0.00,
            'fecha_vencimiento' => now()->addMonth()->toDateString(),
            'estado' => PlanPago::ESTADO_PENDIENTE,
        ]);

        // Registrar Desembolso en Libro Diario
        $this->accountingService->aprobarCredito($this->socio, 10000.00, $credito->id);

        // 2. Registrar Pago de la Primera Cuota
        $cuota1->update(['estado' => PlanPago::ESTADO_PAGADA]);
        $this->accountingService->registrarPagoCuota($this->socio, $cuota1, 'Efectivo');

        // 3. AUDITORÍA Y CONCILIACIÓN
        // A. Validar que la sumatoria de egresos en Libro Diario para desembolso coincida con el monto aprobado
        $totalDesembolsadoDiario = LibroDiario::where('tipo_transaccion', 'desembolso_credito')->sum('egreso');
        $totalAprobadoCreditos = Credito::sum('monto_aprobado');

        $this->assertEquals($totalAprobadoCreditos, $totalDesembolsadoDiario, 'CONCILIACIÓN FALLIDA: El egreso en Libro Diario difiere de la cartera de créditos aprobada.');

        // B. Validar que la sumatoria de ingresos para pagos coincida con las cuotas pagadas
        $totalIngresosDiario = LibroDiario::where('tipo_transaccion', 'pago_cuota')->sum('ingreso');
        $totalCuotasPagadas = PlanPago::where('estado', PlanPago::ESTADO_PAGADA)->sum('cuota_total');

        $this->assertEquals($totalCuotasPagadas, $totalIngresosDiario, 'CONCILIACIÓN FALLIDA: Los ingresos registrados en Libro Diario no coinciden con las cuotas efectivamente pagadas.');
    }
}
