<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EstadoCuentaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return collect($this->data['movimientos']);
    }

    public function title(): string
    {
        return 'Estado de Cuenta - ' . $this->data['socio']['nombre'];
    }

    public function headings(): array
    {
        return [
            'FECHA',
            'TIPO DE MOVIMIENTO',
            'CONCEPTO / DETALLE',
            'INGRESO (BS)',
            'EGRESO (BS)',
            'SALDO ACUMULADO (BS)'
        ];
    }

    public function map($m): array
    {
        return [
            $m['fecha'],
            strtoupper($m['tipo']),
            $m['concepto'],
            $m['ingreso'] ?: 0,
            $m['egreso'] ?: 0,
            $m['saldo']
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:F1')->getFont()->setBold(true);
        $sheet->getStyle('A1:F1')->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()->setRGB('1A4731');
        $sheet->getStyle('A1:F1')->getFont()->getColor()->setRGB('FFFFFF');

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
