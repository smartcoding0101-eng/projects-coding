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
