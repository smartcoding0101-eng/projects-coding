<?php

namespace App\Http\Controllers;

use App\Models\LibroDiario;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class LibroDiarioController extends Controller
{
    /**
     * Construye la query base con filtros aplicados.
     */
    private function buildQuery(Request $request)
    {
        $query = LibroDiario::with([
            'user:id,name,persona_id',
            'user.persona:id,ci,grado',
            'cajero:id,name',
        ]);

        if ($request->filled('fecha_inicio')) {
            $query->where('fecha', '>=', $request->fecha_inicio);
        }
        if ($request->filled('fecha_fin')) {
            $query->where('fecha', '<=', $request->fecha_fin);
        }
        if ($request->filled('socio_id')) {
            $query->where('user_id', $request->socio_id);
        }
        if ($request->filled('tipo')) {
            $query->where('tipo_transaccion', $request->tipo);
        }

        return $query;
    }

    /**
     * Calcula totales globales para la query filtrada.
     */
    private function calcularTotales($query): array
    {
        $totalDebe = (float) (clone $query)->sum('ingreso');
        $totalHaber = (float) (clone $query)->sum('egreso');
        $totalAsientos = (int) (clone $query)->count();

        return [
            'debe' => $totalDebe,
            'haber' => $totalHaber,
            'balance' => round($totalDebe - $totalHaber, 2),
            'asientos' => $totalAsientos,
        ];
    }

    /**
     * Genera texto descriptivo de los filtros activos.
     */
    private function textoFiltros(Request $request): string
    {
        $partes = [];
        if ($request->filled('fecha_inicio')) $partes[] = 'Desde: ' . $request->fecha_inicio;
        if ($request->filled('fecha_fin')) $partes[] = 'Hasta: ' . $request->fecha_fin;
        if ($request->filled('socio_id')) {
            $socio = User::find($request->socio_id);
            $partes[] = 'Socio: ' . ($socio?->name ?? 'ID ' . $request->socio_id);
        }
        if ($request->filled('tipo')) $partes[] = 'Tipo: ' . $this->etiquetaTipo($request->tipo);
        return implode(' | ', $partes);
    }

    // ═══════════════════════════════════════
    //  VISTA PRINCIPAL (Inertia)
    // ═══════════════════════════════════════

    public function index(Request $request)
    {
        $query = $this->buildQuery($request);
        $totales = $this->calcularTotales($query);

        $asientos = $query->orderBy('fecha', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(25)
            ->withQueryString();

        $tiposTransaccion = LibroDiario::select('tipo_transaccion')
            ->distinct()
            ->orderBy('tipo_transaccion')
            ->pluck('tipo_transaccion')
            ->mapWithKeys(fn($t) => [$t => $this->etiquetaTipo($t)])
            ->toArray();

        $socios = User::whereHas('persona')
            ->with('persona:id,ci,grado')
            ->select('id', 'name', 'persona_id')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'ci' => $u->persona?->ci ?? 'N/D',
                'grado' => $u->persona?->grado ?? '',
            ]);

        return Inertia::render('LibroDiario/Index', [
            'asientos' => $asientos,
            'totales' => $totales,
            'filtros' => $request->only(['fecha_inicio', 'fecha_fin', 'socio_id', 'tipo']),
            'tiposTransaccion' => $tiposTransaccion,
            'socios' => $socios,
        ]);
    }

    // ═══════════════════════════════════════
    //  EXPORTAR A PDF
    // ═══════════════════════════════════════

    public function exportPdf(Request $request)
    {
        $query = $this->buildQuery($request);
        $totales = $this->calcularTotales($query);

        $asientos = $query->orderBy('fecha', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $pdf = Pdf::loadView('reportes.libro-diario', [
            'asientos' => $asientos,
            'totales' => $totales,
            'filtros_texto' => $this->textoFiltros($request),
            'fecha_generacion' => now()->format('d/m/Y H:i'),
        ])->setPaper('letter', 'landscape');

        return $pdf->download('libro_diario_' . now()->format('Ymd_Hi') . '.pdf');
    }

    // ═══════════════════════════════════════
    //  EXPORTAR A EXCEL (CSV con BOM UTF-8)
    // ═══════════════════════════════════════

    public function exportExcel(Request $request)
    {
        $query = $this->buildQuery($request);

        $asientos = $query->orderBy('fecha', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $rows = $asientos->map(fn($a) => [
            'ID' => $a->id,
            'Fecha' => \Carbon\Carbon::parse($a->fecha)->format('d/m/Y'),
            'Socio' => $a->user?->name ?? 'Institucional',
            'CI' => $a->user?->persona?->ci ?? 'N/D',
            'Grado' => $a->user?->persona?->grado ?? '',
            'Concepto' => $a->concepto,
            'Tipo Transacción' => $this->etiquetaTipo($a->tipo_transaccion),
            'Debe (Ingreso Bs.)' => number_format((float) $a->ingreso, 2, '.', ''),
            'Haber (Egreso Bs.)' => number_format((float) $a->egreso, 2, '.', ''),
            'Registrado por' => $a->cajero?->name ?? 'Sistema',
        ])->toArray();

        if (empty($rows)) {
            return Response::streamDownload(function () {
                echo "Sin datos para exportar\n";
            }, 'libro_diario_vacio.csv');
        }

        $headers = array_keys($rows[0]);

        return Response::streamDownload(function () use ($rows, $headers) {
            $out = fopen('php://output', 'w');
            // BOM para UTF-8 en Excel
            fprintf($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($out, $headers, ';');
            foreach ($rows as $row) {
                fputcsv($out, array_values($row), ';');
            }
            fclose($out);
        }, 'libro_diario_' . now()->format('Ymd_Hi') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    // ═══════════════════════════════════════
    //  HELPER
    // ═══════════════════════════════════════

    private function etiquetaTipo(string $tipo): string
    {
        return match ($tipo) {
            'aporte' => 'Aporte / Ahorro',
            'venta_ecommerce' => 'Venta E-Commerce',
            'desembolso_credito' => 'Desembolso de Crédito',
            'pago_cuota' => 'Pago de Cuota',
            'mora' => 'Interés Moratorio',
            'interes_ganado' => 'Interés Ganado',
            'ajuste' => 'Ajuste Contable',
            default => ucfirst(str_replace('_', ' ', $tipo)),
        };
    }
}
