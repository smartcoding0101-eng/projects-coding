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
        Schema::table('users', function (Blueprint $table) {
            $table->string('ci', 15)->unique()->after('password')->nullable()->comment('Carnet de Identidad');
            $table->string('escalafon', 20)->unique()->after('ci')->nullable()->comment('Nro. de Escalafón Policial');
            $table->string('grado', 50)->after('escalafon')->nullable()->comment('Grado Policial (Ej. Sgto, Cnl)');
            $table->string('destino', 100)->after('grado')->nullable()->comment('Unidad de Destino Actual');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ci', 'escalafon', 'grado', 'destino']);
        });
    }
};
