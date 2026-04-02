<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caja extends Model
{
    protected $fillable = [
        'user_id',
        'fecha_apertura',
        'fecha_cierre',
        'saldo_inicial_bob',
        'saldo_inicial_usd',
        'saldo_final_bob',
        'saldo_final_usd',
        'estado',
        'observaciones_apertura',
        'observaciones_cierre',
    ];

    protected function casts(): array
    {
        return [
            'fecha_apertura' => 'datetime',
            'fecha_cierre' => 'datetime',
            'saldo_inicial_bob' => 'decimal:2',
            'saldo_inicial_usd' => 'decimal:2',
            'saldo_final_bob' => 'decimal:2',
            'saldo_final_usd' => 'decimal:2',
        ];
    }

    // ─── Relaciones ───

    public function cajero()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function denominaciones()
    {
        return $this->hasMany(CajaDenominacion::class);
    }

    public function movimientos()
    {
        return $this->hasMany(CajaMovimiento::class)->orderBy('fecha', 'desc');
    }

    // ─── Scopes ───

    public function scopeAbiertas($query)
    {
        return $query->where('estado', 'abierta');
    }

    public function scopeCerradas($query)
    {
        return $query->where('estado', 'cerrada');
    }

    // ─── Accessors ───

    public function getTotalIngresosBobAttribute(): float
    {
        return (float) $this->movimientos()->where('tipo', 'ingreso')->sum('monto_bob');
    }

    public function getTotalEgresosBobAttribute(): float
    {
        return (float) $this->movimientos()->where('tipo', 'egreso')->sum('monto_bob');
    }

    public function getTotalIngresosUsdAttribute(): float
    {
        return (float) $this->movimientos()->where('tipo', 'ingreso')->sum('monto_usd');
    }

    public function getTotalEgresosUsdAttribute(): float
    {
        return (float) $this->movimientos()->where('tipo', 'egreso')->sum('monto_usd');
    }

    public function getSaldoEsperadoBobAttribute(): float
    {
        return (float) $this->saldo_inicial_bob + $this->total_ingresos_bob - $this->total_egresos_bob;
    }

    public function getSaldoEsperadoUsdAttribute(): float
    {
        return (float) $this->saldo_inicial_usd + $this->total_ingresos_usd - $this->total_egresos_usd;
    }

    // ─── Helpers ───

    public function estaAbierta(): bool
    {
        return $this->estado === 'abierta';
    }

    /**
     * Obtener la caja abierta del usuario, o null si no tiene.
     */
    public static function cajaAbiertaDe(int $userId): ?self
    {
        return static::where('user_id', $userId)->where('estado', 'abierta')->first();
    }
}
