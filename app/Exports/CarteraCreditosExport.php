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
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Credito::with(['user', 'tipoCredito'])->get();
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
            'Plazo (Meses)',
            'Tasa de Interés (%)',
            'Fecha Desembolso',
            'Estado',
            'Fecha Registro'
        ];
    }

    public function map($credito): array
    {
        return [
            $credito->id,
            $credito->user ? $credito->user->name : 'N/A',
            $credito->user ? $credito->user->ci : 'N/A',
            $credito->user ? $credito->user->grado : 'N/A',
            $credito->tipoCredito ? $credito->tipoCredito->nombre : 'N/A',
            $credito->monto_aprobado,
            $credito->plazo_meses,
            $credito->tasa_interes,
            $credito->fecha_desembolso ? \Carbon\Carbon::parse($credito->fecha_desembolso)->format('d/m/Y') : 'Pendiente',
            strtoupper($credito->estado),
            $credito->created_at->format('d/m/Y H:i'),
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
        ];
    }
}
