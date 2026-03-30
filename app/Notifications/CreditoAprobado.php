<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CreditoAprobado extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public float $monto)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('¡Felicidades! Tu crédito ha sido aprobado')
            ->greeting('Hola ' . $notifiable->name . ',')
            ->line('Te informamos que tu solicitud de crédito por un monto de Bs. ' . number_format($this->monto, 2) . ' ha sido Aprobada.')
            ->action('Ver Detalles en la Plataforma', url('/dashboard'))
            ->line('Gracias por confiar en FAPCLAS R.L.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'mensaje' => 'Tu crédito por Bs. ' . number_format($this->monto, 2) . ' ha sido aprobado.',
            'tipo' => 'credito_aprobado',
            'monto' => $this->monto
        ];
    }
}
