<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Añadir persona_id a las tablas financieras prioritarias
        $tables = ['creditos', 'cuentas_aportacion', 'kardex', 'compras_convenio'];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    if (!Schema::hasColumn($table->getTable(), 'persona_id')) {
                        $table->foreignId('persona_id')->nullable()->after('id')->constrained('personas')->onDelete('cascade');
                    }
                    // Hacer que user_id sea opcional (ahora el dueño es persona_id)
                    $table->unsignedBigInteger('user_id')->nullable()->change();
                });

                // 2. Sincronización de Datos: Mapear persona_id desde la tabla users
                DB::statement("
                    UPDATE {$tableName}
                    SET persona_id = (
                        SELECT persona_id FROM users 
                        WHERE users.id = {$tableName}.user_id
                    )
                    WHERE persona_id IS NULL AND user_id IS NOT NULL
                ");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['creditos', 'cuentas_aportacion', 'kardex', 'compras_convenio'];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    $table->dropForeign([$tableName . '_persona_id_foreign']);
                    $table->dropColumn('persona_id');
                    $table->unsignedBigInteger('user_id')->nullable(false)->change();
                });
            }
        }
    }
};
