<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RecaudacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        // Combinamos pagos y colocaciones para un reporte maestro si se desea, 
        // o exportamos la recaudación como principal.
        return collect($this->data['detalle_pagos']);
    }

    public function title(): string
    {
        return 'Recaudación de Cartera';
    }

    public function headings(): array
    {
        return [
            'ID Pago',
            'Fecha Pago',
            'Socio',
            'Crédito #',
            'Cuota',
            'Capital',
            'Interés',
            'Mora/Otros',
            'Total Recaudado',
            'Método de Pago'
        ];
    }

    public function map($pago): array
    {
        return [
            $pago['id'],
            $pago['fecha'],
            $pago['socio'],
            $pago['credito_id'],
            $pago['cuota'],
            $pago['capital'],
            $pago['interes'],
            ($pago['total'] - $pago['capital'] - $pago['interes']), // Mora
            $pago['total'],
            $pago['metodo']
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true], 'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'E2E8F0']]],
        ];
    }
}
