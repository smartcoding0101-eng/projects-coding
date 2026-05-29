<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Noticia;
use App\Models\Servicio;
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
            return \Illuminate\Support\Facades\Cache::remember('site_settings_payload', 3600, function () {
                return [
                    'header' => SiteSetting::get('header', []),
                    'footer' => SiteSetting::get('footer', []),
                    'whatsapp' => SiteSetting::get('whatsapp', []),
                ];
            });
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

        // Extraer TODOS los bloques del CMS para inyectarlos a los componentes estáticos
        $heroSlides = [];
        $galleryData = null;
        $identityData = null;
        $videoData = null;
        $testimonialsData = null;
        $productCardsData = null;
        $benefitsData = null;

        if ($page && is_array($page->content)) {
            foreach ($page->content as $block) {
                $type = $block['type'] ?? '';
                $data = $block['data'] ?? [];

                switch ($type) {
                    case 'hero':
                        if (!empty($data['slides'])) {
                            $heroSlides = $data['slides'];
                        }
                        break;
                    case 'gallery':
                        $galleryData = $data;
                        break;
                    case 'identity':
                        $identityData = $data;
                        break;
                    case 'video':
                        $videoData = $data;
                        break;
                    case 'testimonials':
                        $testimonialsData = $data;
                        break;
                    case 'product_cards':
                        $productCardsData = $data;
                        break;
                    case 'benefits':
                        $benefitsData = $data;
                        break;
                }
            }
        }

        // Servicios dinámicos desde BD (Filament CRUD)
        try {
            $servicios = Servicio::active()->ordered()->get()->map(fn($s) => [
                'id' => $s->id,
                'nombre' => $s->nombre,
                'slug' => $s->slug,
                'descripcion' => $s->descripcion,
                'imagen' => $s->imagen_url ?? $s->imagen,
                'icono' => $s->icono,
                'is_featured' => $s->is_featured,
            ])->toArray();
        } catch (\Exception $e) {
            $servicios = [];
        }

        return Inertia::render('Welcome', [
            'page' => $pageData,
            'isDynamic' => false,
            'heroSlides' => $heroSlides,
            'galleryData' => $galleryData,
            'identityData' => $identityData,
            'videoData' => $videoData,
            'testimonialsData' => $testimonialsData,
            'productCardsData' => $productCardsData,
            'benefitsData' => $benefitsData,
            'servicios' => $servicios,
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
