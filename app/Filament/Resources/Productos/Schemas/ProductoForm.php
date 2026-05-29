<?php

namespace App\Filament\Resources\Productos\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make([
                    Section::make('Información Principal')->schema([
                        Select::make('categoria_id')
                            ->relationship('categoria', 'nombre')
                            ->required()
                            ->label('Categoría'),
                        TextInput::make('codigo_sku')
                            ->required()
                            ->unique(\App\Models\Producto::class, 'codigo_sku', ignoreRecord: true)
                            ->label('SKU'),
                        TextInput::make('nombre')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn($state, callable $set) => $set('slug', \Illuminate\Support\Str::slug($state))),
                        TextInput::make('slug')
                            ->required()
                            ->unique(\App\Models\Producto::class, 'slug', ignoreRecord: true),
                        Textarea::make('descripcion')
                            ->default(null)
                            ->columnSpanFull()
                            ->label('Descripción Corta'),
                        RichEditor::make('descripcion_larga')
                            ->default(null)
                            ->columnSpanFull()
                            ->label('Descripción Larga'),
                        Textarea::make('observacion')
                            ->default(null)
                            ->columnSpanFull(),
                    ])->columns(2),

                    Section::make('Multimedia')->schema([
                        FileUpload::make('imagen_path')
                            ->label('Imagen del Producto')
                            ->image()
                            ->disk('public')
                            ->directory('tienda/productos')
                            ->helperText('📐 Dimensiones: 800 × 800 px · Relación 1:1 (Cuadrado) · Formatos: JPG, PNG, WEBP · Peso máximo: 2MB')
                            ->hint('Se usa como thumbnail en el catálogo y como imagen principal en el detalle del producto.')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('800')
                            ->imageResizeTargetHeight('800'),
                    ]),
                ])->columnSpan(['lg' => 2]),

                Group::make([
                    Section::make('Precios')->schema([
                        TextInput::make('precio_general')
                            ->required()
                            ->numeric()
                            ->prefix('Bs')
                            ->label('Público General'),
                        TextInput::make('precio_asociado')
                            ->required()
                            ->numeric()
                            ->prefix('Bs')
                            ->label('Asociado'),
                        TextInput::make('precio_credito')
                            ->numeric()
                            ->prefix('Bs')
                            ->label('Crédito'),
                        TextInput::make('precio_costo')
                            ->numeric()
                            ->prefix('Bs')
                            ->label('Costo'),
                    ]),

                    Section::make('Inventario y Estado')->schema([
                        TextInput::make('stock_actual')
                            ->required()
                            ->numeric()
                            ->default(0),
                        TextInput::make('stock_minimo')
                            ->required()
                            ->numeric()
                            ->default(5),
                        Toggle::make('activo')
                            ->default(true)
                            ->required(),
                    ]),

                    Section::make('Atributos')->schema([
                        TextInput::make('marca')->default(null),
                        TextInput::make('modelo')->default(null),
                        TextInput::make('serie')->default(null),
                        TextInput::make('calibre')->default(null),
                        DatePicker::make('fecha_vencimiento')->label('Vencimiento'),
                    ])->collapsed(),
                ])->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }
}
