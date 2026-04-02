<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->string('icono', 50)->nullable()->after('descripcion');
            $table->string('color', 20)->nullable()->after('icono');
            $table->integer('orden')->default(0)->after('color');
        });
    }

    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropColumn(['icono', 'color', 'orden']);
        });
    }
};
