<?php

namespace App\Exports;

use App\Models\Credito;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CarteraCreditosExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->data['creditos']);
    }

    public function headings(): array
    {
        return [
            'ID Crédito',
            'Socio',
            'CI',
            'Grado',
            'Tipo de Crédito',
            'Monto Aprobado (Bs)',
            'Saldo Capital (Bs)',
            'Tasa (%)',
            'Plazo (Meses)',
            'Fecha Desembolso',
            'Estado'
        ];
    }

    public function map($c): array
    {
        return [
            $c['id'],
            $c['socio'],
            $c['ci'],
            $c['grado'],
            $c['tipo'],
            $c['monto_aprobado'],
            $c['saldo_capital'],
            $c['tasa'],
            $c['plazo'],
            $c['fecha_desembolso'] ?? 'Pendiente',
            strtoupper($c['estado']),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para la cabecera
            1    => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF28361D']],
            ],
            'F' => ['font' => ['bold' => true]],
            'G' => ['font' => ['bold' => true, 'color' => ['argb' => 'FF064E3B']]],
        ];
    }
}
