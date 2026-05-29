<?php

namespace App\Filament\Resources\KardexProductos\Pages;

use App\Filament\Resources\KardexProductos\KardexProductoResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditKardexProducto extends EditRecord
{
    protected static string $resource = KardexProductoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
