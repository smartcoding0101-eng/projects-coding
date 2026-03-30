<?php

namespace App\Http\Controllers;

use App\Models\Beneficio;
use App\Models\CompraConvenio;
use App\Services\KardexService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TiendaController extends Controller
{
    public function index()
    {
        $beneficios = Beneficio::where('activo', true)->get();
        return Inertia::render('Tienda/Index', [
            'beneficios' => $beneficios
        ]);
    }

    public function pasarelaQr(Request $request, Beneficio $beneficio)
    {
        $monto = $request->query('monto', 50);
        return Inertia::render('Tienda/PasarelaQR', [
            'beneficio' => $beneficio,
            'monto' => $monto
        ]);
    }

    public function finalizarPago(Request $request, KardexService $kardex)
    {
        $validated = $request->validate([
            'beneficio_id' => 'required|exists:beneficios,id',
            'monto_total' => 'required|numeric',
            'codigo_transaccion_qr' => 'required|string|min:5',
            'whatsapp' => ['required', 'string', 'regex:/^[6,7][0-9]{7}$/'],
        ]);

        $compra = CompraConvenio::create([
            'user_id' => $request->user()->id,
            'beneficio_id' => $validated['beneficio_id'],
            'monto_total' => $validated['monto_total'],
            'metodo_pago' => 'QR',
            'estado_pago' => 'Pendiente',
            'codigo_transaccion_qr' => $validated['codigo_transaccion_qr'],
            'telefono_contacto' => $validated['whatsapp'],
        ]);

        // Actualizar WhatsApp del usuario si no tiene o ha cambiado
        $user = $request->user();
        if ($user && $user->whatsapp !== $validated['whatsapp']) {
            $user->update(['whatsapp' => $validated['whatsapp']]);
        }

        // Registrar en Kardex
        $beneficio = Beneficio::find($validated['beneficio_id']);
        $kardex->registrarCompraConvenio(
            $request->user(),
            $validated['monto_total'],
            $compra->id,
            $beneficio->nombre ?? 'Convenio'
        );

        return redirect()->route('tienda.index')->with('success', 'Pago reportado. Un administrador verificará tu comprobante QR pronto.');
    }
}

