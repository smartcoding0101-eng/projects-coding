<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    public function index()
    {
        $noticias = Noticia::where('is_active', true)
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('Institutional/Noticias', [
            'noticias' => $noticias
        ]);
    }

    public function show($slug)
    {
        $noticia = Noticia::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Institutional/NoticiaDetail', [
            'noticia' => $noticia
        ]);
    }
}
