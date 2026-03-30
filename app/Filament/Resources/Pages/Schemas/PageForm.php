<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Schema;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make([
                    TextInput::make('title')
                        ->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($state, $set) => $set('slug', \Illuminate\Support\Str::slug($state))),
                    TextInput::make('slug')
                        ->required()
                        ->unique(\App\Models\Page::class, 'slug', ignoreRecord: true),
                ])->columns(2),

                Toggle::make('is_active')
                    ->label('Página Activa')
                    ->default(true),

                Builder::make('content')
                    ->label('Contenido Dinámico')
                    ->blocks([

                        // ========================================
                        // HERO — Multi-slide carousel
                        // ========================================
                        Block::make('hero')
                            ->label('Hero (Carrusel Multi-Slide)')
                            ->icon('heroicon-o-presentation-chart-bar')
                            ->schema([
                                Repeater::make('slides')
                                    ->label('Slides del Hero')
                                    ->schema([
                                        TextInput::make('title')->required()->label('Título'),
                                        TextInput::make('subtitle')->label('Subtítulo (dorado)'),
                                        Textarea::make('description')->label('Descripción')->rows(2),
                                        Group::make([
                                            TextInput::make('cta_text')->label('Texto Botón'),
                                            TextInput::make('cta_link')->label('Link Botón'),
                                        ])->columns(2),
                                        FileUpload::make('image')
                                            ->label('Imagen de Fondo')
                                            ->image()
                                            ->directory('pages/heros'),
                                    ])
                                    ->defaultItems(3)
                                    ->reorderable()
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Slide'),
                            ]),

                        // ========================================
                        // IDENTITY — Misión/Visión + Counter
                        // ========================================
                        Block::make('identity')
                            ->label('Nuestra Identidad (Misión/Visión)')
                            ->icon('heroicon-o-finger-print')
                            ->schema([
                                TextInput::make('title')->default('Nacimos para Crecer, Servir y Transformar'),
                                Textarea::make('description')->label('Párrafo introductorio')->rows(3),
                                Textarea::make('mission')->label('Misión')->rows(3),
                                Textarea::make('vision')->label('Visión')->rows(3),
                                Group::make([
                                    TextInput::make('counter_value')->label('Cifra del Contador')->numeric()->default(5000),
                                    TextInput::make('counter_label')->label('Etiqueta del Contador')->default('Socios Activos'),
                                ])->columns(2),
                                FileUpload::make('images')
                                    ->label('Mosaico Lateral (3 imágenes)')
                                    ->multiple()
                                    ->maxFiles(3)
                                    ->image()
                                    ->directory('pages/identity'),
                            ]),

                        // ========================================
                        // PRODUCT CARDS — Servicios con imágenes
                        // ========================================
                        Block::make('product_cards')
                            ->label('Tarjetas de Servicios')
                            ->icon('heroicon-o-squares-2x2')
                            ->schema([
                                TextInput::make('title')->default('Nuestros Servicios')->required(),
                                TextInput::make('subtitle')->label('Subtítulo'),
                                Repeater::make('items')
                                    ->label('Servicios')
                                    ->schema([
                                        TextInput::make('name')->required()->label('Nombre'),
                                        TextInput::make('description')->required()->label('Descripción'),
                                        TextInput::make('route')->label('Ruta/Link')->placeholder('/servicios/prestamo-policial'),
                                        TextInput::make('icon')->label('Icono (nombre Lucide)')->default('Shield'),
                                        FileUpload::make('image')
                                            ->label('Imagen del Servicio')
                                            ->image()
                                            ->directory('pages/services'),
                                        Toggle::make('is_featured')->label('Destacado (★ Principal)')->default(false),
                                    ])
                                    ->columns(2)
                                    ->reorderable()
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Servicio'),
                            ]),

                        // ========================================
                        // CREDIT SIMULATOR — Configurable params
                        // ========================================
                        Block::make('credit_simulator')
                            ->label('Simulador de Crédito')
                            ->icon('heroicon-o-calculator')
                            ->schema([
                                TextInput::make('title')->default('Tu Solución Inmediata')->required(),
                                TextInput::make('subtitle')->label('Subtítulo')->default('Calcula con total transparencia institucional.'),
                                Group::make([
                                    TextInput::make('rate')->label('Tasa mensual (%)')->numeric()->default(10),
                                    TextInput::make('min_amount')->label('Monto mínimo (Bs)')->numeric()->default(1000),
                                    TextInput::make('max_amount')->label('Monto máximo (Bs)')->numeric()->default(150000),
                                ])->columns(3),
                                Group::make([
                                    TextInput::make('min_months')->label('Plazo mínimo (meses)')->numeric()->default(1),
                                    TextInput::make('max_months')->label('Plazo máximo (meses)')->numeric()->default(36),
                                    TextInput::make('default_amount')->label('Monto por defecto')->numeric()->default(20000),
                                    TextInput::make('default_months')->label('Plazo por defecto')->numeric()->default(12),
                                ])->columns(4),
                                TextInput::make('cta_text')->label('Texto del Botón')->default('Iniciar Solicitud de Crédito'),
                            ]),

                        // ========================================
                        // BENEFITS — Beneficios Exclusivos
                        // ========================================
                        Block::make('benefits')
                            ->label('Beneficios Exclusivos')
                            ->icon('heroicon-o-gift')
                            ->schema([
                                TextInput::make('title')->default('Beneficios Exclusivos')->required(),
                                TextInput::make('subtitle')->label('Subtítulo')->default('Más allá del crédito, somos tu respaldo integral.'),
                                Repeater::make('items')
                                    ->label('Lista de Beneficios')
                                    ->schema([
                                        TextInput::make('title')->required()->label('Título'),
                                        TextInput::make('description')->required()->label('Descripción'),
                                        TextInput::make('icon')->label('Icono (Lucide)')->default('Shield'),
                                        TextInput::make('link')->label('Link (Opcional)'),
                                    ])
                                    ->columns(2)
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Beneficio'),
                                Group::make([
                                    TextInput::make('status_label')->label('Etiqueta Estado')->default('Socio Activo'),
                                    TextInput::make('status_badge')->label('Badge')->default('Fapclas ERP v3'),
                                ])->columns(2),
                            ]),

                        // ========================================
                        // STATS — Cifradores / Estadísticas
                        // ========================================
                        Block::make('stats')
                            ->label('Cifradores / Estadísticas')
                            ->icon('heroicon-o-users')
                            ->schema([
                                TextInput::make('title')->required(),
                                Repeater::make('items')
                                    ->schema([
                                        TextInput::make('label')->required(),
                                        TextInput::make('value')->required(),
                                        TextInput::make('icon')->label('Icono (Lucide)'),
                                    ])
                                    ->columns(3),
                            ]),

                        // ========================================
                        // GALLERY — Mosaico asimétrico con captions
                        // ========================================
                        Block::make('gallery')
                            ->label('Galería Institucional')
                            ->icon('heroicon-o-photo')
                            ->schema([
                                TextInput::make('title')->required(),
                                TextInput::make('subtitle'),
                                Repeater::make('items')
                                    ->label('Imágenes de la Galería')
                                    ->schema([
                                        TextInput::make('caption')->label('Título/Caption')->required(),
                                        FileUpload::make('image')
                                            ->image()
                                            ->directory('pages/galleries')
                                            ->required(),
                                    ])
                                    ->reorderable()
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['caption'] ?? 'Imagen'),
                            ]),

                        // ========================================
                        // VIDEO — Principal + Galería + Fullscreen
                        // ========================================
                        Block::make('video')
                            ->label('Sección de Videos')
                            ->icon('heroicon-o-play')
                            ->schema([
                                TextInput::make('title')->required()->default('Fapclas en Movimiento'),
                                TextInput::make('subtitle')->default('Conoce Nuestra Historia'),
                                Group::make([
                                    TextInput::make('main_title')->label('Título Video Principal'),
                                    TextInput::make('main_subtitle')->label('Subtítulo Video Principal'),
                                    TextInput::make('main_url')->label('URL Video Principal')->url(),
                                    FileUpload::make('main_thumbnail')
                                        ->label('Thumbnail Principal')
                                        ->image()
                                        ->directory('pages/videos'),
                                ]),
                                Repeater::make('gallery')
                                    ->label('Videos de la Galería')
                                    ->schema([
                                        TextInput::make('title')->required(),
                                        TextInput::make('subtitle'),
                                        TextInput::make('url')->label('URL del Video')->url()->required(),
                                        FileUpload::make('thumbnail')
                                            ->label('Thumbnail')
                                            ->image()
                                            ->directory('pages/videos'),
                                    ])
                                    ->columns(2)
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Video'),
                            ]),

                        // ========================================
                        // TESTIMONIALS — Glassmorphism + Ratings
                        // ========================================
                        Block::make('testimonials')
                            ->label('Testimonios')
                            ->icon('heroicon-o-chat-bubble-bottom-center-text')
                            ->schema([
                                TextInput::make('title')->default('Voces de Nuestra Familia'),
                                TextInput::make('subtitle')->default('Confianza que nos respalda'),
                                Repeater::make('items')
                                    ->schema([
                                        TextInput::make('name')->required()->label('Nombre'),
                                        TextInput::make('role')->label('Cargo/Ubicación'),
                                        Textarea::make('content')->required()->label('Testimonio'),
                                        TextInput::make('rating')->numeric()->default(5)->label('Estrellas (1-5)'),
                                        FileUpload::make('image')->image()->avatar()->directory('pages/testimonials'),
                                    ])
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Testimonio'),
                            ]),

                        // ========================================
                        // FAQ — Accordion
                        // ========================================
                        Block::make('faq')
                            ->label('Preguntas Frecuentes (FAQ)')
                            ->icon('heroicon-o-question-mark-circle')
                            ->schema([
                                TextInput::make('title')->default('Preguntas Frecuentes'),
                                TextInput::make('subtitle')->default('Aclaremos tus dudas operativas antes de que tomes una decisión.'),
                                Repeater::make('items')
                                    ->schema([
                                        TextInput::make('question')->required()->label('Pregunta'),
                                        Textarea::make('answer')->required()->label('Respuesta'),
                                    ])
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['question'] ?? 'Pregunta'),
                            ]),

                        // ========================================
                        // NORMATIVAS — Document Repository (PDFs)
                        // ========================================
                        Block::make('normativas')
                            ->label('Repositorio de Normativas (PDFs)')
                            ->icon('heroicon-o-document-duplicate')
                            ->schema([
                                TextInput::make('title')->default('Repositorio Normativo')->required(),
                                TextInput::make('subtitle')->default('Documentación oficial y regulatoria.'),
                                Repeater::make('items')
                                    ->label('Documentos')
                                    ->schema([
                                        TextInput::make('name')->required()->label('Nombre del Documento'),
                                        TextInput::make('label')->label('Etiqueta (ej: Fiscalización)'),
                                        Textarea::make('description')->label('Breve descripción')->rows(2),
                                        TextInput::make('icon')->label('Icono (Lucide)')->default('FileText'),
                                        TextInput::make('color')->label('Color (blue, emerald, primary, gold)')->default('primary'),
                                        FileUpload::make('file')
                                            ->label('Archivo PDF')
                                            ->acceptedFileTypes(['application/pdf'])
                                            ->directory('pages/normativas')
                                            ->required(),
                                        TextInput::make('button_text')->label('Texto del Botón')->default('Descargar PDF'),
                                    ])
                                    ->columns(2)
                                    ->reorderable()
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Documento'),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(false)
                    ->blockNumbers(false),
            ]);
    }
}
