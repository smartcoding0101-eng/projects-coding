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
        Schema::create('tipos_credito', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100)->comment('Consumo, Emergencia, Vivienda, Anticipo Sueldo');
            $table->text('descripcion')->nullable();
            $table->decimal('tasa_interes', 5, 2)->comment('Tasa de interés anual %');
            $table->integer('plazo_min_meses')->default(1);
            $table->integer('plazo_max_meses')->default(60);
            $table->decimal('monto_min', 15, 2)->default(100);
            $table->decimal('monto_max', 15, 2)->default(100000);
            $table->decimal('tasa_mora', 5, 2)->default(3.0)->comment('Interés moratorio anual adicional %');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_credito');
    }
};
