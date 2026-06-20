<?php

namespace App\Filament\Pages\Reportes\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class EcommerceStatsWidget extends StatsOverviewWidget
{
    public ?array $filtros = [];

    protected function getStats(): array
    {
        $desde      = $this->filtros['desde']      ?? now()->startOfMonth()->toDateString();
        $hasta      = $this->filtros['hasta']      ?? now()->toDateString();
        $estadoPago = $this->filtros['estado_pago'] ?? null;

        // Base query con rango de fechas
        $queryPedidos = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);

        if ($estadoPago) {
            $queryPedidos->where('estado_pago', $estadoPago);
        }

        // Pedidos correspondientes al filtro seleccionado
        $pedidosTotal = (clone $queryPedidos)->count();

        // Ventas Totales del periodo (solo pagados)
        $ventasTotales = (float) DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->where('estado_pago', 'pagado')
            ->sum('total');

        // Pedidos pagados en el periodo (para calcular el ticket promedio)
        $pedidosPagados = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->where('estado_pago', 'pagado')
            ->count();

        $ticketPromedio = $pedidosPagados > 0 ? $ventasTotales / $pedidosPagados : 0;

        $stockValorizado = (float) DB::table('productos')
            ->where('activo', true)
            ->sum(DB::raw('stock_actual * precio_general'));

        // Tendencia últimos 6 meses (siempre sobre pagados)
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = now()->subMonths($i);
            $trend[] = (float) DB::table('pedidos')
                ->where('estado_pago', 'pagado')
                ->whereMonth('created_at', $d->month)
                ->whereYear('created_at', $d->year)
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
