<?php

namespace App\Exports;

use App\Models\Persona;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PersonaKardexExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $persona;

    public function __construct(Persona $persona)
    {
        $this->persona = $persona;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Obtener historial completo ordenado por fecha y por id
        return $this->persona->kardex()->orderBy('fecha', 'asc')->orderBy('id', 'asc')->get();
    }

    public function headings(): array
    {
        return [
            ['ESTADO DE CUENTA INDIVIDUAL (KARDEX MAESTRO)'],
            ['Socio:', $this->persona->nombres . ' ' . $this->persona->apellidos],
            ['C.I.:', $this->persona->ci],
            ['Fecha de Reporte:', now()->format('d/m/Y H:i')],
            [],
            [
                'ID Trans.',
                'Fecha',
                'Operación',
                'Concepto / Detalle',
                'Ingreso (Bs)',
                'Egreso (Bs)',
                'Saldo Acumulado (Bs)'
            ]
        ];
    }

    public function map($mov): array
    {
        return [
            $mov->id,
            $mov->fecha->format('d/m/Y'),
            strtoupper(str_replace('_', ' ', $mov->tipo_movimiento)),
            $mov->concepto,
            $mov->ingreso > 0 ? (float)$mov->ingreso : 0,
            $mov->egreso > 0 ? (float)$mov->egreso : 0,
            (float)$mov->saldo_accumulado ?? (float)$mov->saldo_acumulado, // Fix typo check
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Estilo para el título
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        
        // Estilo para la cabecera de la tabla (Fila 6)
        return [
            6 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF1A237E'] // Azul FAPCLAS
                ],
            ],
            // Los datos de cabecera en negrita
            'A2:A4' => ['font' => ['bold' => true]],
        ];
    }
}
