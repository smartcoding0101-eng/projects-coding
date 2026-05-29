<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\Pedido;
use Illuminate\Support\Facades\Log;

class SendWhatsAppNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $pedido;
    public $tipo;

    /**
     * Create a new job instance.
     */
    public function __construct(Pedido $pedido, string $tipo)
    {
        $this->pedido = $pedido;
        $this->tipo = $tipo;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // En el futuro, si se implementa una API oficial de WhatsApp (Meta, Twilio, etc),
        // la llamada HTTP iría aquí. Esto evita bloquear el request del usuario.

        Log::info("Job Procesado: Preparando notificación de WhatsApp para Pedido {$this->pedido->numero_orden} (Tipo: {$this->tipo})");

        // Simulación de llamada API
        // Http::post('api.whatsapp.com', ['message' => ...]);
    }
}
