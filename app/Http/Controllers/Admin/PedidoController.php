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

        // 1. Verificar si se exige caja abierta según configuración global
        $exigeCaja = \DB::table('configuraciones')->where('key', 'ecommerce_pago_exige_caja')->first();
        $cajaActiva = \App\Models\Caja::cajaAbiertaDe(auth()->id());

        if ($exigeCaja && ($exigeCaja->value === '1' || $exigeCaja->value === 'true') && !$cajaActiva) {
            return redirect()->back()->with('error', 'No puede validar pagos sin una sesión de caja abierta. Por favor, aperture su caja primero en el módulo de Caja General.');
        }

        DB::beginTransaction();
        try {
            $pedido->update(['estado_pago' => 'pagado']);

            // NOTA: El stock NO se descuenta aquí en la validación de pago.
            // Se descontará en el método marcarEntregado() al momento de la entrega física.
            // Esto permite la triangulación financiera: Pago (Caja) vs Entrega (Inventario).

            // 2. Registrar Ingreso en Libro Diario (Caja General)
            \App\Models\LibroDiario::create([
                'user_id' => $pedido->user_id,
                'cajero_id' => auth()->id(),
                'fecha' => now()->toDateString(),
                'concepto' => 'Venta Ecommerce / Beneficios - Orden #' . $pedido->numero_orden . ' (ID: ' . $pedido->id . ')',
                'ingreso' => $pedido->total,
                'egreso' => 0,
                'tipo_transaccion' => 'venta_ecommerce',
                'referencia_id' => $pedido->id,
            ]);

            // 3. Inyectar movimiento en Caja activa del cajero (si existe)
            $cajaActiva = \App\Models\Caja::cajaAbiertaDe(auth()->id());
            if ($cajaActiva) {
                \App\Models\CajaMovimiento::create([
                    'caja_id' => $cajaActiva->id,
                    'user_id' => auth()->id(),
                    'fecha' => now(),
                    'tipo' => 'ingreso',
                    'concepto' => 'Venta Ecommerce Orden #' . $pedido->numero_orden,
                    'categoria' => 'venta_ecommerce',
                    'monto_bob' => $pedido->total,
                    'monto_usd' => 0,
                    'metodo_pago' => $pedido->tipo_pago === 'qr' ? 'qr_banco' : 'efectivo',
                    'referencia_tipo' => 'Pedido',
                    'referencia_id' => $pedido->id,
                ]);
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

        DB::beginTransaction();
        try {
            $pedido->update(['estado_entrega' => 'entregado']);
            
            // 1. Descontar inventario formalmente al entregar (Triangulación Física)
            $pedido->load('detalles');
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
                        'concepto' => 'Salida por Entrega Ecommerce - Orden #' . $pedido->numero_orden,
                        'usuario_admin_id' => auth()->id(),
                        'notas' => 'Entrega presencial confirmada por el servidor.'
                    ]);
                }
            }

            DB::commit();

            if ($pedido->user) {
                $pedido->user->notify(new \App\Notifications\NotificacionPedido($pedido));
            }

            return redirect()->back()->with('success', 'Pedido marcado como entregado y stock descontado del Kardex.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al procesar la entrega: ' . $e->getMessage());
        }
    }
}
