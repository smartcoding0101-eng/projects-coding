<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Configuracion;

class EcommerceSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Identidad de Tienda (Hero)
            ['key' => 'ecommerce_titulo_hero', 'value' => 'Tienda de Beneficios', 'description' => 'Título principal del hero de la tienda'],
            ['key' => 'ecommerce_subtitulo_hero', 'value' => 'FAPCLAS', 'description' => 'Subtítulo o marca del hero de la tienda'],
            ['key' => 'ecommerce_descripcion_hero', 'value' => 'Equipamiento táctico, víveres y servicios con precios exclusivos para nuestros asociados. Abierto al público general.', 'description' => 'Descripción del hero de la tienda'],
            ['key' => 'ecommerce_badge_hero', 'value' => 'BENEFICIOS EXCLUSIVOS', 'description' => 'Badge del hero de la tienda'],

            // Control de precios
            ['key' => 'ecommerce_mostrar_precio_venta', 'value' => 'si', 'description' => 'Mostrar precio de venta directa'],
            ['key' => 'ecommerce_mostrar_precio_credito', 'value' => 'si', 'description' => 'Mostrar opción de crédito asociado'],

            // Operaciones
            ['key' => 'ecommerce_modo_mantenimiento', 'value' => 'no', 'description' => 'Activar modo mantenimiento en la tienda'],
            ['key' => 'ecommerce_nota_legal', 'value' => 'Los precios pueden variar sin previo aviso. Sujeto a disponibilidad de stock.', 'description' => 'Nota legal visible en la tienda'],

            // Datos de contacto tienda
            ['key' => 'ecommerce_horario_atencion', 'value' => 'Lunes a Viernes 08:00 - 18:00', 'description' => 'Horario de atención para recojo de productos'],
            ['key' => 'ecommerce_direccion_tienda', 'value' => 'Av. Principal #123, La Paz - Bolivia', 'description' => 'Dirección de la tienda física'],
            ['key' => 'ecommerce_telefono_tienda', 'value' => '800-10-FAPCLAS', 'description' => 'Teléfono de contacto de la tienda'],
            ['key' => 'ecommerce_whatsapp_tienda', 'value' => '', 'description' => 'Link directo de WhatsApp para consultas'],
        ];

        foreach ($settings as $s) {
            Configuracion::firstOrCreate(['key' => $s['key']], $s);
        }

        $this->command->info('✅ ' . count($settings) . ' settings de tienda procesados.');
    }
}
