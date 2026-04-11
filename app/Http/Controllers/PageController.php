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
        try {
            return [
                'header' => SiteSetting::get('header', []),
                'footer' => SiteSetting::get('footer', []),
                'whatsapp' => SiteSetting::get('whatsapp', []),
            ];
        } catch (\Exception $e) {
            return [
                'header' => [],
                'footer' => [],
                'whatsapp' => [],
            ];
        }
    }

    public function welcome()
    {
        try {
            $noticias = Noticia::where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get(['id', 'titulo', 'slug', 'resumen', 'imagen_path', 'categoria', 'fecha', 'created_at'])
                ->toArray();
        } catch (\Illuminate\Database\QueryException $e) {
            $noticias = [];
        }

        // Buscar página "inicio" en el CMS para extraer SEO + bloques dinámicos
        try {
            $page = Page::where('slug', 'inicio')->where('is_active', true)->first();
            $pageData = $page ? $page->only(['title', 'content', 'metadata']) : ['title' => 'FAPCLAS R.L. - Tu Futuro Seguro', 'content' => [], 'metadata' => null];
        } catch (\Exception $e) {
            $page = null;
            $pageData = ['title' => 'FAPCLAS R.L. - Tu Futuro Seguro', 'content' => [], 'metadata' => null];
        }

        // Extraer contenido dinámico desde el CMS para inyectarlo a los componentes premium
        $heroSlides = [];
        $galleryData = null;
        
        if ($page && is_array($page->content)) {
            foreach ($page->content as $block) {
                // Slides del Hero
                if (($block['type'] ?? '') === 'hero' && !empty($block['data']['slides'])) {
                    $heroSlides = $block['data']['slides'];
                }
                // Galería Institucional
                if (($block['type'] ?? '') === 'gallery') {
                    $galleryData = $block['data'];
                }
            }
        }

        return Inertia::render('Welcome', [
            'page' => $pageData,
            'isDynamic' => false,
            'heroSlides' => $heroSlides,
            'galleryData' => $galleryData,
            'latest_noticias' => $noticias,
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    public function show($slug)
    {
        try {
            $page = Page::where('slug', $slug)->where('is_active', true)->firstOrFail();
        } catch (\Illuminate\Database\QueryException $e) {
            abort(404);
        }

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
        try {
            $page = Page::where('slug', $slug)->where('is_active', true)->first();
        } catch (\Illuminate\Database\QueryException $e) {
            $page = null;
        }

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
