<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'categoria_id', 'codigo_sku', 'nombre', 'slug', 'descripcion',
        'descripcion_larga', 'marca', 'modelo', 'serie', 'calibre',
        'fecha_vencimiento', 'precio_general', 'precio_asociado',
        'precio_credito', 'precio_costo', 'stock_actual', 'stock_minimo',
        'imagen_path', 'observacion', 'activo'
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function kardex()
    {
        return $this->hasMany(KardexProducto::class);
    }
}
