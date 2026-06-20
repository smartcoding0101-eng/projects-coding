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

    protected static string|\UnitEnum|null $navigationGroup = 'Landing Page';

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
                ->visible(fn($record) => $record !== null),
        ]);
    }

    protected static function getValueFields(): array
    {
        return [
            // --- HEADER ---
            Section::make('Configuración del Header')
                ->schema([
                    FileUpload::make('favicon')
                        ->label('Favicon del Sitio')
                        ->image()
                        ->disk('public')
                        ->directory('site/favicon')
                        ->deletable()
                        ->nullable()
                        ->helperText('📐 Dimensiones recomendadas: 32x32px o 192x192px (Pantallas retina) · Relación de aspecto 1:1 · Formatos: ICO, PNG, WEBP, SVG')
                        ->imageResizeMode('contain')
                        ->imageCropAspectRatio('1:1')
                        ->imageResizeTargetWidth('192')
                        ->imageResizeTargetHeight('192'),
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
                    Section::make('SEO y Metadatos (Buscadores / Google)')
                        ->schema([
                            Textarea::make('meta_description')
                                ->label('Meta Descripción')
                                ->helperText('Escribe una descripción concisa de tu cooperativa (recomendado: 150-160 caracteres). Esto es lo que aparecerá en los resultados de búsqueda de Google.')
                                ->rows(3)
                                ->maxLength(255),
                            TextInput::make('meta_keywords')
                                ->label('Palabras Clave (Keywords)')
                                ->helperText('Separadas por comas. Ej: cooperativa, créditos, ahorro, fapclas'),
                        ])->collapsible()->collapsed(),
                    Repeater::make('top_links')
                        ->label('Links de la Barra Superior')
                        ->schema([
                            TextInput::make('label')->required()->label('Texto'),
                            TextInput::make('url')->required()->label('URL'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn(array $state): ?string => $state['label'] ?? 'Link'),
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
                                ->itemLabel(fn(array $state): ?string => $state['label'] ?? 'Enlace'),
                            TextInput::make('featured_title')->label('Título Destacado (opcional)'),
                            TextInput::make('featured_subtitle')->label('Subtítulo Destacado'),
                            TextInput::make('featured_badge')->label('Badge Destacado'),
                            FileUpload::make('featured_image')
                                ->label('Imagen Destacada del Menú')
                                ->image()
                                ->disk('public')
                                ->directory('site/menu')
                                ->helperText('📐 Dimensiones: 400 × 300 px · Relación 4:3 · Formatos: JPG, PNG, WEBP')
                                ->hint('Imagen decorativa que aparece en el mega-menú desplegable del Header.')
                                ->imageResizeMode('cover')
                                ->imageCropAspectRatio('4:3')
                                ->imageResizeTargetWidth('400')
                                ->imageResizeTargetHeight('300'),
                        ])
                        ->collapsible()
                        ->itemLabel(fn(array $state): ?string => $state['label'] ?? 'Menú'),
                ])
                ->visible(fn($record) => $record?->key === 'header')
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
                        ->itemLabel(fn(array $state): ?string => $state['top_label'] ?? 'Badge'),
                    Repeater::make('quick_links')
                        ->label('Accesos Rápidos')
                        ->schema([
                            TextInput::make('label')->required()->label('Texto'),
                            TextInput::make('url')->required()->label('URL'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn(array $state): ?string => $state['label'] ?? 'Link'),
                    Repeater::make('contact_links')
                        ->label('Links de Contacto')
                        ->schema([
                            TextInput::make('label')->required()->label('Texto'),
                            TextInput::make('url')->label('URL (vacío = solo texto)'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn(array $state): ?string => $state['label'] ?? 'Contacto'),
                    Repeater::make('social_links')
                        ->label('Redes Sociales')
                        ->schema([
                            TextInput::make('platform')->required()->label('Plataforma (facebook, instagram, tiktok, linkedin)'),
                            TextInput::make('url')->required()->label('URL'),
                        ])
                        ->columns(2)
                        ->collapsible()
                        ->itemLabel(fn(array $state): ?string => $state['platform'] ?? 'Red Social'),
                ])
                ->visible(fn($record) => $record?->key === 'footer')
                ->collapsed(),

            // --- WHATSAPP ---
            Section::make('WhatsApp Flotante')
                ->schema([
                    Toggle::make('enabled')->label('Habilitado')->default(true),
                    TextInput::make('url')->label('URL de WhatsApp')->placeholder('https://wa.link/...'),
                    TextInput::make('tooltip')->label('Texto del Tooltip')->default('Oficial de Negocios (En línea)'),
                ])
                ->visible(fn($record) => $record?->key === 'whatsapp')
                ->collapsed(),

            // --- PROMO POPUP LANDING ---
            Section::make('Popup Promocional - Landing Page')
                ->schema([
                    Toggle::make('enabled')
                        ->label('Habilitar Popup')
                        ->default(false),
                    
                    \Filament\Forms\Components\Select::make('type')
                        ->label('Tipo de Popup')
                        ->options([
                            'oferta' => '🏷️ Oferta Especial',
                            'noticia' => '📰 Noticia',
                            'informacion' => 'ℹ️ Información',
                        ])
                        ->required()
                        ->default('oferta'),

                    FileUpload::make('image')
                        ->label('Imagen del Popup')
                        ->image()
                        ->disk('public')
                        ->directory('site/popups')
                        ->helperText('📐 Dimensiones sugeridas: 800x600px. Formatos: JPG, PNG, WEBP')
                        ->imageResizeMode('cover'),

                    TextInput::make('title')
                        ->label('Título')
                        ->maxLength(100),

                    Textarea::make('description')
                        ->label('Descripción / Detalle')
                        ->rows(3),

                    Group::make([
                        TextInput::make('button_text')
                            ->label('Texto del Botón (CTA)')
                            ->placeholder('Ej: Ver Más'),
                        TextInput::make('button_link')
                            ->label('Enlace del Botón')
                            ->placeholder('Ej: /beneficios'),
                    ])->columns(2),

                    Group::make([
                        Toggle::make('show_once')
                            ->label('Mostrar una sola vez por sesión')
                            ->default(true)
                            ->helperText('Si está activo, solo se mostrará una vez hasta que el usuario cierre el navegador.'),
                        TextInput::make('delay_ms')
                            ->label('Retardo para mostrar (ms)')
                            ->numeric()
                            ->default(1000)
                            ->suffix('ms'),
                    ])->columns(2),

                    \Filament\Forms\Components\DateTimePicker::make('expires_at')
                        ->label('Fecha de expiración (opcional)')
                        ->helperText('Si se define, el popup se desactivará automáticamente después de esta fecha.'),
                ])
                ->visible(fn($record) => $record?->key === 'promo_popup_landing'),

            // --- PROMO POPUP ECOMMERCE ---
            Section::make('Popup Promocional - Ecommerce')
                ->schema([
                    Toggle::make('enabled')
                        ->label('Habilitar Popup')
                        ->default(false),
                    
                    \Filament\Forms\Components\Select::make('type')
                        ->label('Tipo de Popup')
                        ->options([
                            'oferta' => '🏷️ Oferta Especial',
                            'noticia' => '📰 Noticia',
                            'informacion' => 'ℹ️ Información',
                        ])
                        ->required()
                        ->default('oferta'),

                    FileUpload::make('image')
                        ->label('Imagen del Popup')
                        ->image()
                        ->disk('public')
                        ->directory('site/popups')
                        ->helperText('📐 Dimensiones sugeridas: 800x600px. Formatos: JPG, PNG, WEBP')
                        ->imageResizeMode('cover'),

                    TextInput::make('title')
                        ->label('Título')
                        ->maxLength(100),

                    Textarea::make('description')
                        ->label('Descripción / Detalle')
                        ->rows(3),

                    Group::make([
                        TextInput::make('button_text')
                            ->label('Texto del Botón (CTA)')
                            ->placeholder('Ej: Ver Ofertas'),
                        TextInput::make('button_link')
                            ->label('Enlace del Botón')
                            ->placeholder('Ej: #catalogo'),
                    ])->columns(2),

                    Group::make([
                        Toggle::make('show_once')
                            ->label('Mostrar una sola vez por sesión')
                            ->default(true)
                            ->helperText('Si está activo, solo se mostrará una vez hasta que el usuario cierre el navegador.'),
                        TextInput::make('delay_ms')
                            ->label('Retardo para mostrar (ms)')
                            ->numeric()
                            ->default(800)
                            ->suffix('ms'),
                    ])->columns(2),

                    \Filament\Forms\Components\DateTimePicker::make('expires_at')
                        ->label('Fecha de expiración (opcional)')
                        ->helperText('Si se define, el popup se desactivará automáticamente después de esta fecha.'),
                ])
                ->visible(fn($record) => $record?->key === 'promo_popup_ecommerce')
                ->collapsed(),

            // --- SPLASH SCREEN ---
            Section::make('🚀 Splash Screen de Bienvenida')
                ->description('Pantalla de carga animada que se muestra la primera vez que un visitante entra al sitio.')
                ->schema([
                    Toggle::make('enabled')
                        ->label('Habilitar Splash Screen')
                        ->default(true)
                        ->helperText('Si está activo, se mostrará una pantalla de bienvenida animada al cargar la página por primera vez.'),

                    Group::make([
                        \Filament\Forms\Components\Select::make('logo_type')
                            ->label('Tipo de Logo')
                            ->options([
                                'text' => '✏️ Solo Texto',
                                'image' => '🖼️ Imagen',
                                'both' => '🔠 Texto + Imagen',
                            ])
                            ->default('text')
                            ->helperText('Define qué mostrar como logo durante el splash.'),

                        \Filament\Forms\Components\Select::make('logo_size')
                            ->label('Tamaño del Logo')
                            ->options([
                                'sm' => 'Pequeño (160px)',
                                'md' => 'Mediano (240px)',
                                'lg' => 'Grande (320px)',
                                'xl' => 'Extra Grande (400px)',
                            ])
                            ->default('md')
                            ->helperText('Aplica para logos tipo Imagen.'),
                    ])->columns(2),

                    Group::make([
                        \Filament\Forms\Components\Select::make('style')
                            ->label('Estilo Visual')
                            ->options([
                                'dark' => '🌑 Oscuro (por defecto)',
                                'light' => '☀️ Claro',
                                'brand' => '🎨 Color de Marca',
                            ])
                            ->default('dark'),

                        \Filament\Forms\Components\Select::make('animation')
                            ->label('Animación de Salida')
                            ->options([
                                'fade'     => '🌫️ Desvanecer (Fade)',
                                'slide-up' => '⬆️ Deslizar hacia arriba',
                                'zoom-out' => '🔍 Alejar (Zoom Out)',
                            ])
                            ->default('fade')
                            ->helperText('Efecto visual al ocultarse.'),
                    ])->columns(2),

                    FileUpload::make('logo_image')
                        ->label('Imagen del Logo (opcional)')
                        ->image()
                        ->disk('public')
                        ->directory('site/splash')
                        ->helperText('📐 Recomendado: 200×200 px, PNG transparente. Solo se usa si el tipo de logo es "Imagen" o "Texto + Imagen".')
                        ->imageResizeMode('contain')
                        ->imageResizeTargetWidth('200')
                        ->imageResizeTargetHeight('200'),

                    Group::make([
                        TextInput::make('title')
                            ->label('Título Principal')
                            ->default('FAPCLAS')
                            ->placeholder('Ej: FAPCLAS'),

                        TextInput::make('subtitle')
                            ->label('Subtítulo / Eslogan')
                            ->default('R.L.')
                            ->placeholder('Ej: R.L.'),
                    ])->columns(2),

                    Textarea::make('tagline')
                        ->label('Tagline (texto pequeño debajo del logo)')
                        ->placeholder('Ej: Tu cooperativa de confianza')
                        ->rows(2),

                    Group::make([
                        \Filament\Forms\Components\TextInput::make('duration_ms')
                            ->label('Duración del Splash (ms)')
                            ->numeric()
                            ->default(2500)
                            ->suffix('ms')
                            ->helperText('Tiempo en milisegundos antes de mostrar el sitio. Mínimo recomendado: 1500ms.'),

                        \Filament\Forms\Components\TextInput::make('show_every_minutes')
                            ->label('Mostrar cada X minutos')
                            ->numeric()
                            ->default(0)
                            ->suffix('min')
                            ->helperText('0 = solo una vez por sesión. Ej: 60 = se repite cada hora.'),
                    ])->columns(2),
                ])
                ->visible(fn($record) => $record?->key === 'splash')
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
                    ->color(fn(string $state): string => match ($state) {
                        'header' => 'info',
                        'footer' => 'success',
                        'whatsapp' => 'warning',
                        'promo_popup_landing' => 'danger',
                        'promo_popup_ecommerce' => 'primary',
                        'splash' => 'gray',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'header' => '🏠 Header / Navegación',
                        'footer' => '📋 Footer / Pie de Página',
                        'whatsapp' => '💬 WhatsApp Flotante',
                        'promo_popup_landing' => '🚀 Popup - Landing Page',
                        'promo_popup_ecommerce' => '🛍️ Popup - Ecommerce',
                        'splash' => '✨ Splash Screen',
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
