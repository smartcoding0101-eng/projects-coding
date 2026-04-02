<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;
use Illuminate\Support\Str;

class CategoriaController extends Controller
{
    /**
     * Devuelve todas las categorías (util para recargas vía AJAX/Inertia).
     */
    public function index()
    {
        return response()->json(Categoria::orderBy('orden', 'asc')->get());
    }

    /**
     * Almacena una nueva categoría.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'required|integer',
            'activa' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($validated['nombre']);

        Categoria::create($validated);

        return redirect()->back()->with('success', 'Categoría creada correctamente.');
    }

    /**
     * Actualiza una categoría existente.
     */
    public function update(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'required|integer',
            'activa' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($validated['nombre']);

        $categoria->update($validated);

        return redirect()->back()->with('success', 'Categoría actualizada.');
    }

    /**
     * Elimina una categoría (soft delete).
     */
    public function destroy(Categoria $categoria)
    {
        // Verificar si tiene productos asociados antes de eliminar o simplemente usar restrict
        if ($categoria->productos()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar una categoría con productos asociados.');
        }

        $categoria->delete();

        return redirect()->back()->with('success', 'Categoría eliminada.');
    }
}
