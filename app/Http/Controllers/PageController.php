<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    public function welcome()
    {
        // Buscamos la página 'inicio' que debe existir para el CMS
        $page = Page::where('slug', 'inicio')->where('is_active', true)->first();

        // Si no existe la página dinámica aún, retornamos la vista con contenido vacío 
        // o podemos mantener una estructura por defecto.
        return Inertia::render('Welcome', [
            'page' => $page ? $page->only(['title', 'content', 'metadata']) : null,
            'isDynamic' => false
        ]);
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('DynamicPage', [
            'page' => $page->only(['title', 'content', 'metadata'])
        ]);
    }
}
