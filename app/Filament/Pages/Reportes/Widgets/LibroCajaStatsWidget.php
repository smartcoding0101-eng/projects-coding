<?php

namespace App\Filament\Pages\Reportes\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class LibroCajaStatsWidget extends StatsOverviewWidget
{
    public ?array $filtros = [];

    protected function getStats(): array
    {
        $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
        $hasta = $this->filtros['hasta'] ?? now()->toDateString();
        $cajeroId = $this->filtros['cajero_id'] ?? null;

        $saldoInicialQuery = DB::table('libro_diarios')
            ->where('fecha', '<', $desde);

        if ($cajeroId) {
            $saldoInicialQuery->where('cajero_id', $cajeroId);
        }

        $saldoInicial = (float) $saldoInicialQuery->sum(DB::raw('ingreso - egreso'));

        $movimientos = DB::table('libro_diarios')
            ->whereBetween('fecha', [$desde, $hasta]);

        if ($cajeroId) {
            $movimientos->where('cajero_id', $cajeroId);
        }

        $ingresos = (float) (clone $movimientos)->sum('ingreso');
        $egresos = (float) (clone $movimientos)->sum('egreso');
        $saldoFinal = $saldoInicial + $ingresos - $egresos;

        // trend
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = now()->subMonths($i);
            $trend[] = (float) DB::table('libro_diarios')
                ->whereMonth('fecha', $d->month)->whereYear('fecha', $d->year)
                ->sum(DB::raw('ingreso - egreso'));
        }

        return [
            Stat::make('Saldo Inicial', 'Bs ' . number_format($saldoInicial, 2))
                ->description('Apertura del periodo')
                ->descriptionIcon('heroicon-o-arrow-right')
                ->color('gray'),

            Stat::make('Ingresos', 'Bs ' . number_format($ingresos, 2))
                ->description('Entradas en periodo')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('success')
                ->chart($trend),

            Stat::make('Egresos', 'Bs ' . number_format($egresos, 2))
                ->description('Salidas en periodo')
                ->descriptionIcon('heroicon-o-arrow-trending-down')
                ->color('danger'),

            Stat::make('Saldo Final', 'Bs ' . number_format($saldoFinal, 2))
                ->description($saldoFinal >= $saldoInicial ? 'Positivo' : 'Negativo')
                ->descriptionIcon($saldoFinal >= $saldoInicial ? 'heroicon-o-check-circle' : 'heroicon-o-exclamation-triangle')
                ->color($saldoFinal >= $saldoInicial ? 'success' : 'danger'),
        ];
    }
}
