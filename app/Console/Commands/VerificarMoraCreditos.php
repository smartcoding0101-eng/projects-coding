<?php

namespace App\Console\Commands;

use App\Models\Credito;
use App\Models\Configuracion;
use App\Models\PlanPago;
use Illuminate\Console\Command;
use Carbon\Carbon;

class VerificarMoraCreditos extends Command
{
    protected $signature = 'fapclas:verificar-mora {--dias-gracia=5 : Días de gracia antes de aplicar mora}';

    protected $description = 'Verifica cuotas vencidas, calcula interés moratorio y actualiza estados de mora.';

    public function handle()
    {
        $this->info('━━━ Verificación de Mora - FAPCLAS ━━━');
        $this->newLine();

        // Leer días de gracia: primero del argumento, luego de configuración, default 5
        $diasGracia = (int) $this->option('dias-gracia');
        $diasGraciaConfig = Configuracion::where('key', 'dias_gracia_mora')->value('value');
        if ($diasGraciaConfig !== null) {
            $diasGracia = (int) $diasGraciaConfig;
        }

        $fechaLimite = Carbon::now()->subDays($diasGracia)->toDateString();

        $this->info("Fecha límite (con {$diasGracia} días de gracia): {$fechaLimite}");

        // Buscar cuotas pendientes con fecha de vencimiento antes de la fecha límite
        $cuotasVencidas = PlanPago::where('estado', PlanPago::ESTADO_PENDIENTE)
            ->where('fecha_vencimiento', '<', $fechaLimite)
            ->with('credito.user', 'credito.tipoCredito')
            ->get();

        if ($cuotasVencidas->isEmpty()) {
            $this->info('✅ No se encontraron cuotas vencidas. Todo al día.');
            return 0;
        }

        $this->warn("⚠ Se encontraron {$cuotasVencidas->count()} cuota(s) vencida(s).");
        $this->newLine();

        $procesadas = 0;
        $creditosAfectados = [];

        foreach ($cuotasVencidas as $cuota) {
            $credito = $cuota->credito;
            if (!$credito || !$credito->user) {
                continue;
            }

            // Calcular días de mora reales
            $diasMora = Carbon::parse($cuota->fecha_vencimiento)->diffInDays(Carbon::now());

            // Tasa de mora: desde el tipo de crédito, o default 3%
            $tasaMoraAnual = $credito->tipoCredito
                ? $credito->tipoCredito->tasa_mora
                : 3.0;

            $tasaMoraDiaria = ($tasaMoraAnual / 100) / 365;

            // Interés moratorio = Saldo cuota * tasa diaria * días de mora
            $montoMora = round($cuota->capital_amortizado * $tasaMoraDiaria * $diasMora, 2);

            // Actualizar la cuota
            $cuota->update([
                'estado' => PlanPago::ESTADO_RETRASADA,
                'monto_mora' => $montoMora,
            ]);

            // Marcar el crédito con estado En Mora si no lo está
            if ($credito->estado !== Credito::ESTADO_EN_MORA) {
                $credito->update(['estado' => Credito::ESTADO_EN_MORA]);
                $creditosAfectados[] = $credito->id;
            }

            $this->line(
                "  Cuota #{$cuota->nro_cuota} | Crédito #{$credito->id} | " .
                "Socio: {$credito->user->name} | " .
                "Días mora: {$diasMora} | " .
                "Mora: Bs. " . number_format($montoMora, 2)
            );

            $procesadas++;
        }

        $this->newLine();
        $this->info("━━━ Resumen ━━━");
        $this->info("Cuotas procesadas: {$procesadas}");
        $this->info("Créditos marcados en mora: " . count($creditosAfectados));

        return 0;
    }
}
