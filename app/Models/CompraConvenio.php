<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompraConvenio extends Model
{
    // Desactivar pluralization default ya que la tabla se llama compras_convenio manualmente
    protected $table = 'compras_convenio';
    
    protected $fillable = [
        'user_id',
        'beneficio_id',
        'monto_total',
        'metodo_pago',
        'estado_pago',
        'codigo_transaccion_qr'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function beneficio()
    {
        return $this->belongsTo(Beneficio::class);
    }
}
