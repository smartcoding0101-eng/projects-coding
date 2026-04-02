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
        // 1. Añadir el campo persona_id a users si no existe
        if (!Schema::hasColumn('users', 'persona_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('persona_id')->nullable()->after('id')->constrained('personas')->onDelete('set null');
            });
        }

        // 2. Migrar datos existentes (solo si hay usuarios sin persona_id)
        $usersToMigrate = DB::table('users')->whereNull('persona_id')->get();
        foreach ($usersToMigrate as $user) {
            $parts = explode(' ', $user->name, 2);
            $nombres = $parts[0];
            $apellidos = isset($parts[1]) ? $parts[1] : 'S/A';

            $personaId = DB::table('personas')->insertGetId([
                'nombres' => $nombres,
                'apellidos' => $apellidos,
                'ci' => $user->ci ?? 'TEMP-'.uniqid(),
                'escalafon' => $user->escalafon,
                'grado' => $user->grado,
                'destino' => $user->destino,
                'email' => $user->email,
                'celular' => $user->whatsapp ?? null,
                'institucion' => 'POLICIA',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('users')->where('id', $user->id)->update(['persona_id' => $personaId]);
        }

        // 3. Eliminar columnas redundantes en users (con comprobación)
        if (Schema::hasColumn('users', 'ci')) {
            try {
                Schema::table('users', function (Blueprint $table) {
                    $table->dropColumn(['ci', 'escalafon', 'grado', 'destino']);
                });
            } catch (\Exception $e) {
                // Si falla en SQLite por claves foráneas o índices, lo ignoramos 
                // para permitir que el resto del sistema funcione.
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir es complejo por la pérdida de datos, pero definiremos la estructura básica
        Schema::table('users', function (Blueprint $table) {
            $table->string('ci')->nullable();
            $table->string('escalafon')->nullable();
            $table->string('grado')->nullable();
            $table->string('destino')->nullable();
            $table->dropForeign(['persona_id']);
            $table->dropColumn('persona_id');
        });
    }
};
