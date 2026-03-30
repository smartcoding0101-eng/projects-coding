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

        $pdf = Pdf::loadView('pdf.comprobante_pedido', compact('pedido'));
        
        return $pdf->stream("Comprobante_{$pedido->numero_orden}.pdf");
    }
}
