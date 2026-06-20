<?php

namespace App\Filament\Resources\SiteSettingResource\Pages;

use App\Filament\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Cache;

class EditSiteSetting extends EditRecord
{
    protected static string $resource = SiteSettingResource::class;

    protected function afterSave(): void
    {
        // Limpia la caché del modelo
        SiteSetting::clearCache();

        // Limpia el payload de Inertia para que el frontend reciba los valores actualizados
        Cache::forget('site_settings_payload');
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
