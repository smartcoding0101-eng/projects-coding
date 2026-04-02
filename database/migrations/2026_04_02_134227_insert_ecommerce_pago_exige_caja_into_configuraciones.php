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
            'key' => 'ecommerce_pago_exige_caja',
            'value' => '0',
            'description' => 'Exigir que el administrador tenga una caja abierta para validar pagos de e-commerce.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('configuraciones')->where('key', 'ecommerce_pago_exige_caja')->delete();
    }
};
