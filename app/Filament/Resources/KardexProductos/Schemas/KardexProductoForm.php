<?php

namespace App\Filament\Resources\KardexProductos\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class KardexProductoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('producto_id')
                    ->required()
                    ->numeric(),
                Select::make('tipo_movimiento')
                    ->options(['ingreso' => 'Ingreso', 'egreso' => 'Egreso', 'ajuste' => 'Ajuste'])
                    ->required(),
                TextInput::make('cantidad')
                    ->required()
                    ->numeric(),
                TextInput::make('saldo_stock')
                    ->required()
                    ->numeric(),
                TextInput::make('costo_unitario')
                    ->numeric()
                    ->default(null),
                TextInput::make('concepto')
                    ->required(),
                TextInput::make('usuario_admin_id')
                    ->numeric()
                    ->default(null),
                Textarea::make('notas')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
