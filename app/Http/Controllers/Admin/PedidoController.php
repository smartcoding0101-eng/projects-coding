<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\KardexProducto;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with('user')->orderBy('created_at', 'desc')->get();
        return inertia('Admin/Pedidos/Index', [
            'pedidos' => $pedidos
        ]);
    }

    public function show(Pedido $pedido)
    {
        $pedido->load('user', 'detalles.producto');
        
        $whatsappService = new \App\Services\WhatsAppService();
        
        return inertia('Admin/Pedidos/Show', [
            'pedido' => $pedido,
            'urls' => [
                'pdf' => route('pedidos.pdf', $pedido->numero_orden),
                'wa_pago' => $whatsappService->generarEnlace($pedido, 'pago_validado'),
                'wa_entrega' => $whatsappService->generarEnlace($pedido, 'pedido_entregado'),
            ]
        ]);
    }

    public function validarPago(Pedido $pedido)
    {
        if ($pedido->estado_pago !== 'pendiente_validacion') {
            return redirect()->back()->with('error', 'El pedido no está pendiente de validación.');
        }

        DB::beginTransaction();
        try {
            $pedido->update(['estado_pago' => 'pagado']);

            // Descontar inventario al validar el pago (QR validados o créditos descontados)
            foreach ($pedido->detalles as $detalle) {
                $producto = Producto::find($detalle->producto_id);
                if ($producto) {
                    $nuevo_saldo = $producto->stock_actual - $detalle->cantidad;
                    $producto->update(['stock_actual' => $nuevo_saldo]);

                    KardexProducto::create([
                        'producto_id' => $producto->id,
                        'tipo_movimiento' => 'egreso',
                        'cantidad' => $detalle->cantidad,
                        'saldo_stock' => $nuevo_saldo,
                        'concepto' => 'Venta Ecommerce Orden ' . $pedido->numero_orden,
                        'usuario_admin_id' => auth()->id()
                    ]);
                }
            }
            DB::commit();

            if ($pedido->user) {
                $pedido->user->notify(new \App\Notifications\NotificacionPedido($pedido));
            }

            return redirect()->back()->with('success', 'Pago validado y stock descontado.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al validar pago: ' . $e->getMessage());
        }
    }

    public function rechazarPago(Pedido $pedido)
    {
        $pedido->update(['estado_pago' => 'rechazado']);
        
        if ($pedido->user) {
            $pedido->user->notify(new \App\Notifications\NotificacionPedido($pedido));
        }

        return redirect()->back()->with('success', 'Pago rechazado.');
    }

    public function marcarEntregado(Pedido $pedido)
    {
        if ($pedido->estado_pago !== 'pagado') {
            return redirect()->back()->with('error', 'El pedido debe estar pagado antes de entregarse.');
        }

        $pedido->update(['estado_entrega' => 'entregado']);
        
        if ($pedido->user) {
            $pedido->user->notify(new \App\Notifications\NotificacionPedido($pedido));
        }

        return redirect()->back()->with('success', 'Pedido marcado como entregado (Click & Collect finalizado).');
    }
}
