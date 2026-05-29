<?php

namespace App\Filament\Resources\Configuracions\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ConfiguracionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Detalle de Configuración')->schema([
                    TextInput::make('key')
                        ->required()
                        ->disabled()
                        ->label('Llave del Sistema'),
                    TextInput::make('description')
                        ->disabled()
                        ->label('Propósito y Descripción'),
                    Textarea::make('value')
                        ->required()
                        ->label('Valor Configurado')
                        ->columnSpanFull(),
                ])->columns(2),
            ]);
    }
}
