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
        Schema::table('personas', function (Blueprint $table) {
            // 1. Ampliación Información Adicional (Entorno y Educación)
            $table->string('grado_instruccion')->nullable()->after('observaciones');
            $table->string('profesion')->nullable()->after('grado_instruccion');
            $table->string('conyuge_nombre')->nullable()->after('profesion');
            $table->string('conyuge_celular', 20)->nullable()->after('conyuge_nombre');
            $table->integer('numero_hijos')->default(0)->after('conyuge_celular');

            // 2. Ampliación Garantías (Control de Custodia)
            $table->string('garantia_codigo', 50)->nullable()->after('garantia_monto_valorado');
            $table->string('garantia_estado', 20)->default('VIGENTE')->after('garantia_codigo');
            $table->text('garantia_detalle')->nullable()->after('garantia_estado');
            $table->date('garantia_fecha_constitucion')->nullable()->after('garantia_detalle');
            $table->text('garantia_ubicacion_docs')->nullable()->after('garantia_fecha_constitucion');
            
            // Flexibilizar tipo de garantía (de enum a string para soportar más tipos)
            $table->string('garantia_tipo', 50)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->dropColumn([
                'grado_instruccion', 'profesion', 'conyuge_nombre', 'conyuge_celular', 'numero_hijos',
                'garantia_codigo', 'garantia_estado', 'garantia_detalle', 'garantia_fecha_constitucion', 'garantia_ubicacion_docs'
            ]);
        });
    }
};
