<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use App\Models\Servicio;
use Inertia\Inertia;

class ServicioController extends Controller
{
    /**
     * Muestra la página de detalle de un servicio dinámico (desde BD).
     */
    public function show(string $slug)
    {
        $servicio = Servicio::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $whatsapp = Configuracion::getValor('whatsapp_soporte', '59170000000');

        // Normalizar secciones: los items del Repeater de Filament vienen como
        // [{item: "texto"}, ...] — los aplanamos a ["texto", ...]
        $secciones = collect($servicio->secciones ?? [])->map(function ($sec) {
            $items = $sec['items'] ?? [];
            // Si items son objetos con clave 'item', aplanar
            if (!empty($items) && is_array($items[0] ?? null)) {
                $items = array_map(fn($i) => $i['item'] ?? $i, $items);
            }
            return [
                'titulo' => $sec['titulo'] ?? '',
                'contenido' => $sec['contenido'] ?? '',
                'items' => $items,
            ];
        })->toArray();

        return Inertia::render('Servicios/Show', [
            'servicio' => [
                'nombre' => $servicio->nombre,
                'descripcion' => $servicio->descripcion,
                'imagen' => $servicio->imagen_url ?? $servicio->imagen,
                'secciones' => $secciones,
            ],
            'whatsappSoporte' => $whatsapp,
        ]);
    }
}
