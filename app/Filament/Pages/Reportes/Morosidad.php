<?php

namespace App\Filament\Pages\Reportes;

use App\Exports\MorosidadExport;
use App\Models\PlanPago;
use App\Models\TipoCredito;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;

class Morosidad extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.morosidad';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-exclamation-triangle';

    protected static ?string $title = 'Morosidad';

    protected static ?string $navigationLabel = 'Morosidad';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 2;

    public ?array $filtros = [];

    protected function getHeaderWidgets(): array
    {
        return [
            Widgets\MorosidadStatsWidget::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            Widgets\MorosidadChartWidget::class,
        ];
    }

    public function mount(): void
    {
        $this->filterForm->fill([
            'min_dias' => null,
            'max_dias' => null,
            'tipo_id' => null,
            'search' => null,
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                TextInput::make('min_dias')
                    ->label('Días Mora Mín.')
                    ->numeric()
                    ->placeholder('0'),
                TextInput::make('max_dias')
                    ->label('Días Mora Máx.')
                    ->numeric()
                    ->placeholder('Sin límite'),
                Select::make('tipo_id')
                    ->label('Tipo de Crédito')
                    ->options(TipoCredito::pluck('nombre', 'id'))
                    ->placeholder('Todos'),
                TextInput::make('search')
                    ->label('Buscar Socio / CI')
                    ->placeholder('Nombre o CI...'),
            ])
            ->columns(4)
            ->statePath('filtros');
    }

    public function filter(): void
    {
    }

    public function getData(): array
    {
        $minDias = $this->filtros['min_dias'] ?? null;
        $maxDias = $this->filtros['max_dias'] ?? null;
        $tipoId = $this->filtros['tipo_id'] ?? null;
        $search = $this->filtros['search'] ?? null;

        $query = PlanPago::where('plan_pagos.estado', PlanPago::ESTADO_RETRASADA)
            ->join('creditos', 'plan_pagos.credito_id', '=', 'creditos.id')
            ->join('users', 'creditos.user_id', '=', 'users.id')
            ->join('personas', 'users.persona_id', '=', 'personas.id')
            ->with(['credito.user.persona', 'credito.tipoCredito'])
            ->select('plan_pagos.*', 'creditos.tipo_credito_id', 'users.name', 'personas.ci');

        if ($tipoId) {
            $query->where('creditos.tipo_credito_id', $tipoId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                    ->orWhere('personas.ci', 'like', "%{$search}%");
            });
        }

        $cuotasFiltradas = $query->orderBy('plan_pagos.fecha_vencimiento')->get();

        if ($minDias !== null || $maxDias !== null) {
            $cuotasFiltradas = $cuotasFiltradas->filter(function ($c) use ($minDias, $maxDias) {
                $dias = $c->fecha_vencimiento ? (int) Carbon::parse($c->fecha_vencimiento)->diffInDays(now(), false) : 0;
                if ($minDias !== null && $dias < $minDias)
                    return false;
                if ($maxDias !== null && $dias > $maxDias)
                    return false;
                return true;
            });
        }

        return [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'filtros' => compact('minDias', 'maxDias', 'tipoId', 'search'),
            'resumen' => [
                'total_cuotas_atrasadas' => (int) $cuotasFiltradas->count(),
                'total_capital_moroso' => (float) $cuotasFiltradas->sum('capital_amortizado'),
                'total_mora_acumulada' => (float) $cuotasFiltradas->sum('monto_mora'),
                'socios_afectados' => (int) $cuotasFiltradas->pluck('credito.user_id')->unique()->count(),
            ],
            'cuotas' => $cuotasFiltradas->map(fn($c) => [
                'credito_id' => $c->credito_id,
                'socio' => $c->credito->user?->name ?? 'N/D',
                'ci' => $c->credito->user?->ci ?? 'N/D',
                'grado' => $c->credito->user?->grado ?? '',
                'tipo_credito' => $c->credito->tipoCredito?->nombre ?? 'General',
                'nro_cuota' => (int) $c->nro_cuota,
                'fecha_vencimiento' => $c->fecha_vencimiento?->format('d/m/Y'),
                'dias_mora' => $c->fecha_vencimiento ? (int) Carbon::parse($c->fecha_vencimiento)->diffInDays(now()) : 0,
                'capital' => (float) $c->capital_amortizado,
                'interes' => (float) $c->interes_pagado,
                'mora' => (float) $c->monto_mora,
                'total' => (float) ($c->cuota_total + $c->monto_mora),
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
                    $pdf = Pdf::loadView('reportes.morosidad', $data)->setPaper('letter', 'landscape');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'reporte_morosidad_' . now()->format('Ymd') . '.pdf'
                    );
                }),
            Action::make('exportExcel')
                ->label('Excel')
                ->icon('heroicon-o-table-cells')
                ->color('success')
                ->action(function () {
                    $data = $this->getData();
                    return Excel::download(new MorosidadExport($data), 'morosidad_' . now()->format('Ymd') . '.xlsx');
                }),
        ];
    }
}
