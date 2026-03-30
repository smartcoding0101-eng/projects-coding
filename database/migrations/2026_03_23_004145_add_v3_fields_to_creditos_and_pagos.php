<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('creditos', function (Blueprint $table) {
            $table->string('metodo_descuento')->default('Planilla')->after('estado')->comment('Planilla, Pago Directo');
        });

        Schema::table('plan_pagos', function (Blueprint $table) {
            $table->string('metodo_pago')->nullable()->after('estado')->comment('Planilla, QR, Efectivo');
            $table->date('fecha_pago_real')->nullable()->after('fecha_vencimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('creditos', function (Blueprint $table) {
            $table->dropColumn('metodo_descuento');
        });

        Schema::table('plan_pagos', function (Blueprint $table) {
            $table->dropColumn(['metodo_pago', 'fecha_pago_real']);
        });
    }
};
