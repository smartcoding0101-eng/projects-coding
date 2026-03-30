<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InteresCapitalizado extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $montoInteres;
    protected $nuevoSaldo;

    public function __construct($montoInteres, $nuevoSaldo)
    {
        $this->montoInteres = $montoInteres;
        $this->nuevoSaldo = $nuevoSaldo;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Intereses Capitalizados en FAPCLAS')
                    ->greeting('Hola ' . $notifiable->name . ',')
                    ->line('En virtud de nuestro rendimiento financiero mensual, hemos capitalizado Bs. ' . number_format($this->montoInteres, 2) . ' a tu cuenta de ahorros.')
                    ->line('Tu nuevo saldo disponible para apalancamiento es de: Bs. ' . number_format($this->nuevoSaldo, 2))
                    ->action('Ver mi Libreta', url('/libro-diario'))
                    ->line('Gracias por confiar en FAPCLAS R.L.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'mensaje' => 'Se ha abonado Bs. ' . number_format($this->montoInteres, 2) . ' a tu cuenta por rendimiento mensual.',
            'tipo' => 'interes_capitalizado',
            'monto' => $this->montoInteres,
            'nuevo_saldo' => $this->nuevoSaldo
        ];
    }
}
