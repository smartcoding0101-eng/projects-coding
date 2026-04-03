<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EcommerceExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function collection()
    {
        return collect($this->data['recientes']);
    }

    public function title(): string
    {
        return 'Reporte de E-commerce';
    }

    public function headings(): array
    {
        return [
            'ID',
            'Número de Orden',
            'Cliente',
            'Método de Pago',
            'Estado',
            'Total (Bs)',
            'Fecha y Hora'
        ];
    }

    public function map($pedido): array
    {
        return [
            $pedido['id'],
            $pedido['orden'],
            $pedido['cliente'],
            strtoupper($pedido['metodo']),
            strtoupper($pedido['estado']),
            $pedido['total'],
            $pedido['fecha']
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true], 'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'FFF7ED']]], // Orange light
        ];
    }
}
