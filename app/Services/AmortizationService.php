<?php

namespace App\Services;

class AmortizationService
{
    /**
     * Calcula la tabla de amortización usando el Sistema Francés (Cuotas Fijas).
     *
     * @param float $capital Monto principal del préstamo (Ej: 10000)
     * @param float $tasaAnual Tasa de interés anual en porcentaje (Ej: 12.0)
     * @param int $plazoMeses Cantidad de meses (Ej: 12)
     * @param string $fechaDesembolso Fecha de inicio YYYY-MM-DD
     * @return array
     */
    public function calcularTablaFrances(float $capital, float $tasaAnual, int $plazoMeses, string $fechaDesembolso): array
    {
        $tabla = [];
        $tasaMensual = ($tasaAnual / 100) / 12; // De anual a decimal mensual
        
        // Cuota mensual fija = P * [ i(1 + i)^n ] / [ (1 + i)^n - 1 ]
        // Si no hay interes (0%), cuota = capital / meses
        if ($tasaMensual > 0) {
            $cuotaFija = $capital * ($tasaMensual * pow(1 + $tasaMensual, $plazoMeses)) / (pow(1 + $tasaMensual, $plazoMeses) - 1);
        } else {
            $cuotaFija = $capital / $plazoMeses;
        }

        $saldoRestante = $capital;
        $fechaActual = \Carbon\Carbon::parse($fechaDesembolso);

        for ($mes = 1; $mes <= $plazoMeses; $mes++) {
            $interesMensual = $saldoRestante * $tasaMensual;
            $capitalAmortizado = $cuotaFija - $interesMensual;
            
            // Ajuste por redondeo en el último mes
            if ($mes === $plazoMeses) {
                $capitalAmortizado = $saldoRestante;
                $cuotaFija = $capitalAmortizado + $interesMensual;
                $saldoRestante = 0;
            } else {
                $saldoRestante -= $capitalAmortizado;
            }

            // Sumar 1 mes para la fecha de vencimiento
            $fechaActual->addMonthNoOverflow(); 
            // Para sueldos (descuento planilla) o 30 dias fijo, 'addMonthNoOverflow' maneja bordes (Ej 31 de Ene a 28/29 de Feb)

            $tabla[] = [
                'nro_cuota' => $mes,
                'fecha_vencimiento' => $fechaActual->toDateString(),
                'cuota_total' => round($cuotaFija, 2),
                'interes_pagado' => round($interesMensual, 2),
                'capital_amortizado' => round($capitalAmortizado, 2),
                'saldo_restante' => round($saldoRestante, 2),
            ];
        }

        return $tabla;
    }
}
