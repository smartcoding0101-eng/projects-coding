<?php

namespace App\Filament\Pages\Reportes\Widgets;

use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class EcommerceVentasChart extends ChartWidget
{
    protected ?string $heading = 'Tendencia de Ventas (Rango seleccionado)';

    protected ?string $maxHeight = '280px';

    protected string $color = 'success';

    public ?array $filtros = [];

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
        $hasta = $this->filtros['hasta'] ?? now()->toDateString();
        $estadoPago = $this->filtros['estado_pago'] ?? 'pagado'; // Por defecto solo pagados para la tendencia real

        $fechaInicio = Carbon::parse($desde);
        $fechaFin = Carbon::parse($hasta);
        $diasDiferencia = $fechaInicio->diffInDays($fechaFin);

        $labels = [];
        $data = [];

        // Si el rango es mayor a 90 días, agrupamos por meses para no saturar la gráfica
        if ($diasDiferencia > 90) {
            $this->heading = 'Ventas Mensuales (Rango seleccionado)';
            // Obtener el inicio del mes de $desde
            $mesActual = $fechaInicio->copy()->startOfMonth();
            while ($mesActual <= $fechaFin) {
                $labels[] = ucfirst($mesActual->translatedFormat('M Y'));
                
                $query = DB::table('pedidos')
                    ->whereMonth('created_at', $mesActual->month)
                    ->whereYear('created_at', $mesActual->year);

                if ($estadoPago) {
                    $query->where('estado_pago', $estadoPago);
                }

                $data[] = (float) $query->sum('total');
                $mesActual->addMonth();
            }
        } else {
            $this->heading = 'Ventas Diarias (Rango seleccionado)';
            // Agrupamos día a día
            $diaActual = $fechaInicio->copy();
            while ($diaActual <= $fechaFin) {
                $labels[] = $diaActual->format('d/m');
                
                $query = DB::table('pedidos')
                    ->whereDate('created_at', $diaActual->toDateString());

                if ($estadoPago) {
                    $query->where('estado_pago', $estadoPago);
                }

                $data[] = (float) $query->sum('total');
                $diaActual->addDay();
            }
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
