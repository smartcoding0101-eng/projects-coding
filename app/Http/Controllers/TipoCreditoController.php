<?php

namespace App\Http\Controllers;

use App\Models\TipoCredito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class TipoCreditoController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tasa_interes' => 'required|numeric|min:0',
            'plazo_min_meses' => 'required|integer|min:1',
            'plazo_max_meses' => 'required|integer|min:1|gte:plazo_min_meses',
            'monto_min' => 'required|numeric|min:0',
            'monto_max' => 'required|numeric|min:0|gte:monto_min',
            'tasa_mora' => 'required|numeric|min:0',
            'activo' => 'boolean',
        ]);

        TipoCredito::create($validated);

        return Redirect::back()->with('success', 'Línea de crédito creada exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TipoCredito $tipo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'tasa_interes' => 'required|numeric|min:0',
            'plazo_min_meses' => 'required|integer|min:1',
            'plazo_max_meses' => 'required|integer|min:1|gte:plazo_min_meses',
            'monto_min' => 'required|numeric|min:0',
            'monto_max' => 'required|numeric|min:0|gte:monto_min',
            'tasa_mora' => 'required|numeric|min:0',
            'activo' => 'boolean',
        ]);

        $tipo->update($validated);

        return Redirect::back()->with('success', 'Línea de crédito actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoCredito $tipo)
    {
        // En un caso real, validar si tiene créditos asociados antes de eliminar, 
        // o usar SoftDeletes. Para Fapclas, podemos intentar eliminar o desactivar.
        try {
            $tipo->delete();
            return Redirect::back()->with('success', 'Línea de crédito eliminada exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['error' => 'No se puede eliminar la línea de crédito porque tiene créditos asociados. Considere desactivarla.']);
        }
    }
}
