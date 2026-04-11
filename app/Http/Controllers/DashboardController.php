<?php

namespace App\Http\Controllers;

use App\Models\LibroDiario;
use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\User;
use App\Models\Caja;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Noticia;
use App\Models\CompraConvenio;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito');

        $desde = $request->query('desde') ? Carbon::parse($request->query('desde'))->startOfDay() : null;
        $hasta = $request->query('hasta') ? Carbon::parse($request->query('hasta'))->endOfDay() : null;

        if ($isAdmin) {
            // ==========================================
            // 1. ERP - FINANZAS Y CRÉDITOS
            // ==========================================
            try {
                // Colocación
                $qDesembolsados = Credito::where('estado', 'Desembolsado');
                $qDesembolsados->when($desde, fn($q) => $q->where('fecha_desembolso', '>=', $desde))
                               ->when($hasta, fn($q) => $q->where('fecha_desembolso', '<=', $hasta));
                $montoPrestado = $qDesembolsados->sum('monto_aprobado');
                
                // Recuperación en el periodo (Pagos registrados)
                $qRecuperado = PlanPago::where('estado', 'Pagada');
                $qRecuperado->when($desde, fn($q) => $q->where('fecha_pago_real', '>=', $desde))
                            ->when($hasta, fn($q) => $q->where('fecha_pago_real', '<=', $hasta));
                $capitalRecuperado = $qRecuperado->sum('capital_amortizado');

                // Morosidad Estricta (Solo cuotas puras vencidas)
                $capitalEnMora = PlanPago::where('estado', 'Retrasada')
                                         ->where('fecha_vencimiento', '<', Carbon::today())
                                         ->sum(DB::raw('capital_amortizado + interes_pagado'));

                // Exposición de Riesgo Global (Todo el saldo pendiente de créditos que tienen mora)
                $creditosEnMoraIds = PlanPago::where('estado', 'Retrasada')->where('fecha_vencimiento', '<', Carbon::today())->pluck('credito_id');
                $exposicionGlobalMora = Credito::whereIn('id', $creditosEnMoraIds)->sum('saldo_capital');

                // Resumen de la última Caja reportada (Caja Central)
                $ultimaCaja = Caja::latest('id')->first();
                $saldoCaja = $ultimaCaja ? $ultimaCaja->saldo_cierre ?? $ultimaCaja->saldo_apertura : 0;
                
                // Gráfico: Estado de Créditos Pie Chart
                $creditosEstados = Credito::select('estado', DB::raw('count(*) as count'))
                    ->when($desde, fn($q) => $q->where('created_at', '>=', $desde))
                    ->when($hasta, fn($q) => $q->where('created_at', '<=', $hasta))
                    ->groupBy('estado')
                    ->get()
                    ->pluck('count', 'estado')
                    ->toArray();

                // Volumen Convenios
                $qConvenios = CompraConvenio::query();
                $qConvenios->when($desde, fn($q) => $q->where('created_at', '>=', $desde))
                           ->when($hasta, fn($q) => $q->where('created_at', '<=', $hasta));
                $volumenConvenios = $qConvenios->sum('monto_total');
            } catch (\Exception $e) {
                // Fail-safe para tablas faltantes
                $montoPrestado = $capitalRecuperado = $capitalEnMora = $exposicionGlobalMora = $saldoCaja = $volumenConvenios = 0;
                $creditosEstados = [];
            }

            // ==========================================
            // 2. ECOMMERCE Y BENEFICIOS
            // ==========================================
            try {
                // Ventas Netas del eCommerce
                $qVentas = Pedido::where('estado_pago', 'pagado');
                $qVentas->when($desde, fn($q) => $q->where('created_at', '>=', $desde))
                        ->when($hasta, fn($q) => $q->where('created_at', '<=', $hasta));
                $ingresosEcommerce = $qVentas->sum('total');
                $totalPedidos = $qVentas->count();

                // Flujo Ventas Diarias
                $ventasPorDia = DB::table('pedidos')
                    ->where('estado_pago', 'pagado')
                    ->when($desde, fn($q) => $q->where('created_at', '>=', $desde))
                    ->when($hasta, fn($q) => $q->where('created_at', '<=', $hasta))
                    ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as sum'))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->take(15) // max 15 days view for cleanliness
                    ->get()
                    ->pluck('sum', 'date')
                    ->toArray();

                // Top Productos
                $topProductosObj = DB::table('pedido_detalles')
                    ->join('productos', 'pedido_detalles.producto_id', '=', 'productos.id')
                    ->select('productos.nombre', DB::raw('SUM(pedido_detalles.cantidad) as total_qty'))
                    ->when($desde, fn($q) => $q->where('pedido_detalles.created_at', '>=', $desde))
                    ->when($hasta, fn($q) => $q->where('pedido_detalles.created_at', '<=', $hasta))
                    ->groupBy('productos.id', 'productos.nombre')
                    ->orderByDesc('total_qty')
                    ->take(5)
                    ->get();
                
                $topProductos = [];
                foreach ($topProductosObj as $tp) {
                    $topProductos[$tp->nombre] = $tp->total_qty;
                }

                // Alerta Stock
                $productosSinStock = Producto::whereColumn('stock_actual', '<=', 'stock_minimo')->count();
            } catch (\Exception $e) {
                // Fail-safe para ecommerce
                $ingresosEcommerce = $totalPedidos = $productosSinStock = 0;
                $ventasPorDia = [];
                $topProductos = [];
            }

            // ==========================================
            // 3. INSTITUCIONAL Y PLATAFORMA
            // ==========================================
            try {
                // Usuarios / Socios
                $qNuevosUsers = User::query();
                $qNuevosUsers->when($desde, fn($q) => $q->where('created_at', '>=', $desde))
                             ->when($hasta, fn($q) => $q->where('created_at', '<=', $hasta));
                $nuevosUsuarios = $qNuevosUsers->count();
                $totalUsuarios = User::count();
                $totalNoticias = Noticia::count();

                // Desglose Demográfico para Gráficos
                $usuariosPorGradoObj = DB::table('users')
                    ->join('personas', 'users.persona_id', '=', 'personas.id')
                    ->select('personas.grado', DB::raw('count(*) as count'))
                    ->groupBy('personas.grado')
                    ->get();
                
                $usuariosPorGrado = [];
                foreach ($usuariosPorGradoObj as $g) {
                    $gt = $g->grado ?: 'Afiliaciones Base';
                    $usuariosPorGrado[$gt] = $g->count;
                }

                // Flujo Reciente General (Cross-activity)
                $ultimosMovimientos = LibroDiario::with('user:id,name,persona_id', 'user.persona:id,ci,grado')
                    ->orderBy('id', 'desc')->take(8)->get();
            } catch (\Exception $e) {
                // Fail-safe para institucional
                $nuevosUsuarios = $totalUsuarios = $totalNoticias = 0;
                $usuariosPorGrado = [];
                $ultimosMovimientos = collect([]);
            }

            return Inertia::render('Dashboard', [
                'metrics' => [
                    'tipo' => 'admin',
                    'erp' => [
                        'montoPrestado' => $montoPrestado,
                        'capitalRecuperado' => $capitalRecuperado,
                        'capitalEnMora' => $capitalEnMora,
                        'exposicionGlobalMora' => $exposicionGlobalMora,
                        'volumenConvenios' => $volumenConvenios,
                        'saldoCaja' => $saldoCaja,
                    ],
                    'ecommerce' => [
                        'ingresosTotales' => $ingresosEcommerce,
                        'totalPedidos' => $totalPedidos,
                        'alertasStock' => $productosSinStock,
                    ],
                    'institucional' => [
                        'totalUsuarios' => $totalUsuarios,
                        'nuevosUsuarios' => $nuevosUsuarios,
                        'totalNoticias' => $totalNoticias,
                    ],
                ],
                'charts' => [
                    'creditosEstados' => $creditosEstados,
                    'usuariosPorGrado' => $usuariosPorGrado,
                    'flujoVentas' => $ventasPorDia,
                    'topProductos' => $topProductos
                ],
                'actividadReciente' => $ultimosMovimientos,
                'filtros' => [
                    'desde' => $request->query('desde', ''),
                    'hasta' => $request->query('hasta', ''),
                ]
            ]);

        } else {
            // Socio (User) Metrics
            try {
                $miUltimoMovimiento = LibroDiario::where('user_id', $user->id)->orderBy('id', 'desc')->first();
                $miSaldo = $miUltimoMovimiento ? $miUltimoMovimiento->saldo : 0;

                $misPrestamos = Credito::where('user_id', $user->id)->whereIn('estado', ['Solicitado', 'Aprobado', 'Desembolsado'])->count();
                $misConvenios = CompraConvenio::where('user_id', $user->id)->count();
                
                $miActividad = LibroDiario::where('user_id', $user->id)->orderBy('id', 'desc')->take(5)->get();
            } catch (\Exception $e) {
                $miSaldo = $misPrestamos = $misConvenios = 0;
                $miActividad = collect([]);
            }

            return Inertia::render('Dashboard', [
                'metrics' => [
                    'miSaldo' => $miSaldo,
                    'misPrestamos' => $misPrestamos,
                    'misConvenios' => $misConvenios,
                    'tipo' => 'socio'
                ],
                'actividadReciente' => $miActividad
            ]);
        }
    }
}
