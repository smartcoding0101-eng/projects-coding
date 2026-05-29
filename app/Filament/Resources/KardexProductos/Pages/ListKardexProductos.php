<?php

namespace App\Filament\Resources\KardexProductos\Pages;

use App\Filament\Resources\KardexProductos\KardexProductoResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListKardexProductos extends ListRecords
{
    protected static string $resource = KardexProductoResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
