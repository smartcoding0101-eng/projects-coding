<?php

namespace App\Filament\Pages\Reportes\Widgets;

use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class EcommerceVentasChart extends ChartWidget
{
    protected ?string $heading = 'Ventas Mensuales (6 meses)';

    protected ?string $maxHeight = '280px';

    protected string $color = 'success';

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        $labels = [];
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $labels[] = ucfirst($date->translatedFormat('M'));
            $data[] = (float) DB::table('pedidos')
                ->where('estado_pago', 'pagado')
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('total');
        }

        return [
            'datasets' => [
                [
                    'label' => 'Ventas Bs',
                    'data' => $data,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
