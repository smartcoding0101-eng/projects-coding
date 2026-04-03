<?php

namespace App\Exports;

use App\Models\Credito;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MorosidadExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
    * Reporte enfocado solo en créditos con cuotas en Mora.
    * Muestra el monto total vencido.
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->data['cuotas']);
    }

    public function headings(): array
    {
        return [
            'ID Crédito',
            'Socio',
            'CI',
            'Tipo de Crédito',
            'Nro Cuota',
            'Fecha Vencimiento',
            'Días Atraso',
            'Capital Moroso (Bs)',
            'Interés/Mora (Bs)',
            'Total Exigible (Bs)'
        ];
    }

    public function map($c): array
    {
        return [
            $c['credito_id'],
            $c['socio'],
            $c['ci'],
            $c['tipo_credito'],
            $c['nro_cuota'],
            $c['fecha_vencimiento'],
            $c['dias_mora'] . ' días',
            $c['capital'],
            $c['mora'],
            $c['total'],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Header styling
            1    => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFB91C1C']], // Red for mora
            ],
            // Bold totals
            'H' => ['font' => ['bold' => true]],
            'I' => ['font' => ['bold' => true, 'color' => ['argb' => 'FFB91C1C']]],
            'J' => ['font' => ['bold' => true]],
        ];
    }
}
