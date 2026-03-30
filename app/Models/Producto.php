<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'categoria_id', 'codigo_sku', 'nombre', 'slug', 'descripcion',
        'precio_general', 'precio_asociado', 'stock_actual', 'stock_minimo',
        'imagen_path', 'activo'
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
