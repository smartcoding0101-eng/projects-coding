<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Cargar parámetros públicos del ecommerce (colores, políticas públicas) para inyectarlos en layouts
        $ecommerceSettings = \App\Models\Configuracion::where('key', 'like', 'ecommerce_%')->pluck('value', 'key')->toArray();

        // Limpiar JSON si existen strings
        if (isset($ecommerceSettings['ecommerce_hero_slides']) && is_string($ecommerceSettings['ecommerce_hero_slides'])) {
            $ecommerceSettings['ecommerce_hero_slides'] = json_decode($ecommerceSettings['ecommerce_hero_slides'], true);
        }

        // ─── Splash Screen config (landing page only) ─────────────────────────
        $splashConfig = \App\Models\SiteSetting::get('splash', []);

        // ─── Site Settings (global for header, footer, whatsapp) ──────────────
        $siteSettings = [];
        try {
            $siteSettings = \Illuminate\Support\Facades\Cache::remember('site_settings_payload', 3600, function () {
                return [
                    'header' => \App\Models\SiteSetting::get('header', []),
                    'footer' => \App\Models\SiteSetting::get('footer', []),
                    'whatsapp' => \App\Models\SiteSetting::get('whatsapp', []),
                    'promo_popup_landing' => \App\Models\SiteSetting::get('promo_popup_landing', []),
                    'promo_popup_ecommerce' => \App\Models\SiteSetting::get('promo_popup_ecommerce', []),
                    'splash' => \App\Models\SiteSetting::get('splash', []),
                ];
            });
        } catch (\Exception $e) {
            $siteSettings = [
                'header' => [],
                'footer' => [],
                'whatsapp' => [],
                'promo_popup_landing' => [],
                'promo_popup_ecommerce' => [],
                'splash' => [],
            ];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    'theme' => $request->user()->theme_preference ?? 'premium-olive',
                ]) : null,
            ],
            'settings' => $ecommerceSettings,
            'splash' => $splashConfig,
            'site_settings' => $siteSettings,
            'siteSettings' => $siteSettings,
            // ─── Flash messages para el sistema de Toasts global ───────────────
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info'    => $request->session()->get('info'),
            ],
        ];
    }
}
