<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->index('estado_pago', 'idx_pedidos_estado_pago');
            $table->index('estado_entrega', 'idx_pedidos_estado_entrega');
        });

        Schema::table('creditos', function (Blueprint $table) {
            // Using raw indexes if the columns already exist.
            $table->index(['estado'], 'idx_creditos_estado');
            // 'fecha_vencimiento' might not exist in creditos directly (maybe in plan_pagos), safer to just index 'estado'
        });

        Schema::table('kardex_productos', function (Blueprint $table) {
            $table->index(['producto_id', 'created_at'], 'idx_kardex_prod_fecha');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropIndex('idx_pedidos_estado_pago');
            $table->dropIndex('idx_pedidos_estado_entrega');
        });

        Schema::table('creditos', function (Blueprint $table) {
            $table->dropIndex('idx_creditos_estado');
        });

        Schema::table('kardex_productos', function (Blueprint $table) {
            $table->dropIndex('idx_kardex_prod_fecha');
        });
    }
};
