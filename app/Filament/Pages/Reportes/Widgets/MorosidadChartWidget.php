<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Credito;
use App\Models\PlanPago;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class MorosidadChartWidget extends ChartWidget
{
    protected ?string $heading = 'Evolución de Mora (6 meses)';

    protected ?string $maxHeight = '280px';

    protected string $color = 'danger';

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        $labels = [];
        $capitalMoroso = [];
        $cuotasMora = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $labels[] = ucfirst($date->translatedFormat('M'));

            $cuotas = PlanPago::where('estado', PlanPago::ESTADO_RETRASADA)
                ->whereMonth('fecha_vencimiento', $date->month)
                ->whereYear('fecha_vencimiento', $date->year)
                ->get();

            $capitalMoroso[] = (float) $cuotas->sum('capital_amortizado');
            $cuotasMora[] = $cuotas->count();
        }

        return [
            'datasets' => [
                [
                    'label' => 'Capital Moroso (Bs)',
                    'data' => $capitalMoroso,
                    'borderColor' => '#ef4444',
                    'backgroundColor' => 'rgba(239, 68, 68, 0.1)',
                    'fill' => true,
                    'tension' => 0.3,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
