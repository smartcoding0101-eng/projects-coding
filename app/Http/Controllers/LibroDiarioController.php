<?php

namespace App\Http\Controllers;

use App\Models\LibroDiario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibroDiarioController extends Controller
{
    public function index()
    {
        // Se puede filtrar por Rango de fechas, etc.
        $asientos = LibroDiario::with('user:id,name,ci')->orderBy('fecha', 'desc')->orderBy('id', 'desc')->paginate(20);

        return Inertia::render('LibroDiario/Index', [
            'asientos' => $asientos
        ]);
    }
}
