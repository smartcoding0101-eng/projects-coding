<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SiteSettingResource\Pages;
use App\Models\SiteSetting;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Group;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;

class SiteSettingResource extends Resource
{
    protected static ?string $model = SiteSetting::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Configuración del Sitio';

    protected static ?string $modelLabel = 'Configuración';

    protected static ?string $pluralModelLabel = 'Configuraciones del Sitio';

    protected static string|\UnitEnum|null $navigationGroup = 'CMS';

    protected static ?int $navigationSort = 0;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('key')
                ->label('Clave')
                ->required()
                ->disabled()
                ->dehydrated(),

            Section::make('Contenido')
                ->statePath('value')
                ->schema(static::getValueFields())
                ->visible(fn ($record) => $record !== null),
        ]);
    }

    protected static function getValueFields(): array
    {
        return [
            // --- HEADER ---
            Section::make('Configuración del Header')
                ->schema([
                    Group::make([
                        TextInput::make('phone')->label('Teléfono de Soporte')->placeholder('800-10-FAPCLAS'),
                        TextInput::make('phone_link')->label('Link Teléfono')->placeholder('tel:80010XXXX'),
                    ])->columns(2),
                    Group::make([
                        TextInput::make('whatsapp_link')->label('Link WhatsApp Header')->placeholder('http://wa.link/...'),
                        TextInput::make('whatsapp_label')->label('Etiqueta WhatsApp'),
                    ])->columns(2),
                    Group::make([
                        TextInput::make('logo_text')->label('Texto del Logo')->default('FAPCLAS'),
                        TextInput::make('logo_suffix')->label('Sufijo del Logo')->default('R.L.'),
                    ])->columns(2),
                    Group::make([
                        TextInput::make('cta_portal_text')->label('Texto Botón Portal')->default('Acceso al Portal'),
                        TextInput::make('cta_tienda_text')->label('Texto Botón Tienda')->default('Tienda Virtual'),
                    ])->columns(2),
                    Repeater::make('top_links')
                        ->label('Links de la Barra Superior')
                        ->schema([
                            TextInput::make('label')->required()->label('Texto'),
                            TextInput::make('url')->required()->label('URL'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn (array $state): ?string => $state['label'] ?? 'Link'),
                    Repeater::make('menu')
                        ->label('Menú Principal')
                        ->schema([
                            TextInput::make('label')->required()->label('Nombre del Menú'),
                            Repeater::make('children')
                                ->label('Sub-enlaces')
                                ->schema([
                                    TextInput::make('label')->required()->label('Texto'),
                                    TextInput::make('url')->required()->label('URL'),
                                    TextInput::make('description')->label('Descripción'),
                                    TextInput::make('icon')->label('Icono (lucide)'),
                                    Toggle::make('disabled')->label('Deshabilitado')->default(false),
                                ])
                                ->columns(2)
                                ->collapsible()
                                ->itemLabel(fn (array $state): ?string => $state['label'] ?? 'Enlace'),
                            TextInput::make('featured_title')->label('Título Destacado (opcional)'),
                            TextInput::make('featured_subtitle')->label('Subtítulo Destacado'),
                            TextInput::make('featured_badge')->label('Badge Destacado'),
                            FileUpload::make('featured_image')->label('Imagen Destacada')->image()->directory('site/menu'),
                        ])
                        ->collapsible()
                        ->itemLabel(fn (array $state): ?string => $state['label'] ?? 'Menú'),
                ])
                ->visible(fn ($record) => $record?->key === 'header')
                ->collapsed(),

            // --- FOOTER ---
            Section::make('Configuración del Footer')
                ->schema([
                    Textarea::make('description')->label('Descripción Institucional')->rows(3),
                    Group::make([
                        TextInput::make('copyright')->label('Copyright Principal'),
                        TextInput::make('copyright_dev')->label('Copyright Desarrollador'),
                    ])->columns(2),
                    Repeater::make('badges')
                        ->label('Badges Regulatorios')
                        ->schema([
                            TextInput::make('top_label')->required()->label('Etiqueta Superior'),
                            TextInput::make('bottom_label')->required()->label('Etiqueta Inferior'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn (array $state): ?string => $state['top_label'] ?? 'Badge'),
                    Repeater::make('quick_links')
                        ->label('Accesos Rápidos')
                        ->schema([
                            TextInput::make('label')->required()->label('Texto'),
                            TextInput::make('url')->required()->label('URL'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn (array $state): ?string => $state['label'] ?? 'Link'),
                    Repeater::make('contact_links')
                        ->label('Links de Contacto')
                        ->schema([
                            TextInput::make('label')->required()->label('Texto'),
                            TextInput::make('url')->label('URL (vacío = solo texto)'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn (array $state): ?string => $state['label'] ?? 'Contacto'),
                    Repeater::make('social_links')
                        ->label('Redes Sociales')
                        ->schema([
                            TextInput::make('platform')->required()->label('Plataforma (facebook, instagram, tiktok, linkedin)'),
                            TextInput::make('url')->required()->label('URL'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn (array $state): ?string => $state['platform'] ?? 'Red Social'),
                ])
                ->visible(fn ($record) => $record?->key === 'footer')
                ->collapsed(),

            // --- WHATSAPP ---
            Section::make('WhatsApp Flotante')
                ->schema([
                    Toggle::make('enabled')->label('Habilitado')->default(true),
                    TextInput::make('url')->label('URL de WhatsApp')->placeholder('https://wa.link/...'),
                    TextInput::make('tooltip')->label('Texto del Tooltip')->default('Oficial de Negocios (En línea)'),
                ])
                ->visible(fn ($record) => $record?->key === 'whatsapp')
                ->collapsed(),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->label('Configuración')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'header' => 'info',
                        'footer' => 'success',
                        'whatsapp' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'header' => '🏠 Header / Navegación',
                        'footer' => '📋 Footer / Pie de Página',
                        'whatsapp' => '💬 WhatsApp Flotante',
                        default => $state,
                    }),
                TextColumn::make('updated_at')
                    ->label('Última Modificación')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->actions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSiteSettings::route('/'),
            'edit' => Pages\EditSiteSetting::route('/{record}/edit'),
        ];
    }
}
