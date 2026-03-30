<?php

namespace App\Console\Commands;

use App\Services\KardexService;
use Illuminate\Console\Command;

class CalcularInteresesAhorro extends Command
{
    protected $signature = 'fapclas:calcular-intereses';

    protected $description = 'Calcula y abona el interés pasivo mensual a los ahorros de los socios.';

    public function handle(KardexService $kardex)
    {
        $this->info('Iniciando cálculo de interés compuesto...');
        
        $tasaAnual = 4.0; // 4% anual (ejemplo FAPCLAS)
        $tasaMensual = ($tasaAnual / 100) / 12;

        $socios = \App\Models\User::all();
        $abonos = 0;
        
        foreach ($socios as $socio) {
            $ultimoMovimiento = \App\Models\LibroDiario::where('user_id', $socio->id)
                ->orderBy('id', 'desc')
                ->first();

            if ($ultimoMovimiento && $ultimoMovimiento->saldo > 0) {
                $interesGanado = $ultimoMovimiento->saldo * $tasaMensual;
                $interesArrendado = round($interesGanado, 2);

                if ($interesArrendado > 0) {
                    $nuevoSaldo = $ultimoMovimiento->saldo + $interesArrendado;

                    \App\Models\LibroDiario::create([
                        'user_id' => $socio->id,
                        'fecha' => now()->toDateString(),
                        'concepto' => "Capitalización de Interés Mensual ({$tasaAnual}% TEA)",
                        'tipo_transaccion' => 'Ingreso Automático',
                        'ingreso' => $interesArrendado,
                        'egreso' => 0,
                        'saldo' => $nuevoSaldo,
                    ]);

                    // Registrar en Kardex
                    $kardex->registrarInteresGanado($socio, $interesArrendado);

                    $socio->notify(new \App\Notifications\InteresCapitalizado($interesArrendado, $nuevoSaldo));
                    $abonos++;
                }
            }
        }

        $this->info("¡Operación exitosa! Se abonaron intereses a {$abonos} cuenta(s) activa(s).");
    }
}

