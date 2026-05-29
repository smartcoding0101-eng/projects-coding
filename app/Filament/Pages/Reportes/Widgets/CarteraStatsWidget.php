<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Credito;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CarteraStatsWidget extends StatsOverviewWidget
{
    public ?array $filtros = [];

    protected function getStats(): array
    {
        $tipoId = $this->filtros['tipo_id'] ?? null;
        $estado = $this->filtros['estado'] ?? null;

        $query = Credito::query();

        if ($tipoId) {
            $query->where('tipo_credito_id', $tipoId);
        }

        if ($estado) {
            $query->where('estado', $estado);
        } else {
            $query->whereIn('estado', [
                Credito::ESTADO_DESEMBOLSADO,
                Credito::ESTADO_EN_MORA,
                Credito::ESTADO_PAGADO,
            ]);
        }

        $creditos = $query->get();
        $vigentes = $creditos->where('estado', Credito::ESTADO_DESEMBOLSADO);
        $enMora = $creditos->where('estado', Credito::ESTADO_EN_MORA);
        $pagados = $creditos->where('estado', Credito::ESTADO_PAGADO);

        // Mini trend: créditos otorgados por mes (últimos 6 meses)
        $trendData = [];
        for ($i = 5; $i >= 0; $i--) {
            $trendData[] = (float) Credito::whereMonth('created_at', now()->subMonths($i)->month)
                ->whereYear('created_at', now()->subMonths($i)->year)
                ->sum('monto_aprobado');
        }

        return [
            Stat::make('Total Créditos', $creditos->count())
                ->description('Créditos en cartera')
                ->descriptionIcon('heroicon-o-document-text')
                ->color('primary')
                ->chart($trendData),

            Stat::make('Vigentes', $vigentes->count())
                ->description('Bs ' . number_format($vigentes->sum('saldo_capital'), 2) . ' en saldo')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('success')
                ->chart($trendData),

            Stat::make('En Mora', $enMora->count())
                ->description('Bs ' . number_format($enMora->sum('saldo_capital'), 2) . ' expuesto')
                ->descriptionIcon('heroicon-o-exclamation-triangle')
                ->color('danger'),

            Stat::make('Total Otorgado', 'Bs ' . number_format($creditos->sum('monto_aprobado'), 2))
                ->description($pagados->count() . ' créditos pagados')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('warning'),
        ];
    }
}
