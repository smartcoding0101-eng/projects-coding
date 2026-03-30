<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class ConfiguracionController extends Controller
{
    public function index()
    {
        Gate::authorize('gestionar usuarios'); // Solo SuperAdmin o Gerente

        $configuraciones = Configuracion::orderBy('key')->get();
        return Inertia::render('Admin/Configuraciones/Index', [
            'configuraciones' => $configuraciones
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:configuraciones,id',
            'settings.*.value' => 'required|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            Configuracion::where('id', $setting['id'])->update(['value' => $setting['value']]);
        }

        return redirect()->back()->with('success', 'Configuraciones actualizadas exitosamente.');
    }
}
