<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanPago extends Model
{
    protected $fillable = [
        'credito_id',
        'nro_cuota',
        'cuota_total',
        'capital_amortizado',
        'interes_pagado',
        'monto_mora',
        'fecha_vencimiento',
        'estado',
        'metodo_pago',
        'fecha_pago_real',
    ];

    protected function casts(): array
    {
        return [
            'cuota_total' => 'decimal:2',
            'capital_amortizado' => 'decimal:2',
            'interes_pagado' => 'decimal:2',
            'monto_mora' => 'decimal:2',
            'fecha_vencimiento' => 'date',
            'fecha_pago_real' => 'date',
        ];
    }

    // ─── Relaciones ───

    public function credito()
    {
        return $this->belongsTo(Credito::class);
    }

    // ─── Scopes ───

    /**
     * Cuotas vencidas (fecha pasada y no pagadas).
     */
    public function scopeVencidas($query)
    {
        return $query->where('fecha_vencimiento', '<', now()->toDateString())
                     ->where('estado', '!=', 'Pagada');
    }

    /**
     * Cuotas pagadas.
     */
    public function scopePagadas($query)
    {
        return $query->where('estado', 'Pagada');
    }

    /**
     * Cuotas pendientes.
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'Pendiente');
    }

    /**
     * Cuotas retrasadas.
     */
    public function scopeRetrasadas($query)
    {
        return $query->where('estado', 'Retrasada');
    }

    // ─── Constantes ───

    const ESTADO_PENDIENTE = 'Pendiente';
    const ESTADO_PAGADA = 'Pagada';
    const ESTADO_RETRASADA = 'Retrasada';
}

