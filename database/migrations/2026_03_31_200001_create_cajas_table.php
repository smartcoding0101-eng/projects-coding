<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cajas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->comment('Cajero que abre la sesión');
            $table->dateTime('fecha_apertura');
            $table->dateTime('fecha_cierre')->nullable();
            $table->decimal('saldo_inicial_bob', 12, 2)->default(0);
            $table->decimal('saldo_inicial_usd', 12, 2)->default(0);
            $table->decimal('saldo_final_bob', 12, 2)->nullable();
            $table->decimal('saldo_final_usd', 12, 2)->nullable();
            $table->enum('estado', ['abierta', 'cerrada'])->default('abierta')->index();
            $table->text('observaciones_apertura')->nullable();
            $table->text('observaciones_cierre')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cajas');
    }
};
