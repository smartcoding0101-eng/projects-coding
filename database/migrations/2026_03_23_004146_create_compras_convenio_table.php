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
        Schema::create('compras_convenio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('beneficio_id')->constrained('beneficios')->onDelete('cascade');
            $table->decimal('monto_total', 10, 2);
            $table->string('metodo_pago')->default('QR')->comment('Oficial: QR');
            $table->string('estado_pago')->default('Pendiente')->comment('Pendiente, Pagado, Rechazado');
            $table->string('codigo_transaccion_qr')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compras_convenio');
    }
};
