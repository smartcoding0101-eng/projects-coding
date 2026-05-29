<?php

namespace App\Filament\Pages\Reportes;

use App\Models\Credito;
use App\Models\Kardex;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Maatwebsite\Excel\Facades\Excel;

class EstadoCuenta extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.estado-cuenta';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-magnifying-glass';

    protected static ?string $title = 'Estado de Cuenta';

    protected static ?string $navigationLabel = 'Estado de Cuenta';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 3;

    protected function getHeaderWidgets(): array
    {
        return [
            Widgets\EstadoCuentaStatsWidget::class,
            Widgets\EstadoCuentaBalanceChart::class,
        ];
    }


    public ?array $filtros = [];

    public function mount(): void
    {
        $this->filterForm->fill([
            'socio_id' => null,
            'desde' => null,
            'hasta' => null,
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                Select::make('socio_id')
                    ->label('Socio')
                    ->options(User::orderBy('name')->pluck('name', 'id'))
                    ->searchable()
                    ->placeholder('Seleccione un socio'),
                DatePicker::make('desde')
                    ->label('Desde'),
                DatePicker::make('hasta')
                    ->label('Hasta'),
            ])
            ->columns(3)
            ->statePath('filtros');
    }

    public function filter(): void
    {
        // Al ejecutar filter(), Livewire redesplegará los widgets con los nuevos $filtros
    }


    public function getData(): array
    {
        $socioId = $this->filtros['socio_id'] ?? null;
        $desde = $this->filtros['desde'] ?? null;
        $hasta = $this->filtros['hasta'] ?? null;

        if (!$socioId) {
            return [
                'socio' => null,
                'resumen' => null,
                'creditos' => collect(),
                'movimientos' => collect(),
            ];
        }

        $socio = User::findOrFail($socioId);

        $creditos = Credito::where('user_id', $socio->id)
            ->with(['tipoCredito', 'planPagos'])
            ->get();

        $queryMovimientos = Kardex::where('user_id', $socio->id)
            ->orderBy('id', 'desc');

        if ($desde && $hasta) {
            $queryMovimientos->whereBetween('fecha', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);
        } else {
            $queryMovimientos->limit(50);
        }

        $movimientos = $queryMovimientos->get();

        return [
            'socio' => [
                'id' => $socio->id,
                'nombre' => $socio->name,
                'ci' => $socio->ci ?? 'N/D',
                'grado' => $socio->grado ?? 'N/D',
            ],
            'resumen' => [
                'saldo_kardex' => Kardex::where('user_id', $socio->id)->orderBy('id', 'desc')->value('saldo_acumulado') ?? 0,
                'creditos_activos' => $creditos->whereIn('estado', [Credito::ESTADO_DESEMBOLSADO, Credito::ESTADO_EN_MORA])->count(),
                'deuda_total' => $creditos->whereIn('estado', [Credito::ESTADO_DESEMBOLSADO, Credito::ESTADO_EN_MORA])->sum('saldo_capital'),
                'total_pagado' => $creditos->sum(fn($c) => $c->planPagos->where('estado', 'Pagada')->sum('cuota_total')),
            ],
            'creditos' => $creditos->map(fn($c) => [
                'id' => $c->id,
                'tipo' => $c->tipoCredito?->nombre ?? 'General',
                'monto_aprobado' => $c->monto_aprobado,
                'saldo_capital' => $c->saldo_capital,
                'estado' => $c->estado,
                'plazo' => $c->plazo_meses,
                'cuotas_pagadas' => $c->planPagos->where('estado', 'Pagada')->count(),
                'cuotas_pendientes' => $c->planPagos->whereIn('estado', ['Pendiente', 'Retrasada'])->count(),
            ])->values(),
            'movimientos' => $movimientos->map(fn($m) => [
                'fecha' => $m->fecha ? Carbon::parse($m->fecha)->format('d/m/Y') : 'N/D',
                'tipo' => Kardex::etiquetasTipo()[$m->tipo_movimiento] ?? $m->tipo_movimiento,
                'concepto' => $m->conceptosExport()[$m->concepto] ?? $m->concepto,
                'ingreso' => (float) $m->ingreso,
                'egreso' => (float) $m->egreso,
                'saldo' => (float) $m->saldo_acumulado,
            ])->values(),
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('filter')
                ->label('Filtrar')
                ->icon('heroicon-o-funnel')
                ->action('filter')
                ->color('primary'),
            Action::make('exportPdf')
                ->label('PDF')
                ->icon('heroicon-o-document-arrow-down')
                ->color('danger')
                ->action(function () {
                    $data = $this->getData();
                    if (!$data['socio'])
                        return;
                    $data['fecha_generacion'] = now()->format('d/m/Y H:i');
                    $data['filtros'] = $this->filtros;
                    $data['socios'] = [];
                    $pdf = Pdf::loadView('reportes.estado-cuenta', $data)->setPaper('letter');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'estado_cuenta_' . ($data['socio']['ci'] ?? 'socio') . '_' . now()->format('Ymd') . '.pdf'
                    );
                }),
            Action::make('exportExcel')
                ->label('Excel')
                ->icon('heroicon-o-table-cells')
                ->color('success')
                ->action(function () {
                    $data = $this->getData();
                    if (!$data['socio'])
                        return;
                    $data['fecha_generacion'] = now()->format('d/m/Y H:i');
                    $data['filtros'] = $this->filtros;
                    $data['socios'] = [];
                    return Excel::download(
                        new \App\Exports\EstadoCuentaExport($data),
                        'estado_cuenta_' . ($data['socio']['ci'] ?? 'socio') . '.xlsx'
                    );
                }),
        ];
    }
}
