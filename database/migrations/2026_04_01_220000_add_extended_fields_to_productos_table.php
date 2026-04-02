<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->text('descripcion_larga')->nullable()->after('descripcion');
            $table->string('marca', 100)->nullable()->after('descripcion_larga');
            $table->string('modelo', 100)->nullable()->after('marca');
            $table->string('serie', 100)->nullable()->after('modelo');
            $table->string('calibre', 50)->nullable()->after('serie');
            $table->date('fecha_vencimiento')->nullable()->after('calibre');
            $table->decimal('precio_credito', 10, 2)->nullable()->after('precio_asociado');
            $table->decimal('precio_costo', 10, 2)->nullable()->after('precio_credito');
            $table->text('observacion')->nullable()->after('imagen_path');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn([
                'descripcion_larga', 'marca', 'modelo', 'serie', 'calibre',
                'fecha_vencimiento', 'precio_credito', 'precio_costo', 'observacion'
            ]);
        });
    }
};
