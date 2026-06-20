<?php

namespace App\Filament\Resources\Pedidos\Pages;

use App\Filament\Resources\Pedidos\PedidoResource;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Resources\Pages\ViewRecord;

class ViewPedido extends ViewRecord
{
    protected static string $resource = PedidoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('descargarPdf')
                ->label('Descargar Comprobante PDF')
                ->icon('heroicon-o-document-arrow-down')
                ->color('gray')
                ->url(fn() => route('pedidos.pdf', $this->record->numero_orden))
                ->openUrlInNewTab(),
            EditAction::make(),
        ];
    }
}
