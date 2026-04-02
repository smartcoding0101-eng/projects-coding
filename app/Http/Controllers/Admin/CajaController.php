<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Caja;
use App\Models\CajaDenominacion;
use App\Models\CajaMovimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CajaController extends Controller
{
    /**
     * Dashboard de Caja — Lista de sesiones
     */
    public function index()
    {
        Gate::authorize('gestionar usuarios');

        $cajas = Caja::with('cajero:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Añadir totales calculados a cada caja
        $cajas->getCollection()->transform(function ($caja) {
            $caja->total_ingresos_bob = (float) $caja->movimientos()->where('tipo', 'ingreso')->sum('monto_bob');
            $caja->total_egresos_bob = (float) $caja->movimientos()->where('tipo', 'egreso')->sum('monto_bob');
            $caja->total_ingresos_usd = (float) $caja->movimientos()->where('tipo', 'ingreso')->sum('monto_usd');
            $caja->total_egresos_usd = (float) $caja->movimientos()->where('tipo', 'egreso')->sum('monto_usd');
            $caja->num_movimientos = $caja->movimientos()->count();
            return $caja;
        });

        $cajaAbierta = Caja::cajaAbiertaDe(auth()->id());

        return Inertia::render('Admin/Caja/Index', [
            'cajas' => $cajas,
            'cajaAbierta' => $cajaAbierta,
            'denominaciones_bob' => CajaDenominacion::denominacionesBob(),
            'denominaciones_usd' => CajaDenominacion::denominacionesUsd(),
        ]);
    }

    /**
     * Abrir una nueva sesión de caja con corte de denominaciones
     */
    public function abrir(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        // Validar que no haya caja abierta
        $cajaExistente = Caja::cajaAbiertaDe(auth()->id());
        if ($cajaExistente) {
            return redirect()->back()->with('error', 'Ya tienes una caja abierta. Debes cerrar la actual antes de abrir una nueva.');
        }

        $request->validate([
            'observaciones_apertura' => 'nullable|string|max:500',
            'denominaciones_bob' => 'required|array',
            'denominaciones_bob.*.denominacion' => 'required|numeric',
            'denominaciones_bob.*.cantidad' => 'required|integer|min:0',
            'denominaciones_usd' => 'nullable|array',
            'denominaciones_usd.*.denominacion' => 'required|numeric',
            'denominaciones_usd.*.cantidad' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Calcular totales de apertura
            $totalBob = 0;
            foreach ($request->denominaciones_bob as $d) {
                $totalBob += $d['denominacion'] * $d['cantidad'];
            }

            $totalUsd = 0;
            if ($request->denominaciones_usd) {
                foreach ($request->denominaciones_usd as $d) {
                    $totalUsd += $d['denominacion'] * $d['cantidad'];
                }
            }

            $caja = Caja::create([
                'user_id' => auth()->id(),
                'fecha_apertura' => now(),
                'saldo_inicial_bob' => $totalBob,
                'saldo_inicial_usd' => $totalUsd,
                'estado' => 'abierta',
                'observaciones_apertura' => $request->observaciones_apertura,
            ]);

            // Registrar denominaciones BOB
            foreach ($request->denominaciones_bob as $d) {
                if ($d['cantidad'] > 0) {
                    CajaDenominacion::create([
                        'caja_id' => $caja->id,
                        'tipo' => 'apertura',
                        'moneda' => 'BOB',
                        'denominacion' => $d['denominacion'],
                        'cantidad' => $d['cantidad'],
                        'subtotal' => $d['denominacion'] * $d['cantidad'],
                    ]);
                }
            }

            // Registrar denominaciones USD
            if ($request->denominaciones_usd) {
                foreach ($request->denominaciones_usd as $d) {
                    if ($d['cantidad'] > 0) {
                        CajaDenominacion::create([
                            'caja_id' => $caja->id,
                            'tipo' => 'apertura',
                            'moneda' => 'USD',
                            'denominacion' => $d['denominacion'],
                            'cantidad' => $d['cantidad'],
                            'subtotal' => $d['denominacion'] * $d['cantidad'],
                        ]);
                    }
                }
            }

            DB::commit();
            return redirect()->route('admin.caja.show', $caja)->with('success', 'Caja abierta exitosamente con Bs ' . number_format($totalBob, 2) . ' y $' . number_format($totalUsd, 2));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al abrir caja: ' . $e->getMessage());
        }
    }

    /**
     * Ver detalle de una sesión de caja con todos sus movimientos
     */
    public function show(Caja $caja, Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $caja->load(['cajero:id,name', 'denominaciones']);

        $categoria = $request->query('categoria');

        $query = CajaMovimiento::with('registradoPor:id,name')
            ->where('caja_id', $caja->id);

        if ($categoria) {
            $query->where('categoria', $categoria);
        }

        $movimientos = $query->orderBy('fecha', 'desc')->get();

        // KPIs (Filtrados por categoría si aplica)
        $totalIngBob = (float) $movimientos->where('tipo', 'ingreso')->sum('monto_bob');
        $totalEgrBob = (float) $movimientos->where('tipo', 'egreso')->sum('monto_bob');
        $totalIngUsd = (float) $movimientos->where('tipo', 'ingreso')->sum('monto_usd');
        $totalEgrUsd = (float) $movimientos->where('tipo', 'egreso')->sum('monto_usd');

        // Desglose por categoría (General de la caja para contexto)
        $porCategoria = CajaMovimiento::where('caja_id', $caja->id)
            ->select('categoria', 'tipo', DB::raw('SUM(monto_bob) as total_bob'), DB::raw('SUM(monto_usd) as total_usd'), DB::raw('COUNT(*) as cantidad'))
            ->groupBy('categoria', 'tipo')
            ->get();

        // Datos para gráfico por método de pago (Filtrado)
        $porMetodo = $movimientos->groupBy('metodo_pago')->map(function ($items, $key) {
            return (object) [
                'metodo_pago' => $key,
                'total_bob' => $items->sum('monto_bob')
            ];
        })->values();

        return Inertia::render('Admin/Caja/Show', [
            'caja' => $caja,
            'movimientos' => $movimientos,
            'filters' => $request->only('categoria'),
            'kpis' => [
                'saldo_inicial_bob' => (float) $caja->saldo_inicial_bob,
                'saldo_inicial_usd' => (float) $caja->saldo_inicial_usd,
                'total_ingresos_bob' => $totalIngBob,
                'total_egresos_bob' => $totalEgrBob,
                'total_ingresos_usd' => $totalIngUsd,
                'total_egresos_usd' => $totalEgrUsd,
                'saldo_esperado_bob' => round((float) $caja->saldo_inicial_bob + $totalIngBob - $totalEgrBob, 2),
                'saldo_esperado_usd' => round((float) $caja->saldo_inicial_usd + $totalIngUsd - $totalEgrUsd, 2),
                'saldo_final_bob' => $caja->saldo_final_bob,
                'saldo_final_usd' => $caja->saldo_final_usd,
            ],
            'porCategoria' => $porCategoria,
            'porMetodo' => $porMetodo,
            'categorias' => [
                'desembolso' => 'Desembolso Préstamos',
                'pago_credito' => 'Pago de Cuotas / Crédito',
                'aporte' => 'Aporte de Capital',
                'gasto_operativo' => 'Gasto Operativo',
                'deposito_banco' => 'Depósito a BCP/GNB',
                'retiro_banco' => 'Retiro de Efectivo BCP',
                'venta_ecommerce' => 'Venta Ecommerce',
                'otro_ingreso' => 'Otros Ingresos',
                'otro_egreso' => 'Otros Egresos'
            ],
            'denominaciones_bob' => \App\Models\CajaDenominacion::denominacionesBob(),
            'denominaciones_usd' => \App\Models\CajaDenominacion::denominacionesUsd(),
        ]);
    }

    /**
     * Registrar un movimiento de entrada o salida
     */
    public function registrarMovimiento(Request $request, Caja $caja)
    {
        Gate::authorize('gestionar usuarios');

        if (!$caja->estaAbierta()) {
            return redirect()->back()->with('error', 'Esta caja ya fue cerrada. No se pueden registrar más movimientos.');
        }

        $request->validate([
            'tipo' => 'required|in:ingreso,egreso',
            'concepto' => 'required|string|max:255',
            'categoria' => 'required|string',
            'monto_bob' => 'nullable|numeric|min:0',
            'monto_usd' => 'nullable|numeric|min:0',
            'metodo_pago' => 'required|in:efectivo,qr_banco,transferencia',
            'numero_comprobante' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string|max:500',
        ]);

        // Al menos un monto debe ser > 0
        if (($request->monto_bob ?? 0) <= 0 && ($request->monto_usd ?? 0) <= 0) {
            return redirect()->back()->with('error', 'Debe ingresar al menos un monto mayor a cero (BOB o USD).');
        }

        CajaMovimiento::create([
            'caja_id' => $caja->id,
            'user_id' => auth()->id(),
            'fecha' => now(),
            'tipo' => $request->tipo,
            'concepto' => $request->concepto,
            'categoria' => $request->categoria,
            'monto_bob' => $request->monto_bob ?? 0,
            'monto_usd' => $request->monto_usd ?? 0,
            'metodo_pago' => $request->metodo_pago,
            'numero_comprobante' => $request->numero_comprobante,
            'observaciones' => $request->observaciones,
        ]);

        return redirect()->back()->with('success', 'Movimiento registrado correctamente.');
    }

    /**
     * Cerrar la sesión de caja con conteo final de denominaciones
     */
    public function cerrar(Request $request, Caja $caja)
    {
        Gate::authorize('gestionar usuarios');

        if (!$caja->estaAbierta()) {
            return redirect()->back()->with('error', 'Esta caja ya está cerrada.');
        }

        $request->validate([
            'observaciones_cierre' => 'nullable|string|max:500',
            'denominaciones_bob' => 'required|array',
            'denominaciones_bob.*.denominacion' => 'required|numeric',
            'denominaciones_bob.*.cantidad' => 'required|integer|min:0',
            'denominaciones_usd' => 'nullable|array',
            'denominaciones_usd.*.denominacion' => 'required|numeric',
            'denominaciones_usd.*.cantidad' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $totalBob = 0;
            foreach ($request->denominaciones_bob as $d) {
                $totalBob += $d['denominacion'] * $d['cantidad'];
                if ($d['cantidad'] > 0) {
                    CajaDenominacion::create([
                        'caja_id' => $caja->id,
                        'tipo' => 'cierre',
                        'moneda' => 'BOB',
                        'denominacion' => $d['denominacion'],
                        'cantidad' => $d['cantidad'],
                        'subtotal' => $d['denominacion'] * $d['cantidad'],
                    ]);
                }
            }

            $totalUsd = 0;
            if ($request->denominaciones_usd) {
                foreach ($request->denominaciones_usd as $d) {
                    $totalUsd += $d['denominacion'] * $d['cantidad'];
                    if ($d['cantidad'] > 0) {
                        CajaDenominacion::create([
                            'caja_id' => $caja->id,
                            'tipo' => 'cierre',
                            'moneda' => 'USD',
                            'denominacion' => $d['denominacion'],
                            'cantidad' => $d['cantidad'],
                            'subtotal' => $d['denominacion'] * $d['cantidad'],
                        ]);
                    }
                }
            }

            $caja->update([
                'fecha_cierre' => now(),
                'saldo_final_bob' => $totalBob,
                'saldo_final_usd' => $totalUsd,
                'estado' => 'cerrada',
                'observaciones_cierre' => $request->observaciones_cierre,
            ]);

            DB::commit();
            return redirect()->route('admin.caja.index')->with('success', 'Caja cerrada. Saldo final: Bs ' . number_format($totalBob, 2) . ' / $ ' . number_format($totalUsd, 2));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al cerrar caja: ' . $e->getMessage());
        }
    }
}
