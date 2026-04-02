<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

use App\Models\Configuracion;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Programación automática de Backups Avanzados (FAPCLAS Enterprise)
try {
    $autoBackup = Configuracion::where('key', 'backup_auto_enabled')->value('value');
    if ($autoBackup === '1' || strtolower($autoBackup) === 'si' || strtolower($autoBackup) === 'true') {
        
        $interval = Configuracion::where('key', 'backup_interval')->value('value') ?: 'daily';
        $startTime = Configuracion::where('key', 'backup_time_start')->value('value') ?: '08:00';
        $endTime = Configuracion::where('key', 'backup_time_end')->value('value') ?: '18:00';
        
        // Days parse: "1,2,3,4,5"
        $daysStr = Configuracion::where('key', 'backup_days')->value('value');
        $daysArray = $daysStr ? explode(',', $daysStr) : [1,2,3,4,5]; // default lun-vie
        
        $schedule = Schedule::command('backup:run --only-db')->days($daysArray);
        
        if ($interval === 'daily') {
            $schedule->dailyAt($startTime);
        } else {
            // Entre hora inicio y hora fin
            $schedule->between($startTime, $endTime);

            switch ($interval) {
                case 'hourly': $schedule->hourly(); break;
                case 'everyTwoHours': $schedule->everyTwoHours(); break;
                case 'everyFourHours': $schedule->everyFourHours(); break;
                case 'everySixHours': $schedule->everySixHours(); break;
                default: $schedule->hourly(); break;
            }
        }
        
        // El backup:clean se ejecuta igual 1 vez a la madrugada los días activos
        Schedule::command('backup:clean')->days($daysArray)->dailyAt('01:30');
    }
} catch (\Exception $e) {
    // Tolerancia a fallos de conexión DB en despliegue
}
