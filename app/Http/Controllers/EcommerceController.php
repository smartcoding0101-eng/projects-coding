<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\Configuracion;
use App\Services\EcommerceCheckoutService;

class EcommerceController extends Controller
{
    protected $checkoutService;

    public function __construct(EcommerceCheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    private function getSettings()
    {
        return Configuracion::where('key', 'like', 'ecommerce_%')
            ->get()
            ->pluck('value', 'key');
    }

    public function index(Request $request)
    {
        $query = Producto::with('categoria')->where('activo', true);

        if ($request->filled('categoria')) {
            $query->whereHas('categoria', function($q) use ($request) {
                $q->where('slug', $request->categoria);
            });
        }

        if ($request->filled('q')) {
            $searchTerm = '%' . $request->q . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('nombre', 'like', $searchTerm)
                  ->orWhere('codigo_sku', 'like', $searchTerm)
                  ->orWhere('descripcion', 'like', $searchTerm);
            });
        }

        if ($request->filled('min_price')) {
            $query->where('precio_general', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('precio_general', '<=', $request->max_price);
        }

        $productos = $query->paginate(12)->withQueryString();
        $categorias = Categoria::where('activa', true)->get();
        $settings = $this->getSettings();

        return inertia('Ecommerce/Store', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filtros' => $request->only('categoria', 'q', 'min_price', 'max_price'),
            'settings' => $settings
        ]);
    }

    public function show(Producto $producto)
    {
        if (!$producto->activo) abort(404);
        
        $producto->load('categoria');
        $settings = $this->getSettings();
        
        // F1.2: Productos relacionados (misma categoría)
        $relacionados = Producto::with('categoria')
            ->where('categoria_id', $producto->categoria_id)
            ->where('id', '!=', $producto->id)
            ->where('activo', true)
            ->take(4)
            ->get();
        
        return inertia('Ecommerce/Show', [
            'producto' => $producto,
            'settings' => $settings,
            'relacionados' => $relacionados
        ]);
    }

    public function checkout()
    {
        $settings = $this->getSettings();
        
        // Requerir login si invitados están deshabilitados
        if ($settings['ecommerce_habilitar_invitados'] === 'no' && !auth()->check()) {
            return redirect()->route('login')->with('error', 'Debe iniciar sesión para realizar una compra.');
        }

        return inertia('Ecommerce/Checkout', [
            'settings' => $settings
        ]);
    }

    public function processCheckout(Request $request)
    {
        $validated = $request->validate([
            'cliente.nombre' => 'required|string',
            'cliente.ci' => 'nullable|string',
            'cliente.telefono' => 'nullable|string',
            'cliente.observaciones' => 'nullable|string',
            'carrito' => 'required|array|min:1',
            'carrito.*.id' => 'required|exists:productos,id',
            'carrito.*.cantidad' => 'required|integer|min:1',
            'tipo_pago' => 'required|in:qr,credito_asociado',
            'logistica.tipo_entrega' => 'required|in:recojo_tienda,envio_domicilio',
            'logistica.direccion_envio' => 'required_if:logistica.tipo_entrega,envio_domicilio|nullable|string'
        ], [
            'carrito.required' => 'El carrito está vacío.',
            'tipo_pago.required' => 'Debe seleccionar un método de pago.',
            'logistica.direccion_envio.required_if' => 'La dirección es obligatoria para el envío a domicilio.'
        ]);

        $settings = $this->getSettings();

        // Validar invitados en el procesamiento también
        if ($settings['ecommerce_habilitar_invitados'] === 'no' && !auth()->check()) {
            return redirect()->route('login');
        }

        try {
            $pedido = $this->checkoutService->procesarCheckout(
                $validated['cliente'],
                $validated['carrito'],
                $validated['tipo_pago'],
                $validated['logistica'],
                auth()->user(),
                null // Ya no se sube comprobante manual
            );

            if ($validated['tipo_pago'] === 'qr') {
                return redirect()->route('beneficios.pasarela', $pedido->numero_orden);
            }

            return redirect()->route('beneficios.success', $pedido->numero_orden)->with('success', 'Pedido a crédito procesado con éxito.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }

    public function pasarela($numero_orden)
    {
        $pedido = Pedido::where('numero_orden', $numero_orden)->firstOrFail();
        
        if ($pedido->estado_pago !== 'pendiente_validacion') {
            return redirect()->route('beneficios.success', $pedido->numero_orden)->with('info', 'Este pedido ya fue procesado o pagado.');
        }

        return inertia('Ecommerce/PasarelaQR', [
            'pedido' => $pedido,
            'settings' => $this->getSettings()
        ]);
    }

    public function webhookQr(Request $request)
    {
        $validated = $request->validate([
            'numero_orden' => 'required|string|exists:pedidos,numero_orden'
        ]);

        $pedido = Pedido::with('detalles')->where('numero_orden', $validated['numero_orden'])->firstOrFail();

        if ($pedido->estado_pago === 'pagado') {
            return response()->json(['message' => 'El pedido ya estaba pagado.']);
        }

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            $pedido->update(['estado_pago' => 'pagado']);

            // NOTA: El stock NO se descuenta aquí automáticamente vía Webhook.
            // La salida de almacén se registrará formalmente cuando el administrador
            // marque el pedido como 'Entregado' en el panel de administración.
            \Illuminate\Support\Facades\DB::commit();

            if ($pedido->user) {
                $pedido->user->notify(new \App\Notifications\NotificacionPedido($pedido));
            }

            return redirect()->route('beneficios.success', $pedido->numero_orden)->with('success', 'Pago confirmado automáticamente por la pasarela QR.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return redirect()->back()->with('error', 'Error al procesar el pago: ' . $e->getMessage());
        }
    }

    public function success($numero_orden)
    {
        $pedido = Pedido::where('numero_orden', $numero_orden)->firstOrFail();
        
        return inertia('Ecommerce/Success', [
            'pedido' => $pedido
        ]);
    }
}
