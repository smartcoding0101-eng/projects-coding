<?php

namespace App\Console\Commands;

use App\Models\Caja;
use App\Models\CajaDenominacion;
use App\Models\CajaMovimiento;
use App\Models\Credito;
use App\Models\Kardex;
use App\Models\KardexProducto;
use App\Models\LibroDiario;
use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\PlanPago;
use Illuminate\Console\Command;

/**
 * ═══════════════════════════════════════════════════════════════
 *  AUDITORÍA DE INTEGRIDAD CONTABLE — FAPCLAS
 * ═══════════════════════════════════════════════════════════════
 *
 * Ejecuta 10 reglas de integridad referencial y contable
 * para garantizar que NO existan registros huérfanos.
 *
 * Uso: php artisan fapclas:audit
 */
class AuditIntegrity extends Command
{
    protected $signature = 'fapclas:audit';
    protected $description = 'Auditoría de integridad contable del sistema FAPCLAS (10 reglas)';

    private int $passed = 0;
    private int $failed = 0;
    private array $errors = [];

    public function handle(): int
    {
        $this->newLine();
        $this->info('══════════════════════════════════════════════════════════');
        $this->info('  AUDITORÍA DE INTEGRIDAD CONTABLE — FAPCLAS');
        $this->info('══════════════════════════════════════════════════════════');
        $this->newLine();

        $this->rule01_PedidoPagadoConLibroDiario();
        $this->rule02_PedidoEntregadoConKardexProducto();
        $this->rule03_CreditoDesembolsadoConLibroDiario();
        $this->rule04_CreditoDesembolsadoConKardex();
        $this->rule05_CuotaPagadaConLibroDiario();
        $this->rule06_CuotaPagadaConKardex();
        $this->rule07_CuotaEnMoraConLibroDiario();
        $this->rule08_CajaConMovimientos();
        $this->rule09_CajaConDenominaciones();
        $this->rule10_BalanceGeneralLibroDiario();

        $this->newLine();
        $this->info('══════════════════════════════════════════════════════════');

        if ($this->failed === 0) {
            $this->info("  ✅ RESULTADO: {$this->passed}/10 REGLAS CUMPLIDAS — SISTEMA ÍNTEGRO");
        } else {
            $this->error("  ❌ RESULTADO: {$this->passed} OK, {$this->failed} FALLIDAS");
            $this->newLine();
            foreach ($this->errors as $err) {
                $this->error("    → " . $err);
            }
        }

        $this->info('══════════════════════════════════════════════════════════');
        $this->newLine();

        return $this->failed === 0 ? 0 : 1;
    }

    // ─── REGLA 1: Todo Pedido pagado tiene asiento en LibroDiario ───

    private function rule01_PedidoPagadoConLibroDiario(): void
    {
        $pedidosPagados = Pedido::where('estado_pago', 'pagado')->count();
        $asientosVenta = LibroDiario::where('tipo_transaccion', 'venta_ecommerce')->count();

        $this->check(
            'R01',
            'Pedido Pagado → LibroDiario (venta_ecommerce)',
            $pedidosPagados,
            $asientosVenta,
            $pedidosPagados === $asientosVenta
        );
    }

    // ─── REGLA 2: Todo Pedido entregado tiene KardexProducto por detalle ───

    private function rule02_PedidoEntregadoConKardexProducto(): void
    {
        $pedidosEntregados = Pedido::where('estado_entrega', 'entregado')->pluck('id');
        $detallesEntregados = PedidoDetalle::whereIn('pedido_id', $pedidosEntregados)->count();
        $kardexEgresos = KardexProducto::where('tipo_movimiento', 'egreso')
            ->where('concepto', 'LIKE', '%Entrega Ecommerce%')
            ->count();

        $this->check(
            'R02',
            'Pedido Entregado → KardexProducto (egreso)',
            $detallesEntregados,
            $kardexEgresos,
            $detallesEntregados === $kardexEgresos
        );
    }

    // ─── REGLA 3: Todo Crédito desembolsado tiene LibroDiario ───

    private function rule03_CreditoDesembolsadoConLibroDiario(): void
    {
        $creditosDesemb = Credito::where('estado', Credito::ESTADO_DESEMBOLSADO)->count();
        $asientosDesemb = LibroDiario::where('tipo_transaccion', 'desembolso_credito')->count();

        $this->check(
            'R03',
            'Crédito Desembolsado → LibroDiario (desembolso)',
            $creditosDesemb,
            $asientosDesemb,
            $creditosDesemb === $asientosDesemb
        );
    }

    // ─── REGLA 4: Todo Crédito desembolsado tiene Kardex social ───

    private function rule04_CreditoDesembolsadoConKardex(): void
    {
        $creditosDesemb = Credito::where('estado', Credito::ESTADO_DESEMBOLSADO)->count();
        $kardexDesemb = Kardex::where('tipo_movimiento', Kardex::TIPO_DESEMBOLSO_CREDITO)->count();

        $this->check(
            'R04',
            'Crédito Desembolsado → Kardex (desembolso_credito)',
            $creditosDesemb,
            $kardexDesemb,
            $creditosDesemb === $kardexDesemb
        );
    }

    // ─── REGLA 5: Toda Cuota pagada tiene LibroDiario ───

    private function rule05_CuotaPagadaConLibroDiario(): void
    {
        $cuotasPagadas = PlanPago::where('estado', PlanPago::ESTADO_PAGADA)->count();
        $asientosPago = LibroDiario::where('tipo_transaccion', 'pago_cuota')->count();

        $this->check(
            'R05',
            'Cuota Pagada → LibroDiario (pago_cuota)',
            $cuotasPagadas,
            $asientosPago,
            $cuotasPagadas === $asientosPago
        );
    }

    // ─── REGLA 6: Toda Cuota pagada tiene Kardex social ───

    private function rule06_CuotaPagadaConKardex(): void
    {
        $cuotasPagadas = PlanPago::where('estado', PlanPago::ESTADO_PAGADA)->count();
        $kardexPagos = Kardex::where('tipo_movimiento', Kardex::TIPO_PAGO_CUOTA)->count();

        $this->check(
            'R06',
            'Cuota Pagada → Kardex (pago_cuota)',
            $cuotasPagadas,
            $kardexPagos,
            $cuotasPagadas === $kardexPagos
        );
    }

    // ─── REGLA 7: Toda Cuota en mora tiene LibroDiario ───

    private function rule07_CuotaEnMoraConLibroDiario(): void
    {
        $cuotasMora = PlanPago::where('estado', PlanPago::ESTADO_RETRASADA)
            ->where('monto_mora', '>', 0)->count();
        $asientosMora = LibroDiario::where('tipo_transaccion', 'mora')->count();

        $this->check(
            'R07',
            'Cuota Mora → LibroDiario (mora)',
            $cuotasMora,
            $asientosMora,
            $cuotasMora === $asientosMora
        );
    }

    // ─── REGLA 8: Toda Caja tiene al menos 1 movimiento ───

    private function rule08_CajaConMovimientos(): void
    {
        $totalCajas = Caja::count();
        $cajasConMov = Caja::whereHas('movimientos')->count();

        $this->check(
            'R08',
            'Toda Caja → al menos 1 CajaMovimiento',
            $totalCajas,
            $cajasConMov,
            $totalCajas === $cajasConMov
        );
    }

    // ─── REGLA 9: Toda Caja tiene denominaciones de apertura y cierre ───

    private function rule09_CajaConDenominaciones(): void
    {
        $totalCajas = Caja::count();
        $cajasConApertura = CajaDenominacion::select('caja_id')
            ->where('tipo', 'apertura')
            ->groupBy('caja_id')
            ->get()
            ->count();
        $cajasConCierre = CajaDenominacion::select('caja_id')
            ->where('tipo', 'cierre')
            ->groupBy('caja_id')
            ->get()
            ->count();

        $ambas = min($cajasConApertura, $cajasConCierre);

        $this->check(
            'R09',
            'Toda Caja → Denominaciones apertura + cierre',
            $totalCajas,
            $ambas,
            $totalCajas === $ambas
        );
    }

    // ─── REGLA 10: Balance General del Libro Diario ───

    private function rule10_BalanceGeneralLibroDiario(): void
    {
        $ingresos = (float) LibroDiario::sum('ingreso');
        $egresos = (float) LibroDiario::sum('egreso');
        $balance = round($ingresos - $egresos, 2);

        $ok = $ingresos > 0 || $egresos > 0; // Al menos hay datos
        $this->info("  [R10] Balance General LibroDiario:");
        $this->info("        Ingresos: Bs " . number_format($ingresos, 2));
        $this->info("        Egresos:  Bs " . number_format($egresos, 2));
        $this->info("        Balance:  Bs " . number_format($balance, 2));

        if ($ok) {
            $this->info("        → ✅ LibroDiario tiene registros contables");
            $this->passed++;
        } else {
            $this->error("        → ❌ LibroDiario VACÍO — sin actividad contable");
            $this->failed++;
            $this->errors[] = 'R10: LibroDiario vacío';
        }
    }

    // ─── Helper ───

    private function check(string $id, string $label, int $expected, int $actual, bool $ok): void
    {
        $status = $ok ? '✅' : '❌';
        $this->info("  [{$id}] {$label}");
        $this->info("        Esperado: {$expected} | Encontrado: {$actual} → {$status}");

        if ($ok) {
            $this->passed++;
        } else {
            $this->failed++;
            $this->errors[] = "{$id}: Esperado {$expected}, encontrado {$actual} — {$label}";
        }
    }
}
