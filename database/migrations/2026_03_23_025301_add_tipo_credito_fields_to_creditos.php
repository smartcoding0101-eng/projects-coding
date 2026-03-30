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
        Schema::table('creditos', function (Blueprint $table) {
            $table->foreignId('tipo_credito_id')->nullable()->after('user_id')
                  ->constrained('tipos_credito')->onDelete('set null')
                  ->comment('Tipo de crédito (consumo, emergencia, vivienda, etc.)');
            $table->decimal('saldo_capital', 15, 2)->nullable()->after('monto_aprobado')
                  ->comment('Saldo vivo del capital pendiente');
            $table->text('observaciones')->nullable()->after('metodo_descuento');
            $table->foreignId('aprobado_por')->nullable()->after('observaciones')
                  ->constrained('users')->onDelete('set null')
                  ->comment('Usuario que aprobó el crédito');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('creditos', function (Blueprint $table) {
            $table->dropForeign(['tipo_credito_id']);
            $table->dropForeign(['aprobado_por']);
            $table->dropColumn(['tipo_credito_id', 'saldo_capital', 'observaciones', 'aprobado_por']);
        });
    }
};
