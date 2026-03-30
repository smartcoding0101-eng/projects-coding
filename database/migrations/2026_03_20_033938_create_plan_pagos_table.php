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
        Schema::create('plan_pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('credito_id')->constrained('creditos')->onDelete('cascade');
            $table->integer('nro_cuota');
            $table->decimal('cuota_total', 15, 2);
            $table->decimal('capital_amortizado', 15, 2);
            $table->decimal('interes_pagado', 15, 2);
            $table->date('fecha_vencimiento');
            $table->string('estado', 50)->default('Pendiente')->comment('Pendiente, Pagada, Retrasada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_pagos');
    }
};
