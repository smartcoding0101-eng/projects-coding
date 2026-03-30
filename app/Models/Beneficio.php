<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficio extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'logo_path',
        'activo',
    ];

    public function compras()
    {
        return $this->hasMany(CompraConvenio::class);
    }
}
