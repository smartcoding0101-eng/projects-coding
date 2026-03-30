<?php

namespace App\Http\Controllers;

use App\Models\Kardex;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KardexController extends Controller
{
    /**
     * Kardex del socio logueado, o de cualquier socio si es admin.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('SuperAdmin') || $user->hasRole('Oficial Crédito');

        // Determinar de quién es el kardex
        $socioId = $request->input('socio_id');
        if ($socioId && $isAdmin) {
            $socio = User::findOrFail($socioId);
        } else {
            $socio = $user;
        }

        // Filtros
        $query = Kardex::where('user_id', $socio->id);

        if ($request->filled('tipo')) {
            $query->byTipo($request->input('tipo'));
        }

        if ($request->filled('fecha_desde') || $request->filled('fecha_hasta')) {
            $query->byFecha($request->input('fecha_desde'), $request->input('fecha_hasta'));
        }

        $movimientos = $query->orderBy('id', 'desc')->paginate(20)->withQueryString();

        // Resumen de totales
        $resumenQuery = Kardex::where('user_id', $socio->id);
        if ($request->filled('tipo')) {
            $resumenQuery->byTipo($request->input('tipo'));
        }
        if ($request->filled('fecha_desde') || $request->filled('fecha_hasta')) {
            $resumenQuery->byFecha($request->input('fecha_desde'), $request->input('fecha_hasta'));
        }

        $resumen = [
            'total_ingresos' => (clone $resumenQuery)->sum('ingreso'),
            'total_egresos' => (clone $resumenQuery)->sum('egreso'),
            'saldo_actual' => Kardex::where('user_id', $socio->id)
                ->orderBy('id', 'desc')->value('saldo_acumulado') ?? 0,
            'total_movimientos' => (clone $resumenQuery)->count(),
        ];

        // Lista de socios para admin
        $socios = $isAdmin ? User::select('id', 'name', 'ci', 'grado')->orderBy('name')->get() : [];

        return Inertia::render('Kardex/Index', [
            'movimientos' => $movimientos,
            'resumen' => $resumen,
            'socio' => $socio->only('id', 'name', 'ci', 'grado', 'destino', 'escalafon'),
            'socios' => $socios,
            'filtros' => $request->only('tipo', 'fecha_desde', 'fecha_hasta', 'socio_id'),
            'tiposMovimiento' => Kardex::etiquetasTipo(),
        ]);
    }
}
