<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EcommerceDashboardController extends Controller
{
    public function index()
    {
        // 1. Valorizado del Inventario
        $valorizado = Producto::where('activo', true)->sum(DB::raw('stock_actual * precio_general'));

        // 2. Composición de Ventas
        $ventasTotales = Pedido::where('estado_pago', 'pagado')->sum('total');
        $ventasCredito = Pedido::where('estado_pago', 'pagado')->where('tipo_pago', 'credito_asociado')->sum('total');
        $ventasQr = Pedido::where('estado_pago', 'pagado')->where('tipo_pago', 'qr')->sum('total');

        // 3. Alertas de Quiebre (Stock <= Mínimo)
        $stockouts = Producto::whereRaw('stock_actual <= stock_minimo')->where('activo', true)->get();

        // 4. Ranking de Productos (Top 5 por cantidad vendida)
        $rankingProductos = PedidoDetalle::select('producto_id', DB::raw('SUM(cantidad) as total_vendido'), DB::raw('SUM(subtotal) as total_recaudado'))
            ->join('pedidos', 'pedido_detalles.pedido_id', '=', 'pedidos.id')
            ->where('pedidos.estado_pago', 'pagado')
            ->groupBy('producto_id')
            ->orderByDesc('total_vendido')
            ->limit(10)
            ->with('producto:id,nombre,codigo_sku')
            ->get();

        // 5. Nuevos usuarios B2C
        $nuevosUsuarios = User::whereMonth('created_at', now()->month)->count();

        // Analisis ABC simplificado en base al ranking
        $totalRecaudadoGeneral = $rankingProductos->sum('total_recaudado');
        $abc = [];
        $acumulado = 0;
        foreach ($rankingProductos as $item) {
            if ($totalRecaudadoGeneral > 0) {
                $porcentaje = ($item->total_recaudado / $totalRecaudadoGeneral) * 100;
                $acumulado += $porcentaje;
                $categoria_abc = $acumulado <= 80 ? 'A' : ($acumulado <= 95 ? 'B' : 'C');
                $abc[] = [
                    'producto' => $item->producto->nombre ?? 'N/A',
                    'sku' => $item->producto->codigo_sku ?? 'N/A',
                    'ventas' => $item->total_vendido,
                    'recaudado' => $item->total_recaudado,
                    'clase' => $categoria_abc
                ];
            }
        }

        return inertia('Admin/Ecommerce/Dashboard', [
            'kpis' => [
                'valorizado_inventario' => $valorizado,
                'ventas_totales' => $ventasTotales,
                'ventas_credito' => $ventasCredito,
                'ventas_qr' => $ventasQr,
                'nuevos_usuarios_mes' => $nuevosUsuarios,
            ],
            'stockouts' => $stockouts,
            'ranking_abc' => $abc
        ]);
    }
}
