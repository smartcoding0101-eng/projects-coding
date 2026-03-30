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
        Schema::create('movimientos_aportacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cuenta_aportacion_id')->constrained('cuentas_aportacion')->onDelete('cascade');
            $table->string('tipo', 50)->comment('Ingreso, Retiro, Interés');
            $table->decimal('monto', 15, 2)->comment('Valor transaccionado');
            $table->string('descripcion', 255)->nullable();
            $table->date('fecha_movimiento');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_aportacion');
    }
};
