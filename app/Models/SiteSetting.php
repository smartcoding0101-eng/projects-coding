<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Obtener un setting por su clave, con caché de 1 hora.
     */
    public static function get(string $key, $default = null): mixed
    {
        return Cache::remember("site_setting.{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Establecer un setting y limpiar el caché.
     */
    public static function set(string $key, $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
        Cache::forget("site_setting.{$key}");
    }

    /**
     * Obtener todos los settings del sitio como array asociativo.
     */
    public static function allSettings(): array
    {
        return Cache::remember('site_settings.all', 3600, function () {
            return static::pluck('value', 'key')->toArray();
        });
    }

    /**
     * Limpiar toda la caché de settings.
     */
    public static function clearCache(): void
    {
        $keys = static::pluck('key');
        foreach ($keys as $key) {
            Cache::forget("site_setting.{$key}");
        }
        Cache::forget('site_settings.all');
        Cache::forget('site_settings_payload');
    }
}
