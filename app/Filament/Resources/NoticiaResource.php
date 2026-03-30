<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NoticiaResource\Pages;
use App\Models\Noticia;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Resources\Resource;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Table;
use App\Filament\Resources\Pages\Schemas\PageForm;
use Illuminate\Support\Str;

class NoticiaResource extends Resource
{
    protected static ?string $model = Noticia::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-newspaper';

    protected static ?string $recordTitleAttribute = 'titulo';

    public static function form(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return $schema
            ->components([
                Section::make('Información de la Noticia')
                    ->schema([
                        TextInput::make('titulo')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->required()
                            ->unique(Noticia::class, 'slug', ignoreRecord: true),

                        Select::make('categoria')
                            ->options([
                                'Créditos' => 'Créditos',
                                'Institucional' => 'Institucional',
                                'Beneficios' => 'Beneficios',
                                'Vivienda' => 'Vivienda',
                                'Eventos' => 'Eventos',
                            ])
                            ->required()
                            ->default('Institucional'),

                        DatePicker::make('fecha')
                            ->required()
                            ->default(now()),

                        Select::make('color_accent')
                            ->label('Color de Acento')
                            ->options([
                                'primary' => 'Color Institucional (Verde)',
                                'blue' => 'Azul',
                                'emerald' => 'Esmeralda',
                                'gold' => 'Dorado',
                            ])
                            ->default('primary'),
                        
                        Toggle::make('is_active')
                            ->label('Publicado')
                            ->default(true),
                    ])->columns(2),

                Section::make('Contenido y Multimedia')
                    ->schema([
                        FileUpload::make('imagen_path')
                            ->label('Imagen de Portada')
                            ->image()
                            ->directory('noticias'),

                        Textarea::make('resumen')
                            ->label('Resumen (Extracto)')
                            ->rows(3),

                        RichEditor::make('contenido')
                            ->label('Contenido Completo')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_path')
                    ->label('Imagen'),
                TextColumn::make('titulo')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('categoria')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Créditos' => 'info',
                        'Institucional' => 'primary',
                        'Beneficios' => 'success',
                        'Vivienda' => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('fecha')
                    ->date()
                    ->sortable(),
                ToggleColumn::make('is_active')
                    ->label('Estado'),
            ])
            ->filters([
                SelectFilter::make('categoria'),
                TernaryFilter::make('is_active')
                    ->label('Publicado'),
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
            'index' => Pages\ListNoticias::route('/'),
            'create' => Pages\CreateNoticia::route('/create'),
            'edit' => Pages\EditNoticia::route('/{record}/edit'),
        ];
    }
}
