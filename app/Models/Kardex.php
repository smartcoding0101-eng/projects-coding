<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kardex extends Model
{
    protected $table = 'kardex';

    protected $fillable = [
        'user_id',
        'fecha',
        'tipo_movimiento',
        'concepto',
        'ingreso',
        'egreso',
        'saldo_acumulado',
        'referencia_tipo',
        'referencia_id',
        'metodo',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'ingreso' => 'decimal:2',
            'egreso' => 'decimal:2',
            'saldo_acumulado' => 'decimal:2',
        ];
    }

    // ─── Relaciones ───

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ─── Scopes ───

    /**
     * Filtrar por tipo de movimiento.
     */
    public function scopeByTipo($query, string $tipo)
    {
        return $query->where('tipo_movimiento', $tipo);
    }

    /**
     * Filtrar por rango de fechas.
     */
    public function scopeByFecha($query, ?string $desde = null, ?string $hasta = null)
    {
        if ($desde) {
            $query->where('fecha', '>=', $desde);
        }
        if ($hasta) {
            $query->where('fecha', '<=', $hasta);
        }
        return $query;
    }

    /**
     * Solo movimientos de ingreso.
     */
    public function scopeIngresos($query)
    {
        return $query->where('ingreso', '>', 0);
    }

    /**
     * Solo movimientos de egreso.
     */
    public function scopeEgresos($query)
    {
        return $query->where('egreso', '>', 0);
    }

    // ─── Constantes de tipos ───

    const TIPO_APORTE = 'aporte';
    const TIPO_RETIRO = 'retiro';
    const TIPO_DESEMBOLSO_CREDITO = 'desembolso_credito';
    const TIPO_PAGO_CUOTA = 'pago_cuota';
    const TIPO_INTERES_GANADO = 'interes_ganado';
    const TIPO_COMPRA_CONVENIO = 'compra_convenio';
    const TIPO_AJUSTE = 'ajuste';
    const TIPO_MORA = 'mora';

    /**
     * Etiquetas legibles para cada tipo de movimiento.
     */
    public static function etiquetasTipo(): array
    {
        return [
            self::TIPO_APORTE => 'Aporte / Ahorro',
            self::TIPO_RETIRO => 'Retiro',
            self::TIPO_DESEMBOLSO_CREDITO => 'Desembolso de Crédito',
            self::TIPO_PAGO_CUOTA => 'Pago de Cuota',
            self::TIPO_INTERES_GANADO => 'Interés Ganado',
            self::TIPO_COMPRA_CONVENIO => 'Compra por Convenio',
            self::TIPO_AJUSTE => 'Ajuste Contable',
            self::TIPO_MORA => 'Interés Moratorio',
        ];
    }
}
