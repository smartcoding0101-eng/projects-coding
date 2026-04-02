<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CajaDenominacion extends Model
{
    protected $table = 'caja_denominaciones';

    protected $fillable = [
        'caja_id',
        'tipo',
        'moneda',
        'denominacion',
        'cantidad',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'denominacion' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    // ─── Constantes de Denominaciones ───

    public static function denominacionesBob(): array
    {
        return [200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10];
    }

    public static function denominacionesUsd(): array
    {
        return [100, 50, 20, 10, 5, 2, 1, 0.50, 0.25, 0.10, 0.05, 0.01];
    }
}
