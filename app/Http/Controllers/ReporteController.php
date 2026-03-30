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
    //  HELPER: Export CSV
    // ═══════════════════════════════════════════

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
