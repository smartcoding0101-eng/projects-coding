<?php

namespace App\Filament\Pages\Reportes;

use App\Exports\EcommerceExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class RendimientoEcommerce extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.rendimiento-ecommerce';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $title = 'Rendimiento E-Commerce';

    protected static ?string $navigationLabel = 'Rendimiento E-Commerce';

    protected static string|\UnitEnum|null $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 7;

    public ?array $filtros = [];

    protected function getHeaderWidgets(): array
    {
        return [
            Widgets\EcommerceStatsWidget::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            Widgets\EcommerceVentasChart::class,
        ];
    }

    public function mount(): void
    {
        $this->filterForm->fill([
            'desde' => now()->startOfMonth()->toDateString(),
            'hasta' => now()->toDateString(),
            'estado_pago' => null,
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                DatePicker::make('desde')->label('Desde')->required(),
                DatePicker::make('hasta')->label('Hasta')->required(),
                Select::make('estado_pago')
                    ->label('Estado Pago')
                    ->options([
                        'pagado' => 'Pagado',
                        'pendiente_validacion' => 'Pendiente',
                        'rechazado' => 'Rechazado',
                    ])
                    ->placeholder('Todos'),
            ])
            ->columns(3)
            ->statePath('filtros');
    }

    public function filter(): void
    {
    }

    public function getData(): array
    {
        $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
        $hasta = $this->filtros['hasta'] ?? now()->toDateString();
        $estadoPago = $this->filtros['estado_pago'] ?? null;

        $queryPedidos = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);

        if ($estadoPago) {
            $queryPedidos->where('estado_pago', $estadoPago);
        }

        $ventasPeriodo = (float) (clone $queryPedidos)->where('estado_pago', 'pagado')->sum('total');
        $pedidosTotal = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->count();

        $ticketPromedio = $pedidosTotal > 0 ? ($ventasPeriodo / $pedidosTotal) : 0;

        $valorizado = DB::table('productos')
            ->where('activo', true)
            ->sum(DB::raw('stock_actual * precio_general'));

        $recientes = DB::table('pedidos')
            ->select('id', 'numero_orden', 'nombre_cliente', 'tipo_pago', 'estado_pago', 'total', 'created_at')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->orderByDesc('created_at')
            ->limit(15)
            ->get();

        $top_productos = DB::table('pedido_detalles')
            ->join('productos', 'pedido_detalles.producto_id', '=', 'productos.id')
            ->join('pedidos', 'pedido_detalles.pedido_id', '=', 'pedidos.id')
            ->whereBetween('pedidos.created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->where('pedidos.estado_pago', 'pagado')
            ->select('productos.nombre', DB::raw('SUM(pedido_detalles.cantidad) as total_vendido'), DB::raw('SUM(pedido_detalles.subtotal) as recaudado'))
            ->groupBy('productos.id', 'productos.nombre')
            ->orderByDesc('recaudado')
            ->limit(5)
            ->get();

        $ventas_data = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->where('estado_pago', 'pagado')
            ->select('tipo_pago', DB::raw('SUM(total) as total'))
            ->groupBy('tipo_pago')
            ->get();

        $meses = [];
        $ventas_mensuales = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $meses[] = ucfirst($date->translatedFormat('M'));
            $ventas_mensuales[] = (float) DB::table('pedidos')
                ->where('estado_pago', 'pagado')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total');
        }

        return [
            'filtros' => compact('desde', 'hasta', 'estadoPago'),
            'kpis' => [
                'stock_valorizado' => $valorizado,
                'ventas_periodo' => $ventasPeriodo,
                'pedidos_total' => $pedidosTotal,
                'ticket_promedio' => $ticketPromedio,
                'usuarios_activos' => DB::table('users')->count(),
            ],
            'recientes' => $recientes->map(fn($p) => [
                'id' => $p->id,
                'orden' => $p->numero_orden,
                'cliente' => $p->nombre_cliente,
                'metodo' => $p->tipo_pago,
                'estado' => $p->estado_pago,
                'total' => (float) $p->total,
                'fecha' => Carbon::parse($p->created_at)->format('d/m/Y H:i'),
            ]),
            'top_productos' => $top_productos,
            'ventas_por_tipo' => $ventas_data,
            'chart_labels' => $meses,
            'chart_data' => $ventas_mensuales,
            'fecha_reporte' => now()->format('d/m/Y H:i'),
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('filter')->label('Filtrar')->icon('heroicon-o-funnel')->action('filter')->color('primary'),
            Action::make('exportPdf')
                ->label('PDF')
                ->icon('heroicon-o-document-arrow-down')
                ->color('danger')
                ->action(function () {
                    $data = $this->getData();
                    $pdf = Pdf::loadView('reportes.ecommerce-pdf', $data)->setPaper('letter', 'portrait');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'ecommerce_' . now()->format('Ymd') . '.pdf'
                    );
                }),
            Action::make('exportExcel')
                ->label('Excel')
                ->icon('heroicon-o-table-cells')
                ->color('success')
                ->action(function () {
                    $data = $this->getData();
                    return Excel::download(new EcommerceExport($data), 'ecommerce_' . now()->format('Ymd') . '.xlsx');
                }),
        ];
    }
}
