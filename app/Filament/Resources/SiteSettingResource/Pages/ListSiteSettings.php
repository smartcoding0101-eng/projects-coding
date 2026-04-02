<?php

namespace App\Filament\Resources\SiteSettingResource\Pages;

use App\Filament\Resources\SiteSettingResource;
use Filament\Resources\Pages\ListRecords;

class ListSiteSettings extends ListRecords
{
    protected static string $resource = SiteSettingResource::class;

    protected ?string $heading = 'Configuración del Sitio Web';

    protected ?string $subheading = 'Edita el contenido del Header, Footer y WhatsApp de la landing page.';
}
