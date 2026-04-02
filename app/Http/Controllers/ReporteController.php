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

        $creditos = Credito::with('user', 'tipoCredito')
            ->whereIn('estado', [
                Credito::ESTADO_DESEMBOLSADO,
                Credito::ESTADO_EN_MORA,
                Credito::ESTADO_PAGADO,
            ])
            ->get();

        $vigentes = $creditos->where('estado', Credito::ESTADO_DESEMBOLSADO);
        $enMora = $creditos->where('estado', Credito::ESTADO_EN_MORA);
        $pagados = $creditos->where('estado', Credito::ESTADO_PAGADO);

        $data = [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'resumen' => [
                'total_creditos' => $creditos->count(),
                'vigentes' => $vigentes->count(),
                'en_mora' => $enMora->count(),
                'pagados' => $pagados->count(),
                'monto_vigente' => $vigentes->sum('saldo_capital'),
                'monto_mora' => $enMora->sum('saldo_capital'),
                'monto_total_otorgado' => $creditos->sum('monto_aprobado'),
            ],
            'creditos' => $creditos->map(fn($c) => [
                'id' => $c->id,
                'socio' => $c->user->name,
                'ci' => $c->user->ci ?? 'N/D',
                'grado' => $c->user->grado ?? '',
                'tipo' => $c->tipoCredito?->nombre ?? 'General',
                'monto_aprobado' => $c->monto_aprobado,
                'saldo_capital' => $c->saldo_capital,
                'tasa' => $c->tasa_interes,
                'plazo' => $c->plazo_meses,
                'estado' => $c->estado,
                'fecha_desembolso' => $c->fecha_desembolso?->format('d/m/Y'),
            ])->values(),
        ];

        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.cartera', $data)->setPaper('letter', 'landscape');
            return $pdf->download('reporte_cartera_' . now()->format('Ymd') . '.pdf');
        }

        if ($request->query('formato') === 'xlsx') {
            return Excel::download(new CarteraCreditosExport, 'cartera_creditos_' . now()->format('Ymd') . '.xlsx');
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

        $cuotasAtrasadas = PlanPago::where('estado', PlanPago::ESTADO_RETRASADA)
            ->with('credito.user', 'credito.tipoCredito')
            ->orderBy('fecha_vencimiento')
            ->get();

        $data = [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'resumen' => [
                'total_cuotas_atrasadas' => $cuotasAtrasadas->count(),
                'total_capital_moroso' => $cuotasAtrasadas->sum('capital_amortizado'),
                'total_mora_acumulada' => $cuotasAtrasadas->sum('monto_mora'),
                'socios_afectados' => $cuotasAtrasadas->pluck('credito.user_id')->unique()->count(),
            ],
            'cuotas' => $cuotasAtrasadas->map(fn($c) => [
                'credito_id' => $c->credito_id,
                'socio' => $c->credito->user->name,
                'ci' => $c->credito->user->ci ?? 'N/D',
                'grado' => $c->credito->user->grado ?? '',
                'tipo_credito' => $c->credito->tipoCredito?->nombre ?? 'General',
                'nro_cuota' => $c->nro_cuota,
                'fecha_vencimiento' => $c->fecha_vencimiento?->format('d/m/Y'),
                'dias_mora' => $c->fecha_vencimiento ? Carbon::parse($c->fecha_vencimiento)->diffInDays(now()) : 0,
                'capital' => $c->capital_amortizado,
                'interes' => $c->interes_pagado,
                'mora' => $c->monto_mora,
                'total' => $c->cuota_total + $c->monto_mora,
            ])->values(),
        ];

        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.morosidad', $data)->setPaper('letter', 'landscape');
            return $pdf->download('reporte_morosidad_' . now()->format('Ymd') . '.pdf');
        }

        if ($request->query('formato') === 'xlsx') {
            return Excel::download(new MorosidadExport, 'morosidad_' . now()->format('Ymd') . '.xlsx');
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
        $isAdmin = $user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito');

        if ($socioId && $isAdmin) {
            $socio = User::findOrFail($socioId);
        } else {
            $socio = $user;
        }

        $creditos = Credito::where('user_id', $socio->id)
            ->with('tipoCredito', 'planPagos')
            ->get();

        $movimientos = Kardex::where('user_id', $socio->id)
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get();

        $data = [
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'socio' => [
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
                'fecha' => $m->fecha?->format('d/m/Y'),
                'tipo' => Kardex::etiquetasTipo()[$m->tipo_movimiento] ?? $m->tipo_movimiento,
                'concepto' => $m->concepto,
                'ingreso' => $m->ingreso,
                'egreso' => $m->egreso,
                'saldo' => $m->saldo_acumulado,
            ])->values(),
            'socios' => $isAdmin ? User::select('id', 'name', 'ci', 'grado')->orderBy('name')->get() : [],
        ];

        if ($request->query('formato') === 'pdf') {
            $pdf = Pdf::loadView('reportes.estado-cuenta', $data)->setPaper('letter');
            return $pdf->download('estado_cuenta_' . $socio->ci . '_' . now()->format('Ymd') . '.pdf');
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
                $pagosQuery->whereBetween('fecha_pago', [$fechaInicio, Carbon::parse($fechaFin)->endOfDay()]);
            }
            $pagosHistoricos = $pagosQuery->orderBy('fecha_vencimiento', 'desc')->get();
        }

        $data = [
            'socios_catalogo' => User::select('id', 'name', 'ci', 'grado')->orderBy('name')->get(),
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
                    'fecha_pago' => $p->fecha_pago ? Carbon::parse($p->fecha_pago)->format('Y-m-d') : null,
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
                'Fecha Pago' => $p->fecha_pago?->format('d/m/Y') ?? 'Pendiente',
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
    public function recaudacion()
    {
        Gate::authorize('gestionar usuarios');
        return Inertia::render('Reportes/Construccion', ['titulo' => 'Reporte de Recaudación y Colocación']);
    }

    // ═══════════════════════════════════════════
    //  REPORTE 7: RENDIMIENTO E-COMMERCE
    /**
     * REPORTE 7: RENDIMIENTO E-COMMERCE
     */
    public function ecommerce()
    {
        Gate::authorize('gestionar usuarios');

        // Valorizado del Inventario (Activos)
        $valorizado = DB::table('productos')
            ->where('activo', true)
            ->sum(DB::raw('stock_actual * precio_general'));

        // Composición de Ventas por Tipo
        $ventas_data = DB::table('pedidos')
            ->where('estado_pago', 'pagado')
            ->select('tipo_pago', DB::raw('SUM(total) as total'))
            ->groupBy('tipo_pago')
            ->get();

        // Top 5 Productos más vendidos
        $top_productos = DB::table('pedido_detalles')
            ->join('productos', 'pedido_detalles.producto_id', '=', 'productos.id')
            ->join('pedidos', 'pedido_detalles.pedido_id', '=', 'pedidos.id')
            ->where('pedidos.estado_pago', 'pagado')
            ->select('productos.nombre', DB::raw('SUM(pedido_detalles.cantidad) as total_vendido'), DB::raw('SUM(pedido_detalles.subtotal) as recaudado'))
            ->groupBy('productos.id', 'productos.nombre')
            ->orderByDesc('recaudado')
            ->limit(5)
            ->get();

        // Ventas por Mes (Gráfico)
        $meses = [];
        $ventas_mensuales = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $meses[] = ucfirst($date->translatedFormat('M'));
            $ventas_mensuales[] = DB::table('pedidos')
                ->where('estado_pago', 'pagado')
                ->whereYear('fecha_pedido', $date->year)
                ->whereMonth('fecha_pedido', $date->month)
                ->sum('total');
        }

        return Inertia::render('Reportes/Ecommerce', [
            'kpis' => [
                'stock_valorizado' => $valorizado,
                'ventas_historicas' => DB::table('pedidos')->where('estado_pago', 'pagado')->sum('total'),
                'pedidos_hoy' => DB::table('pedidos')->whereDate('created_at', now())->count(),
                'usuarios_activos' => DB::table('users')->count(),
            ],
            'chart_labels' => $meses,
            'chart_data' => $ventas_mensuales,
            'top_productos' => $top_productos,
            'ventas_por_tipo' => $ventas_data
        ]);
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
        $query = LibroDiario::with(['user:id,name,ci,grado', 'cajero:id,name'])
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

        // 1. Pedidos Pagados pero NO Entregados (Dinero en caja, producto en almacén)
        $pendientes = \App\Models\Pedido::with('detalles.producto', 'user')
            ->where('estado_pago', 'pagado')
            ->where('estado_entrega', 'por_recoger')
            ->orderBy('created_at', 'asc')
            ->get();

        // 2. Resumen de Productos Retenidos
        $productosRetenidos = DB::table('pedido_detalles')
            ->join('pedidos', 'pedido_detalles.pedido_id', '=', 'pedidos.id')
            ->join('productos', 'pedido_detalles.producto_id', '=', 'productos.id')
            ->where('pedidos.estado_pago', 'pagado')
            ->where('pedidos.estado_entrega', 'por_recoger')
            ->select(
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
            'productos' => $productosRetenidos
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
