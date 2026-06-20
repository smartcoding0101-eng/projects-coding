<?php

namespace App\Filament\Pages\Reportes;

use App\Exports\CarteraCreditosExport;
use App\Filament\Pages\Reportes\Widgets\CarteraChartWidget;
use App\Filament\Pages\Reportes\Widgets\CarteraStatsWidget;
use App\Filament\Pages\Reportes\Widgets\CarteraTendenciaChart;
use App\Models\Credito;
use App\Models\TipoCredito;
use Barryvdh\DomPDF\Facade\Pdf;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;

class CarteraCreditos extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.cartera-creditos';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?string $title = 'Cartera de Créditos';

    protected static ?string $navigationLabel = 'Cartera de Créditos';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 1;

    public ?array $filtros = [];

    protected function getHeaderWidgets(): array
    {
        return [
            CarteraStatsWidget::class,
        ];
    }

    public function getWidgetData(): array
    {
        return [
            'filtros' => $this->filtros ?? [],
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            CarteraChartWidget::class,
            CarteraTendenciaChart::class,
        ];
    }

    public function mount(): void
    {
        $this->filterForm->fill([
            'tipo_id' => null,
            'estado' => null,
            'search' => null,
            'desde' => null,
            'hasta' => null,
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                Select::make('tipo_id')
                    ->label('Tipo de Crédito')
                    ->options(TipoCredito::pluck('nombre', 'id'))
                    ->placeholder('Todos'),
                Select::make('estado')
                    ->label('Estado')
                    ->options([
                        Credito::ESTADO_DESEMBOLSADO => 'Vigente',
                        Credito::ESTADO_EN_MORA => 'En Mora',
                        Credito::ESTADO_PAGADO => 'Pagado',
                    ])
                    ->placeholder('Todos (activos)'),
                TextInput::make('search')
                    ->label('Buscar Socio / CI')
                    ->placeholder('Nombre o CI...'),
                DatePicker::make('desde')
                    ->label('Desde'),
                DatePicker::make('hasta')
                    ->label('Hasta'),
            ])
            ->columns(5)
            ->statePath('filtros');
    }

    public function filter(): void
    {
        $this->filtros = $this->filterForm->getState();
        unset($this->cachedHeaderWidgetsSchemaComponents);
        unset($this->cachedFooterWidgetsSchemaComponents);
    }

    public function getData(): array
    {
        $tipoId = $this->filtros['tipo_id'] ?? null;
        $estado = $this->filtros['estado'] ?? null;
        $search = $this->filtros['search'] ?? null;
        $desde = $this->filtros['desde'] ?? null;
        $hasta = $this->filtros['hasta'] ?? null;

        $query = Credito::join('users', 'creditos.user_id', '=', 'users.id')
            ->join('personas', 'users.persona_id', '=', 'personas.id')
            ->with(['user.persona', 'tipoCredito'])
            ->select('creditos.*', 'users.name', 'personas.ci');

        if ($tipoId) {
            $query->where('creditos.tipo_credito_id', $tipoId);
        }

        if ($estado) {
            $query->where('creditos.estado', $estado);
        } else {
            $query->whereIn('creditos.estado', [
                Credito::ESTADO_DESEMBOLSADO,
                Credito::ESTADO_EN_MORA,
                Credito::ESTADO_PAGADO,
            ]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('personas.ci', 'like', "%{$search}%");
            });
        }

        if ($desde) {
            $query->whereDate('creditos.fecha_desembolso', '>=', $desde);
        }

        if ($hasta) {
            $query->whereDate('creditos.fecha_desembolso', '<=', $hasta);
        }

        $creditosFiltrados = $query->orderBy('creditos.fecha_desembolso', 'desc')->get();

        $vigentes = $creditosFiltrados->where('estado', Credito::ESTADO_DESEMBOLSADO);
        $enMora = $creditosFiltrados->where('estado', Credito::ESTADO_EN_MORA);
        $pagados = $creditosFiltrados->where('estado', Credito::ESTADO_PAGADO);

        return [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'filtros' => [
                'tipo_id' => $tipoId,
                'estado' => $estado,
                'search' => $search,
                'desde' => $desde,
                'hasta' => $hasta,
            ],
            'resumen' => [
                'total_creditos' => (int) $creditosFiltrados->count(),
                'vigentes' => (int) $vigentes->count(),
                'en_mora' => (int) $enMora->count(),
                'pagados' => (int) $pagados->count(),
                'monto_vigente' => (float) $vigentes->sum('saldo_capital'),
                'monto_mora' => (float) $enMora->sum('saldo_capital'),
                'monto_total_otorgado' => (float) $creditosFiltrados->sum('monto_aprobado'),
            ],
            'creditos' => $creditosFiltrados->map(fn($c) => [
                'id' => $c->id,
                'socio' => $c->user->name,
                'ci' => $c->user->ci ?? 'N/D',
                'grado' => $c->user->grado ?? '',
                'tipo' => $c->tipoCredito?->nombre ?? 'General',
                'monto_aprobado' => (float) $c->monto_aprobado,
                'saldo_capital' => (float) $c->saldo_capital,
                'tasa' => (float) $c->tasa_interes,
                'plazo' => (int) $c->plazo_meses,
                'estado' => $c->estado,
                'fecha_desembolso' => $c->fecha_desembolso?->format('d/m/Y'),
            ])->values(),
            'tipos_credito' => TipoCredito::select('id', 'nombre')->get(),
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
                    $pdf = Pdf::loadView('reportes.cartera', $data)->setPaper('letter', 'landscape');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'reporte_cartera_' . now()->format('Ymd') . '.pdf'
                    );
                }),
            Action::make('exportExcel')
                ->label('Excel')
                ->icon('heroicon-o-table-cells')
                ->color('success')
                ->action(function () {
                    $data = $this->getData();
                    return Excel::download(new CarteraCreditosExport($data), 'cartera_creditos_' . now()->format('Ymd') . '.xlsx');
                }),
            Action::make('exportCsv')
                ->label('CSV')
                ->icon('heroicon-o-document-text')
                ->color('gray')
                ->action(function () {
                    $data = $this->getData();
                    $datos = $data['creditos']->toArray();
                    return $this->exportCsv($datos, 'cartera_creditos');
                }),
        ];
    }

    private function exportCsv(array $datos, string $nombre)
    {
        if (empty($datos)) {
            return Response::streamDownload(function () {
                echo "Sin datos para exportar\n";
            }, $nombre . '.csv');
        }

        $headers = array_keys($datos[0]);

        return Response::streamDownload(function () use ($datos, $headers) {
            $out = fopen('php://output', 'w');
            fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($out, $headers, ';');
            foreach ($datos as $row) {
                fputcsv($out, array_values($row), ';');
            }
            fclose($out);
        }, $nombre . '_' . now()->format('Ymd') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
