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
        Schema::create('personas', function (Blueprint $table) {
            $table->id();

            // 1. Datos Personales
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('ci', 20)->unique();
            $table->string('ext_ci', 5)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['MASCULINO', 'FEMENINO', 'OTRO'])->nullable();
            $table->string('estado_civil', 20)->nullable();
            $table->string('celular', 20)->nullable();
            $table->string('email')->nullable();
            $table->text('direccion_domicilio')->nullable();

            // 2. Información de Trabajo
            $table->enum('institucion', ['POLICIA', 'CIVIL', 'EXTERNO'])->default('POLICIA');
            $table->string('grado', 50)->nullable();
            $table->string('escalafon', 50)->nullable();
            $table->string('destino', 100)->nullable();
            $table->decimal('sueldo_neto', 12, 2)->nullable();
            $table->date('fecha_ingreso_inst')->nullable();

            // 3. Información Adicional
            $table->string('tipo_afiliacion')->default('SOCIO');
            $table->string('contacto_emergencia_nom')->nullable();
            $table->string('contacto_emergencia_tel')->nullable();
            $table->text('observaciones')->nullable();

            // 4. Garantías
            $table->enum('garantia_tipo', ['INMUEBLE', 'VEHICULO', 'PAPELETA', 'OTRO', 'NINGUNA'])->default('NINGUNA');
            $table->string('garantia_vehiculo_modelo')->nullable();
            $table->string('garantia_vehiculo_placa')->nullable();
            $table->string('garantia_inmueble_folio')->nullable();
            $table->text('garantia_inmueble_dir')->nullable();
            $table->decimal('garantia_monto_valorado', 15, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
