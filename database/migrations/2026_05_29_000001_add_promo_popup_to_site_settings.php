<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = [
            // ── Popup Landing Page ──────────────────────────────────
            [
                'key'   => 'promo_popup_landing',
                'value' => json_encode([
                    'enabled'     => false,
                    'type'        => 'oferta',       // oferta | noticia | informacion
                    'image'       => null,
                    'title'       => 'Oferta Especial',
                    'description' => 'Aprovecha nuestras promociones exclusivas para socios.',
                    'button_text' => 'Ver Más',
                    'button_link' => '/beneficios',
                    'show_once'   => true,           // true = una vez por sesión
                    'delay_ms'    => 1000,           // ms antes de aparecer
                    'expires_at'  => null,           // ISO 8601 o null
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ── Popup Ecommerce / Tienda ────────────────────────────
            [
                'key'   => 'promo_popup_ecommerce',
                'value' => json_encode([
                    'enabled'     => false,
                    'type'        => 'oferta',
                    'image'       => null,
                    'title'       => 'Descuentos en Tienda',
                    'description' => 'Ofertas exclusivas para miembros activos de FAPCLAS.',
                    'button_text' => 'Ver Ofertas',
                    'button_link' => '#catalogo',
                    'show_once'   => true,
                    'delay_ms'    => 800,
                    'expires_at'  => null,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($defaults as $row) {
            // Insertar solo si la key NO existe ya
            DB::table('site_settings')
                ->where('key', $row['key'])
                ->doesntExist()
            && DB::table('site_settings')->insert($row);
        }
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->whereIn('key', ['promo_popup_landing', 'promo_popup_ecommerce'])
            ->delete();
    }
};
