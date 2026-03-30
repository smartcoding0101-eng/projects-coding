<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoCredito extends Model
{
    protected $table = 'tipos_credito';

    protected $fillable = [
        'nombre',
        'descripcion',
        'tasa_interes',
        'plazo_min_meses',
        'plazo_max_meses',
        'monto_min',
        'monto_max',
        'tasa_mora',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'tasa_interes' => 'decimal:2',
            'monto_min' => 'decimal:2',
            'monto_max' => 'decimal:2',
            'tasa_mora' => 'decimal:2',
            'activo' => 'boolean',
        ];
    }

    // ─── Relaciones ───

    public function creditos()
    {
        return $this->hasMany(Credito::class);
    }

    // ─── Scopes ───

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
