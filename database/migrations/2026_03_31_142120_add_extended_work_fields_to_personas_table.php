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
            // Ampliación de campos laborales
            $table->string('situacion_laboral', 50)->nullable()->after('fecha_ingreso_inst');
            $table->string('especialidad', 100)->nullable()->after('situacion_laboral');
            $table->string('unidad_dependencia', 100)->nullable()->after('especialidad');
            
            // Flexibilizar institución (cambiar enum por string para permitir nuevos nombres)
            $table->string('institucion', 50)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->dropColumn(['situacion_laboral', 'especialidad', 'unidad_dependencia']);
            // Nota: No se revierte el cambio de string a enum en SQLite fácilmente
        });
    }
};
