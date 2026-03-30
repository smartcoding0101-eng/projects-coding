<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotificacionPedido extends Notification
{
    use Queueable;

    public $pedido;
    public $mensaje;

    /**
     * Create a new notification instance.
     */
    public function __construct($pedido, $mensaje = null)
    {
        $this->pedido = $pedido;
        $this->mensaje = $mensaje ?: "Tu pedido #{$this->pedido->numero_orden} ha sido actualizado. Pago: {$this->pedido->estado_pago}. Entrega: {$this->pedido->estado_entrega}.";
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'pedido_id' => $this->pedido->id,
            'numero_orden' => $this->pedido->numero_orden,
            'estado_pago' => $this->pedido->estado_pago,
            'estado_entrega' => $this->pedido->estado_entrega,
            'mensaje' => $this->mensaje,
        ];
    }
}
