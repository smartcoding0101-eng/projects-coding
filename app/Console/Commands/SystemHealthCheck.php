<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\File;

class SystemHealthCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:health';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica la integridad física de la base de datos comparando las migraciones con las tablas existentes (útil para auditoria en cPanel).';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("====================================");
        $this->info("🏥 INICIANDO SYSTEM HEALTH CHECK");
        $this->info("====================================");

        // 1. Check DB Connection
        try {
            DB::connection()->getPdo();
            $this->info("✅ Conexión a Base de Datos: OK [" . DB::connection()->getDatabaseName() . "]");
        } catch (\Exception $e) {
            $this->error("❌ ERROR CRITICO: No se puede conectar a la base de datos.");
            $this->error($e->getMessage());
            return 1;
        }

        // 2. Check migrations folder vs DB tables
        $this->info("\n🔍 Analizando integridad de tablas y migraciones...");
        
        $migrationFiles = File::files(database_path('migrations'));
        $missingMigrations = [];
        $missingTables = [];

        // Check the 'migrations' table existence first
        if (!Schema::hasTable('migrations')) {
            $this->error("❌ La tabla 'migrations' NO EXISTE. Nunca se ejecutó 'php artisan migrate' en este servidor.");
            $missingTables[] = 'migrations';
        } else {
            $dbMigrations = DB::table('migrations')->pluck('migration')->toArray();

            foreach ($migrationFiles as $file) {
                $filename = str_replace('.php', '', $file->getFilename());
                
                if (!in_array($filename, $dbMigrations)) {
                    $missingMigrations[] = $filename;
                }

                // Extrayendo nombre de tabla de la migración (heurística simple)
                $content = file_get_contents($file->getPathname());
                if (preg_match("/Schema::create\('([^']+)'/", $content, $matches)) {
                    $tableName = $matches[1];
                    if (!Schema::hasTable($tableName)) {
                        if (!in_array($tableName, $missingTables)) {
                            $missingTables[] = $tableName;
                        }
                    }
                }
            }
        }

        // 3. Resultados de Integridad
        if (count($missingMigrations) > 0) {
            $this->error("\n⚠️ MIGRACIONES FALTANTES EN LA TABLA 'migrations':");
            foreach ($missingMigrations as $mig) {
                $this->line("- $mig");
            }
        } else {
            $this->info("✅ Todas las migraciones físicas están registradas en la DB.");
        }

        if (count($missingTables) > 0) {
            $this->error("\n❌ TABLAS CRITICAS INEXISTENTES FÍSICAMENTE EN LA DB:");
            foreach ($missingTables as $table) {
                $this->line("- $table");
            }
            $this->error("\n💡 SOLUCIÓN RECOMENDADA EN CPANEL:");
            $this->error("Ejecute: php artisan migrate --force");
        } else {
            $this->info("✅ Todas las tablas requeridas por el código existen en la base de datos.");
        }

        $this->info("\n====================================");
        $this->info("🏁 HEALTH CHECK FINALIZADO");
        $this->info("====================================");
        
        return 0;
    }
}
