<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caja_movimientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_id')->constrained('cajas')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->comment('Quien registró el movimiento');
            $table->dateTime('fecha');
            $table->enum('tipo', ['ingreso', 'egreso'])->index();
            $table->string('concepto');
            $table->string('categoria')->index()->comment('venta_ecommerce, pago_credito, aporte, desembolso, gasto, deposito_banco, retiro, otro');
            $table->decimal('monto_bob', 12, 2)->default(0);
            $table->decimal('monto_usd', 12, 2)->default(0);
            $table->enum('metodo_pago', ['efectivo', 'qr_banco', 'transferencia'])->default('efectivo');
            $table->string('referencia_tipo')->nullable()->comment('Modelo origen: Pedido, Credito, PlanPago');
            $table->unsignedBigInteger('referencia_id')->nullable();
            $table->string('numero_comprobante')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->index(['referencia_tipo', 'referencia_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caja_movimientos');
    }
};
