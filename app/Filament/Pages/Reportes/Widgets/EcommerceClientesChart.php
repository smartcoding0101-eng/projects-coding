<?php

namespace App\Filament\Pages\Reportes\Widgets;

use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class EcommerceClientesChart extends ChartWidget
{
    protected ?string $heading = 'Clientes por Fecha';

    protected ?string $maxHeight = '280px';

    protected string $color = 'info';

    public ?array $filtros = [];

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
        $hasta = $this->filtros['hasta'] ?? now()->toDateString();
        $estadoPago = $this->filtros['estado_pago'] ?? null; 

        $fechaInicio = Carbon::parse($desde);
        $fechaFin = Carbon::parse($hasta);
        $diasDiferencia = $fechaInicio->diffInDays($fechaFin);

        $labels = [];
        $data = [];

        // Si el rango es mayor a 90 días, agrupamos por meses para no saturar la gráfica
        if ($diasDiferencia > 90) {
            $this->heading = 'Cantidad de Clientes por Mes';
            $mesActual = $fechaInicio->copy()->startOfMonth();
            
            while ($mesActual <= $fechaFin) {
                $labels[] = ucfirst($mesActual->translatedFormat('M Y'));
                
                $query = DB::table('pedidos')
                    ->whereMonth('created_at', $mesActual->month)
                    ->whereYear('created_at', $mesActual->year);

                if ($estadoPago) {
                    $query->where('estado_pago', $estadoPago);
                }

                // Contamos clientes únicos (por user_id, o por ci_cliente/nombre si es invitado)
                $data[] = (int) $query->count(DB::raw('DISTINCT COALESCE(user_id, ci_cliente, nombre_cliente)'));
                $mesActual->addMonth();
            }
        } else {
            $this->heading = 'Cantidad de Clientes por Día';
            $diaActual = $fechaInicio->copy();
            
            while ($diaActual <= $fechaFin) {
                $labels[] = $diaActual->format('d/m');
                
                $query = DB::table('pedidos')
                    ->whereDate('created_at', $diaActual->toDateString());

                if ($estadoPago) {
                    $query->where('estado_pago', $estadoPago);
                }

                $data[] = (int) $query->count(DB::raw('DISTINCT COALESCE(user_id, ci_cliente, nombre_cliente)'));
                $diaActual->addDay();
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Clientes Únicos',
                    'data' => $data,
                    'backgroundColor' => '#3b82f6', // Un azul (info) para contrastar con el verde (success)
                    'borderRadius' => 4,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
