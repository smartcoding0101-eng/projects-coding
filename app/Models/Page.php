<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'is_active',
        'metadata',
    ];

    protected $casts = [
        'content' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        static::deleting(function ($page) {
            $pathsToDelete = [];
            
            // 1. Eliminar SEO Image (og_image)
            if (!empty($page->metadata['og_image'])) {
                $pathsToDelete[] = $page->metadata['og_image'];
            }

            // 2. Escanear JSON dinámico y extraer todos los media de 'pages/'
            if (is_array($page->content)) {
                $jsonStr = json_encode($page->content);
                preg_match_all('/"pages\/[^"]+"/', $jsonStr, $matches);
                if (!empty($matches[0])) {
                    foreach ($matches[0] as $match) {
                        $path = trim($match, '"');
                        $pathsToDelete[] = $path;
                    }
                }
            }

            // 3. Purgar limpieza profunda
            if (count($pathsToDelete) > 0) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(array_unique($pathsToDelete));
            }
        });
    }
}
