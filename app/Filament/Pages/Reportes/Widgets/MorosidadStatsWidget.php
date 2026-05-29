<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\PlanPago;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class MorosidadStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $cuotasMora = PlanPago::where('estado', PlanPago::ESTADO_RETRASADA)->get();
        $sociosAfectados = $cuotasMora->pluck('credito_id')->unique()->count();

        // Trend: cuotas retrasadas por mes
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $trend[] = PlanPago::where('estado', PlanPago::ESTADO_RETRASADA)
                ->whereMonth('fecha_vencimiento', now()->subMonths($i)->month)
                ->whereYear('fecha_vencimiento', now()->subMonths($i)->year)
                ->count();
        }

        return [
            Stat::make('Cuotas Atrasadas', $cuotasMora->count())
                ->description('Total de cuotas vencidas')
                ->descriptionIcon('heroicon-o-exclamation-triangle')
                ->color('danger')
                ->chart($trend),

            Stat::make('Capital Moroso', 'Bs ' . number_format($cuotasMora->sum('capital_amortizado'), 2))
                ->description('Capital en riesgo')
                ->descriptionIcon('heroicon-o-arrow-trending-down')
                ->color('warning'),

            Stat::make('Mora Acumulada', 'Bs ' . number_format($cuotasMora->sum('monto_mora'), 2))
                ->description('Intereses moratorios')
                ->descriptionIcon('heroicon-o-currency-dollar')
                ->color('danger'),

            Stat::make('Socios Afectados', $sociosAfectados)
                ->description('Créditos con mora')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary'),
        ];
    }
}
