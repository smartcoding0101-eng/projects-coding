<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Credito;
use App\Models\PlanPago;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class RecaudacionStatsWidget extends StatsOverviewWidget
{
    public ?array $filtros = [];

    protected function getStats(): array
    {
        $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
        $hasta = $this->filtros['hasta'] ?? now()->toDateString();

        $pagos = PlanPago::where('estado', PlanPago::ESTADO_PAGADA)
            ->whereBetween('fecha_pago_real', [$desde, Carbon::parse($hasta)->endOfDay()])
            ->get();

        $totalRecaudado = (float) $pagos->sum('cuota_total');
        $capitalRecaudado = (float) $pagos->sum('capital_amortizado');

        $colocado = (float) Credito::where('estado', Credito::ESTADO_DESEMBOLSADO)
            ->whereBetween('fecha_desembolso', [$desde, $hasta])
            ->sum('monto_aprobado');

        $ratio = $colocado > 0 ? round(($totalRecaudado / $colocado) * 100, 1) : 100;

        // Trend
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = now()->subMonths($i);
            $trend[] = (float) PlanPago::where('estado', PlanPago::ESTADO_PAGADA)
                ->whereMonth('fecha_pago_real', $d->month)->whereYear('fecha_pago_real', $d->year)
                ->sum('cuota_total');
        }

        return [
            Stat::make('Total Recaudado', 'Bs ' . number_format($totalRecaudado, 2))
                ->description('Capital + Interés + Mora')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('success')
                ->chart($trend),

            Stat::make('Total Colocado', 'Bs ' . number_format($colocado, 2))
                ->description('Nuevos créditos en periodo')
                ->descriptionIcon('heroicon-o-banknotes')
                ->color('primary'),

            Stat::make('Ratio Recuperación', $ratio . '%')
                ->description($ratio >= 100 ? 'Superávit' : 'Déficit')
                ->descriptionIcon($ratio >= 100 ? 'heroicon-o-check-circle' : 'heroicon-o-exclamation-triangle')
                ->color($ratio >= 100 ? 'success' : 'danger'),
        ];
    }
}
