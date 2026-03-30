<?php

namespace App\Services;

use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\User;
use Carbon\Carbon;

class BoletaService
{
    /**
     * Genera datos para la boleta de pago individual de una cuota.
     *
     * @param PlanPago $cuota
     * @return array
     */
    public function generarBoletaPago(PlanPago $cuota): array
    {
        $credito = $cuota->credito;
        $socio = $credito->user;
        $tipoCredito = $credito->tipoCredito;

        return [
            'titulo' => 'BOLETA DE PAGO DE CUOTA',
            'cooperativa' => 'FAPCLAS R.L.',
            'subtitulo' => 'Fondo de Ahorro y Préstamo de Clases Policiales',
            'fecha_emision' => now()->format('d/m/Y H:i'),
            'nro_boleta' => 'BOL-' . str_pad($cuota->id, 8, '0', STR_PAD_LEFT),

            'socio' => [
                'nombre' => $socio->name,
                'ci' => $socio->ci ?? 'N/D',
                'escalafon' => $socio->escalafon ?? 'N/D',
                'grado' => $socio->grado ?? 'N/D',
                'destino' => $socio->destino ?? 'N/D',
            ],

            'credito' => [
                'id' => $credito->id,
                'tipo' => $tipoCredito ? $tipoCredito->nombre : 'General',
                'monto_original' => $credito->monto_aprobado,
                'tasa_interes' => $credito->tasa_interes . '%',
                'plazo' => $credito->plazo_meses . ' meses',
                'fecha_desembolso' => $credito->fecha_desembolso?->format('d/m/Y'),
                'saldo_capital' => $credito->saldo_capital,
            ],

            'cuota' => [
                'nro' => $cuota->nro_cuota . ' de ' . $credito->plazo_meses,
                'fecha_vencimiento' => $cuota->fecha_vencimiento?->format('d/m/Y'),
                'fecha_pago' => $cuota->fecha_pago_real?->format('d/m/Y') ?? now()->format('d/m/Y'),
                'capital' => $cuota->capital_amortizado,
                'interes' => $cuota->interes_pagado,
                'mora' => $cuota->monto_mora,
                'total' => $cuota->cuota_total + $cuota->monto_mora,
                'metodo_pago' => $cuota->metodo_pago ?? 'Planilla',
                'estado' => $cuota->estado,
            ],
        ];
    }

    /**
     * Genera datos para la planilla de descuento mensual.
     * Contiene todos los socios con cuotas del mes a descontar por nómina policial.
     *
     * @param string|null $mesAnio Formato 'Y-m', default mes actual
     * @return array
     */
    public function generarPlanillaDescuento(?string $mesAnio = null): array
    {
        $fecha = $mesAnio ? Carbon::parse($mesAnio . '-01') : Carbon::now();
        $mesInicio = $fecha->copy()->startOfMonth()->toDateString();
        $mesFin = $fecha->copy()->endOfMonth()->toDateString();

        // Cuotas del mes que se pagan por planilla
        $cuotas = PlanPago::whereHas('credito', function ($q) {
                $q->where('metodo_descuento', 'Planilla')
                  ->whereIn('estado', [Credito::ESTADO_DESEMBOLSADO, Credito::ESTADO_EN_MORA]);
            })
            ->where('fecha_vencimiento', '>=', $mesInicio)
            ->where('fecha_vencimiento', '<=', $mesFin)
            ->whereIn('estado', [PlanPago::ESTADO_PENDIENTE, PlanPago::ESTADO_RETRASADA])
            ->with('credito.user', 'credito.tipoCredito')
            ->orderBy('credito_id')
            ->get();

        $items = [];
        $totalGeneral = 0;

        foreach ($cuotas as $cuota) {
            $socio = $cuota->credito->user;
            $totalCuota = $cuota->cuota_total + $cuota->monto_mora;

            $items[] = [
                'socio_nombre' => $socio->name,
                'socio_ci' => $socio->ci ?? 'N/D',
                'socio_grado' => $socio->grado ?? 'N/D',
                'socio_destino' => $socio->destino ?? 'N/D',
                'socio_escalafon' => $socio->escalafon ?? 'N/D',
                'credito_id' => $cuota->credito_id,
                'tipo_credito' => $cuota->credito->tipoCredito?->nombre ?? 'General',
                'nro_cuota' => $cuota->nro_cuota,
                'capital' => $cuota->capital_amortizado,
                'interes' => $cuota->interes_pagado,
                'mora' => $cuota->monto_mora,
                'total_descontar' => $totalCuota,
            ];

            $totalGeneral += $totalCuota;
        }

        return [
            'titulo' => 'PLANILLA DE DESCUENTO POR NÓMINA POLICIAL',
            'cooperativa' => 'FAPCLAS R.L.',
            'periodo' => $fecha->locale('es')->isoFormat('MMMM YYYY'),
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'total_socios' => count(array_unique(array_column($items, 'socio_ci'))),
            'total_cuotas' => count($items),
            'total_general' => $totalGeneral,
            'items' => $items,
        ];
    }
}
