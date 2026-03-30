<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    // Usar nombre en español
    protected $table = 'configuraciones';

    protected $fillable = [
        'key',
        'value',
        'description',
    ];

    public static function getValor($key, $default = null)
    {
        $config = self::where('key', $key)->first();
        return $config ? $config->value : $default;
    }
}
