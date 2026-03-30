<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoAportacion extends Model
{
    protected $table = 'movimientos_aportacion';

    protected $fillable = [
        'cuenta_aportacion_id',
        'tipo',
        'monto',
        'descripcion',
        'fecha_movimiento',
    ];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'fecha_movimiento' => 'date',
        ];
    }

    // ─── Relaciones ───

    public function cuentaAportacion()
    {
        return $this->belongsTo(CuentaAportacion::class);
    }
}
