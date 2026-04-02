<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\KardexProducto;

class InventarioController extends Controller
{
    public function index()
    {
        $productos = Producto::with('categoria')->paginate(30);
        $categorias = Categoria::where('activa', true)->get();

        // Calcular próximo SKU incremental
        $ultimoProducto = Producto::orderBy('id', 'desc')->first();
        $nextSkuNumber = 1;
        if ($ultimoProducto && preg_match('/SKU-(\d+)/', $ultimoProducto->codigo_sku, $matches)) {
            $nextSkuNumber = (int)$matches[1] + 1;
        } elseif ($ultimoProducto && is_numeric($ultimoProducto->codigo_sku)) {
             $nextSkuNumber = (int)$ultimoProducto->codigo_sku + 1;
        }
        $nextSku = 'SKU-' . str_pad($nextSkuNumber, 4, '0', STR_PAD_LEFT);

        return inertia('Admin/Inventario/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'nextSku' => $nextSku
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'codigo_sku' => 'required|string|unique:productos',
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:productos',
            'precio_general' => 'required|numeric|min:0',
            'precio_asociado' => 'required|numeric|min:0',
            'precio_credito' => 'nullable|numeric|min:0',
            'precio_costo' => 'nullable|numeric|min:0',
            'stock_actual' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'descripcion' => 'nullable|string',
            'descripcion_larga' => 'nullable|string',
            'marca' => 'nullable|string|max:100',
            'modelo' => 'nullable|string|max:100',
            'serie' => 'nullable|string|max:100',
            'calibre' => 'nullable|string|max:50',
            'fecha_vencimiento' => 'nullable|date',
            'observacion' => 'nullable|string'
        ]);

        $producto = Producto::create($validated);

        if ($producto->stock_actual > 0) {
            KardexProducto::create([
                'producto_id' => $producto->id,
                'tipo_movimiento' => 'ingreso',
                'cantidad' => $producto->stock_actual,
                'saldo_stock' => $producto->stock_actual,
                'concepto' => 'Inventario Inicial',
                'usuario_admin_id' => auth()->id()
            ]);
        }

        return redirect()->back()->with('success', 'Producto creado exitosamente.');
    }

    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'codigo_sku' => 'required|string|unique:productos,codigo_sku,' . $producto->id,
            'nombre' => 'required|string|max:255',
            'precio_general' => 'required|numeric|min:0',
            'precio_asociado' => 'required|numeric|min:0',
            'precio_credito' => 'nullable|numeric|min:0',
            'precio_costo' => 'nullable|numeric|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'descripcion' => 'nullable|string',
            'descripcion_larga' => 'nullable|string',
            'marca' => 'nullable|string|max:100',
            'modelo' => 'nullable|string|max:100',
            'serie' => 'nullable|string|max:100',
            'calibre' => 'nullable|string|max:50',
            'fecha_vencimiento' => 'nullable|date',
            'observacion' => 'nullable|string',
            'activo' => 'boolean'
        ]);

        $producto->update($validated);

        return redirect()->back()->with('success', 'Producto actualizado.');
    }

    public function kardex(Producto $producto)
    {
        $movimientos = $producto->kardex()->with('admin')->orderBy('created_at', 'desc')->get();

        return inertia('Admin/Inventario/Kardex', [
            'producto' => $producto,
            'movimientos' => $movimientos
        ]);
    }

    public function ajustarStock(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'tipo_movimiento' => 'required|in:ingreso,egreso,ajuste',
            'cantidad' => 'required|integer|min:1',
            'concepto' => 'required|string'
        ]);

        $cantidad = $validated['cantidad'];
        $saldo_anterior = $producto->stock_actual;

        if ($validated['tipo_movimiento'] === 'egreso' && $cantidad > $saldo_anterior) {
            return redirect()->back()->withErrors(['cantidad' => 'Stock insuficiente para el egreso.']);
        }

        $nuevo_saldo = $validated['tipo_movimiento'] === 'ingreso' || $validated['tipo_movimiento'] === 'ajuste' ? $saldo_anterior + $cantidad : $saldo_anterior - $cantidad;
        
        // Si es ajuste (ej. merma, robo, conteo físico)
        if ($validated['tipo_movimiento'] === 'ajuste') {
             // El ajuste asume que mandamos cantidad a restar o sumar en este caso simple.
             // Para simplificar, si el tipo es ajuste, que actue como ingreso/egreso según front. Aquí lo simplifico.
             if ($request->has('es_merma') && $request->es_merma) {
                 $nuevo_saldo = $saldo_anterior - $cantidad;
                 $validated['tipo_movimiento'] = 'egreso';
             }
        }

        $producto->update(['stock_actual' => $nuevo_saldo]);

        KardexProducto::create([
            'producto_id' => $producto->id,
            'tipo_movimiento' => $validated['tipo_movimiento'],
            'cantidad' => $cantidad,
            'saldo_stock' => $nuevo_saldo,
            'concepto' => $validated['concepto'],
            'usuario_admin_id' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Stock actualizado correctamente.');
    }
}
