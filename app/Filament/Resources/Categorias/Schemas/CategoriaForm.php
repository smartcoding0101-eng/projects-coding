<?php

namespace App\Filament\Resources\Categorias\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CategoriaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Detalles de Categoría')
                    ->schema([
                        TextInput::make('nombre')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn($state, callable $set) => $set('slug', \Illuminate\Support\Str::slug($state))),
                        TextInput::make('slug')
                            ->required()
                            ->unique(\App\Models\Categoria::class, 'slug', ignoreRecord: true),
                        Textarea::make('descripcion')
                            ->default(null)
                            ->columnSpanFull(),
                        TextInput::make('icono')
                            ->default(null)
                            ->placeholder('Ej: heroicon-o-cube'),
                        ColorPicker::make('color')
                            ->default(null),
                        TextInput::make('orden')
                            ->required()
                            ->numeric()
                            ->default(0),
                        Toggle::make('activa')
                            ->required()
                            ->default(true),
                    ])->columns(2),
            ]);
    }
}
