<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Noticia extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'slug',
        'categoria',
        'fecha',
        'resumen',
        'contenido',
        'imagen_path',
        'color_accent',
        'is_active',
    ];

    protected $casts = [
        'fecha' => 'date',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($noticia) {
            if (empty($noticia->slug)) {
                $noticia->slug = Str::slug($noticia->titulo);
            }
        });
    }
}
