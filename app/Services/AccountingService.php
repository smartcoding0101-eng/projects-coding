<?php

namespace App\Services;

use App\Models\LibroDiario;
use App\Models\PlanPago;
use App\Models\User;
use App\Notifications\CreditoAprobado;
use App\Notifications\NuevoAporteRegistrado;
use Illuminate\Support\Facades\DB;
use Exception;

class AccountingService
{
    protected KardexService $kardex;

    public function __construct(KardexService $kardex)
    {
        $this->kardex = $kardex;
    }

    /**
     * Registra un nuevo aporte (ahorro) en el sistema.
     */
    public function registrarAporte(User $socio, float $monto, string $concepto = 'Aporte mensual')
    {
        DB::beginTransaction();

        try {
            $asiento = LibroDiario::create([
                'user_id' => $socio->id,
                'fecha' => now()->toDateString(),
                'concepto' => $concepto,
                'ingreso' => $monto,
                'egreso' => 0,
                'tipo_transaccion' => 'aporte',
            ]);

            // Registrar en Kardex
            $this->kardex->registrarAporte($socio, $monto);

            $socio->notify(new NuevoAporteRegistrado($monto));

            DB::commit();
            return $asiento;

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Registra el desembolso de un crédito aprobado.
     */
    public function aprobarCredito(User $socio, float $monto, int $creditoId = 0, string $concepto = 'Desembolso de Crédito Aprobado')
    {
        DB::beginTransaction();

        try {
            $asiento = LibroDiario::create([
                'user_id' => $socio->id,
                'fecha' => now()->toDateString(),
                'concepto' => $concepto,
                'ingreso' => 0,
                'egreso' => $monto,
                'tipo_transaccion' => 'desembolso_credito',
            ]);

            // Registrar en Kardex
            $this->kardex->registrarDesembolso($socio, $monto, $creditoId);

            $socio->notify(new CreditoAprobado($monto));

            DB::commit();
            return $asiento;

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Registra el cobro de una cuota de crédito.
     */
    public function registrarPagoCuota(User $socio, PlanPago $cuota, string $metodoPago = 'Planilla'): LibroDiario
    {
        $montoTotal = $cuota->cuota_total + $cuota->monto_mora;
        $concepto = "Pago Cuota #{$cuota->nro_cuota} - Crédito #{$cuota->credito_id}";

        if ($cuota->monto_mora > 0) {
            $concepto .= " (incluye mora Bs. " . number_format($cuota->monto_mora, 2) . ")";
        }

        $asiento = LibroDiario::create([
            'user_id' => $socio->id,
            'fecha' => now()->toDateString(),
            'concepto' => $concepto,
            'ingreso' => $montoTotal,
            'egreso' => 0,
            'tipo_transaccion' => 'pago_cuota',
            'referencia_id' => $cuota->id,
        ]);

        // Registrar en Kardex
        $this->kardex->registrarPagoCuota(
            $socio, $cuota->credito_id, $cuota->id,
            $cuota->nro_cuota, $montoTotal, $metodoPago
        );

        return $asiento;
    }

    /**
     * Registra interés moratorio en el Libro Diario.
     */
    public function registrarMora(User $socio, PlanPago $cuota, float $montoMora): LibroDiario
    {
        $asiento = LibroDiario::create([
            'user_id' => $socio->id,
            'fecha' => now()->toDateString(),
            'concepto' => "Interés moratorio - Cuota #{$cuota->nro_cuota} - Crédito #{$cuota->credito_id}",
            'ingreso' => $montoMora,
            'egreso' => 0,
            'tipo_transaccion' => 'mora',
            'referencia_id' => $cuota->id,
        ]);

        // Registrar en Kardex
        $this->kardex->registrarMora(
            $socio, $cuota->id, $cuota->nro_cuota,
            $cuota->credito_id, $montoMora
        );

        return $asiento;
    }
}


