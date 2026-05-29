<?php

namespace App\Filament\Pages\Reportes;

use App\Exports\CajaGeneralExport;
use App\Models\LibroDiario;
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
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class LibroCaja extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.libro-caja';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-wallet';

    protected static ?string $title = 'Libro de Caja';

    protected static ?string $navigationLabel = 'Libro de Caja';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 8;

    public ?array $filtros = [];

    protected function getHeaderWidgets(): array
    {
        return [
            Widgets\LibroCajaStatsWidget::class,
        ];
    }

    public function mount(): void
    {
        $this->filterForm->fill([
            'desde' => now()->startOfMonth()->toDateString(),
            'hasta' => now()->toDateString(),
            'cajero_id' => null,
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                DatePicker::make('desde')->label('Desde')->required(),
                DatePicker::make('hasta')->label('Hasta')->required(),
                Select::make('cajero_id')
                    ->label('Cajero')
                    ->options(
                        User::whereHas('roles', fn($q) => $q->whereIn('name', ['admin', 'super-admin', 'cajero', 'SuperAdmin']))
                            ->pluck('name', 'id')
                    )
                    ->placeholder('Todos')
                    ->searchable(),
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
        $cajeroId = $this->filtros['cajero_id'] ?? null;

        $saldoInicialQuery = DB::table('libro_diarios')->where('fecha', '<', $desde);
        if ($cajeroId) {
            $saldoInicialQuery->where('cajero_id', $cajeroId);
        }
        $saldoInicial = $saldoInicialQuery->sum(DB::raw('ingreso - egreso'));

        $query = LibroDiario::with(['user:id,name,persona_id', 'user.persona:id,ci,grado', 'cajero:id,name'])
            ->whereBetween('fecha', [$desde, $hasta])
            ->orderBy('fecha', 'asc')
            ->orderBy('id', 'asc');

        if ($cajeroId) {
            $query->where('cajero_id', $cajeroId);
        }

        $movimientos = $query->get();

        $acumulado = $saldoInicial;
        $dataReporte = [];
        $totalIngresos = 0;
        $totalEgresos = 0;

        foreach ($movimientos as $m) {
            $acumulado += ($m->ingreso - $m->egreso);
            $totalIngresos += $m->ingreso;
            $totalEgresos += $m->egreso;

            $dataReporte[] = [
                'id' => $m->id,
                'fecha' => $m->fecha?->format('d/m/Y'),
                'concepto' => $m->concepto,
                'socio' => $m->user->name ?? 'INSTITUCIONAL',
                'cajero' => $m->cajero->name ?? 'SISTEMA',
                'ingreso' => (float) $m->ingreso,
                'egreso' => (float) $m->egreso,
                'saldo' => round($acumulado, 2),
                'tipo' => $m->tipo_transaccion,
            ];
        }

        return [
            'filtros' => compact('desde', 'hasta', 'cajeroId'),
            'resumen' => [
                'saldo_inicial' => (float) $saldoInicial,
                'total_ingresos' => (float) $totalIngresos,
                'total_egresos' => (float) $totalEgresos,
                'saldo_final' => round($acumulado, 2),
            ],
            'movimientos' => $dataReporte,
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
                    $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
                    $hasta = $this->filtros['hasta'] ?? now()->toDateString();
                    $cajeroId = $this->filtros['cajero_id'] ?? null;

                    $pdfData = [
                        'fecha_generacion' => now()->format('d/m/Y H:i'),
                        'filtros' => [
                            'desde' => Carbon::parse($desde)->format('d/m/Y'),
                            'hasta' => Carbon::parse($hasta)->format('d/m/Y'),
                            'cajero' => $cajeroId ? User::find($cajeroId)?->name : null,
                        ],
                        'resumen' => $data['resumen'],
                        'movimientos' => $data['movimientos'],
                    ];

                    $pdf = Pdf::loadView('reportes.caja', $pdfData)->setPaper('letter', 'landscape');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'libro_caja_' . str_replace('-', '', $desde) . '.pdf'
                    );
                }),
            Action::make('exportExcel')
                ->label('Excel')
                ->icon('heroicon-o-table-cells')
                ->color('success')
                ->action(function () {
                    $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
                    $hasta = $this->filtros['hasta'] ?? now()->toDateString();
                    $cajeroId = $this->filtros['cajero_id'] ?? null;
                    return Excel::download(
                        new CajaGeneralExport($desde, $hasta, $cajeroId),
                        'libro_caja_' . str_replace('-', '', $desde) . '.xlsx'
                    );
                }),
        ];
    }
}
