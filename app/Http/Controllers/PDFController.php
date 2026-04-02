<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PDFController extends Controller
{
    /**
     * Genera y descarga el comprobante de pedido en PDF.
     * 
     * @param string $numero_orden
     * @return \Illuminate\Http\Response
     */
    public function comprobantePedido($numero_orden)
    {
        $pedido = Pedido::with(['detalles.producto', 'user'])
            ->where('numero_orden', $numero_orden)
            ->firstOrFail();

        // Cargar Configuraciones Globales
        $settings = \App\Models\Configuracion::whereIn('key', ['app_logo_pdf', 'app_terminos_recibo'])
            ->pluck('value', 'key')
            ->toArray();

        // Convertir Logo Logo a Base64 para garantizar la renderización segura offline en DomPDF
        $base64Logo = null;
        if (!empty($settings['app_logo_pdf'])) {
            try {
                // Eliminar el prefijo /storage/ para buscar el archivo real en el disco public
                $relativePath = str_replace('/storage/', '', $settings['app_logo_pdf']);
                $path = storage_path('app/public/' . ltrim($relativePath, '/'));
                
                if (file_exists($path)) {
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $base64Logo = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            } catch (\Exception $e) {
                // Failsafe
            }
        }

        $pdf = Pdf::loadView('pdf.comprobante_pedido', compact('pedido', 'settings', 'base64Logo'));
        
        return $pdf->stream("Comprobante_{$pedido->numero_orden}.pdf");
    }
}
