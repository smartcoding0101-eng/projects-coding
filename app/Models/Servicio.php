<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Servicio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'imagen',
        'icono',
        'is_active',
        'is_featured',
        'sort_order',
        'secciones',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'secciones' => 'array',
        'sort_order' => 'integer',
    ];

    // ─── Scopes ───

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ─── Helpers ───

    /**
     * Genera automáticamente el slug a partir del nombre si no se ha definido.
     */
    protected static function booted(): void
    {
        static::creating(function (Servicio $servicio) {
            if (empty($servicio->slug)) {
                $servicio->slug = Str::slug($servicio->nombre);
            }
        });
    }

    /**
     * Devuelve la URL pública de la imagen (compatible con storage o URL externa).
     */
    public function getImagenUrlAttribute(): ?string
    {
        if (!$this->imagen) {
            return null;
        }

        if (str_starts_with($this->imagen, 'http') || str_starts_with($this->imagen, '/')) {
            return $this->imagen;
        }

        return '/storage/' . $this->imagen;
    }
}
