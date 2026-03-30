<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LibroDiario extends Model
{
    protected $fillable = [
        'user_id',
        'fecha',
        'concepto',
        'ingreso',
        'egreso',
        'saldo',
        'tipo_transaccion',
        'referencia_id',
    ];

    /**
     * El socio al que pertenece este registro (si aplica).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
