<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServicioResource\Pages;
use App\Models\Servicio;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Resources\Resource;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ServicioResource extends Resource
{
    protected static ?string $model = Servicio::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';

    protected static string|\UnitEnum|null $navigationGroup = 'Landing Page';

    protected static ?string $recordTitleAttribute = 'nombre';

    protected static ?int $navigationSort = 2;

    public static function form(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return $schema
            ->components([
                Section::make('Información del Servicio')
                    ->schema([
                        TextInput::make('nombre')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn($state, $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->required()
                            ->unique(Servicio::class, 'slug', ignoreRecord: true)
                            ->helperText('Se genera automáticamente. Forma la URL: /servicios/{slug}'),

                        Textarea::make('descripcion')
                            ->label('Descripción')
                            ->rows(3)
                            ->required()
                            ->columnSpanFull(),

                        FileUpload::make('imagen')
                            ->label('Imagen Principal')
                            ->image()
                            ->disk('public')
                            ->directory('servicios')
                            ->helperText('📐 Dimensiones: 1920 × 1080 px · Relación 16:9 · Formatos: JPG, PNG, WEBP · Peso máximo: 5MB')
                            ->hint('Usada en la tarjeta de la Landing Page y en el hero de la página del servicio.')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('16:9')
                            ->imageResizeTargetWidth('1920')
                            ->imageResizeTargetHeight('1080'),

                        TextInput::make('icono')
                            ->label('Ícono (nombre Lucide)')
                            ->default('Shield')
                            ->placeholder('Shield, Banknote, ShoppingBag...')
                            ->helperText('Nombre del ícono de lucide-react (https://lucide.dev)'),

                        Group::make([
                            Toggle::make('is_active')
                                ->label('Activo (visible en la web)')
                                ->default(true),

                            Toggle::make('is_featured')
                                ->label('Destacado (★ resaltado en landing)')
                                ->default(false),

                            TextInput::make('sort_order')
                                ->label('Orden')
                                ->numeric()
                                ->default(0)
                                ->helperText('Menor número = aparece primero'),
                        ])->columns(['default' => 1, 'lg' => 3])->columnSpanFull(),
                    ])->columns(2),

                Section::make('Secciones de Detalle')
                    ->description('Bloques de contenido que aparecen en la página individual del servicio (/servicios/{slug})')
                    ->schema([
                        Repeater::make('secciones')
                            ->label('Secciones')
                            ->schema([
                                TextInput::make('titulo')
                                    ->label('Título de la Sección')
                                    ->required(),

                                Textarea::make('contenido')
                                    ->label('Contenido / Párrafo')
                                    ->rows(3)
                                    ->required(),

                                Repeater::make('items')
                                    ->label('Puntos / Características')
                                    ->schema([
                                        TextInput::make('item')
                                            ->label('Punto')
                                            ->required(),
                                    ])
                                    ->defaultItems(3)
                                    ->collapsible()
                                    ->itemLabel(fn(array $state): ?string => $state['item'] ?? 'Punto'),
                            ])
                            ->defaultItems(2)
                            ->reorderable()
                            ->collapsible()
                            ->itemLabel(fn(array $state): ?string => $state['titulo'] ?? 'Sección'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                ImageColumn::make('imagen')
                    ->label('Img')
                    ->disk('public')
                    ->circular()
                    ->size(40),
                TextColumn::make('nombre')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('slug')
                    ->label('URL')
                    ->formatStateUsing(fn(string $state): string => "/servicios/{$state}")
                    ->color('gray')
                    ->size('sm'),
                TextColumn::make('sort_order')
                    ->label('Orden')
                    ->sortable()
                    ->alignCenter(),
                IconColumn::make('is_featured')
                    ->label('★')
                    ->boolean()
                    ->alignCenter(),
                ToggleColumn::make('is_active')
                    ->label('Activo'),
                TextColumn::make('updated_at')
                    ->label('Actualizado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->size('sm')
                    ->color('gray'),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Estado'),
                TernaryFilter::make('is_featured')
                    ->label('Destacado'),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServicios::route('/'),
            'create' => Pages\CreateServicio::route('/create'),
            'edit' => Pages\EditServicio::route('/{record}/edit'),
        ];
    }
}
