<?php

namespace App\Http\Controllers;

use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\TipoCredito;
use App\Services\AccountingService;
use App\Services\AmortizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Barryvdh\DomPDF\Facade\Pdf;

class CreditoController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Si es Admin/Oficial ve todos, si es socio ve los suyos
        if ($user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito')) {
            $creditos = Credito::with('user', 'tipoCredito')
                ->orderBy('created_at', 'desc')->get();
        } else {
            $creditos = Credito::where('user_id', $user->id)
                ->with('tipoCredito')
                ->orderBy('created_at', 'desc')->get();
        }

        return Inertia::render('Creditos/Index', [
            'creditos' => $creditos
        ]);
    }

    /**
     * Vista detalle de un crédito con su plan de pagos completo.
     */
    public function show(Request $request, Credito $credito)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito');

        // Un socio solo puede ver sus propios créditos
        if (!$isAdmin && $credito->user_id !== $user->id) {
            abort(403, 'No autorizado.');
        }

        $credito->load(['user', 'tipoCredito', 'planPagos' => function ($q) {
            $q->orderBy('nro_cuota');
        }, 'aprobadoPor']);

        // Estadísticas del crédito
        $stats = [
            'cuotas_pagadas' => $credito->planPagos->where('estado', 'Pagada')->count(),
            'cuotas_pendientes' => $credito->planPagos->whereIn('estado', ['Pendiente', 'Retrasada'])->count(),
            'cuotas_retrasadas' => $credito->planPagos->where('estado', 'Retrasada')->count(),
            'total_pagado' => $credito->planPagos->where('estado', 'Pagada')->sum('cuota_total'),
            'total_mora' => $credito->planPagos->sum('monto_mora'),
            'saldo_pendiente' => $credito->saldo_pendiente,
            'progreso' => $credito->plazo_meses > 0
                ? round(($credito->planPagos->where('estado', 'Pagada')->count() / $credito->plazo_meses) * 100, 1)
                : 0,
        ];

        return Inertia::render('Creditos/Show', [
            'credito' => $credito,
            'stats' => $stats,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito');
        $tiposCredito = TipoCredito::activos()->get();
        
        $props = [
            'tiposCredito' => $tiposCredito,
        ];

        // Admin puede originar créditos a nombre de cualquier socio
        if ($isAdmin) {
            $props['socios'] = \App\Models\User::select('id', 'name', 'ci', 'grado', 'destino')
                ->orderBy('name')
                ->get();
        }

        return Inertia::render('Creditos/Solicitar', $props);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito');

        $rules = [
            'tipo_credito_id' => 'required|exists:tipos_credito,id',
            'monto_solicitado' => 'required|numeric|min:100',
            'plazo_meses' => 'required|integer|min:1',
            'metodo_descuento' => 'required|in:Planilla,Pago Directo',
        ];

        // Solo admin puede especificar user_id
        if ($isAdmin) {
            $rules['user_id'] = 'required|exists:users,id';
        }

        $validated = $request->validate($rules);

        $tipoCredito = TipoCredito::findOrFail($validated['tipo_credito_id']);

        // Validar contra límites del tipo de crédito
        if ($validated['monto_solicitado'] < $tipoCredito->monto_min || $validated['monto_solicitado'] > $tipoCredito->monto_max) {
            return back()->withErrors([
                'monto_solicitado' => "El monto debe estar entre Bs. {$tipoCredito->monto_min} y Bs. {$tipoCredito->monto_max} para {$tipoCredito->nombre}."
            ]);
        }

        if ($validated['plazo_meses'] < $tipoCredito->plazo_min_meses || $validated['plazo_meses'] > $tipoCredito->plazo_max_meses) {
            return back()->withErrors([
                'plazo_meses' => "El plazo debe estar entre {$tipoCredito->plazo_min_meses} y {$tipoCredito->plazo_max_meses} meses para {$tipoCredito->nombre}."
            ]);
        }

        // Admin puede asignar a cualquier socio, socio solo a sí mismo
        $targetUserId = $isAdmin ? $validated['user_id'] : $user->id;

        $credito = Credito::create([
            'user_id' => $targetUserId,
            'tipo_credito_id' => $tipoCredito->id,
            'monto_aprobado' => $validated['monto_solicitado'],
            'tasa_interes' => $tipoCredito->tasa_interes,
            'plazo_meses' => $validated['plazo_meses'],
            'estado' => Credito::ESTADO_SOLICITADO,
            'metodo_descuento' => $validated['metodo_descuento'],
        ]);

        $targetName = $isAdmin ? \App\Models\User::find($targetUserId)->name : 'usted';
        return redirect()->route('creditos.index')->with('success', "Crédito originado para {$targetName} con éxito.");
    }

    public function evaluar(Request $request, Credito $credito, AmortizationService $amortization, AccountingService $accounting)
    {
        Gate::authorize('gestionar usuarios');

        $validated = $request->validate([
            'estado' => 'required|in:Aprobado,Rechazado',
            'monto_aprobado' => 'required_if:estado,Aprobado|numeric',
            'observaciones' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $credito->estado = $validated['estado'];
            $credito->observaciones = $validated['observaciones'] ?? null;

            if ($validated['estado'] === 'Aprobado') {
                $credito->monto_aprobado = $validated['monto_aprobado'];
                $credito->saldo_capital = $validated['monto_aprobado'];
                $credito->fecha_desembolso = now()->toDateString();
                $credito->aprobado_por = $request->user()->id;
                
                // 1. Generar Plan de Pagos
                $tabla = $amortization->calcularTablaFrances(
                    $credito->monto_aprobado,
                    $credito->tasa_interes,
                    $credito->plazo_meses,
                    $credito->fecha_desembolso
                );

                foreach ($tabla as $cuota) {
                    PlanPago::create([
                        'credito_id' => $credito->id,
                        'nro_cuota' => $cuota['nro_cuota'],
                        'cuota_total' => $cuota['cuota_total'],
                        'capital_amortizado' => $cuota['capital_amortizado'],
                        'interes_pagado' => $cuota['interes_pagado'],
                        'fecha_vencimiento' => $cuota['fecha_vencimiento'],
                        'estado' => PlanPago::ESTADO_PENDIENTE
                    ]);
                }

                // 2. Registrar Contabilidad y Notificar Socio
                $accounting->aprobarCredito($credito->user, $credito->monto_aprobado, $credito->id);
                $credito->estado = Credito::ESTADO_DESEMBOLSADO;
            }

            $credito->save();
            DB::commit();

            return redirect()->route('creditos.show', $credito)->with('success', 'Crédito evaluado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al evaluar crédito: ' . $e->getMessage()]);
        }
    }

    /**
     * Registrar el pago de una cuota específica.
     */
    public function registrarPago(Request $request, Credito $credito, PlanPago $cuota, AccountingService $accounting)
    {
        Gate::authorize('gestionar usuarios');

        // Verificar que la cuota pertenece al crédito
        if ($cuota->credito_id !== $credito->id) {
            abort(404, 'Cuota no encontrada para este crédito.');
        }

        // No permitir pagar cuotas ya pagadas
        if ($cuota->estado === PlanPago::ESTADO_PAGADA) {
            return back()->withErrors(['error' => 'Esta cuota ya fue pagada.']);
        }

        $validated = $request->validate([
            'metodo_pago' => 'required|in:Planilla,QR,Efectivo',
        ]);

        DB::beginTransaction();
        try {
            // 1. Marcar la cuota como pagada
            $cuota->update([
                'estado' => PlanPago::ESTADO_PAGADA,
                'metodo_pago' => $validated['metodo_pago'],
                'fecha_pago_real' => now()->toDateString(),
            ]);

            // 2. Actualizar saldo de capital del crédito
            $credito->saldo_capital = $credito->saldo_capital - $cuota->capital_amortizado;
            
            // 3. Verificar si todas las cuotas fueron pagadas
            $cuotasPendientes = $credito->planPagos()
                ->whereIn('estado', [PlanPago::ESTADO_PENDIENTE, PlanPago::ESTADO_RETRASADA])
                ->count();

            if ($cuotasPendientes === 0) {
                $credito->estado = Credito::ESTADO_PAGADO;
                $credito->saldo_capital = 0;
            } elseif ($credito->estado === Credito::ESTADO_EN_MORA) {
                // Si ya no hay cuotas retrasadas, volver a Desembolsado
                $cuotasRetrasadas = $credito->planPagos()->retrasadas()->count();
                if ($cuotasRetrasadas === 0) {
                    $credito->estado = Credito::ESTADO_DESEMBOLSADO;
                }
            }

            $credito->save();

            // 4. Registrar en contabilidad
            $accounting->registrarPagoCuota($credito->user, $cuota, $validated['metodo_pago']);

            DB::commit();

            return redirect()->route('creditos.show', $credito)
                ->with('success', "Cuota #{$cuota->nro_cuota} registrada exitosamente.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al registrar pago: ' . $e->getMessage()]);
        }
    }

    /**
     * Anular o eliminar un crédito (solo admin).
     */
    public function destroy(Request $request, Credito $credito)
    {
        Gate::authorize('gestionar usuarios');

        DB::beginTransaction();
        try {
            // Eliminar plan de pagos asociado
            $credito->planPagos()->delete();
            
            // Eliminar el crédito
            $credito->delete();

            DB::commit();

            return redirect()->route('creditos.index')
                ->with('success', "Crédito #{$credito->id} eliminado exitosamente.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al eliminar crédito: ' . $e->getMessage()]);
        }
    }

    /**
     * Generar Plan de Pagos en formato PDF.
     */
    public function imprimirPlanPagos(Request $request, Credito $credito)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito');

        // Solo admin o el dueño pueden verlo
        if (!$isAdmin && $credito->user_id !== $user->id) {
            abort(403, 'No autorizado para ver este documento.');
        }

        $credito->load(['user', 'tipoCredito', 'planPagos' => function ($q) {
            $q->orderBy('nro_cuota');
        }]);

        if ($credito->planPagos->isEmpty()) {
            return back()->withErrors(['error' => 'Aún no existe un plan de pagos generado para este crédito.']);
        }

        $pdf = Pdf::loadView('pdf.plan_pagos', compact('credito'));
        
        return $pdf->stream("Plan_Pagos_Credito_{$credito->id}.pdf");
    }
}

