<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EcommerceReporteController extends Controller
{
    /**
     * Reporte de Movimientos Ecommerce (Kardex de Ventas Digitales)
     */
    public function movimientos(Request $request)
    {
        $query = Pedido::with(['user', 'detalles.producto'])
            ->orderBy('created_at', 'desc');

        // Filtros de búsqueda
        if ($request->filled('q')) {
            $searchTerm = '%' . $request->q . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('numero_orden', 'like', $searchTerm)
                  ->orWhereHas('user', function($qu) use ($searchTerm) {
                      $qu->where('name', 'like', $searchTerm);
                  });
            });
        }

        // Filtro por Estado de Pago (Incluye Rechazados según requerimiento)
        if ($request->filled('estado_pago')) {
            $query->where('estado_pago', $request->estado_pago);
        }

        // Rango de Fechas
        if ($request->filled('fecha_inicio')) {
            $query->whereDate('created_at', '>=', $request->fecha_inicio);
        }

        if ($request->filled('fecha_fin')) {
            $query->whereDate('created_at', '<=', $request->fecha_fin);
        }

        $pedidos = $query->paginate(25)->withQueryString();

        // Totales para el reporte
        $stats = [
            'total_ventas' => (float) Pedido::where('estado_pago', 'pagado')->sum('total'),
            'cantidad_pedidos' => Pedido::count(),
            'pedidos_pagados' => Pedido::where('estado_pago', 'pagado')->count(),
            'pedidos_rechazados' => Pedido::where('estado_pago', 'rechazado')->count(),
        ];

        return Inertia::render('Admin/Ecommerce/ReporteMovimientos', [
            'pedidos' => $pedidos,
            'filters' => $request->all(['q', 'estado_pago', 'fecha_inicio', 'fecha_fin']),
            'stats' => $stats
        ]);
    }
}
