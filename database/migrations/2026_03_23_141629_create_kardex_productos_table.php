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
        Schema::create('kardex_productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->enum('tipo_movimiento', ['ingreso', 'egreso', 'ajuste']);
            $table->integer('cantidad');
            $table->integer('saldo_stock');
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->string('concepto');
            $table->foreignId('usuario_admin_id')->nullable()->constrained('users')->onDelete('set null'); // Who moved the stock
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kardex_productos');
    }
};
