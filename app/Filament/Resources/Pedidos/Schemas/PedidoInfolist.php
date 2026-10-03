<?php

namespace App\Filament\Resources\Pedidos\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PedidoInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('numero_orden'),
                TextEntry::make('user_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('persona_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('nombre_cliente')
                    ->placeholder('-'),
                TextEntry::make('ci_cliente')
                    ->placeholder('-'),
                TextEntry::make('telefono_contacto')
                    ->placeholder('-'),
                TextEntry::make('tipo_pago')
                    ->badge(),
                TextEntry::make('tipo_entrega')
                    ->badge(),
                TextEntry::make('direccion_envio')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('gps_latitud')
                    ->label('Ubicación GPS')
                    ->formatStateUsing(fn($record) => $record->gps_latitud && $record->gps_longitud ? "📍 Abrir en Google Maps ({$record->gps_latitud}, {$record->gps_longitud})" : 'Sin ubicación GPS')
                    ->color(fn($record) => $record->gps_latitud ? 'primary' : 'gray')
                    ->url(fn($record) => $record->gps_latitud && $record->gps_longitud ? "https://www.google.com/maps/search/?api=1&query={$record->gps_latitud},{$record->gps_longitud}" : null, true)
                    ->openUrlInNewTab()
                    ->placeholder('-'),
                TextEntry::make('costo_envio')
                    ->numeric(),
                TextEntry::make('estado_pago')
                    ->badge(),
                TextEntry::make('estado_entrega')
                    ->badge(),
                TextEntry::make('total')
                    ->numeric(),
                \Filament\Infolists\Components\ImageEntry::make('comprobante_qr_path')
                    ->label('Comprobante')
                    ->placeholder('Sin subir')
                    ->url(fn($record) => $record->comprobante_qr_path ? asset('storage/' . $record->comprobante_qr_path) : null, true)
                    ->openUrlInNewTab(),
                TextEntry::make('observaciones')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
