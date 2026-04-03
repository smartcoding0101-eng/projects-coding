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
            
            // Colocación
            $qDesembolsados = Credito::where('estado', 'Desembolsado');
            $qDesembolsados->when($desde, fn($q) => $q->where('fecha_desembolso', '>=', $desde))
                           ->when($hasta, fn($q) => $q->where('fecha_desembolso', '<=', $hasta));
            $montoPrestado = $qDesembolsados->sum('monto_aprobado');
            
            // Recuperación en el periodo (Pagos registrados)
            $qRecuperado = PlanPago::where('estado', 'Pagada');
            $qRecuperado->when($desde, fn($q) => $q->where('fecha_pago', '>=', $desde))
                        ->when($hasta, fn($q) => $q->where('fecha_pago', '<=', $hasta));
            $capitalRecuperado = $qRecuperado->sum('monto_amortizacion');

            // Morosidad Estricta (Cuotas Vencidas / Retrasadas en mora sin pagar aún)
            $capitalEnMora = PlanPago::where('estado', 'Retrasada')
                                     ->where('fecha_vencimiento', '<', Carbon::today())
                                     ->sum(DB::raw('monto_amortizacion + interes'));

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

            // ==========================================
            // 2. ECOMMERCE Y BENEFICIOS
            // ==========================================
            
            // Ventas Netas del eCommerce
            $qVentas = Pedido::whereIn('estado', ['pagado', 'entregado', 'despachado']);
            $qVentas->when($desde, fn($q) => $q->where('created_at', '>=', $desde))
                    ->when($hasta, fn($q) => $q->where('created_at', '<=', $hasta));
            $ingresosEcommerce = $qVentas->sum('total');
            $totalPedidos = $qVentas->count();

            // Alerta Stock
            $productosSinStock = Producto::whereColumn('stock_actual', '<=', 'stock_minimo')->count();

            // ==========================================
            // 3. INSTITUCIONAL Y PLATAFORMA
            // ==========================================
            
            // Usuarios / Socios
            $qNuevosUsers = User::query();
            $qNuevosUsers->when($desde, fn($q) => $q->where('created_at', '>=', $desde))
                         ->when($hasta, fn($q) => $q->where('created_at', '<=', $hasta));
            $nuevosUsuarios = $qNuevosUsers->count();
            $totalUsuarios = User::count();

            // Desglose Demográfico para Gráficos
            $usuariosPorGradoObj = DB::table('users')
                ->join('personas', 'users.persona_id', '=', 'personas.id')
                ->select('personas.grado', DB::raw('count(*) as count'))
                ->groupBy('personas.grado')
                ->get();
            
            $usuariosPorGrado = [];
            foreach ($usuariosPorGradoObj as $g) {
                $gt = $g->grado ?: 'Sin Grado';
                $usuariosPorGrado[$gt] = $g->count;
            }

            // Flujo Reciente General (Cross-activity)
            $ultimosMovimientos = LibroDiario::with('user:id,name,persona_id', 'user.persona:id,ci,grado')
                ->orderBy('id', 'desc')->take(8)->get();

            return Inertia::render('Dashboard', [
                'metrics' => [
                    'tipo' => 'admin',
                    'erp' => [
                        'montoPrestado' => $montoPrestado,
                        'capitalRecuperado' => $capitalRecuperado,
                        'capitalEnMora' => $capitalEnMora,
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
                        'totalNoticias' => Noticia::count(),
                    ],
                ],
                'charts' => [
                    'creditosEstados' => $creditosEstados,
                    'usuariosPorGrado' => $usuariosPorGrado
                ],
                'actividadReciente' => $ultimosMovimientos,
                'filtros' => [
                    'desde' => $request->query('desde', ''),
                    'hasta' => $request->query('hasta', ''),
                ]
            ]);

        } else {
            // Socio (User) Metrics
            $miUltimoMovimiento = LibroDiario::where('user_id', $user->id)->orderBy('id', 'desc')->first();
            $miSaldo = $miUltimoMovimiento ? $miUltimoMovimiento->saldo : 0;

            $misPrestamos = Credito::where('user_id', $user->id)->whereIn('estado', ['Solicitado', 'Aprobado', 'Desembolsado'])->count();
            $misConvenios = CompraConvenio::where('user_id', $user->id)->count();
            
            $miActividad = LibroDiario::where('user_id', $user->id)->orderBy('id', 'desc')->take(5)->get();

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
