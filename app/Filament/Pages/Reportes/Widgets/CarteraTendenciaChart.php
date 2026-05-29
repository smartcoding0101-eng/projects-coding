<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Credito;
use Filament\Widgets\ChartWidget;

class CarteraTendenciaChart extends ChartWidget
{
    protected ?string $heading = 'Colocación Mensual (6 meses)';

    protected ?string $maxHeight = '280px';

    protected string $color = 'warning';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $labels = [];
        $montos = [];
        $cantidades = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $labels[] = ucfirst($date->translatedFormat('M'));

            $montos[] = (float) Credito::whereMonth('fecha_desembolso', $date->month)
                ->whereYear('fecha_desembolso', $date->year)
                ->where('estado', '!=', 'Rechazado')
                ->sum('monto_aprobado');

            $cantidades[] = Credito::whereMonth('fecha_desembolso', $date->month)
                ->whereYear('fecha_desembolso', $date->year)
                ->where('estado', '!=', 'Rechazado')
                ->count();
        }

        return [
            'datasets' => [
                [
                    'label' => 'Monto Bs',
                    'data' => $montos,
                    'backgroundColor' => '#f59e0b',
                    'borderRadius' => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
