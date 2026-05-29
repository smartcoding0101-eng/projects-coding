<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\PlanPago;
use Filament\Widgets\ChartWidget;

class RecaudacionChartWidget extends ChartWidget
{
    protected ?string $heading = 'Recaudación vs Colocación (6 meses)';

    protected ?string $maxHeight = '280px';

    protected string $color = 'success';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $labels = [];
        $recaudado = [];
        $colocado = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $labels[] = ucfirst($date->translatedFormat('M'));

            $recaudado[] = (float) PlanPago::where('estado', PlanPago::ESTADO_PAGADA)
                ->whereMonth('fecha_pago_real', $date->month)
                ->whereYear('fecha_pago_real', $date->year)
                ->sum('cuota_total');

            $colocado[] = (float) \App\Models\Credito::where('estado', \App\Models\Credito::ESTADO_DESEMBOLSADO)
                ->whereMonth('fecha_desembolso', $date->month)
                ->whereYear('fecha_desembolso', $date->year)
                ->sum('monto_aprobado');
        }

        return [
            'datasets' => [
                [
                    'label' => 'Recaudado',
                    'data' => $recaudado,
                    'backgroundColor' => '#10b981',
                    'borderRadius' => 6,
                ],
                [
                    'label' => 'Colocado',
                    'data' => $colocado,
                    'backgroundColor' => '#6366f1',
                    'borderRadius' => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
