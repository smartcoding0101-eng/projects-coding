<?php

namespace App\Services;

use App\Models\Caja;
use App\Models\CajaMovimiento;
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
     * Inyecta movimiento automático en la caja abierta del cajero actual.
     */
    private function inyectarEnCaja(string $tipo, string $concepto, string $categoria, float $monto, string $metodo = 'efectivo', ?string $refTipo = null, ?int $refId = null): void
    {
        $cajero = auth()->id();
        if (!$cajero) return;

        $cajaActiva = Caja::cajaAbiertaDe($cajero);
        if (!$cajaActiva) return;

        CajaMovimiento::create([
            'caja_id' => $cajaActiva->id,
            'user_id' => $cajero,
            'fecha' => now(),
            'tipo' => $tipo,
            'concepto' => $concepto,
            'categoria' => $categoria,
            'monto_bob' => $monto,
            'monto_usd' => 0,
            'metodo_pago' => $metodo,
            'referencia_tipo' => $refTipo,
            'referencia_id' => $refId,
        ]);
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
                'cajero_id' => auth()->id(),
                'fecha' => now()->toDateString(),
                'concepto' => $concepto,
                'ingreso' => $monto,
                'egreso' => 0,
                'tipo_transaccion' => 'aporte',
            ]);

            // Registrar en Kardex
            $this->kardex->registrarAporte($socio, $monto);

            // Inyectar en Caja activa
            $this->inyectarEnCaja('ingreso', "Aporte Socio: {$socio->name}", 'aporte', $monto);

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
                'cajero_id' => auth()->id(),
                'fecha' => now()->toDateString(),
                'concepto' => $concepto,
                'ingreso' => 0,
                'egreso' => $monto,
                'tipo_transaccion' => 'desembolso_credito',
            ]);

            // Registrar en Kardex
            $this->kardex->registrarDesembolso($socio, $monto, $creditoId);

            // Inyectar en Caja activa (EGRESO)
            $this->inyectarEnCaja('egreso', "Desembolso Crédito #{$creditoId} - {$socio->name}", 'desembolso', $monto, 'efectivo', 'Credito', $creditoId);

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
            'cajero_id' => auth()->id(),
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

        // Inyectar en Caja activa (INGRESO)
        $this->inyectarEnCaja('ingreso', $concepto, 'pago_credito', $montoTotal, 'efectivo', 'PlanPago', $cuota->id);

        return $asiento;
    }

    /**
     * Registra interés moratorio en el Libro Diario.
     */
    public function registrarMora(User $socio, PlanPago $cuota, float $montoMora): LibroDiario
    {
        $asiento = LibroDiario::create([
            'user_id' => $socio->id,
            'cajero_id' => auth()->id(),
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

    /**
     * Obtiene el límite de crédito global configurado para un socio.
     */
    public function getLimiteCreditoGlobal(User $socio): float
    {
        // Prioridad: 1. Configuración de configuración global, 2. Default hardcoded
        $limite = (float) \App\Models\Configuracion::getValor('ecommerce_limite_credito_default', '5000');
        
        // Si hay lógica específica por rango/grado en el futuro, se añadiría aquí.
        return $limite;
    }

    /**
     * Calcula la deuda total acumulada del socio en cuotas pendientes.
     */
    public function getDeudaTotal(User $socio): float
    {
        return (float) PlanPago::whereHas('credito', function($q) use ($socio) {
            $q->where('user_id', $socio->id);
        })
        ->where('pagada', false)
        ->sum('cuota_total');
    }
}
