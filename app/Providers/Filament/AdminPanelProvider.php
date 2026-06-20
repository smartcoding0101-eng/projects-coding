<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
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
            ->sidebarCollapsibleOnDesktop()
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
