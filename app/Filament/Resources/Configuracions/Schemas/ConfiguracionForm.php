<?php

namespace App\Filament\Resources\Configuracions\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
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
                    
                    // Tipo 1: BOOLEANO — valores si/no/true/false/1/0
                    Toggle::make('value')
                        ->label('Valor Configurado (Interruptor)')
                        ->visible(fn ($record) => $record && self::isBoolean($record->value))
                        ->dehydrated(fn ($record) => $record && self::isBoolean($record->value))
                        ->dehydrateStateUsing(fn ($state, $record) => 
                            in_array(strtolower($record->value), ['si', 'no'])
                                ? ($state ? 'si' : 'no')
                                : ($state ? 'true' : 'false')
                        )
                        ->formatStateUsing(fn ($state) => in_array(strtolower((string) $state), ['si', 'true', '1'])),

                    // Tipo 2: NUMÉRICO — precios, porcentajes, límites
                    TextInput::make('value')
                        ->label('Valor Numérico')
                        ->numeric()
                        ->required()
                        ->suffix(fn ($record) => $record && str_contains(strtolower($record->key ?? ''), 'precio') ? 'Bs.' : null)
                        ->visible(fn ($record) => $record && self::isNumeric($record->value))
                        ->dehydrated(fn ($record) => $record && self::isNumeric($record->value)),

                    // Tipo 3: TEXTO LIBRE — URLs, rutas, cadenas largas
                    Textarea::make('value')
                        ->required()
                        ->label('Valor Configurado')
                        ->columnSpanFull()
                        ->visible(fn ($record) => !$record || (!self::isBoolean($record->value) && !self::isNumeric($record->value)))
                        ->dehydrated(fn ($record) => !$record || (!self::isBoolean($record->value) && !self::isNumeric($record->value))),

                ])->columns(2),
            ]);
    }

    /**
     * Determina si el valor es un booleano del sistema (si/no/true/false/1/0).
     */
    private static function isBoolean(mixed $value): bool
    {
        return in_array(strtolower((string) $value), ['si', 'no', 'true', 'false', '0', '1']);
    }

    /**
     * Determina si el valor es numérico (pero no un booleano como 1/0).
     * Ejemplo: "15.00", "5000", "10.5"
     */
    private static function isNumeric(mixed $value): bool
    {
        $str = (string) $value;
        // Excluir valores que sean literalmente "0" o "1" solos (considerados booleanos)
        if (in_array($str, ['0', '1'])) {
            return false;
        }
        return is_numeric($str);
    }
}
