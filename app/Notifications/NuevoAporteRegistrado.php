<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NuevoAporteRegistrado extends Notification
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
            ->subject('Nuevo Aporte Registrado Exitosamente')
            ->greeting('Estimado Socio ' . $notifiable->name . ',')
            ->line('Hemos recibido y registrado correctamente tu aporte de Bs. ' . number_format($this->monto, 2) . ' en tu cuenta de ahorro.')
            ->action('Ver mi Estado de Cuenta', url('/dashboard'))
            ->line('FAPCLAS R.L. - Tu cooperativa de confianza.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'mensaje' => 'Se ha registrado un nuevo aporte por Bs. ' . number_format($this->monto, 2) . '.',
            'tipo' => 'aporte_registrado',
            'monto' => $this->monto
        ];
    }
}
