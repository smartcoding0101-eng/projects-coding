<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Producto;
use App\Models\KardexProducto;
use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\Kardex;
use Illuminate\Support\Facades\DB;

class AuditDatabaseSync extends Command
{
    protected $signature = 'fapclas:audit-sync';
    protected $description = 'Audita la sincronización del núcleo de la base de datos (Inventario y Finanzas) buscando derivas de datos (Data Drift).';

    public function handle()
    {
        $this->info('🚀 INICIANDO AUDITORÍA DE SINCRONIZACIÓN DE DATOS (FAPCLAS ERP)');
        $this->info('================================================================');

        $this->auditInventario();
        $this->auditCreditos();
        $this->auditKardexFinanciero();

        $this->info('================================================================');
        $this->info('✅ AUDITORÍA FINALIZADA.');
    }

    private function auditInventario()
    {
        $this->warn("\n📦 1. AUDITORÍA DE KARDEX FÍSICO (INVENTARIO)");
        $this->line('Verificando que stock_actual coincida milimétricamente con Ingresos - Egresos...');

        $productos = Producto::all();
        $errores = 0;

        foreach ($productos as $p) {
            $ingresos = KardexProducto::where('producto_id', $p->id)
                ->where('tipo_movimiento', 'ingreso')
                ->sum('cantidad');

            $egresos = KardexProducto::where('producto_id', $p->id)
                ->whereIn('tipo_movimiento', ['salida', 'egreso'])
                ->sum('cantidad');

            $stockMatematico = $ingresos - $egresos;

            if ($stockMatematico != $p->stock_actual) {
                $errores++;
                $this->error("❌ DESCUADRE en Producto ID #{$p->id} ({$p->nombre})");
                $this->error("   - Stock Actual BD: {$p->stock_actual}");
                $this->error("   - Stock Transaccional Real: {$stockMatematico} (Ingresos: {$ingresos} | Egresos: {$egresos})");
            }
        }

        if ($errores === 0) {
            $this->info("✔️ PERFECTO: Todos los {$productos->count()} productos cuadran matemáticamente.");
        } else {
            $this->error("⚠️ ALERTA: {$errores} productos tienen deriva de datos y necesitan re-sincronización.");
        }
    }

    private function auditCreditos()
    {
        $this->warn("\n💳 2. AUDITORÍA DE LÍNEA DE CRÉDITOS");
        $this->line('Verificando que Saldo Capital = Monto Original - Amortizaciones Pagadas...');

        $creditos = Credito::whereIn('estado', ['Desembolsado', 'Activo', 'Pagado'])->get();
        $errores = 0;

        foreach ($creditos as $c) {
            // El amortizado de capital pagado.
            $capitalPagadoReal = PlanPago::where('credito_id', $c->id)
                ->where('estado', 'Pagada')
                ->sum('capital_amortizado');

            $saldoMatematicoEsperado = round((float) $c->monto_aprobado - (float) $capitalPagadoReal, 2);
            $saldoActualBD = round((float) $c->saldo_capital, 2);

            if (abs($saldoMatematicoEsperado - $saldoActualBD) > 0.05) { // Threshold de centavos
                $errores++;
                $this->error("❌ DESCUADRE en Crédito ID #{$c->id}");
                $this->error("   - Saldo Capital BD: Bs {$saldoActualBD}");
                $this->error("   - Saldo Matemático Real: Bs {$saldoMatematicoEsperado} (Monto: {$c->monto_aprobado} | Pagado: {$capitalPagadoReal})");
            }
        }

        if ($errores === 0) {
            $this->info("✔️ PERFECTO: Las tablas de {$creditos->count()} créditos cuadran matemáticamente.");
        } else {
            $this->error("⚠️ ALERTA: {$errores} créditos tienen deriva de datos.");
        }
    }

    private function auditKardexFinanciero()
    {
        $this->warn("\n💰 3. AUDITORÍA DE KARDEX FINANCIERO (CONSOLIDADO MAESTRO)");
        $this->line('Validando la estructura general del libro contable (Montos no nulos y cruces de ID)...');

        $kardexCorruptos = Kardex::whereNull('ingreso')
            ->whereNull('egreso')
            ->count();

        $kardexVacioTotal = Kardex::where('ingreso', 0)->where('egreso', 0)->count();

        if ($kardexCorruptos > 0) {
            $this->error("❌ FATAL: Encontrados {$kardexCorruptos} registros en el Kardex Financiero sin ningún valor numérico.");
        } else {
            $this->info("✔️ ESTRUCTURA KARDEX OK: No hay variables nulas.");
        }

        if ($kardexVacioTotal > 0) {
            $this->error("⚠️ ADVERTENCIA: Encontrados {$kardexVacioTotal} movimientos en cero (Ghost records).");
        } else {
            $this->info("✔️ INTEGRIDAD OK: No hay registros fantasmas vacíos.");
        }
    }
}
