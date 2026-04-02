<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EcommerceConfigController extends Controller
{
    public function index()
    {
        $settings = Configuracion::where('key', 'like', 'ecommerce_%')->get();
        return Inertia::render('Admin/Ecommerce/Configuracion', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'qr_file' => 'nullable|image|max:2048'
        ]);

        foreach ($request->settings as $key => $value) {
            Configuracion::where('key', $key)->update(['value' => $value]);
        }

        if ($request->hasFile('qr_file')) {
            $path = $request->file('qr_file')->store('public/ecommerce');
            Configuracion::where('key', 'ecommerce_qr_pago')->update(['value' => Storage::url($path)]);
        }

        return redirect()->back()->with('success', 'Configuración de la tienda actualizada.');
    }
}
