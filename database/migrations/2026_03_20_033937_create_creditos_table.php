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
        Schema::create('creditos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('monto_aprobado', 15, 2);
            $table->decimal('tasa_interes', 5, 2)->comment('Porcentaje anual');
            $table->integer('plazo_meses');
            $table->string('estado', 50)->default('Solicitado')->comment('Solicitado, Aprobado, Desembolsado, Pagado, En Mora');
            $table->date('fecha_desembolso')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creditos');
    }
};
