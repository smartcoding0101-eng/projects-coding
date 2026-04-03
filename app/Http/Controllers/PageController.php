<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Noticia;
use App\Models\SiteSetting;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Inyecta los settings del sitio en todas las respuestas de la landing.
     */
    private function getSiteSettings(): array
    {
        return [
            'header' => SiteSetting::get('header', []),
            'footer' => SiteSetting::get('footer', []),
            'whatsapp' => SiteSetting::get('whatsapp', []),
        ];
    }

    public function welcome()
    {
        $noticias = Noticia::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get(['id', 'titulo', 'slug', 'resumen', 'imagen_path', 'categoria', 'fecha', 'created_at'])
            ->toArray();

        // Buscar página "inicio" en el CMS EXCLUSIVAMENTE para extraer su SEO
        $page = Page::where('slug', 'inicio')->where('is_active', true)->first();
        $pageData = $page ? $page->only(['title', 'content', 'metadata']) : ['title' => 'FAPCLAS R.L. - Tu Futuro Seguro', 'content' => [], 'metadata' => null];

        return Inertia::render('Welcome', [
            'page' => $pageData,
            'isDynamic' => false, // MUY IMPORTANTE: Forzamos false para que dibuje el diseño "Hardcoded" gigante
            'latest_noticias' => $noticias,
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('Welcome', [
            'page' => $page->only(['title', 'content', 'metadata']),
            'isDynamic' => true,
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Páginas institucionales dinámicas.
     * Busca por slug en la tabla pages. Si no existe, renderiza el componente estático.
     */
    public function institutional($slug)
    {
        $page = Page::where('slug', $slug)->where('is_active', true)->first();

        if ($page) {
            return Inertia::render('Welcome', [
                'page' => $page->only(['title', 'content', 'metadata']),
                'isDynamic' => true,
                'siteSettings' => $this->getSiteSettings(),
            ]);
        }

        // Fallback a las páginas estáticas existentes
        $componentMap = [
            'mision-vision' => 'Institutional/MisionVision',
            'constitucion' => 'Institutional/Constitucion',
            'normativas' => 'Institutional/LeyesNormativas',
        ];

        $component = $componentMap[$slug] ?? null;

        if (!$component) {
            abort(404);
        }

        return Inertia::render($component, [
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }
}
