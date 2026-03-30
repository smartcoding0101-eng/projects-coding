<?php

namespace Tests\Unit;

use App\Services\AmortizationService;
use PHPUnit\Framework\TestCase;

class AmortizationServiceTest extends TestCase
{
    private AmortizationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AmortizationService();
    }

    /** @test */
    public function genera_tabla_con_cantidad_correcta_de_cuotas(): void
    {
        $tabla = $this->service->calcularTablaFrances(10000, 12, 12, '2026-01-15');

        $this->assertCount(12, $tabla);
        $this->assertEquals(1, $tabla[0]['nro_cuota']);
        $this->assertEquals(12, $tabla[11]['nro_cuota']);
    }

    /** @test */
    public function saldo_restante_final_es_cero(): void
    {
        $tabla = $this->service->calcularTablaFrances(10000, 12, 12, '2026-01-15');

        $ultimaCuota = end($tabla);
        $this->assertEquals(0, $ultimaCuota['saldo_restante']);
    }

    /** @test */
    public function capital_amortizado_total_igual_al_prestamo(): void
    {
        $capital = 10000;
        $tabla = $this->service->calcularTablaFrances($capital, 12, 12, '2026-01-15');

        $totalCapital = array_sum(array_column($tabla, 'capital_amortizado'));
        $this->assertEqualsWithDelta($capital, $totalCapital, 0.02);
    }

    /** @test */
    public function cuotas_son_fijas_excepto_ultima(): void
    {
        $tabla = $this->service->calcularTablaFrances(10000, 12, 12, '2026-01-15');

        $cuotaReferencia = $tabla[0]['cuota_total'];
        for ($i = 0; $i < 11; $i++) {
            $this->assertEqualsWithDelta($cuotaReferencia, $tabla[$i]['cuota_total'], 0.01,
                "Cuota {$tabla[$i]['nro_cuota']} difiere de la cuota fija esperada");
        }
    }

    /** @test */
    public function interes_decrece_y_capital_crece_con_cada_cuota(): void
    {
        $tabla = $this->service->calcularTablaFrances(10000, 12, 6, '2026-01-15');

        $this->assertGreaterThan($tabla[5]['interes_pagado'], $tabla[0]['interes_pagado']);
        $this->assertLessThan($tabla[5]['capital_amortizado'], $tabla[0]['capital_amortizado']);
    }

    /** @test */
    public function funciona_con_tasa_cero(): void
    {
        $capital = 6000;
        $meses = 6;
        $tabla = $this->service->calcularTablaFrances($capital, 0, $meses, '2026-01-15');

        $this->assertCount($meses, $tabla);
        $this->assertEquals(1000, $tabla[0]['cuota_total']);
        $this->assertEquals(0, $tabla[0]['interes_pagado']);
        $this->assertEquals(0, $tabla[5]['saldo_restante']);
    }

    /** @test */
    public function fechas_incrementan_mensualmente(): void
    {
        $tabla = $this->service->calcularTablaFrances(10000, 12, 3, '2026-01-15');

        $this->assertEquals('2026-02-15', $tabla[0]['fecha_vencimiento']);
        $this->assertEquals('2026-03-15', $tabla[1]['fecha_vencimiento']);
        $this->assertEquals('2026-04-15', $tabla[2]['fecha_vencimiento']);
    }

    /** @test */
    public function maneja_correctamente_borde_de_mes(): void
    {
        $tabla = $this->service->calcularTablaFrances(10000, 12, 3, '2026-01-31');

        // addMonthNoOverflow: 31 ene → 28 feb → 28 mar → 28 abr
        $this->assertEquals('2026-02-28', $tabla[0]['fecha_vencimiento']);
    }

    /** @test */
    public function valores_de_cuota_son_positivos(): void
    {
        $tabla = $this->service->calcularTablaFrances(50000, 18, 48, '2026-01-01');

        foreach ($tabla as $cuota) {
            $this->assertGreaterThan(0, $cuota['cuota_total']);
            $this->assertGreaterThanOrEqual(0, $cuota['interes_pagado']);
            $this->assertGreaterThan(0, $cuota['capital_amortizado']);
            $this->assertGreaterThanOrEqual(0, $cuota['saldo_restante']);
        }
    }
}
