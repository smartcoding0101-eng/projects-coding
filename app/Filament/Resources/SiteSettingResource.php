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

    protected static function getFontOptions(): array
    {
        return [
            'Inter'            => 'Inter (Web Standard)',
            'Roboto'           => 'Roboto',
            'Montserrat'       => 'Montserrat',
            'Outfit'           => 'Outfit',
            'Poppins'          => 'Poppins',
            'Lato'             => 'Lato',
            'Nunito'           => 'Nunito',
            'Open Sans'        => 'Open Sans',
            'Raleway'          => 'Raleway',
            'Playfair Display' => 'Playfair Display (Serif)',
            'Merriweather'     => 'Merriweather (Serif)',
            'Georgia'          => 'Georgia (Serif)',
            'Arial'            => 'Arial',
            'Calibri'          => 'Calibri',
            'Times New Roman'  => 'Times New Roman',
        ];
    }

    protected static function getFontWeightOptions(): array
    {
        return [
            '100' => '100 – Thin',
            '200' => '200 – Extra Light',
            '300' => '300 – Light',
            '400' => '400 – Regular',
            '500' => '500 – Medium',
            '600' => '600 – SemiBold',
            '700' => '700 – Bold',
            '800' => '800 – Extra Bold',
            '900' => '900 – Black',
        ];
    }

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
                            TextInput::make('meta_title')
                                ->label('Título SEO (<title>)')
                                ->helperText('Define el título principal que se mostrará en los resultados de Google (snippet). Ej: Cooperativa de ahorro y creditos Fapclas R.L.')
                                ->maxLength(255),
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

            // --- LANDING STYLES: Tabs por Bloque ---
            Tabs::make('Estilos Landing Page')
                ->tabs([
                    Tab::make('🌐 Global')
                        ->schema([
                            Section::make('Fuentes Globales (Base de Todo el Sitio)')
                                ->description('Define la tipografía base que heredan todos los bloques. Cada bloque puede sobreescribir esto de manera independiente.')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('global.font_family_title')
                                            ->label('Fuente Global de Títulos')
                                            ->options(static::getFontOptions())
                                            ->default('Inter')->required(),
                                        \Filament\Forms\Components\Select::make('global.font_family_body')
                                            ->label('Fuente Global de Cuerpo')
                                            ->options(static::getFontOptions())
                                            ->default('Inter')->required(),
                                        \Filament\Forms\Components\Select::make('global.font_weight_title')
                                            ->label('Peso de Títulos')
                                            ->options(static::getFontWeightOptions())
                                            ->default('700'),
                                        \Filament\Forms\Components\Select::make('global.font_weight_body')
                                            ->label('Peso del Cuerpo')
                                            ->options(static::getFontWeightOptions())
                                            ->default('400'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('global.color_primary')
                                            ->label('Color Primario (Marca)')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_secondary')
                                            ->label('Color Secundario')->default('#eab308'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_text')
                                            ->label('Color de Texto Base')
                                            ->helperText('Color para párrafos y descripciones.')
                                            ->default('#1e293b'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_title')
                                            ->label('Color de Títulos Base (Por Defecto)')
                                            ->helperText('Usar color oscuro (ej. #0f172a o #1e293b) si el fondo de la página es blanco/claro.')
                                            ->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_bg_page')
                                            ->label('Fondo de Página')->default('#f8faf6'),
                                    ])->columns(5),
                                    Group::make([
                                        TextInput::make('global.font_size_h1')->label('Tamaño H1')->default('2.75rem'),
                                        TextInput::make('global.font_size_h2')->label('Tamaño H2')->default('2rem'),
                                        TextInput::make('global.font_size_h3')->label('Tamaño H3')->default('1.5rem'),
                                        TextInput::make('global.font_size_body')->label('Tamaño Cuerpo')->default('1rem'),
                                        TextInput::make('global.font_size_small')->label('Tamaño Pequeño')->default('0.875rem'),
                                        TextInput::make('global.line_height')->label('Interlineado')->default('1.65'),
                                        TextInput::make('global.letter_spacing')->label('Espaciado entre letras')->default('0em'),
                                    ])->columns(4),
                                ]),
                        ]),

                    Tab::make('🦸 Hero / Banner')
                        ->schema([
                            Section::make('Estilos del Bloque Hero (Sección de Bienvenida)')
                                ->description('Tipografía y colores específicos del hero que aparece al inicio de la landing.')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('hero.font_family_title')
                                            ->label('Fuente del Título Hero')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('hero.font_weight_title')
                                            ->label('Peso del Título Hero')->options(static::getFontWeightOptions())->default('900'),
                                        \Filament\Forms\Components\Select::make('hero.text_transform_title')
                                            ->label('Transformación del Título')
                                            ->options(['none'=>'Normal','uppercase'=>'MAYÚSCULAS','lowercase'=>'minúsculas','capitalize'=>'Primera Mayúscula'])
                                            ->default('none'),
                                        \Filament\Forms\Components\Select::make('hero.text_align')
                                            ->label('Alineación de Texto')
                                            ->options(['left'=>'Izquierda','center'=>'Centro','right'=>'Derecha'])
                                            ->default('left'),
                                    ])->columns(4),
                                    Group::make([
                                        TextInput::make('hero.font_size_title')->label('Tamaño del Título')->default('3.5rem'),
                                        TextInput::make('hero.font_size_subtitle')->label('Tamaño del Subtítulo')->default('1.5rem'),
                                        TextInput::make('hero.font_size_description')->label('Tamaño de Descripción')->default('1.125rem'),
                                        TextInput::make('hero.letter_spacing_title')->label('Espaciado Título')->default('-0.02em'),
                                        TextInput::make('hero.line_height_title')->label('Interlineado Título')->default('1.1'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('hero.color_title')->label('Color del Título')->default('#ffffff'),
                                        \Filament\Forms\Components\ColorPicker::make('hero.color_subtitle')->label('Color del Subtítulo')->default('#eab308'),
                                        \Filament\Forms\Components\ColorPicker::make('hero.color_description')->label('Color Descripción')->default('#cbd5e1'),
                                        \Filament\Forms\Components\ColorPicker::make('hero.color_overlay')->label('Color Overlay (fondo)')->default('#0f172a'),
                                        TextInput::make('hero.overlay_opacity')->label('Opacidad Overlay (0-1)')->default('0.55'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('hero.btn_primary_bg')->label('Botón Primario BG')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('hero.btn_primary_text')->label('Botón Primario Texto')->default('#ffffff'),
                                        \Filament\Forms\Components\ColorPicker::make('hero.btn_secondary_bg')->label('Botón Secundario BG')->default('transparent'),
                                        \Filament\Forms\Components\ColorPicker::make('hero.btn_secondary_text')->label('Botón Secundario Texto')->default('#ffffff'),
                                        TextInput::make('hero.btn_border_radius')->label('Radio de Borde Botón')->default('0.5rem'),
                                    ])->columns(5),
                                ]),
                        ]),

                    Tab::make('🧭 Navegación')
                        ->schema([
                            Section::make('Estilos del Header / Menú de Navegación')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('nav.font_family')->label('Fuente del Menú')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('nav.font_weight')->label('Peso del Texto Menú')->options(static::getFontWeightOptions())->default('500'),
                                        TextInput::make('nav.font_size')->label('Tamaño de Texto Menú')->default('0.9rem'),
                                        \Filament\Forms\Components\Select::make('nav.text_transform')->label('Transformación')
                                            ->options(['none'=>'Normal','uppercase'=>'MAYÚSCULAS','capitalize'=>'Primera Mayúscula'])->default('none'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('nav.color_bg')->label('Fondo del Header')->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('nav.color_bg_scroll')->label('Fondo al hacer Scroll')->default('#1e293b'),
                                        \Filament\Forms\Components\ColorPicker::make('nav.color_link')->label('Color de Links')->default('#f1f5f9'),
                                        \Filament\Forms\Components\ColorPicker::make('nav.color_link_hover')->label('Color Hover Links')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('nav.color_logo')->label('Color del Logo')->default('#ffffff'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('nav.topbar_bg')->label('Fondo Barra Superior')->default('#166534'),
                                        \Filament\Forms\Components\ColorPicker::make('nav.topbar_text')->label('Texto Barra Superior')->default('#dcfce7'),
                                        TextInput::make('nav.topbar_font_size')->label('Tamaño Texto Topbar')->default('0.8rem'),
                                    ])->columns(3),
                                ]),
                        ]),

                    Tab::make('📋 Secciones / Títulos')
                        ->schema([
                            Section::make('Estilos de Títulos de Sección')
                                ->description('Controla los títulos (H2) que encabezan cada bloque de la landing: "Nuestros Servicios", "Testimonios", etc.')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('section_title.font_family')->label('Fuente del Título')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('section_title.font_weight')->label('Peso')->options(static::getFontWeightOptions())->default('800'),
                                        TextInput::make('section_title.font_size')->label('Tamaño H2 Sección')->default('2rem'),
                                        \Filament\Forms\Components\Select::make('section_title.text_transform')->label('Transformación')
                                            ->options(['none'=>'Normal','uppercase'=>'MAYÚSCULAS','capitalize'=>'Capitalizado'])->default('none'),
                                        \Filament\Forms\Components\Select::make('section_title.text_align')->label('Alineación')
                                            ->options(['left'=>'Izquierda','center'=>'Centro','right'=>'Derecha'])->default('center'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('section_title.color_title')
                                            ->label('Color Título H2 (Secciones)')
                                            ->helperText('Aplica a títulos de secciones sobre fondo claro ("Nuestros Servicios", "Noticias", etc.).')
                                            ->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('section_title.color_subtitle')->label('Color Subtítulo')->default('#64748b'),
                                        \Filament\Forms\Components\ColorPicker::make('section_title.color_badge')->label('Color Badge/Etiqueta')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('section_title.color_badge_text')->label('Color Texto Badge')->default('#ffffff'),
                                        TextInput::make('section_title.margin_bottom')->label('Separación inferior')->default('3rem'),
                                    ])->columns(5),
                                    Group::make([
                                        TextInput::make('section_title.font_size_subtitle')->label('Tamaño Subtítulo')->default('1.1rem'),
                                        TextInput::make('section_title.letter_spacing')->label('Espaciado letras')->default('0em'),
                                        TextInput::make('section_title.line_height')->label('Interlineado')->default('1.3'),
                                    ])->columns(3),
                                ]),
                        ]),

                    Tab::make('🃏 Tarjetas')
                        ->schema([
                            Section::make('Estilos de Tarjetas de Servicios / Beneficios')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('cards.font_family_title')->label('Fuente del Título de Tarjeta')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('cards.font_weight_title')->label('Peso del Título')->options(static::getFontWeightOptions())->default('700'),
                                        TextInput::make('cards.font_size_title')->label('Tamaño del Título')->default('1.25rem'),
                                        TextInput::make('cards.font_size_body')->label('Tamaño de Descripción')->default('0.95rem'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('cards.color_bg')->label('Fondo de Tarjeta')->default('#ffffff'),
                                        \Filament\Forms\Components\ColorPicker::make('cards.color_bg_hover')->label('Fondo en Hover')->default('#f0fdf4'),
                                        \Filament\Forms\Components\ColorPicker::make('cards.color_title')
                                            ->label('Color de Título')
                                            ->helperText('Color para tarjetas con fondo blanco/claro (las destacadas oscuras usan blanco automáticamente).')
                                            ->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('cards.color_body')->label('Color de Descripción')->default('#64748b'),
                                        \Filament\Forms\Components\ColorPicker::make('cards.color_icon')->label('Color de Ícono')->default('#22c55e'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('cards.color_border')->label('Color del Borde')->default('#e2e8f0'),
                                        \Filament\Forms\Components\ColorPicker::make('cards.color_border_hover')->label('Color Borde en Hover')->default('#22c55e'),
                                        TextInput::make('cards.border_radius')->label('Radio de Borde')->default('1rem'),
                                        TextInput::make('cards.padding')->label('Padding Interno')->default('1.5rem'),
                                    ])->columns(4),
                                ]),
                        ]),

                    Tab::make('📊 Estadísticas')
                        ->schema([
                            Section::make('Estilos de la Sección de Cifradores / Estadísticas')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('stats.font_family_value')->label('Fuente del Número/Valor')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('stats.font_weight_value')->label('Peso del Número')->options(static::getFontWeightOptions())->default('800'),
                                        TextInput::make('stats.font_size_value')->label('Tamaño del Número')->default('3rem'),
                                        TextInput::make('stats.font_size_label')->label('Tamaño de Etiqueta')->default('0.9rem'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('stats.color_bg')->label('Fondo de la Sección')->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('stats.color_value')->label('Color del Número')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('stats.color_label')->label('Color de la Etiqueta')->default('#94a3b8'),
                                        \Filament\Forms\Components\ColorPicker::make('stats.color_icon')->label('Color del Ícono')->default('#eab308'),
                                    ])->columns(4),
                                ]),
                        ]),

                    Tab::make('💬 Testimonios')
                        ->schema([
                            Section::make('Estilos del Bloque de Testimonios')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('testimonials.font_family_quote')->label('Fuente del Testimonio')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('testimonials.font_style_quote')->label('Estilo del Texto')
                                            ->options(['normal'=>'Normal','italic'=>'Cursiva'])->default('italic'),
                                        TextInput::make('testimonials.font_size_quote')->label('Tamaño del Texto')->default('1.1rem'),
                                        TextInput::make('testimonials.font_size_author')->label('Tamaño del Autor')->default('0.95rem'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('testimonials.color_bg_card')->label('Fondo de Tarjeta')->default('rgba(255,255,255,0.05)'),
                                        \Filament\Forms\Components\ColorPicker::make('testimonials.color_quote_text')->label('Color Texto Testimonio')->default('#e2e8f0'),
                                        \Filament\Forms\Components\ColorPicker::make('testimonials.color_author')->label('Color Autor')->default('#94a3b8'),
                                        \Filament\Forms\Components\ColorPicker::make('testimonials.color_stars')->label('Color Estrellas')->default('#eab308'),
                                        \Filament\Forms\Components\ColorPicker::make('testimonials.color_section_bg')->label('Fondo Sección')->default('#0f172a'),
                                    ])->columns(5),
                                ]),
                        ]),

                    Tab::make('🦶 Footer')
                        ->schema([
                            Section::make('Estilos del Pie de Página')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('footer.font_family')->label('Fuente del Footer')->options(static::getFontOptions())->default('Inter'),
                                        TextInput::make('footer.font_size_body')->label('Tamaño de Texto')->default('0.9rem'),
                                        TextInput::make('footer.font_size_title')->label('Tamaño de Títulos')->default('1rem'),
                                        \Filament\Forms\Components\Select::make('footer.font_weight_title')->label('Peso Títulos')->options(static::getFontWeightOptions())->default('600'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_bg')->label('Fondo del Footer')->default('#020617'),
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_text')->label('Color de Texto')->default('#94a3b8'),
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_title')->label('Color de Títulos')->default('#f1f5f9'),
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_link')->label('Color de Links')->default('#94a3b8'),
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_link_hover')->label('Color Links Hover')->default('#22c55e'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_border')->label('Color Línea Divisoria')->default('#1e293b'),
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_copyright_bg')->label('Fondo Copyright')->default('#000000'),
                                        \Filament\Forms\Components\ColorPicker::make('footer.color_copyright_text')->label('Texto Copyright')->default('#475569'),
                                    ])->columns(3),
                                ]),
                        ]),

                    Tab::make('🔘 Botones Globales')
                        ->schema([
                            Section::make('Estilos de Botones (Globales Landing)')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('buttons.font_family')->label('Fuente de Botones')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('buttons.font_weight')->label('Peso de Texto')->options(static::getFontWeightOptions())->default('600'),
                                        TextInput::make('buttons.font_size')->label('Tamaño de Texto')->default('0.95rem'),
                                        \Filament\Forms\Components\Select::make('buttons.text_transform')->label('Transformación')
                                            ->options(['none'=>'Normal','uppercase'=>'MAYÚSCULAS','capitalize'=>'Capitalizado'])->default('none'),
                                    ])->columns(4),
                                    Section::make('Botón Primario')->schema([
                                        Group::make([
                                            \Filament\Forms\Components\ColorPicker::make('buttons.primary_bg')->label('Fondo')->default('#22c55e'),
                                            \Filament\Forms\Components\ColorPicker::make('buttons.primary_text')->label('Texto')->default('#ffffff'),
                                            \Filament\Forms\Components\ColorPicker::make('buttons.primary_bg_hover')->label('Fondo Hover')->default('#16a34a'),
                                            TextInput::make('buttons.primary_border_radius')->label('Radio de Borde')->default('0.5rem'),
                                            TextInput::make('buttons.primary_padding')->label('Padding (py px)')->default('0.75rem 1.75rem'),
                                        ])->columns(5),
                                    ])->collapsible()->collapsed(),
                                    Section::make('Botón Secundario / Outline')->schema([
                                        Group::make([
                                            \Filament\Forms\Components\ColorPicker::make('buttons.secondary_bg')->label('Fondo')->default('transparent'),
                                            \Filament\Forms\Components\ColorPicker::make('buttons.secondary_text')->label('Texto')->default('#22c55e'),
                                            \Filament\Forms\Components\ColorPicker::make('buttons.secondary_border')->label('Borde')->default('#22c55e'),
                                            \Filament\Forms\Components\ColorPicker::make('buttons.secondary_bg_hover')->label('Fondo Hover')->default('#f0fdf4'),
                                            TextInput::make('buttons.secondary_border_radius')->label('Radio de Borde')->default('0.5rem'),
                                        ])->columns(5),
                                    ])->collapsible()->collapsed(),
                                ]),
                        ]),
                ])
                ->visible(fn($record) => $record?->key === 'landing_styles')
                ->contained(false),

            // --- ECOMMERCE STYLES: Tabs por Bloque ---
            Tabs::make('Estilos Ecommerce')
                ->tabs([
                    Tab::make('🌐 Global')
                        ->schema([
                            Section::make('Fuentes y Colores Base del E-commerce')
                                ->description('Configuración base que afecta todo el E-commerce. Cada bloque puede sobreescribir de forma independiente.')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('global.font_family_title')->label('Fuente de Títulos')->options(static::getFontOptions())->default('Inter')->required(),
                                        \Filament\Forms\Components\Select::make('global.font_family_body')->label('Fuente de Cuerpo')->options(static::getFontOptions())->default('Inter')->required(),
                                        \Filament\Forms\Components\Select::make('global.font_weight_title')->label('Peso Títulos')->options(static::getFontWeightOptions())->default('700'),
                                        \Filament\Forms\Components\Select::make('global.font_weight_body')->label('Peso Cuerpo')->options(static::getFontWeightOptions())->default('400'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('global.color_primary')->label('Color Primario')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_accent')->label('Color de Acento')->default('#eab308'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_text')->label('Color Texto Base')->default('#1e293b'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_title')->label('Color Títulos Base')->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('global.color_bg_page')->label('Fondo de Página')->default('#f8faf6'),
                                    ])->columns(5),
                                    Group::make([
                                        TextInput::make('global.font_size_h1')->label('Tamaño H1')->default('2.25rem'),
                                        TextInput::make('global.font_size_h2')->label('Tamaño H2')->default('1.75rem'),
                                        TextInput::make('global.font_size_h3')->label('Tamaño H3')->default('1.25rem'),
                                        TextInput::make('global.font_size_body')->label('Tamaño Cuerpo')->default('0.95rem'),
                                        TextInput::make('global.line_height')->label('Interlineado')->default('1.5'),
                                    ])->columns(5),
                                ]),
                        ]),

                    Tab::make('🏷️ Hero Tienda')
                        ->schema([
                            Section::make('Estilos del Hero/Banner de la Tienda')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('store_hero.font_family_title')->label('Fuente Título')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('store_hero.font_weight_title')->label('Peso del Título')->options(static::getFontWeightOptions())->default('800'),
                                        TextInput::make('store_hero.font_size_title')->label('Tamaño Título')->default('2.75rem'),
                                        \Filament\Forms\Components\Select::make('store_hero.text_align')->label('Alineación')
                                            ->options(['left'=>'Izquierda','center'=>'Centro','right'=>'Derecha'])->default('center'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('store_hero.color_bg')->label('Fondo Hero')->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('store_hero.color_title')->label('Color Título')->default('#ffffff'),
                                        \Filament\Forms\Components\ColorPicker::make('store_hero.color_subtitle')->label('Color Subtítulo')->default('#eab308'),
                                        \Filament\Forms\Components\ColorPicker::make('store_hero.color_badge_bg')->label('Fondo Badge')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('store_hero.color_badge_text')->label('Texto Badge')->default('#ffffff'),
                                    ])->columns(5),
                                ]),
                        ]),

                    Tab::make('📦 Tarjetas de Producto')
                        ->schema([
                            Section::make('Estilos de Tarjetas en el Catálogo')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('product_card.font_family_name')->label('Fuente Nombre Producto')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('product_card.font_weight_name')->label('Peso Nombre')->options(static::getFontWeightOptions())->default('600'),
                                        TextInput::make('product_card.font_size_name')->label('Tamaño Nombre')->default('1rem'),
                                        TextInput::make('product_card.font_size_price')->label('Tamaño Precio')->default('1.25rem'),
                                        TextInput::make('product_card.font_size_description')->label('Tamaño Descripción')->default('0.875rem'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_bg')->label('Fondo Tarjeta')->default('#ffffff'),
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_bg_hover')->label('Fondo Hover')->default('#f0fdf4'),
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_name')->label('Color Nombre')->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_price')->label('Color Precio')->default('#16a34a'),
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_price_credit')->label('Color Precio Crédito')->default('#eab308'),
                                    ])->columns(5),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_description')->label('Color Descripción')->default('#64748b'),
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_border')->label('Color Borde')->default('#e2e8f0'),
                                        \Filament\Forms\Components\ColorPicker::make('product_card.color_badge_stock')->label('Color Badge Stock')->default('#dcfce7'),
                                        TextInput::make('product_card.border_radius')->label('Radio de Borde')->default('1rem'),
                                    ])->columns(4),
                                    Section::make('Botón Agregar al Carrito')->schema([
                                        Group::make([
                                            \Filament\Forms\Components\ColorPicker::make('product_card.btn_bg')->label('Fondo Botón')->default('#22c55e'),
                                            \Filament\Forms\Components\ColorPicker::make('product_card.btn_text')->label('Texto Botón')->default('#ffffff'),
                                            \Filament\Forms\Components\ColorPicker::make('product_card.btn_bg_hover')->label('Fondo Hover')->default('#16a34a'),
                                            TextInput::make('product_card.btn_font_size')->label('Tamaño Texto Botón')->default('0.875rem'),
                                            \Filament\Forms\Components\Select::make('product_card.btn_font_weight')->label('Peso Texto')->options(static::getFontWeightOptions())->default('600'),
                                        ])->columns(5),
                                    ])->collapsible()->collapsed(),
                                ]),
                        ]),

                    Tab::make('🔍 Detalle de Producto')
                        ->schema([
                            Section::make('Estilos de la Página de Detalle del Producto')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('product_detail.font_family_title')->label('Fuente del Título')->options(static::getFontOptions())->default('Inter'),
                                        \Filament\Forms\Components\Select::make('product_detail.font_weight_title')->label('Peso del Título')->options(static::getFontWeightOptions())->default('700'),
                                        TextInput::make('product_detail.font_size_title')->label('Tamaño Título')->default('1.875rem'),
                                        TextInput::make('product_detail.font_size_price')->label('Tamaño del Precio')->default('1.75rem'),
                                    ])->columns(4),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('product_detail.color_title')->label('Color del Título')->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('product_detail.color_price')->label('Color del Precio')->default('#16a34a'),
                                        \Filament\Forms\Components\ColorPicker::make('product_detail.color_price_credit')->label('Color Precio Crédito')->default('#d97706'),
                                        \Filament\Forms\Components\ColorPicker::make('product_detail.color_bg')->label('Fondo Página')->default('#f8faf6'),
                                        \Filament\Forms\Components\ColorPicker::make('product_detail.color_description')->label('Color Descripción')->default('#475569'),
                                    ])->columns(5),
                                ]),
                        ]),

                    Tab::make('🏷️ Categorías / Filtros')
                        ->schema([
                            Section::make('Estilos de la Barra de Categorías y Filtros')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('filters.font_family')->label('Fuente')->options(static::getFontOptions())->default('Inter'),
                                        TextInput::make('filters.font_size')->label('Tamaño de Texto')->default('0.875rem'),
                                        \Filament\Forms\Components\Select::make('filters.font_weight_active')->label('Peso Activo')->options(static::getFontWeightOptions())->default('700'),
                                    ])->columns(3),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('filters.color_bg_active')->label('Fondo Categoría Activa')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('filters.color_text_active')->label('Texto Activa')->default('#ffffff'),
                                        \Filament\Forms\Components\ColorPicker::make('filters.color_bg_inactive')->label('Fondo Inactiva')->default('#f1f5f9'),
                                        \Filament\Forms\Components\ColorPicker::make('filters.color_text_inactive')->label('Texto Inactiva')->default('#64748b'),
                                        \Filament\Forms\Components\ColorPicker::make('filters.color_border')->label('Color Borde')->default('#e2e8f0'),
                                    ])->columns(5),
                                ]),
                        ]),

                    Tab::make('🛒 Checkout / Carrito')
                        ->schema([
                            Section::make('Estilos del Carrito y Página de Checkout')
                                ->schema([
                                    Group::make([
                                        \Filament\Forms\Components\Select::make('checkout.font_family')->label('Fuente')->options(static::getFontOptions())->default('Inter'),
                                        TextInput::make('checkout.font_size_title')->label('Tamaño Título Sección')->default('1.25rem'),
                                        TextInput::make('checkout.font_size_item')->label('Tamaño Item Carrito')->default('0.95rem'),
                                    ])->columns(3),
                                    Group::make([
                                        \Filament\Forms\Components\ColorPicker::make('checkout.color_bg_panel')->label('Fondo Panel')->default('#ffffff'),
                                        \Filament\Forms\Components\ColorPicker::make('checkout.color_total')->label('Color Total')->default('#0f172a'),
                                        \Filament\Forms\Components\ColorPicker::make('checkout.color_btn_checkout_bg')->label('Botón Pagar BG')->default('#22c55e'),
                                        \Filament\Forms\Components\ColorPicker::make('checkout.color_btn_checkout_text')->label('Botón Pagar Texto')->default('#ffffff'),
                                    ])->columns(4),
                                ]),
                        ]),
                ])
                ->visible(fn($record) => $record?->key === 'ecommerce_styles')
                ->contained(false),
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
                        'landing_styles' => 'warning',
                        'ecommerce_styles' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'header' => '🏠 Header / Navegación',
                        'footer' => '📋 Footer / Pie de Página',
                        'whatsapp' => '💬 WhatsApp Flotante',
                        'promo_popup_landing' => '🚀 Popup - Landing Page',
                        'promo_popup_ecommerce' => '🛍️ Popup - Ecommerce',
                        'splash' => '✨ Splash Screen',
                        'landing_styles' => '🎨 Estilos - Landing Page',
                        'ecommerce_styles' => '🛍️ Estilos - E-commerce',
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
