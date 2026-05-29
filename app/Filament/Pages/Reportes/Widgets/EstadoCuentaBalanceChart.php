<?php

namespace App\Filament\Pages\Reportes\Widgets;

use App\Models\Kardex;
use Filament\Widgets\ChartWidget;

class EstadoCuentaBalanceChart extends ChartWidget
{
    protected ?string $heading = 'Evolución de Saldo (Kardex)';

    protected ?string $maxHeight = '250px';

    public ?array $filtros = [];

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        $socioId = $this->filtros['socio_id'] ?? null;

        if (!$socioId) {
            return [
                'datasets' => [],
                'labels' => [],
            ];
        }

        $movimientos = Kardex::where('user_id', $socioId)
            ->orderBy('fecha', 'asc')
            ->orderBy('id', 'asc')
            ->limit(30)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Saldo Acumulado',
                    'data' => $movimientos->map(fn($m) => (float) $m->saldo_acumulado)->toArray(),
                    'fill' => 'start',
                    'tension' => 0.4,
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                ],
            ],
            'labels' => $movimientos->map(fn($m) => \Carbon\Carbon::parse($m->fecha)->format('d/m'))->toArray(),
        ];
    }
}
