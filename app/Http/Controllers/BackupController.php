<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Spatie\DbDumper\Databases\MySql;

class BackupController extends Controller
{
    /**
     * Run a manual backup.
     */
    public function run()
    {
        try {
            // Ejecutar el comando de backup de Spatie
            // Usamos --only-db para que sea rápido en la respuesta HTTP
            Artisan::call('backup:run', ['--only-db' => true]);
            
            return back()->with('success', 'Respaldo de Base de Datos completado exitosamente.');
        } catch (\Exception $e) {
            Log::error('Error en backup manual: ' . $e->getMessage());
            return back()->with('error', 'Error al ejecutar el respaldo: ' . $e->getMessage());
        }
    }

    /**
     * Generate and download a specific .sql database dump.
     */
    public function download(Request $request)
    {
        try {
            $filename = $request->input('filename', 'backup_' . date('Y_m_d_His'));
            // Sanitize filename to avoid path traversal
            $filename = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $filename);
            
            $directory = storage_path('app/backups');
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $path = $directory . '/' . $filename . '.sql';

            $dumper = MySql::create()
                ->setDbName(config('database.connections.mysql.database'))
                ->setUserName(config('database.connections.mysql.username'))
                ->setPassword(config('database.connections.mysql.password'))
                ->setHost(config('database.connections.mysql.host'))
                ->setPort(config('database.connections.mysql.port'));

            // Soporte para entornos locales tipo XAMPP en Windows
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                if (file_exists('C:\\xampp\\mysql\\bin\\mysqldump.exe')) {
                    $dumper->setDumpBinaryPath('C:\\xampp\\mysql\\bin');
                }
            }

            $dumper->dumpToFile($path);

            return response()->download($path)->deleteFileAfterSend();

        } catch (\Exception $e) {
            Log::error('Error downloading custom database backup: ' . $e->getMessage());
            return back()->with('error', 'Error al generar la descarga: ' . $e->getMessage());
        }
    }
}
