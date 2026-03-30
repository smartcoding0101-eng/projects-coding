<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\PedidoDetalle;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_orden', 'user_id', 'nombre_cliente', 'ci_cliente', 'telefono_contacto',
        'tipo_pago', 'estado_pago', 'estado_entrega', 'total',
        'comprobante_qr_path', 'observaciones'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(PedidoDetalle::class);
    }
}
