<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\MenuItem;
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\Width;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        $faviconUrl = asset('favicon.ico');
        try {
            if (class_exists(\App\Models\SiteSetting::class)) {
                $headerSettings = \App\Models\SiteSetting::get('header', []);
                if (!empty($headerSettings['favicon'])) {
                    $faviconUrl = asset('storage/' . $headerSettings['favicon']);
                }
            }
        } catch (\Exception $e) {
            // Silently fallback to default favicon if DB is not ready
        }

        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->favicon($faviconUrl)
            ->login()
            ->colors([
                'primary' => Color::Amber,
            ])
            ->homeUrl('/')
            ->sidebarCollapsibleOnDesktop()
            ->maxContentWidth(Width::Full)
            ->renderHook(
                'panels::styles.after',
                fn (): string => '<style>
                    /* Asegurar que Filament ocupe el ancho completo sin margen flotante */
                    .fi-main-ctn { width: 100% !important; max-width: 100% !important; }
                    .fi-main { width: 100% !important; max-width: 100% !important; }

                    /* Botón de salida elegante monocromático blanco y negro estilo Filament */
                    .fapclas-exit-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.375rem 0.875rem;
                        border-radius: 0.5rem;
                        font-size: 0.8125rem;
                        font-weight: 600;
                        line-height: 1.25rem;
                        color: #09090b;
                        background-color: #ffffff;
                        border: 1px solid #e4e4e7;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                        text-decoration: none;
                        outline: none;
                    }
                    .fapclas-exit-btn svg {
                        width: 1rem;
                        height: 1rem;
                        stroke-width: 2;
                        color: #71717a;
                        transition: all 0.15s ease;
                    }
                    .fapclas-exit-btn:hover {
                        background-color: #09090b;
                        color: #ffffff;
                        border-color: #09090b;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                        transform: translateY(-1px);
                    }
                    .fapclas-exit-btn:hover svg {
                        color: #ffffff;
                        transform: translateX(-2px);
                    }
                    .fapclas-exit-btn:active {
                        transform: translateY(0);
                    }

                    /* Soporte para Dark Mode nativo de Filament */
                    .dark .fapclas-exit-btn {
                        color: #f4f4f5;
                        background-color: #18181b;
                        border-color: rgba(255, 255, 255, 0.12);
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
                    }
                    .dark .fapclas-exit-btn svg {
                        color: #a1a1aa;
                    }
                    .dark .fapclas-exit-btn:hover {
                        background-color: #ffffff;
                        color: #09090b;
                        border-color: #ffffff;
                        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
                    }
                    .dark .fapclas-exit-btn:hover svg {
                        color: #09090b;
                    }
                </style>'
            )
            ->renderHook(
                'panels::global-search.after',
                fn (): string => '<a href="' . url('/') . '" class="fapclas-exit-btn me-3" title="Volver al Portal Principal / Landing Page">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span>Volver a la Web</span>
                </a>'
            )
            ->navigationItems([
                NavigationItem::make('Volver a la Web')
                    ->url('/')
                    ->icon('heroicon-o-arrow-left-on-rectangle')
                    ->sort(999),
            ])
            ->userMenuItems([
                'landing' => MenuItem::make()
                    ->label('Volver a la Web')
                    ->url('/')
                    ->icon('heroicon-o-home')
                    ->sort(0),
            ])
            ->navigationGroups([
                \Filament\Navigation\NavigationGroup::make()
                    ->label('E-commerce')
                    ->icon('heroicon-o-shopping-bag')
                    ->collapsed(),
                \Filament\Navigation\NavigationGroup::make()
                    ->label('Administración')
                    ->icon('heroicon-o-cog-8-tooth')
                    ->collapsed(),
                \Filament\Navigation\NavigationGroup::make()
                    ->label('Landing Page')
                    ->icon('heroicon-o-globe-alt')
                    ->collapsed(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,
                FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
