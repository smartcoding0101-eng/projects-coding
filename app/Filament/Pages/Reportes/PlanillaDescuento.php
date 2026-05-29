<?php

namespace App\Filament\Pages\Reportes;

use App\Services\BoletaService;
use Barryvdh\DomPDF\Facade\Pdf;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Response;

class PlanillaDescuento extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.reportes.planilla-descuento';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $title = 'Planilla de Descuento';

    protected static ?string $navigationLabel = 'Planilla Descuento';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 4;

    public ?array $filtros = [];

    public function mount(): void
    {
        $this->filterForm->fill([
            'mes' => now()->format('Y-m'),
        ]);
    }

    public function filterForm(Schema $form): Schema
    {
        return $form
            ->schema([
                TextInput::make('mes')
                    ->label('Mes (YYYY-MM)')
                    ->placeholder('2026-04')
                    ->required(),
            ])
            ->columns(1)
            ->statePath('filtros');
    }

    public function filter(): void
    {
    }

    public function getData(): array
    {
        $mesAnio = $this->filtros['mes'] ?? now()->format('Y-m');
        $boleta = app(BoletaService::class);
        return $boleta->generarPlanillaDescuento($mesAnio);
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
                    $mesAnio = $this->filtros['mes'] ?? now()->format('Y-m');
                    $pdf = Pdf::loadView('reportes.planilla', $data)->setPaper('letter', 'landscape');
                    return response()->streamDownload(
                        fn() => print ($pdf->output()),
                        'planilla_descuento_' . str_replace('-', '', $mesAnio) . '.pdf'
                    );
                }),
            Action::make('exportCsv')
                ->label('CSV')
                ->icon('heroicon-o-document-text')
                ->color('gray')
                ->action(function () {
                    $data = $this->getData();
                    $items = $data['items'] ?? [];
                    if (empty($items)) {
                        return Response::streamDownload(fn() => print ("Sin datos\n"), 'planilla.csv');
                    }
                    $headers = array_keys($items[0]);
                    return Response::streamDownload(function () use ($items, $headers) {
                        $out = fopen('php://output', 'w');
                        fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
                        fputcsv($out, $headers, ';');
                        foreach ($items as $row) {
                            fputcsv($out, array_values($row), ';');
                        }
                        fclose($out);
                    }, 'planilla_descuento_' . now()->format('Ymd') . '.csv', [
                        'Content-Type' => 'text/csv; charset=UTF-8',
                    ]);
                }),
        ];
    }
}
