<?php

namespace App\Services;

use App\Models\Kardex;
use App\Models\User;

class KardexService
{
    /**
     * Registra un movimiento en el kardex del socio.
     * Calcula automáticamente el saldo acumulado.
     *
     * @param User   $user      Socio al que pertenece el movimiento
     * @param string $tipo      Tipo de movimiento (usar constantes de Kardex)
     * @param string $concepto  Descripción del movimiento
     * @param float  $ingreso   Monto de ingreso (0 si es egreso)
     * @param float  $egreso    Monto de egreso (0 si es ingreso)
     * @param string|null $refTipo  Tipo de entidad referenciada (credito, plan_pago, etc.)
     * @param int|null    $refId    ID de la entidad referenciada
     * @param string|null $metodo   Método de la transacción (Planilla, QR, Efectivo, Automático)
     * @return Kardex
     */
    public function registrar(
        User $user,
        string $tipo,
        string $concepto,
        float $ingreso = 0,
        float $egreso = 0,
        ?string $refTipo = null,
        ?int $refId = null,
        ?string $metodo = null
    ): Kardex {
        // Obtener el último saldo acumulado del usuario
        $ultimoSaldo = Kardex::where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->value('saldo_acumulado') ?? 0;

        $nuevoSaldo = $ultimoSaldo + $ingreso - $egreso;

        return Kardex::create([
            'user_id' => $user->id,
            'fecha' => now()->toDateString(),
            'tipo_movimiento' => $tipo,
            'concepto' => $concepto,
            'ingreso' => round($ingreso, 2),
            'egreso' => round($egreso, 2),
            'saldo_acumulado' => round($nuevoSaldo, 2),
            'referencia_tipo' => $refTipo,
            'referencia_id' => $refId,
            'metodo' => $metodo,
        ]);
    }

    // ─── Métodos de conveniencia ───

    /**
     * Registra un aporte (ingreso de ahorro).
     */
    public function registrarAporte(User $user, float $monto, ?int $cuentaId = null, ?string $metodo = 'Planilla'): Kardex
    {
        return $this->registrar(
            $user, Kardex::TIPO_APORTE, 'Aporte / Ahorro mensual',
            $monto, 0, 'cuenta_aportacion', $cuentaId, $metodo
        );
    }

    /**
     * Registra un desembolso de crédito (el socio recibe dinero).
     */
    public function registrarDesembolso(User $user, float $monto, int $creditoId): Kardex
    {
        return $this->registrar(
            $user, Kardex::TIPO_DESEMBOLSO_CREDITO,
            "Desembolso de Crédito #{$creditoId}",
            $monto, 0, 'credito', $creditoId, null
        );
    }

    /**
     * Registra el pago de una cuota (egreso del socio para pagar deuda).
     */
    public function registrarPagoCuota(User $user, int $creditoId, int $cuotaId, int $nroCuota, float $montoTotal, string $metodo = 'Planilla'): Kardex
    {
        return $this->registrar(
            $user, Kardex::TIPO_PAGO_CUOTA,
            "Pago Cuota #{$nroCuota} - Crédito #{$creditoId}",
            0, $montoTotal, 'plan_pago', $cuotaId, $metodo
        );
    }

    /**
     * Registra interés ganado sobre ahorros.
     */
    public function registrarInteresGanado(User $user, float $interes): Kardex
    {
        return $this->registrar(
            $user, Kardex::TIPO_INTERES_GANADO,
            'Capitalización de interés sobre ahorros',
            $interes, 0, null, null, 'Automático'
        );
    }

    /**
     * Registra interés moratorio.
     */
    public function registrarMora(User $user, int $cuotaId, int $nroCuota, int $creditoId, float $montoMora): Kardex
    {
        return $this->registrar(
            $user, Kardex::TIPO_MORA,
            "Interés moratorio - Cuota #{$nroCuota} - Crédito #{$creditoId}",
            0, $montoMora, 'plan_pago', $cuotaId, null
        );
    }

    /**
     * Registra una compra por convenio.
     */
    public function registrarCompraConvenio(User $user, float $monto, int $compraId, string $beneficioNombre): Kardex
    {
        return $this->registrar(
            $user, Kardex::TIPO_COMPRA_CONVENIO,
            "Compra por convenio: {$beneficioNombre}",
            0, $monto, 'compra_convenio', $compraId, 'QR'
        );
    }

    /**
     * Registra un retiro de fondos.
     */
    public function registrarRetiro(User $user, float $monto, ?string $metodo = 'Efectivo'): Kardex
    {
        return $this->registrar(
            $user, Kardex::TIPO_RETIRO, 'Retiro de fondos de aportación',
            0, $monto, null, null, $metodo
        );
    }
}
