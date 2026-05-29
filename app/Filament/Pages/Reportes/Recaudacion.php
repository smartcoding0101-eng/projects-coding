<?php

namespace App\Filament\Pages\Reportes;

use App\Exports\RecaudacionExport;
use App\Models\Credito;
use App\Models\PlanPago;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Maatwebsite\Excel\Facades\Excel;

class Recaudacion extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.recaudacion';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $title = 'Recaudación y Colocación';

    protected static ?string $navigationLabel = 'Recaudación';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 6;

    public ?array $filtros = [];

    protected function getHeaderWidgets(): array
    {
        return [
            Widgets\RecaudacionStatsWidget::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            Widgets\RecaudacionChartWidget::class,
        ];
    }

    public function mount(): void
    {
        $this->filterForm->fill([
            'desde' => now()->startOfMonth()->toDateString(),
            'hasta' => now()->toDateString(),
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                DatePicker::make('desde')
                    ->label('Desde')
                    ->required(),
                DatePicker::make('hasta')
                    ->label('Hasta')
                    ->required(),
            ])
            ->columns(2)
            ->statePath('filtros');
    }

    public function filter(): void
    {
    }

    public function getData(): array
    {
        $desde = $this->filtros['desde'] ?? now()->startOfMonth()->toDateString();
        $hasta = $this->filtros['hasta'] ?? now()->toDateString();

        $pagos = PlanPago::with('credito.user.persona')
            ->where('estado', PlanPago::ESTADO_PAGADA)
            ->whereBetween('fecha_pago_real', [$desde, Carbon::parse($hasta)->endOfDay()])
            ->get();

        $totalRecaudado = (float) $pagos->sum('cuota_total');
        $capitalRecaudado = (float) $pagos->sum('capital_amortizado');
        $interesRecaudado = (float) $pagos->sum('interes_pagado');
        $moraRecaudada = (float) $pagos->sum('monto_mora');

        $colocaciones = Credito::with('user.persona', 'tipoCredito')
            ->where('estado', Credito::ESTADO_DESEMBOLSADO)
            ->whereBetween('fecha_desembolso', [$desde, $hasta])
            ->get();

        $totalColocado = (float) $colocaciones->sum('monto_aprobado');

        $grafico = [];
        for ($i = 5; $i >= 0; $i--) {
            $mes = now()->subMonths($i);
            $inicioMes = $mes->copy()->startOfMonth();
            $finMes = $mes->copy()->endOfMonth();
            $recaudadoMes = PlanPago::where('estado', PlanPago::ESTADO_PAGADA)
                ->whereBetween('fecha_pago_real', [$inicioMes, $finMes])
                ->sum('cuota_total');
            $colocadoMes = Credito::where('estado', Credito::ESTADO_DESEMBOLSADO)
                ->whereBetween('fecha_desembolso', [$inicioMes, $finMes])
                ->sum('monto_aprobado');
            $grafico[] = [
                'name' => ucfirst($mes->translatedFormat('M')),
                'recaudado' => (float) $recaudadoMes,
                'colocado' => (float) $colocadoMes,
            ];
        }

        return [
            'filtros' => compact('desde', 'hasta'),
            'resumen' => [
                'total_recaudado' => $totalRecaudado,
                'capital' => $capitalRecaudado,
                'interes' => $interesRecaudado,
                'mora' => $moraRecaudada,
                'total_colocado' => $totalColocado,
                'recuperacion_ratio' => $totalColocado > 0 ? round(($totalRecaudado / $totalColocado) * 100, 1) : 100,
            ],
            'detalle_pagos' => $pagos->map(fn($p) => [
                'id' => $p->id,
                'fecha' => $p->fecha_pago_real?->format('d/m/Y'),
                'socio' => $p->credito->user->name,
                'credito_id' => $p->credito_id,
                'cuota' => $p->nro_cuota,
                'total' => (float) $p->cuota_total,
                'capital' => (float) $p->capital_amortizado,
                'interes' => (float) $p->interes_pagado,
                'metodo' => $p->metodo_pago ?? 'Caja',
            ]),
            'detalle_colocaciones' => $colocaciones->map(fn($c) => [
                'id' => $c->id,
                'fecha' => $c->fecha_desembolso?->format('d/m/Y'),
                'socio' => $c->user->name,
                'tipo' => $c->tipoCredito->nombre ?? 'General',
                'monto' => (float) $c->monto_aprobado,
                'tasa' => (float) $c->tasa_interes . '%',
            ]),
            'grafico' => $grafico,
            'fecha_reporte' => now()->format('d/m/Y H:i'),
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
                    $pdf = Pdf::loadView('reportes.recaudacion-pdf', $data)->setPaper('letter', 'landscape');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'recaudacion_' . now()->format('Ymd') . '.pdf'
                    );
                }),
            Action::make('exportExcel')
                ->label('Excel')
                ->icon('heroicon-o-table-cells')
                ->color('success')
                ->action(function () {
                    $data = $this->getData();
                    return Excel::download(new RecaudacionExport($data), 'recaudacion_' . now()->format('Ymd') . '.xlsx');
                }),
        ];
    }
}
