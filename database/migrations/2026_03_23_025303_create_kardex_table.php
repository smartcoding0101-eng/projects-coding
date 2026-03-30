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
        Schema::create('kardex', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('fecha');
            $table->string('tipo_movimiento', 50)
                  ->comment('aporte, retiro, desembolso_credito, pago_cuota, interes_ganado, compra_convenio, ajuste, mora');
            $table->string('concepto');
            $table->decimal('ingreso', 15, 2)->default(0);
            $table->decimal('egreso', 15, 2)->default(0);
            $table->decimal('saldo_acumulado', 15, 2)->default(0)
                  ->comment('Saldo corriente del socio después de este movimiento');
            $table->string('referencia_tipo', 50)->nullable()
                  ->comment('credito, plan_pago, compra_convenio, cuenta_aportacion, etc.');
            $table->unsignedBigInteger('referencia_id')->nullable()
                  ->comment('ID del registro que originó el movimiento');
            $table->string('metodo', 50)->nullable()
                  ->comment('Planilla, QR, Efectivo, Automático');
            $table->timestamps();

            $table->index(['user_id', 'fecha'], 'kardex_user_fecha_idx');
            $table->index('tipo_movimiento', 'kardex_tipo_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kardex');
    }
};
