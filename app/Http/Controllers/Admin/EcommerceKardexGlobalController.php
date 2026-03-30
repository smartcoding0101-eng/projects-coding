<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KardexProducto;

class EcommerceKardexGlobalController extends Controller
{
    public function index(Request $request)
    {
        $query = KardexProducto::with(['producto:id,nombre,codigo_sku', 'admin:id,name']);

        if ($request->filled('q')) {
            $searchTerm = '%' . $request->q . '%';
            $query->whereHas('producto', function($q) use ($searchTerm) {
                $q->where('nombre', 'like', $searchTerm)
                  ->orWhere('codigo_sku', 'like', $searchTerm);
            });
        }

        if ($request->filled('tipo')) {
            $query->where('tipo_movimiento', $request->tipo);
        }

        if ($request->filled('fecha_inicio')) {
            $query->whereDate('created_at', '>=', $request->fecha_inicio);
        }

        if ($request->filled('fecha_fin')) {
            $query->whereDate('created_at', '<=', $request->fecha_fin);
        }

        $movimientos = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return inertia('Admin/Inventario/KardexGlobal', [
            'movimientos' => $movimientos,
            'filtros' => $request->only('q', 'tipo', 'fecha_inicio', 'fecha_fin')
        ]);
    }
}