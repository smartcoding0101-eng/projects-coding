<?php

namespace App\Services;

use App\Models\Pedido;

class WhatsAppService
{
    /**
     * Genera un enlace de WhatsApp Web para un pedido específico.
     *
     * @param Pedido $pedido
     * @param string $tipo 'pago_validado' | 'pago_rechazado' | 'pedido_entregado'
     * @return string
     */
    public function generarEnlace(Pedido $pedido, string $tipo): string
    {
        $telefono = $pedido->telefono_contacto ?: ($pedido->user ? $pedido->user->whatsapp : null);
        
        if (!$telefono) {
            return '';
        }

        // Limpiar teléfono (solo números)
        $telefono = preg_replace('/[^0-9]/', '', $telefono);
        if (strlen($telefono) === 8) {
            $telefono = "591" . $telefono;
        }

        $urlPdf = route('pedidos.pdf', $pedido->numero_orden);

        $mensaje = match ($tipo) {
            'pago_validado' => "✅ *FAPCLAS R.L. - Pago Confirmado*\n\nHola *{$pedido->nombre_cliente}*, tu pago del pedido *{$pedido->numero_orden}* por Bs. {$pedido->total} ha sido validado con éxito. 🎉\n\nTu pedido ya está en proceso de despacho. Puedes descargar tu comprobante aquí: {$urlPdf}\n\n¡Gracias por tu confianza!",
            'pago_rechazado' => "❌ *FAPCLAS R.L. - Observación de Pago*\n\nHola *{$pedido->nombre_cliente}*, hemos tenido un inconveniente al validar el comprobante de tu pedido *{$pedido->numero_orden}*. Por favor, verifica el número de transacción o contacta con nosotros.",
            'pedido_entregado' => "📦 *FAPCLAS R.L. - Pedido Entregado*\n\nHola *{$pedido->nombre_cliente}*, confirmamos que tu pedido *{$pedido->numero_orden}* ha sido entregado exitosamente. ✅\n\nPuedes descargar tu constancia de entrega aquí: {$urlPdf}\n\n¡Esperamos que disfrutes tus productos!",
            default => "Hola *{$pedido->nombre_cliente}*, nos contactamos de FAPCLAS R.L. sobre tu pedido *{$pedido->numero_orden}*. Detalles: {$urlPdf}"
        };

        return "https://wa.me/{$telefono}?text=" . urlencode($mensaje);
    }
}
