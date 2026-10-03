<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Convert existing data to valid JSON arrays
        \Illuminate\Support\Facades\DB::table('productos')->whereNotNull('imagen_path')->get()->each(function ($producto) {
            $path = $producto->imagen_path;
            if (!str_starts_with($path, '[') && !str_starts_with($path, '{')) {
                \Illuminate\Support\Facades\DB::table('productos')
                    ->where('id', $producto->id)
                    ->update(['imagen_path' => json_encode([$path])]);
            }
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->json('imagen_path')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->string('imagen_path')->nullable()->change();
        });
    }
};
