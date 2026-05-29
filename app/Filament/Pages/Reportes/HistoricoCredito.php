<?php

namespace App\Filament\Pages\Reportes;

use App\Models\Credito;
use App\Models\PlanPago;
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

class HistoricoCredito extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.historico-credito';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-clock';

    protected static ?string $title = 'Histórico de Crédito (Buró)';

    protected static ?string $navigationLabel = 'Histórico Crédito';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 5;

    protected function getHeaderWidgets(): array
    {
        return [
            Widgets\HistoricoCreditoStatsWidget::class,
        ];
    }


    public ?array $filtros = [];

    public function mount(): void
    {
        $this->filterForm->fill([
            'socio_id' => null,
            'fecha_inicio' => null,
            'fecha_fin' => null,
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
                DatePicker::make('fecha_inicio')
                    ->label('Desde'),
                DatePicker::make('fecha_fin')
                    ->label('Hasta'),
            ])
            ->columns(3)
            ->statePath('filtros');
    }

    public function filter(): void
    {
    }

    public function getData(): array
    {
        $socioId = $this->filtros['socio_id'] ?? null;
        $fechaInicio = $this->filtros['fecha_inicio'] ?? null;
        $fechaFin = $this->filtros['fecha_fin'] ?? null;

        if (!$socioId) {
            return [
                'socio' => null,
                'metricas' => null,
                'historial_creditos' => collect(),
                'historial_pagos' => collect(),
            ];
        }

        $socio = User::findOrFail($socioId);
        $creditosQuery = Credito::where('user_id', $socio->id)->with('tipoCredito');

        if ($fechaInicio && $fechaFin) {
            $creditosQuery->whereBetween('created_at', [$fechaInicio, Carbon::parse($fechaFin)->endOfDay()]);
        }
        $creditos = $creditosQuery->get();

        $pagosQuery = PlanPago::whereHas('credito', function ($q) use ($socioId) {
            $q->where('user_id', $socioId);
        })->whereIn('estado', [PlanPago::ESTADO_PAGADA, PlanPago::ESTADO_RETRASADA]);

        if ($fechaInicio && $fechaFin) {
            $pagosQuery->whereBetween('fecha_pago_real', [$fechaInicio, Carbon::parse($fechaFin)->endOfDay()]);
        }
        $pagosHistoricos = $pagosQuery->orderBy('fecha_vencimiento', 'desc')->get();

        return [
            'socio' => [
                'nombre' => $socio->name,
                'ci' => $socio->ci ?? 'N/D',
                'grado' => $socio->grado ?? 'N/D',
            ],
            'resumen' => [
                'total_creditos' => $creditos->count(),
                'vigentes' => $creditos->where('estado', Credito::ESTADO_DESEMBOLSADO)->count(),
                'total_solicitado' => $creditos->sum('monto_aprobado'),
                'calificacion' => $this->calculateRating($creditos, $pagosHistoricos),
            ],
            'historial' => $creditos->map(fn($c) => [
                'tipo' => $c->tipoCredito?->nombre ?? 'General',
                'monto' => $c->monto_aprobado,
                'saldo' => $c->saldo_capital,
                'estado' => $c->estado,
                'cuotas_pagadas' => $c->planPagos->where('estado', 'Pagada')->count(),
                'cuotas_total' => $c->plazo_meses,
                'mora_max_dias' => $c->planPagos->max('dias_retraso') ?? 0,
                'fecha_inicio' => $c->fecha_desembolso ? Carbon::parse($c->fecha_desembolso)->format('d/m/Y') : 'N/D',
            ])->values(),
            'historial_pagos' => $pagosHistoricos->map(fn($p) => [
                'id' => $p->id,
                'credito' => 'Crédito #' . $p->credito_id,
                'cuota' => $p->nro_cuota,
                'vencimiento' => Carbon::parse($p->fecha_vencimiento)->format('d/m/Y'),
                'fecha_pago' => $p->fecha_pago_real ? Carbon::parse($p->fecha_pago_real)->format('d/m/Y') : null,
                'total' => $p->cuota_total,
                'mora' => $p->monto_mora,
                'estado' => $p->estado,
            ]),
        ];
    }

    protected function calculateRating($creditos, $pagos): string
    {
        $mora = $pagos->where('estado', PlanPago::ESTADO_RETRASADA)->count();
        if ($mora == 0)
            return 'A';
        if ($mora < 3)
            return 'B';
        return 'C';
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
                    $data['socios_catalogo'] = [];
                    $data['socio_seleccionado'] = $data['socio'];
                    $data['filtros'] = $this->filtros;
                    $pdf = Pdf::loadView('reportes.historico-pdf', $data)->setPaper('letter');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'historico_credito_' . ($data['socio']->ci ?? $data['socio']->id) . '.pdf'
                    );
                }),
        ];
    }
}
