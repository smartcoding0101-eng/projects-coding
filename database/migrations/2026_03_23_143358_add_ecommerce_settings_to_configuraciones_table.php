<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('configuraciones')->insert([
            ['key' => 'ecommerce_mostrar_precios', 'value' => 'si', 'description' => 'Mostrar precios a todos los usuarios (si/no)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'ecommerce_mostrar_stock', 'value' => 'si', 'description' => 'Mostrar cantidad de stock en tienda (si/no)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'ecommerce_habilitar_invitados', 'value' => 'si', 'description' => 'Permitir compras a usuarios no asociados (si/no)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'ecommerce_descuento_socios_global', 'value' => '0', 'description' => 'Descuento porcentual extra para socios en toda la tienda', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'ecommerce_qr_pago', 'value' => '', 'description' => 'URL o base64 de la imagen QR para pagos', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'ecommerce_limite_credito_default', 'value' => '5000', 'description' => 'Límite de crédito por defecto si no está definido en el socio', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('configuraciones')->whereIn('key', [
            'ecommerce_mostrar_precios',
            'ecommerce_mostrar_stock',
            'ecommerce_habilitar_invitados',
            'ecommerce_descuento_socios_global',
            'ecommerce_qr_pago',
            'ecommerce_limite_credito_default'
        ])->delete();
    }
};
