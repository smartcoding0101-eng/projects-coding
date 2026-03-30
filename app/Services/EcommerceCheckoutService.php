<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\Producto;
use App\Models\Configuracion;
use App\Models\User;
use App\Models\KardexProducto;
use App\Services\AccountingService;
use Illuminate\Support\Facades\DB;

class EcommerceCheckoutService
{
    protected $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    public function procesarCheckout(array $datosCliente, array $carrito, string $tipoPago, array $logistica, ?User $user = null, ?string $comprobantePath = null)
    {
        DB::beginTransaction();
        try {
            // Verify items and calculate total based on User Role config
            $total = 0;
            $detalles = [];
            
            // Get config for explicit associated prices
            $descuentoGlobal = (float) Configuracion::getValor('ecommerce_descuento_socios_global', '0');
            $isAsociado = $user && $user->roles()->where('name', 'Socio')->exists(); 

            foreach ($carrito as $item) {
                $producto = Producto::lockForUpdate()->find($item['id']);
                
                if (!$producto || !$producto->activo) {
                    throw new \Exception("Producto no disponible.");
                }

                if ($producto->stock_actual < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para: {$producto->nombre}.");
                }

                // Lógica de precio:
                // 1. Si es socio y tiene precio_asociado definido (> 0), usa ese.
                // 2. Si es socio y NO tiene precio_asociado, aplica el descuento global sobre el general.
                // 3. Si es invitado, usa precio_general.
                $precioFinal = $producto->precio_general;
                if ($isAsociado) {
                    if ($producto->precio_asociado > 0) {
                        $precioFinal = $producto->precio_asociado;
                    } elseif ($descuentoGlobal > 0) {
                        $precioFinal = $producto->precio_general * (1 - ($descuentoGlobal / 100));
                    }
                }

                $subtotal = $precioFinal * $item['cantidad'];
                $total += $subtotal;

                $detalles[] = [
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $precioFinal,
                    'subtotal' => $subtotal
                ];
            }

            // Logística y Costos
            $costoEnvio = 0;
            $tipoEntrega = $logistica['tipo_entrega'] ?? 'recojo_tienda';
            $direccionEnvio = null;

            if ($tipoEntrega === 'envio_domicilio') {
                $costoEnvio = 15.00; // Fixed delivery cost for now, can be setting
                $direccionEnvio = $logistica['direccion_envio'] ?? null;
                if (!$direccionEnvio) {
                    throw new \Exception("La dirección de envío es obligatoria para envíos a domicilio.");
                }
            }

            $total += $costoEnvio;

            // Validations for Credit
            if ($tipoPago === 'credito_asociado') {
                if (!$isAsociado) {
                    throw new \Exception("Las ventas a crédito son exclusivas para socios registrados.");
                }
                
                // Check credit limit
                $limite = $this->accountingService->getLimiteCreditoGlobal($user);
                
                // Si el servicio no tiene límite, usar el default de la config
                if (!$limite || $limite <= 0) {
                    $limite = (float) Configuracion::getValor('ecommerce_limite_credito_default', '5000');
                }

                $deudaActual = $this->accountingService->getDeudaTotal($user);
                $disponible = $limite - $deudaActual;

                if ($total > $disponible) {
                    throw new \Exception("Límite de crédito insuficiente. Disponible: Bs. " . number_format($disponible, 2));
                }
            }

            // Create Order
            $estadoPago = $tipoPago === 'qr' ? 'pendiente_validacion' : 'pagado'; 
            if ($tipoPago === 'credito_asociado') {
                $estadoPago = 'pagado'; 
            }

            $pedido = Pedido::create([
                'numero_orden' => 'ORD-' . strtoupper(uniqid()),
                'user_id' => $user ? $user->id : null,
                'nombre_cliente' => $datosCliente['nombre'],
                'ci_cliente' => $datosCliente['ci'] ?? null,
                'telefono_contacto' => $datosCliente['telefono'] ?? null,
                'tipo_pago' => $tipoPago,
                'tipo_entrega' => $tipoEntrega,
                'direccion_envio' => $direccionEnvio,
                'costo_envio' => $costoEnvio,
                'estado_pago' => $estadoPago,
                'estado_entrega' => 'por_recoger',
                'total' => $total,
                'comprobante_qr_path' => $comprobantePath,
                'observaciones' => $datosCliente['observaciones'] ?? null
            ]);

            foreach ($detalles as $detalle) {
                $detalle['pedido_id'] = $pedido->id;
                PedidoDetalle::create($detalle);

                // If instantly paid by credit, reduce stock and create kardex
                if ($estadoPago === 'pagado') {
                    $producto = Producto::find($detalle['producto_id']);
                    $nuevoSaldo = $producto->stock_actual - $detalle['cantidad'];
                    $producto->update(['stock_actual' => $nuevoSaldo]);

                    KardexProducto::create([
                        'producto_id' => $producto->id,
                        'tipo_movimiento' => 'egreso',
                        'cantidad' => $detalle['cantidad'],
                        'saldo_stock' => $nuevoSaldo,
                        'concepto' => 'Venta Ecommerce a Crédito (Socio) ORD-' . $pedido->numero_orden,
                        'usuario_admin_id' => null
                    ]);
                }
            }

            // Register in the universal Financial Kardex if it's a credit sale
            if ($tipoPago === 'credito_asociado' && $user) {
                // Instanciate KardexService via app helper or DI
                $kardexService = app(\App\Services\KardexService::class);
                $kardexService->registrarCompraConvenio($user, $total, "Compra Ecommerce a Crédito (ORD: {$pedido->numero_orden})", 'Pedido', $pedido->id);
            }

            DB::commit();
            return $pedido;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
