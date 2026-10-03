<?php

namespace App\Filament\Resources\Pedidos\Widgets;

use Filament\Widgets\Widget;
use App\Models\Pedido;
use App\Models\Configuracion;

class OrderSoundNotifier extends Widget
{
    protected string $view = 'filament.resources.pedidos.widgets.order-sound-notifier';

    public $lastOrderCount = 0;
    public $playAlert = false;
    public $soundUrl = null;

    public function mount()
    {
        $this->lastOrderCount = Pedido::where('estado_pago', 'pendiente_validacion')->count();
        
        $settings = Configuracion::where('key', 'like', 'ecommerce_%')->pluck('value', 'key')->toArray();
        $tipo = $settings['ecommerce_admin_sonido_pedido_tipo'] ?? 'campana';
        
        if ($tipo === 'personalizado' && !empty($settings['ecommerce_admin_sonido_pedido_custom'])) {
            $this->soundUrl = asset('storage/' . $settings['ecommerce_admin_sonido_pedido_custom']);
        } else {
            // Asumiendo que podemos tener unos MP3 genéricos en public/sounds/
            // Si no existen, el frontend ignorará silenciosamente el play(), o podemos usar un sonido base64.
            $this->soundUrl = asset("sounds/{$tipo}.mp3"); 
        }
    }

    public function checkNewOrders()
    {
        $currentCount = Pedido::where('estado_pago', 'pendiente_validacion')->count();
        
        if ($currentCount > 0 && $currentCount > $this->lastOrderCount) {
            $this->playAlert = true;
        } else {
            $this->playAlert = false;
        }

        $this->lastOrderCount = $currentCount;
        
        $this->dispatch('check-order-sound', play: $this->playAlert, hasPending: $currentCount > 0);
    }
}
