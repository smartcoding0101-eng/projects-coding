<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class HistoricoCreditoStatsWidget extends StatsOverviewWidget
{
    public ?array $filtros = [];

    protected function getStats(): array
    {
        $socioId = $this->filtros['socio_id'] ?? null;

        if (!$socioId) {
            return [];
        }

        $socio = User::find($socioId);
        if (!$socio) {
            return [];
        }

        $creditos = Credito::where('user_id', $socio->id)->get();
        $pagos = PlanPago::whereHas('credito', fn($q) => $q->where('user_id', $socio->id))
            ->whereIn('estado', [PlanPago::ESTADO_PAGADA, PlanPago::ESTADO_RETRASADA])
            ->get();

        $mora = $pagos->where('estado', PlanPago::ESTADO_RETRASADA)->count();
        $rating = ($mora == 0) ? 'A' : (($mora < 3) ? 'B' : 'C');
        $ratingColor = ($rating === 'A') ? 'success' : (($rating === 'B') ? 'warning' : 'danger');

        return [
            Stat::make('Total Créditos', $creditos->count())
                ->description('Historial completo')
                ->descriptionIcon('heroicon-m-clock')
                ->color('primary'),

            Stat::make('Vigentes', $creditos->where('estado', Credito::ESTADO_DESEMBOLSADO)->count())
                ->description('Créditos activos')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Total Solicitado', 'Bs ' . number_format($creditos->sum('monto_aprobado'), 2))
                ->description('Monto histórico')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning'),

            Stat::make('Calificación Buró', $rating)
                ->description($mora . ' cuotas pagadas con retraso')
                ->descriptionIcon('heroicon-m-shield-check')
                ->color($ratingColor),
        ];
    }
}
