<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CajaMovimiento extends Model
{
    protected $fillable = [
        'caja_id',
        'user_id',
        'fecha',
        'tipo',
        'concepto',
        'categoria',
        'monto_bob',
        'monto_usd',
        'metodo_pago',
        'referencia_tipo',
        'referencia_id',
        'numero_comprobante',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'datetime',
            'monto_bob' => 'decimal:2',
            'monto_usd' => 'decimal:2',
        ];
    }

    // ─── Relaciones ───

    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    public function registradoPor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ─── Relación Polimórfica Simplificada ───

    public function referencia()
    {
        if ($this->referencia_tipo && $this->referencia_id) {
            $model = 'App\\Models\\' . $this->referencia_tipo;
            if (class_exists($model)) {
                return $model::find($this->referencia_id);
            }
        }
        return null;
    }

    // ─── Scopes ───

    public function scopeIngresos($query)
    {
        return $query->where('tipo', 'ingreso');
    }

    public function scopeEgresos($query)
    {
        return $query->where('tipo', 'egreso');
    }

    public function scopeByCategoria($query, string $cat)
    {
        return $query->where('categoria', $cat);
    }

    // ─── Constantes ───

    const CATEGORIAS = [
        'venta_ecommerce' => 'Venta E-Commerce (QR)',
        'pago_credito' => 'Pago de Crédito / Cuota',
        'aporte' => 'Aporte / Ahorro Socio',
        'desembolso' => 'Desembolso de Crédito',
        'gasto_operativo' => 'Gasto Operativo',
        'deposito_banco' => 'Depósito a Banco',
        'retiro_banco' => 'Retiro de Banco',
        'otro_ingreso' => 'Otro Ingreso',
        'otro_egreso' => 'Otro Egreso',
    ];
}
