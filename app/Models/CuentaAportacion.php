<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CuentaAportacion extends Model
{
    protected $table = 'cuentas_aportacion';

    protected $fillable = [
        'user_id',
        'saldo_actual',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'saldo_actual' => 'decimal:2',
        ];
    }

    // ─── Relaciones ───

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoAportacion::class, 'cuenta_aportacion_id');
    }
}
