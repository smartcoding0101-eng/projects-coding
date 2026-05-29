<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Credito;
use App\Models\Kardex;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class EstadoCuentaStatsWidget extends StatsOverviewWidget
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
        $saldoKardex = Kardex::where('user_id', $socio->id)->orderBy('id', 'desc')->value('saldo_acumulado') ?? 0;

        $creditosActivos = $creditos->whereIn('estado', [Credito::ESTADO_DESEMBOLSADO, Credito::ESTADO_EN_MORA]);
        $deudaTotal = $creditosActivos->sum('saldo_capital');

        // Trend for Kardex Balance (last 6 movements)
        $kardexTrend = Kardex::where('user_id', $socio->id)
            ->orderBy('id', 'desc')
            ->limit(10)
            ->pluck('saldo_acumulado')
            ->reverse()
            ->map(fn($v) => (float) $v)
            ->toArray();

        return [
            Stat::make('Saldo Kardex', 'Bs ' . number_format($saldoKardex, 2))
                ->description('Balance acumulado')
                ->descriptionIcon('heroicon-m-wallet')
                ->color('primary')
                ->chart($kardexTrend),

            Stat::make('Créditos Activos', $creditosActivos->count())
                ->description('Créditos vigentes/mora')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('warning'),

            Stat::make('Deuda Total', 'Bs ' . number_format($deudaTotal, 2))
                ->description('Capital pendiente')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('danger'),

            Stat::make('Total Pagado', 'Bs ' . number_format($creditos->sum(fn($c) => $c->planPagos->where('estado', 'Pagada')->sum('cuota_total')), 2))
                ->description('Pagos registrados')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success'),
        ];
    }
}
