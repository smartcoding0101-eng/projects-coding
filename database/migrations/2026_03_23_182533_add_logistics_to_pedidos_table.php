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
        Schema::table('pedidos', function (Blueprint $table) {
            $table->enum('tipo_entrega', ['recojo_tienda', 'envio_domicilio'])->default('recojo_tienda')->after('tipo_pago');
            $table->text('direccion_envio')->nullable()->after('tipo_entrega');
            $table->decimal('costo_envio', 10, 2)->default(0)->after('direccion_envio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn(['tipo_entrega', 'direccion_envio', 'costo_envio']);
        });
    }
};
