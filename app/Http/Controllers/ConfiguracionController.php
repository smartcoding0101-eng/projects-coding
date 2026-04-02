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

        // Garantizar que las llaves de backups avanzado existan
        $keys = [
            'backup_auto_enabled' => ['value' => '0', 'desc' => 'Activa el programador automático'],
            'backup_days' => ['value' => '1,2,3,4,5', 'desc' => 'Días de la semana para backup (0=Dom)'],
            'backup_time_start' => ['value' => '08:00', 'desc' => 'Hora límite inicial'],
            'backup_time_end' => ['value' => '18:00', 'desc' => 'Hora límite final'],
            'backup_interval' => ['value' => 'daily', 'desc' => 'Frecuencia (daily, hourly, etc)'],
        ];

        foreach ($keys as $k => $v) {
            Configuracion::firstOrCreate(['key' => $k], [
                'value' => $v['value'],
                'description' => $v['desc']
            ]);
        }

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
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            Configuracion::where('id', $setting['id'])->update(['value' => $setting['value']]);
        }

        return redirect()->back()->with('success', 'Configuraciones actualizadas exitosamente.');
    }

    public function uploadMedia(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $request->validate([
            // Limite de 4MB acordado con el usuario
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096' 
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('media', 'public');
            $url = \Illuminate\Support\Facades\Storage::url($path);
            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
