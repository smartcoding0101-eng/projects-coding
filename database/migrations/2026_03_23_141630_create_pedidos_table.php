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
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->string('numero_orden')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Null = Guest
            $table->string('nombre_cliente')->nullable();
            $table->string('ci_cliente')->nullable();
            $table->string('telefono_contacto')->nullable();
            $table->enum('tipo_pago', ['qr', 'credito_asociado']);
            $table->enum('estado_pago', ['pendiente_validacion', 'pagado', 'rechazado']);
            $table->enum('estado_entrega', ['por_recoger', 'entregado']);
            $table->decimal('total', 10, 2);
            $table->string('comprobante_qr_path')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
