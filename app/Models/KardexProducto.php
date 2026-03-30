<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KardexProducto extends Model
{
    use HasFactory;

    protected $fillable = [
        'producto_id', 'tipo_movimiento', 'cantidad', 'saldo_stock',
        'costo_unitario', 'concepto', 'usuario_admin_id', 'notas'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'usuario_admin_id');
    }
}
