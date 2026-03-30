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
        Schema::create('libro_diarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Socio asociado, si aplica
            $table->date('fecha');
            $table->string('concepto');
            $table->decimal('ingreso', 12, 2)->default(0);
            $table->decimal('egreso', 12, 2)->default(0);
            $table->decimal('saldo', 12, 2)->default(0); // Para llevar el balance acumulado (opcional pero útil)
            $table->string('tipo_transaccion')->index(); // ej. 'aporte', 'pago_cuota', 'desembolso_credito', 'ajuste'
            $table->unsignedBigInteger('referencia_id')->nullable()->index(); // ID del modelo que originó la transacción (polimórfico simplificado)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('libro_diarios');
    }
};
