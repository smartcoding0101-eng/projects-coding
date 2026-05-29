<?php

namespace App\Filament\Pages\Reportes;

use App\Models\Pedido;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;

class MovimientosEcommerce extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.movimientos-ecommerce';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-arrows-right-left';

    protected static ?string $title = 'Movimientos E-Commerce';

    protected static ?string $navigationLabel = 'Movimientos E-Commerce';

    protected static string|\UnitEnum|null $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 10;

    public ?array $filtros = [];

    public function mount(): void
    {
        $this->filterForm->fill([
            'q' => null,
            'estado_pago' => null,
            'fecha_inicio' => null,
            'fecha_fin' => null,
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                TextInput::make('q')
                    ->label('Buscar')
                    ->placeholder('Orden o cliente...'),
                Select::make('estado_pago')
                    ->label('Estado Pago')
                    ->options([
                        'pagado' => 'Pagado',
                        'pendiente_validacion' => 'Pendiente',
                        'rechazado' => 'Rechazado',
                    ])
                    ->placeholder('Todos'),
                DatePicker::make('fecha_inicio')->label('Desde'),
                DatePicker::make('fecha_fin')->label('Hasta'),
            ])
            ->columns(4)
            ->statePath('filtros');
    }

    public function filter(): void
    {
    }

    public function getData(): array
    {
        $q = $this->filtros['q'] ?? null;
        $estadoPago = $this->filtros['estado_pago'] ?? null;
        $fechaInicio = $this->filtros['fecha_inicio'] ?? null;
        $fechaFin = $this->filtros['fecha_fin'] ?? null;

        $query = Pedido::with(['user', 'detalles.producto'])
            ->orderBy('created_at', 'desc');

        if ($q) {
            $searchTerm = '%' . $q . '%';
            $query->where(function ($qb) use ($searchTerm) {
                $qb->where('numero_orden', 'like', $searchTerm)
                    ->orWhereHas('user', fn($qu) => $qu->where('name', 'like', $searchTerm));
            });
        }

        if ($estadoPago) {
            $query->where('estado_pago', $estadoPago);
        }

        if ($fechaInicio) {
            $query->whereDate('created_at', '>=', $fechaInicio);
        }

        if ($fechaFin) {
            $query->whereDate('created_at', '<=', $fechaFin);
        }

        $pedidos = $query->paginate(25);

        $stats = [
            'total_ventas' => (float) Pedido::where('estado_pago', 'pagado')->sum('total'),
            'cantidad_pedidos' => Pedido::count(),
            'pedidos_pagados' => Pedido::where('estado_pago', 'pagado')->count(),
            'pedidos_rechazados' => Pedido::where('estado_pago', 'rechazado')->count(),
        ];

        return [
            'pedidos' => $pedidos,
            'stats' => $stats,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('filter')->label('Filtrar')->icon('heroicon-o-funnel')->action('filter')->color('primary'),
        ];
    }
}
