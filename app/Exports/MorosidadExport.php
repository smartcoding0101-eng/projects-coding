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
    /**
    * Reporte enfocado solo en créditos con cuotas en Mora.
    * Muestra el monto total vencido.
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Traer créditos que tengan al menos una cuota en estado Mora
        return Credito::with(['user', 'tipoCredito', 'planPagos' => function($q) {
                $q->where('estado', 'Mora');
            }])
            ->whereHas('planPagos', function($q) {
                $q->where('estado', 'Mora');
            })
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID Crédito',
            'Socio',
            'CI',
            'WhatsApp',
            'Mont. Aprobado',
            'Días Atraso (Peor Caso)',
            'Cuotas Vencidas (Cant)',
            'Total Mora (Capital + Interés)',
            'Total Penalidad (Mora Adicional)',
            'Deuda Inmediata Exigible'
        ];
    }

    public function map($credito): array
    {
        $cuotasEnMora = $credito->planPagos; // Filtradas en eager loading
        
        $cantidadVencidas = $cuotasEnMora->count();
        $totalOriginalMora = $cuotasEnMora->sum('cuota_total');
        $totalPenalidad = $cuotasEnMora->sum('monto_mora');
        $deudaExigible = $totalOriginalMora + $totalPenalidad;

        // Calcular días de atraso de la cuota más antigua
        $peorCuota = $cuotasEnMora->sortBy('fecha_vencimiento')->first();
        $diasAtraso = $peorCuota ? \Carbon\Carbon::parse($peorCuota->fecha_vencimiento)->diffInDays(now()) : 0;

        return [
            $credito->id,
            $credito->user ? $credito->user->name : 'N/A',
            $credito->user ? $credito->user->ci : 'N/A',
            $credito->user ? $credito->user->whatsapp : 'N/A',
            $credito->monto_aprobado,
            $diasAtraso . ' días',
            $cantidadVencidas,
            $totalOriginalMora,
            $totalPenalidad,
            $deudaExigible,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Row 1 is header
            1    => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFB91C1C']], // Red for mora
            ],
            // Resaltar celdas de deuda
            'H' => ['font' => ['bold' => true]],
            'I' => ['font' => ['bold' => true, 'color' => ['argb' => 'FFB91C1C']]],
            'J' => ['font' => ['bold' => true]],
        ];
    }
}
