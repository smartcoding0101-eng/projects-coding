<?php

namespace App\Exports;

use App\Models\LibroDiario;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CajaGeneralExport implements FromArray, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{
    protected string $desde;
    protected string $hasta;
    protected ?string $cajeroId;

    public function __construct(string $desde, string $hasta, ?string $cajeroId = null)
    {
        $this->desde = $desde;
        $this->hasta = $hasta;
        $this->cajeroId = $cajeroId;
    }

    public function title(): string
    {
        return 'Libro de Caja';
    }

    public function headings(): array
    {
        return [
            'ID',
            'Fecha',
            'Concepto',
            'Socio / Origen',
            'Cajero',
            'Tipo Transacción',
            'Ingreso (Bs)',
            'Egreso (Bs)',
            'Saldo Acumulado (Bs)',
        ];
    }

    public function array(): array
    {
        // Calcular saldo inicial (antes de la fecha 'desde')
        $saldoInicialQuery = DB::table('libro_diarios')
            ->where('fecha', '<', $this->desde);

        if ($this->cajeroId) {
            $saldoInicialQuery->where('cajero_id', $this->cajeroId);
        }

        $saldoInicial = $saldoInicialQuery->sum(DB::raw('ingreso - egreso'));

        // Movimientos del periodo
        $query = LibroDiario::with(['user:id,name', 'cajero:id,name'])
            ->whereBetween('fecha', [$this->desde, $this->hasta])
            ->orderBy('fecha', 'asc')
            ->orderBy('id', 'asc');

        if ($this->cajeroId) {
            $query->where('cajero_id', $this->cajeroId);
        }

        $movimientos = $query->get();

        $acumulado = $saldoInicial;
        $rows = [];

        // Fila de saldo inicial
        $rows[] = [
            '—',
            Carbon::parse($this->desde)->format('d/m/Y'),
            'SALDO INICIAL ACUMULADO',
            'INSTITUCIONAL',
            '—',
            '—',
            '',
            '',
            number_format($saldoInicial, 2),
        ];

        foreach ($movimientos as $m) {
            $acumulado += ((float)$m->ingreso - (float)$m->egreso);

            $rows[] = [
                $m->id,
                $m->fecha ? $m->fecha->format('d/m/Y') : '',
                $m->concepto,
                $m->user->name ?? 'INSTITUCIONAL',
                $m->cajero->name ?? 'SISTEMA',
                strtoupper($m->tipo_transaccion ?? ''),
                (float)$m->ingreso > 0 ? number_format((float)$m->ingreso, 2) : '',
                (float)$m->egreso > 0 ? number_format((float)$m->egreso, 2) : '',
                number_format(round($acumulado, 2), 2),
            ];
        }

        // Fila de totales
        $totalIngresos = $movimientos->sum('ingreso');
        $totalEgresos = $movimientos->sum('egreso');

        $rows[] = [
            '',
            '',
            'TOTALES DEL PERÍODO',
            '',
            '',
            '',
            number_format((float)$totalIngresos, 2),
            number_format((float)$totalEgresos, 2),
            number_format(round($acumulado, 2), 2),
        ];

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();

        return [
            // Header row
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 10],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF1A4731']],
            ],
            // Saldo inicial row
            2 => [
                'font' => ['bold' => true, 'italic' => true],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFF0FDF4']],
            ],
            // Totals row
            $lastRow => [
                'font' => ['bold' => true, 'size' => 11],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFE5E7EB']],
                'borders' => [
                    'top' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_DOUBLE],
                ],
            ],
        ];
    }
}
