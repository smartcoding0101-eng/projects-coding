<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

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
}
