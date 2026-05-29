<?php

namespace App\Filament\Pages\Reportes\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class EcommerceStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $ventasTotales = (float) DB::table('pedidos')->where('estado_pago', 'pagado')->sum('total');
        $pedidosTotal = DB::table('pedidos')->count();
        $pedidosPagados = DB::table('pedidos')->where('estado_pago', 'pagado')->count();
        $ticketPromedio = $pedidosPagados > 0 ? $ventasTotales / $pedidosPagados : 0;

        $stockValorizado = (float) DB::table('productos')
            ->where('activo', true)
            ->sum(DB::raw('stock_actual * precio_general'));

        // Trend
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = now()->subMonths($i);
            $trend[] = (float) DB::table('pedidos')
                ->where('estado_pago', 'pagado')
                ->whereMonth('created_at', $d->month)->whereYear('created_at', $d->year)
                ->sum('total');
        }

        return [
            Stat::make('Ventas Totales', 'Bs ' . number_format($ventasTotales, 2))
                ->description('Pedidos pagados')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('success')
                ->chart($trend),

            Stat::make('Pedidos', $pedidosTotal)
                ->description($pedidosPagados . ' pagados')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->color('primary'),

            Stat::make('Ticket Promedio', 'Bs ' . number_format($ticketPromedio, 2))
                ->description('Por pedido pagado')
                ->descriptionIcon('heroicon-o-receipt-percent')
                ->color('warning'),

            Stat::make('Stock Valorizado', 'Bs ' . number_format($stockValorizado, 2))
                ->description('Inventario activo')
                ->descriptionIcon('heroicon-o-cube')
                ->color('info'),
        ];
    }
}
