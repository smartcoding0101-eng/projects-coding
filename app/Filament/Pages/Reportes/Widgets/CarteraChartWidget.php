<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Credito;
use Filament\Widgets\ChartWidget;

class CarteraChartWidget extends ChartWidget
{
    protected ?string $heading = 'Composición de Cartera';

    protected ?string $maxHeight = '280px';

    protected string $color = 'primary';

    public ?array $filtros = [];

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $vigentes = Credito::where('estado', Credito::ESTADO_DESEMBOLSADO)->sum('saldo_capital');
        $enMora = Credito::where('estado', Credito::ESTADO_EN_MORA)->sum('saldo_capital');
        $pagados = Credito::where('estado', Credito::ESTADO_PAGADO)->count();

        return [
            'datasets' => [
                [
                    'data' => [$vigentes, $enMora],
                    'backgroundColor' => ['#10b981', '#ef4444'],
                    'hoverOffset' => 4,
                ],
            ],
            'labels' => ['Vigente', 'En Mora'],
        ];
    }
}
