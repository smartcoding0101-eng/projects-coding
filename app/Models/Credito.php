<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Credito extends Model
{
    protected $fillable = [
        'user_id',
        'tipo_credito_id',
        'monto_aprobado',
        'saldo_capital',
        'tasa_interes',
        'plazo_meses',
        'estado',
        'fecha_desembolso',
        'metodo_descuento',
        'observaciones',
        'aprobado_por',
    ];

    protected function casts(): array
    {
        return [
            'monto_aprobado' => 'decimal:2',
            'saldo_capital' => 'decimal:2',
            'tasa_interes' => 'decimal:2',
            'fecha_desembolso' => 'date',
        ];
    }

    // ─── Relaciones ───

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function planPagos()
    {
        return $this->hasMany(PlanPago::class);
    }

    public function tipoCredito()
    {
        return $this->belongsTo(TipoCredito::class);
    }

    public function aprobadoPor()
    {
        return $this->belongsTo(User::class, 'aprobado_por');
    }

    // ─── Accessors ───

    /**
     * Saldo pendiente calculado dinámicamente desde las cuotas no pagadas.
     */
    public function getSaldoPendienteAttribute(): float
    {
        return $this->planPagos()
            ->whereIn('estado', ['Pendiente', 'Retrasada'])
            ->sum('capital_amortizado');
    }

    /**
     * Total de mora acumulada en las cuotas.
     */
    public function getTotalMoraAttribute(): float
    {
        return $this->planPagos()->sum('monto_mora');
    }

    // ─── Scopes ───

    public function scopeDesembolsados($query)
    {
        return $query->where('estado', 'Desembolsado');
    }

    public function scopeEnMora($query)
    {
        return $query->where('estado', 'En Mora');
    }

    public function scopeSolicitados($query)
    {
        return $query->where('estado', 'Solicitado');
    }

    // ─── Constantes de Estado ───

    const ESTADO_SOLICITADO = 'Solicitado';
    const ESTADO_APROBADO = 'Aprobado';
    const ESTADO_DESEMBOLSADO = 'Desembolsado';
    const ESTADO_EN_MORA = 'En Mora';
    const ESTADO_PAGADO = 'Pagado';
    const ESTADO_RECHAZADO = 'Rechazado';
}

