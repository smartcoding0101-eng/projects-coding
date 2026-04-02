<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LibroDiario extends Model
{
    protected $fillable = [
        'user_id',
        'cajero_id',
        'fecha',
        'concepto',
        'ingreso',
        'egreso',
        'saldo',
        'tipo_transaccion',
        'referencia_id',
    ];

    /**
     * Casting de atributos
     */
    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'ingreso' => 'decimal:2',
            'egreso' => 'decimal:2',
            'saldo' => 'decimal:2',
        ];
    }

    /**
     * El socio al que pertenece este registro (si aplica).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * El usuario administrativo que registró el movimiento.
     */
    public function cajero()
    {
        return $this->belongsTo(User::class, 'cajero_id');
    }
}
