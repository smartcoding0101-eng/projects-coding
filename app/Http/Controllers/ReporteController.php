<?php

namespace App\Http\Controllers;

use App\Models\Credito;
use App\Models\Kardex;
use App\Models\PlanPago;
use App\Models\User;
use App\Services\BoletaService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\LibroDiario;
use Illuminate\Support\Facades\DB;
use App\Exports\CarteraCreditosExport;
use App\Exports\MorosidadExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class ReporteController extends Controller
{
    /**
     * Panel principal de reportes.
     */
    public function index()
    {
        Gate::authorize('gestionar usuarios');

        return Inertia::render('Reportes/Index');
    }

    // ═══════════════════════════════════════════
    //  REPORTE 1: CARTERA DE CRÉDITOS
    // ═══════════════════════════════════════════

    public function cartera(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $tipoId = $request->input('tipo_id');
        $estado = $request->input('estado');
        $search = $request->input('search');
        $desde = $request->input('desde');
        $hasta = $request->input('hasta');

        $query = Credito::join('users', 'creditos.user_id', '=', 'users.id')
            ->join('personas', 'users.persona_id', '=', 'personas.id')
            ->with(['user.persona', 'tipoCredito'])
            ->select('creditos.*', 'users.name', 'personas.ci');

        if ($tipoId) {
            $query->where('creditos.tipo_credito_id', $tipoId);
        }

        if ($estado) {
            $query->where('creditos.estado', $estado);
        } else {
            $query->whereIn('creditos.estado', [
                Credito::ESTADO_DESEMBOLSADO,
                Credito::ESTADO_EN_MORA,
                Credito::ESTADO_PAGADO,
            ]);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('personas.ci', 'like', "%{$search}%");
            });
        }

        if ($desde) {
            $query->whereDate('creditos.fecha_desembolso', '>=', $desde);
        }

        if ($hasta) {
            $query->whereDate('creditos.fecha_desembolso', '<=', $hasta);
        }

        $creditosFiltrados = $query->orderBy('creditos.fecha_desembolso', 'desc')->get();

        $vigentes = $creditosFiltrados->where('estado', Credito::ESTADO_DESEMBOLSADO);
        $enMora = $creditosFiltrados->where('estado', Credito::ESTADO_EN_MORA);
        $pagados = $creditosFiltrados->where('estado', Credito::ESTADO_PAGADO);

        $data = [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'filtros' => [
                'tipo_id' => $tipoId,
                'estado' => $estado,
                'search' => $search,
                'desde' => $desde,
                'hasta' => $hasta,
            ],
            'resumen' => [
                'total_creditos' => (int) $creditosFiltrados->count(),
                'vigentes' => (int) $vigentes->count(),
                'en_mora' => (int) $enMora->count(),
                'pagados' => (int) $pagados->count(),
                'monto_vigente' => (float) $vigentes->sum('saldo_capital'),
                'monto_mora' => (float) $enMora->sum('saldo_capital'),
                'monto_total_otorgado' => (float) $creditosFiltrados->sum('monto_aprobado'),
            ],
            'creditos' => $creditosFiltrados->map(fn($c) => [
                'id' => $c->id,
                'socio' => $c->user->name,
                'ci' => $c->user->ci ?? 'N/D',
                'grado' => $c->user->grado ?? '',
                'tipo' => $c->tipoCredito?->nombre ?? 'General',
                'monto_aprobado' => (float) $c->monto_aprobado,
                'saldo_capital' => (float) $c->saldo_capital,
                'tasa' => (float) $c->tasa_interes,
                'plazo' => (int) $c->plazo_meses,
                'estado' => $c->estado,
                'fecha_desembolso' => $c->fecha_desembolso?->format('d/m/Y'),
            ])->values(),
            'tipos_credito' => \App\Models\TipoCredito::select('id', 'nombre')->get(),
        ];

        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.cartera', $data)->setPaper('letter', 'landscape');
            return $pdf->download('reporte_cartera_' . now()->format('Ymd') . '.pdf');
        }

        if ($request->query('formato') === 'xlsx') {
            return Excel::download(new CarteraCreditosExport($data), 'cartera_creditos_' . now()->format('Ymd') . '.xlsx');
        }

        if ($request->query('formato') === 'csv') {
            return $this->exportCsv($data['creditos']->toArray(), 'cartera_creditos');
        }

        return Inertia::render('Reportes/Cartera', $data);
    }

    // ═══════════════════════════════════════════
    //  REPORTE 2: MOROSIDAD
    // ═══════════════════════════════════════════

    public function morosidad(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $minDias = $request->input('min_dias');
        $maxDias = $request->input('max_dias');
        $tipoId = $request->input('tipo_id');
        $search = $request->input('search');

        $query = PlanPago::where('plan_pagos.estado', PlanPago::ESTADO_RETRASADA)
            ->join('creditos', 'plan_pagos.credito_id', '=', 'creditos.id')
            ->join('users', 'creditos.user_id', '=', 'users.id')
            ->join('personas', 'users.persona_id', '=', 'personas.id')
            ->with(['credito.user.persona', 'credito.tipoCredito'])
            ->select('plan_pagos.*', 'creditos.tipo_credito_id', 'users.name', 'personas.ci');

        if ($tipoId) {
            $query->where('creditos.tipo_credito_id', $tipoId);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('personas.ci', 'like', "%{$search}%");
            });
        }

        $cuotasFiltradas = $query->orderBy('plan_pagos.fecha_vencimiento')->get();

        // Aplicar filtro de días de mora en PHP para mayor flexibilidad con Carbon
        if ($minDias !== null || $maxDias !== null) {
            $cuotasFiltradas = $cuotasFiltradas->filter(function($c) use ($minDias, $maxDias) {
                $dias = $c->fecha_vencimiento ? (int) Carbon::parse($c->fecha_vencimiento)->diffInDays(now(), false) : 0;
                
                if ($minDias !== null && $dias < $minDias) return false;
                if ($maxDias !== null && $dias > $maxDias) return false;
                
                return true;
            });
        }

        $data = [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'filtros' => [
                'min_dias' => $minDias,
                'max_dias' => $maxDias,
                'tipo_id' => $tipoId,
                'search' => $search
            ],
            'resumen' => [
                'total_cuotas_atrasadas' => (int) $cuotasFiltradas->count(),
                'total_capital_moroso' => (float) $cuotasFiltradas->sum('capital_amortizado'),
                'total_mora_acumulada' => (float) $cuotasFiltradas->sum('monto_mora'),
                'socios_afectados' => (int) $cuotasFiltradas->pluck('credito.user_id')->unique()->count(),
            ],
            'cuotas' => $cuotasFiltradas->map(fn($c) => [
                'credito_id' => $c->credito_id,
                'socio' => $c->credito->user?->name ?? 'N/D',
                'ci' => $c->credito->user?->ci ?? 'N/D',
                'grado' => $c->credito->user?->grado ?? '',
                'tipo_credito' => $c->credito->tipoCredito?->nombre ?? 'General',
                'nro_cuota' => (int) $c->nro_cuota,
                'fecha_vencimiento' => $c->fecha_vencimiento?->format('d/m/Y'),
                'dias_mora' => $c->fecha_vencimiento ? (int) Carbon::parse($c->fecha_vencimiento)->diffInDays(now()) : 0,
                'capital' => (float) $c->capital_amortizado,
                'interes' => (float) $c->interes_pagado,
                'mora' => (float) $c->monto_mora,
                'total' => (float) ($c->cuota_total + $c->monto_mora),
            ])->values(),
            'tipos_credito' => \App\Models\TipoCredito::select('id', 'nombre')->get(),
        ];

        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.morosidad', $data)->setPaper('letter', 'landscape');
            return $pdf->download('reporte_morosidad_' . now()->format('Ymd') . '.pdf');
        }

        if ($request->query('formato') === 'xlsx') {
            return Excel::download(new MorosidadExport($data), 'morosidad_' . now()->format('Ymd') . '.xlsx');
        }

        if ($request->query('formato') === 'csv') {
            return $this->exportCsv($data['cuotas']->toArray(), 'morosidad');
        }

        return Inertia::render('Reportes/Morosidad', $data);
    }

    // ═══════════════════════════════════════════
    //  REPORTE 3: ESTADO DE CUENTA DEL SOCIO
    // ═══════════════════════════════════════════

    public function estadoCuenta(Request $request)
    {
        $user = $request->user();
        $socioId = $request->input('socio_id');
        
        // Sanitizar socioId: si es literal 'undefined', ignorar para evitar el 404
        if ($socioId === 'undefined') {
            $socioId = null;
        }

        $isAdmin = $user->hasAnyRole(['SuperAdmin', 'Oficial Crédito']);

        if ($socioId && $isAdmin) {
            $socio = User::findOrFail($socioId);
        } else {
            $socio = $user;
        }

        $desde = $request->input('desde');
        $hasta = $request->input('hasta');

        $creditos = Credito::where('user_id', $socio->id)
            ->with(['tipoCredito', 'planPagos'])
            ->get();

        $queryMovimientos = Kardex::where('user_id', $socio->id)
            ->orderBy('id', 'desc');
        
        if ($desde && $hasta) {
            $queryMovimientos->whereBetween('fecha', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);
        } else {
            $queryMovimientos->limit(50);
        }

        $movimientos = $queryMovimientos->get();

        $data = [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'filtros' => [
                'desde' => $desde,
                'hasta' => $hasta,
                'socio_id' => $socioId
            ],
            'socio' => [
                'id' => $socio->id,
                'nombre' => $socio->name,
                'ci' => $socio->ci ?? 'N/D',
                'grado' => $socio->grado ?? 'N/D',
                'destino' => $socio->destino ?? 'N/D',
                'escalafon' => $socio->escalafon ?? 'N/D',
            ],
            'resumen' => [
                'saldo_kardex' => Kardex::where('user_id', $socio->id)->orderBy('id', 'desc')->value('saldo_acumulado') ?? 0,
                'creditos_activos' => $creditos->whereIn('estado', [Credito::ESTADO_DESEMBOLSADO, Credito::ESTADO_EN_MORA])->count(),
                'deuda_total' => $creditos->whereIn('estado', [Credito::ESTADO_DESEMBOLSADO, Credito::ESTADO_EN_MORA])->sum('saldo_capital'),
                'total_pagado' => $creditos->sum(fn($c) => $c->planPagos->where('estado', 'Pagada')->sum('cuota_total')),
            ],
            'creditos' => $creditos->map(fn($c) => [
                'id' => $c->id,
                'tipo' => $c->tipoCredito?->nombre ?? 'General',
                'monto_aprobado' => $c->monto_aprobado,
                'saldo_capital' => $c->saldo_capital,
                'estado' => $c->estado,
                'plazo' => $c->plazo_meses,
                'cuotas_pagadas' => $c->planPagos->where('estado', 'Pagada')->count(),
                'cuotas_pendientes' => $c->planPagos->whereIn('estado', ['Pendiente', 'Retrasada'])->count(),
            ])->values(),
            'movimientos' => $movimientos->map(fn($m) => [
                'fecha' => $m->fecha ? \Carbon\Carbon::parse($m->fecha)->format('d/m/Y') : 'N/D',
                'tipo' => Kardex::etiquetasTipo()[$m->tipo_movimiento] ?? $m->tipo_movimiento,
                'concepto' => $m->conceptosExport()[$m->concepto] ?? $m->concepto, 
                'ingreso' => (float) $m->ingreso,
                'egreso' => (float) $m->egreso,
                'saldo' => (float) $m->saldo_acumulado,
            ])->values(),
            'socios' => $isAdmin ? User::select('id', 'name')->orderBy('name')->get() : [],
        ];

        // Exportación PDF
        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.estado-cuenta', $data)->setPaper('letter');
            return $pdf->download('estado_cuenta_' . $socio->ci . '_' . now()->format('Ymd') . '.pdf');
        }

        // Exportación EXCEL
        if ($request->query('formato') === 'xlsx') {
            return Excel::download(new \App\Exports\EstadoCuentaExport($data), 'estado_cuenta_' . $socio->ci . '.xlsx');
        }

        return Inertia::render('Reportes/EstadoCuenta', $data);
    }

    // ═══════════════════════════════════════════
    //  REPORTE 4: PLANILLA DE DESCUENTO
    // ═══════════════════════════════════════════

    public function planilla(Request $request, BoletaService $boleta)
    {
        Gate::authorize('gestionar usuarios');

        $mesAnio = $request->input('mes', now()->format('Y-m'));
        $data = $boleta->generarPlanillaDescuento($mesAnio);

        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.planilla', $data)->setPaper('letter', 'landscape');
            return $pdf->download('planilla_descuento_' . str_replace('-', '', $mesAnio) . '.pdf');
        }

        if ($request->query('formato') === 'csv') {
            return $this->exportCsv($data['items'], 'planilla_descuento');
        }

        return Inertia::render('Reportes/Planilla', $data);
    }

    // ═══════════════════════════════════════════
    //  REPORTE 5: HISTÓRICO DE CRÉDITO (Buro)
    // ═══════════════════════════════════════════
    public function historico(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $socioId = $request->input('socio_id');
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        $socio = null;
        $creditos = collect();
        $pagosHistoricos = collect();

        if ($socioId) {
            $socio = User::findOrFail($socioId);
            $creditosQuery = Credito::where('user_id', $socio->id)->with('tipoCredito');
            
            if ($fechaInicio && $fechaFin) {
                $creditosQuery->whereBetween('created_at', [$fechaInicio, Carbon::parse($fechaFin)->endOfDay()]);
            }
            $creditos = $creditosQuery->get();

            $pagosQuery = PlanPago::whereHas('credito', function($q) use ($socioId) {
                $q->where('user_id', $socioId);
            })->whereIn('estado', [PlanPago::ESTADO_PAGADA, PlanPago::ESTADO_RETRASADA]);

            if ($fechaInicio && $fechaFin) {
                $pagosQuery->whereBetween('fecha_pago_real', [$fechaInicio, Carbon::parse($fechaFin)->endOfDay()]);
            }
            $pagosHistoricos = $pagosQuery->orderBy('fecha_vencimiento', 'desc')->get();
        }

        $data = [
            'socios_catalogo' => User::with('persona:id,ci,grado')->select('id', 'name', 'persona_id')->orderBy('name')->get()
                ->map(fn($u) => ['id' => $u->id, 'name' => $u->name, 'ci' => $u->ci, 'grado' => $u->grado]),
            'socio_seleccionado' => $socio,
            'metricas' => $socio ? [
                'creditos_totales' => $creditos->count(),
                'monto_total_aprobado' => $creditos->sum('monto_aprobado'),
                'cuotas_mora_historicas' => $pagosHistoricos->where('estado', PlanPago::ESTADO_RETRASADA)->count(),
                'capital_pagado_total' => $pagosHistoricos->sum('capital_amortizado'),
            ] : null,
            'historial_creditos' => $creditos,
            'historial_pagos' => $pagosHistoricos->map(function($p) {
                return [
                    'id' => $p->id,
                    'credito' => 'Crédito #' . $p->credito_id,
                    'cuota' => $p->nro_cuota,
                    'vencimiento' => Carbon::parse($p->fecha_vencimiento)->format('Y-m-d'),
                    'fecha_pago' => $p->fecha_pago_real ? Carbon::parse($p->fecha_pago_real)->format('Y-m-d') : null,
                    'total' => $p->cuota_total,
                    'mora' => $p->monto_mora,
                    'estado' => $p->estado,
                ];
            }),
            'filtros' => compact('fechaInicio', 'fechaFin', 'socioId')
        ];

        if ($request->query('formato') === 'pdf' && $socio) {
            $pdf = Pdf::loadView('reportes.historico-pdf', $data)->setPaper('letter');
            return $pdf->download('historico_credito_' . ($socio->ci ?? $socio->id) . '.pdf');
        }

        if ($request->query('formato') === 'xlsx' && $socio) {
            $exportData = $pagosHistoricos->map(fn($p) => [
                'Socio' => $socio->name,
                'Crédito' => '#' . $p->credito_id,
                'Cuota' => $p->nro_cuota,
                'Vencimiento' => $p->fecha_vencimiento->format('d/m/Y'),
                'Fecha Pago' => $p->fecha_pago_real?->format('d/m/Y') ?? 'Pendiente',
                'Monto Cuota' => $p->cuota_total,
                'Mora' => $p->monto_mora,
                'Estado' => $p->estado,
            ])->toArray();
            return $this->exportCsv($exportData, 'historico_creditos_' . $socio->ci);
        }

        return Inertia::render('Reportes/Historico', $data);
    }

    /**
     * REPORTE 6: RECAUDACIÓN Y COLOCACIÓN
     */
    public function recaudacion(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $desde = $request->input('desde', now()->startOfMonth()->toDateString());
        $hasta = $request->input('hasta', now()->toDateString());

        // 1. RECAUDACIÓN: Pagos realizados en el periodo
        $pagos = PlanPago::with('credito.user.persona')
            ->where('estado', PlanPago::ESTADO_PAGADA)
            ->whereBetween('fecha_pago_real', [$desde, Carbon::parse($hasta)->endOfDay()])
            ->get();

        $totalRecaudado = (float)$pagos->sum('cuota_total');
        $capitalRecaudado = (float)$pagos->sum('capital_amortizado');
        $interesRecaudado = (float)$pagos->sum('interes_pagado');
        $moraRecaudada = (float)$pagos->sum('monto_mora');

        // 2. COLOCACIÓN: Créditos desembolsados en el periodo
        $colocaciones = Credito::with('user.persona', 'tipoCredito')
            ->where('estado', Credito::ESTADO_DESEMBOLSADO)
            ->whereBetween('fecha_desembolso', [$desde, $hasta])
            ->get();

        $totalColocado = (float)$colocaciones->sum('monto_aprobado');

        // 3. DATOS PARA GRÁFICOS (Últimos 6 meses de tendencia)
        $grafico = [];
        for ($i = 5; $i >= 0; $i--) {
            $mes = now()->subMonths($i);
            $inicioMes = $mes->copy()->startOfMonth();
            $finMes = $mes->copy()->endOfMonth();

            $recaudadoMes = PlanPago::where('estado', PlanPago::ESTADO_PAGADA)
                ->whereBetween('fecha_pago_real', [$inicioMes, $finMes])
                ->sum('cuota_total');
            
            $colocadoMes = Credito::where('estado', Credito::ESTADO_DESEMBOLSADO)
                ->whereBetween('fecha_desembolso', [$inicioMes, $finMes])
                ->sum('monto_aprobado');

            $grafico[] = [
                'name' => ucfirst($mes->translatedFormat('M')),
                'recaudado' => (float)$recaudadoMes,
                'colocado' => (float)$colocadoMes
            ];
        }

        $data = [
            'filtros' => [
                'desde' => $desde,
                'hasta' => $hasta
            ],
            'resumen' => [
                'total_recaudado' => $totalRecaudado,
                'capital' => $capitalRecaudado,
                'interes' => $interesRecaudado,
                'mora' => $moraRecaudada,
                'total_colocado' => $totalColocado,
                'recuperacion_ratio' => $totalColocado > 0 ? round(($totalRecaudado / $totalColocado) * 100, 1) : 100
            ],
            'detalle_pagos' => $pagos->map(fn($p) => [
                'id' => $p->id,
                'fecha' => $p->fecha_pago_real?->format('d/m/Y'),
                'socio' => $p->credito->user->name,
                'credito_id' => $p->credito_id,
                'cuota' => $p->nro_cuota,
                'total' => (float)$p->cuota_total,
                'capital' => (float)$p->capital_amortizado,
                'interes' => (float)$p->interes_pagado,
                'metodo' => $p->metodo_pago ?? 'Caja'
            ]),
            'detalle_colocaciones' => $colocaciones->map(fn($c) => [
                'id' => $c->id,
                'fecha' => $c->fecha_desembolso?->format('d/m/Y'),
                'socio' => $c->user->name,
                'tipo' => $c->tipoCredito->nombre ?? 'General',
                'monto' => (float)$c->monto_aprobado,
                'tasa' => (float)$c->tasa_interes . '%'
            ]),
            'grafico' => $grafico,
            'fecha_reporte' => now()->format('d/m/Y H:i')
        ];

        // 4. EXPORTACIÓN
        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.recaudacion-pdf', $data)->setPaper('letter', 'landscape');
            return $pdf->download('recaudacion_' . str_replace('-', '', $desde) . '.pdf');
        }

        if ($request->query('formato') === 'xlsx') {
            // Asumimos que existirá la clase RecaudacionExport
            return Excel::download(new \App\Exports\RecaudacionExport($data), 'recaudacion_' . str_replace('-', '', $desde) . '.xlsx');
        }

        return Inertia::render('Reportes/Recaudacion', $data);
    }

    // ═══════════════════════════════════════════
    //  REPORTE 7: RENDIMIENTO E-COMMERCE
    /**
     * REPORTE 7: RENDIMIENTO E-COMMERCE (DINÁMICO)
     */
    public function ecommerce(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $desde = $request->input('desde', now()->startOfMonth()->toDateString());
        $hasta = $request->input('hasta', now()->toDateString());
        $estadoPago = $request->input('estado_pago');

        // 1. FILTROS Y QUERIES BASE
        $queryPedidos = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);

        if ($estadoPago) {
            $queryPedidos->where('estado_pago', $estadoPago);
        }

        // 2. KPIs DINÁMICOS
        $ventasPeriodo = (float)$queryPedidos->where('estado_pago', 'pagado')->sum('total');
        $pedidosTotal = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->count();
        
        $ticketPromedio = $pedidosTotal > 0 ? ($ventasPeriodo / $pedidosTotal) : 0;

        $valorizado = DB::table('productos')
            ->where('activo', true)
            ->sum(DB::raw('stock_actual * precio_general'));

        // 3. DETALLE DE TRANSACCIONES RECIENTES
        $recientes = DB::table('pedidos')
            ->select('id', 'numero_orden', 'nombre_cliente', 'tipo_pago', 'estado_pago', 'total', 'created_at')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->orderByDesc('created_at')
            ->limit(15)
            ->get();

        // 4. TOP PRODUCTOS (DINÁMICO)
        $top_productos = DB::table('pedido_detalles')
            ->join('productos', 'pedido_detalles.producto_id', '=', 'productos.id')
            ->join('pedidos', 'pedido_detalles.pedido_id', '=', 'pedidos.id')
            ->whereBetween('pedidos.created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->where('pedidos.estado_pago', 'pagado')
            ->select('productos.nombre', DB::raw('SUM(pedido_detalles.cantidad) as total_vendido'), DB::raw('SUM(pedido_detalles.subtotal) as recaudado'))
            ->groupBy('productos.id', 'productos.nombre')
            ->orderByDesc('recaudado')
            ->limit(5)
            ->get();

        // 5. COMPOSICIÓN DE VENTAS
        $ventas_data = DB::table('pedidos')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->where('estado_pago', 'pagado')
            ->select('tipo_pago', DB::raw('SUM(total) as total'))
            ->groupBy('tipo_pago')
            ->get();

        // 6. TENDENCIA DINÁMICA (Últimos 6 periodos)
        $meses = [];
        $ventas_mensuales = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $meses[] = ucfirst($date->translatedFormat('M'));
            $ventas_mensuales[] = (float)DB::table('pedidos')
                ->where('estado_pago', 'pagado')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total');
        }

        $data = [
            'filtros' => [
                'desde' => $desde,
                'hasta' => $hasta,
                'estado_pago' => $estadoPago
            ],
            'kpis' => [
                'stock_valorizado' => $valorizado,
                'ventas_periodo' => $ventasPeriodo,
                'pedidos_total' => $pedidosTotal,
                'ticket_promedio' => $ticketPromedio,
                'usuarios_activos' => DB::table('users')->count(),
            ],
            'recientes' => $recientes->map(fn($p) => [
                'id' => $p->id,
                'orden' => $p->numero_orden,
                'cliente' => $p->nombre_cliente,
                'metodo' => $p->tipo_pago,
                'estado' => $p->estado_pago,
                'total' => (float)$p->total,
                'fecha' => Carbon::parse($p->created_at)->format('d/m/Y H:i')
            ]),
            'chart_labels' => $meses,
            'chart_data' => $ventas_mensuales,
            'top_productos' => $top_productos,
            'ventas_por_tipo' => $ventas_data,
            'fecha_reporte' => now()->format('d/m/Y H:i')
        ];

        // 7. EXPORTACIÓN
        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.ecommerce-pdf', $data)->setPaper('letter', 'portrait');
            return $pdf->download('ecommerce_' . str_replace('-', '', $desde) . '.pdf');
        }

        if ($request->query('formato') === 'xlsx') {
            return Excel::download(new \App\Exports\EcommerceExport($data), 'ecommerce_' . str_replace('-', '', $desde) . '.xlsx');
        }

        return Inertia::render('Reportes/Ecommerce', $data);
    }

    /**
     * REPORTE 8: CAJA GENERAL (LIBRO DE CAJA)
     */
    public function caja(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $desde = $request->input('desde', now()->startOfMonth()->toDateString());
        $hasta = $request->input('hasta', now()->toDateString());
        $cajeroId = $request->input('cajero_id');

        // 1. Calcular Saldo Inicial (acumulado antes de la fecha 'desde')
        $saldoInicialQuery = DB::table('libro_diarios')
            ->where('fecha', '<', $desde);
        
        if ($cajeroId) {
            $saldoInicialQuery->where('cajero_id', $cajeroId);
        }

        $saldoInicial = $saldoInicialQuery->sum(DB::raw('ingreso - egreso'));

        // 2. Obtener movimientos del periodo
        $query = LibroDiario::with(['user:id,name,persona_id', 'user.persona:id,ci,grado', 'cajero:id,name'])
            ->whereBetween('fecha', [$desde, $hasta])
            ->orderBy('fecha', 'asc')
            ->orderBy('id', 'asc');

        if ($cajeroId) {
            $query->where('cajero_id', $cajeroId);
        }

        $movimientos = $query->get();

        // 3. Calcular Saldos Reales (Running Balance)
        $acumulado = $saldoInicial;
        $dataReporte = [];
        $totalIngresos = 0;
        $totalEgresos = 0;

        foreach ($movimientos as $m) {
            $acumulado += ($m->ingreso - $m->egreso);
            $totalIngresos += $m->ingreso;
            $totalEgresos += $m->egreso;
            
            $dataReporte[] = [
                'id' => $m->id,
                'fecha' => $m->fecha?->format('d/m/Y'),
                'concepto' => $m->concepto,
                'socio' => $m->user->name ?? 'INSTITUCIONAL',
                'cajero' => $m->cajero->name ?? 'SISTEMA',
                'ingreso' => (float)$m->ingreso,
                'egreso' => (float)$m->egreso,
                'saldo' => round($acumulado, 2),
                'tipo' => $m->tipo_transaccion
            ];
        }

        // 4. Datos para el Gráfico (Flujo por día)
        $flujoDias = DB::table('libro_diarios')
            ->select('fecha', DB::raw('SUM(ingreso) as total_ingreso'), DB::raw('SUM(egreso) as total_egreso'))
            ->whereBetween('fecha', [$desde, $hasta]);
        
        if ($cajeroId) {
            $flujoDias->where('cajero_id', $cajeroId);
        }

        $graficoData = $flujoDias->groupBy('fecha')
            ->orderBy('fecha', 'asc')
            ->get();

        // 5. Soporte para Exportación (PDF / Excel)
        if ($request->query('formato') === 'pdf') {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reportes.caja', [
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'filtros' => [
                    'desde' => Carbon::parse($desde)->format('d/m/Y'),
                    'hasta' => Carbon::parse($hasta)->format('d/m/Y'),
                    'cajero' => $cajeroId ? User::find($cajeroId)?->name : null
                ],
                'resumen' => [
                    'saldo_inicial' => (float)$saldoInicial,
                    'total_ingresos' => (float)$totalIngresos,
                    'total_egresos' => (float)$totalEgresos,
                    'saldo_final' => round($acumulado, 2),
                ],
                'movimientos' => $dataReporte
            ])->setPaper('letter', 'landscape');

            return $pdf->download('libro_caja_' . str_replace('-', '', $desde) . '_' . str_replace('-', '', $hasta) . '.pdf');
        }

        if ($request->query('formato') === 'xlsx') {
            return \Maatwebsite\Excel\Facades\Excel::download(
                new \App\Exports\CajaGeneralExport($desde, $hasta, $cajeroId),
                'libro_caja_' . str_replace('-', '', $desde) . '.xlsx'
            );
        }

        return Inertia::render('Reportes/Caja', [
            'filtros' => [
                'desde' => $desde,
                'hasta' => $hasta,
                'cajero_id' => $cajeroId
            ],
            'resumen' => [
                'saldo_inicial' => (float)$saldoInicial,
                'total_ingresos' => (float)$totalIngresos,
                'total_egresos' => (float)$totalEgresos,
                'saldo_final' => round($acumulado, 2),
            ],
            'movimientos' => $dataReporte,
            'grafico' => $graficoData,
            'cajeros' => User::whereHas('roles', function($q){
                $q->whereIn('name', ['admin', 'super-admin', 'cajero']);
            })->select('id', 'name')->get()
        ]);
    }

    // ═══════════════════════════════════════════
    //  HELPER: Export CSV
    // ═══════════════════════════════════════════

    /**
     * REPORTE 9: CONCILIACIÓN E-COMMERCE (PAGADOS VS NO ENTREGADOS)
     * Triangulación Financiera vs Inventarios
     */
    public function conciliacionEcommerce(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $desde = $request->input('desde', now()->startOfMonth()->toDateString());
        $hasta = $request->input('hasta', now()->toDateString());
        $estadoEntrega = $request->input('estado_entrega', 'por_recoger');

        // 1. Pedidos Pagados filtrados por fecha y estado
        $queryPendientes = \App\Models\Pedido::with('detalles.producto', 'user')
            ->where('estado_pago', 'pagado')
            ->whereBetween('created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);

        if ($estadoEntrega !== 'todos') {
            $queryPendientes->where('estado_entrega', $estadoEntrega);
        }

        $pendientes = $queryPendientes->orderBy('created_at', 'asc')->get();

        // 2. Resumen de Productos Retenidos/Comprometidos
        $queryProductos = DB::table('pedido_detalles')
            ->join('pedidos', 'pedido_detalles.pedido_id', '=', 'pedidos.id')
            ->join('productos', 'pedido_detalles.producto_id', '=', 'productos.id')
            ->where('pedidos.estado_pago', 'pagado')
            ->whereBetween('pedidos.created_at', [$desde . ' 00:00:00', $hasta . ' 23:59:59']);

        if ($estadoEntrega !== 'todos') {
            $queryProductos->where('pedidos.estado_entrega', $estadoEntrega);
        }

        $productosRetenidos = $queryProductos->select(
            'productos.nombre',
            'productos.codigo_sku',
            DB::raw('SUM(pedido_detalles.cantidad) as total_unidades'),
            DB::raw('SUM(pedido_detalles.subtotal) as valor_reservado')
        )
        ->groupBy('productos.id', 'productos.nombre', 'productos.codigo_sku')
        ->get();

        return Inertia::render('Reportes/ConciliacionEcommerce', [
            'pendientes' => $pendientes,
            'resumen' => [
                'total_pedidos_retenidos' => $pendientes->count(),
                'monto_total_retenido' => $pendientes->sum('total'),
                'unidades_totales_pendientes' => $productosRetenidos->sum('total_unidades'),
                'fecha_corte' => now()->format('d/m/Y H:i'),
            ],
            'productos' => $productosRetenidos,
            'filtros' => [
                'desde' => $desde,
                'hasta' => $hasta,
                'estado_entrega' => $estadoEntrega
            ]
        ]);
    }

    private function exportCsv(array $datos, string $nombre): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        if (empty($datos)) {
            return Response::streamDownload(function () {
                echo "Sin datos para exportar\n";
            }, $nombre . '.csv');
        }

        $headers = array_keys($datos[0]);

        return Response::streamDownload(function () use ($datos, $headers) {
            $out = fopen('php://output', 'w');
            // BOM para Excel UTF-8
            fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($out, $headers, ';');
            foreach ($datos as $row) {
                fputcsv($out, array_values($row), ';');
            }
            fclose($out);
        }, $nombre . '_' . now()->format('Ymd') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
