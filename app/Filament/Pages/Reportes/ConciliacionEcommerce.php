<?php

namespace App\Filament\Pages\Reportes;

use App\Models\Pedido;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\DB;

class ConciliacionEcommerce extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.conciliacion-ecommerce';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-scale';

    protected static ?string $title = 'Conciliación E-Commerce';

    protected static ?string $navigationLabel = 'Conciliación E-Commerce';

    protected static string|\UnitEnum|null $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 9;

    public ?array $filtros = [];

    public function mount(): void
    {
        $this->filterForm->fill([
            'desde' => now()->startOfMonth()->toDateString(),
            'hasta' => now()->toDateString(),
            'estado_entrega' => 'por_recoger',
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                DatePicker::make('desde')->label('Desde')->required(),
                DatePicker::make('hasta')->label('Hasta')->required(),
                Select::make('estado_entrega')
                    ->label('Estado Entrega')
                    ->options([
                        'por_recoger' => 'Por Recoger',
                        'entregado' => 'Entregado',
                        'todos' => 'Todos',
                    ])
                    ->default('por_recoger'),
            ])
            ->columns(3)
            ->statePath('filtros');
    }

    public function filter(): void
    {
        $this->filtros = $this->filterForm->getState();
    }

    public function getData(): array
    {
        $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
        $hasta = $this->filtros['hasta'] ?? now()->toDateString();
        $estadoEntrega = $this->filtros['estado_entrega'] ?? 'por_recoger';

        $queryPendientes = Pedido::with('detalles.producto', 'user')
            ->where('estado_pago', 'pagado')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);

        if ($estadoEntrega !== 'todos') {
            $queryPendientes->where('estado_entrega', $estadoEntrega);
        }

        $pendientes = $queryPendientes->orderBy('created_at', 'asc')->get();

        $queryProductos = DB::table('pedido_detalles')
            ->join('pedidos', 'pedido_detalles.pedido_id', '=', 'pedidos.id')
            ->join('productos', 'pedido_detalles.producto_id', '=', 'productos.id')
            ->where('pedidos.estado_pago', 'pagado')
            ->whereBetween('pedidos.created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);

        if ($estadoEntrega !== 'todos') {
            $queryProductos->where('pedidos.estado_entrega', $estadoEntrega);
        }

        $productosRetenidos = $queryProductos->select(
            'productos.nombre',
            'productos.codigo_sku',
            DB::raw('SUM(pedido_detalles.cantidad) as total_unidades'),
            DB::raw('SUM(pedido_detalles.subtotal) as valor_reservado')
        )
            ->groupBy('productos.id', 'productos.nombre', 'productos.codigo_sku')
            ->get();

        // Mapea los pedidos para que coincidan con lo que espera el Blade (registros)
        $registros = $pendientes->map(fn($p) => [
            'fecha' => \Carbon\Carbon::parse($p->created_at)->format('d/m/Y H:i'),
            'orden' => $p->numero_orden,
            'cliente' => $p->nombre_cliente,
            'metodo' => $p->tipo_pago,
            'estado_pago' => $p->estado_pago,
            'estado_pedido' => $p->estado_entrega,
            'total' => (float) $p->total,
        ]);

        return [
            'registros' => $registros,
            'pendientes' => $pendientes,
            'resumen' => [
                'total_pedidos_retenidos' => $pendientes->count(),
                'monto_total_retenido' => $pendientes->sum('total'),
                'unidades_totales_pendientes' => $productosRetenidos->sum('total_unidades'),
                'fecha_corte' => now()->format('d/m/Y H:i'),
            ],
            'productos' => $productosRetenidos,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('filter')->label('Filtrar')->icon('heroicon-o-funnel')->action('filter')->color('primary'),
        ];
    }
}
