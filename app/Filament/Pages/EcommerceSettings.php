<?php

namespace App\Filament\Pages;

use App\Models\Configuracion;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EcommerceSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.ecommerce-settings';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $title = 'Configuración E-Commerce';

    protected static ?string $navigationLabel = 'Config. Global';

    protected static string|\UnitEnum|null $navigationGroup = 'Administración';

    protected static ?int $navigationSort = 0;

    // ── Form state ───────────────────────────────────────────────
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Configuracion::where('key', 'like', 'ecommerce_%')
            ->orWhere('key', 'whatsapp_soporte')
            ->pluck('value', 'key')
            ->toArray();

        // Decode hero_slides JSON
        if (isset($settings['ecommerce_hero_slides'])) {
            $settings['ecommerce_hero_slides'] = json_decode($settings['ecommerce_hero_slides'], true) ?? [];
        }

        // Cast booleans robustly (handling 'si', 'no', 'true', 'false', '1', '0')
        foreach (['ecommerce_mostrar_precios', 'ecommerce_mostrar_precio_venta', 'ecommerce_mostrar_precio_credito', 'ecommerce_mostrar_stock', 'ecommerce_habilitar_invitados', 'ecommerce_modo_mantenimiento', 'ecommerce_pago_exige_caja'] as $boolKey) {
            $val = $settings[$boolKey] ?? null;
            $settings[$boolKey] = ($val === 'si' || $val === 'true' || $val === '1' || $val === 1 || $val === true);
        }

        $this->form->fill($settings);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Tabs::make('Configuración E-Commerce')
                    ->schema([

                        // ═══════════════════════════════════════
                        // TAB 1: HERO & CARRUSEL
                        // ═══════════════════════════════════════
                        Tab::make('Hero & Carrusel')
                            ->icon('heroicon-o-presentation-chart-bar')
                            ->schema([
                                Section::make('Textos del Hero Principal')
                                    ->schema([
                                        TextInput::make('ecommerce_titulo_hero')
                                            ->label('Título')
                                            ->placeholder('Bienvenido a nuestra Tienda'),
                                        TextInput::make('ecommerce_subtitulo_hero')
                                            ->label('Subtítulo'),
                                        Textarea::make('ecommerce_descripcion_hero')
                                            ->label('Descripción')
                                            ->rows(2),
                                        TextInput::make('ecommerce_badge_hero')
                                            ->label('Badge Decorativo')
                                            ->placeholder('¡Nuevo!'),
                                    ])->columns(2),

                                Section::make('Slides del Carrusel')
                                    ->description('Gestiona las diapositivas del carrusel Hero de la tienda.')
                                    ->schema([
                                        Repeater::make('ecommerce_hero_slides')
                                            ->label('')
                                            ->schema([
                                                TextInput::make('title')
                                                    ->label('Título del Slide')
                                                    ->required(),
                                                TextInput::make('subtitle')
                                                    ->label('Subtítulo'),
                                                Textarea::make('description')
                                                    ->label('Descripción')
                                                    ->rows(2),
                                                TextInput::make('button_text')
                                                    ->label('Texto del Botón'),
                                                TextInput::make('button_link')
                                                    ->label('Link del Botón')
                                                    ->url(),
                                                FileUpload::make('image')
                                                    ->label('Imagen del Slide')
                                                    ->image()
                                                    ->disk('public')
                                                    ->directory('ecommerce/hero')
                                                    ->maxSize(5120)
                                                    ->helperText('📐 Dimensiones: 1920 × 600 px · Relación 16:5 (Banner panorámico) · Formatos: JPG, PNG · Máx: 5MB')
                                                    ->hint('Imagen de fondo del slide del Hero de la Tienda Virtual.')
                                                    ->imageResizeMode('cover')
                                                    ->imageCropAspectRatio('16:5')
                                                    ->imageResizeTargetWidth('1920')
                                                    ->imageResizeTargetHeight('600'),
                                            ])
                                            ->columns(2)
                                            ->collapsible()
                                            ->reorderable()
                                            ->itemLabel(fn(array $state): ?string => $state['title'] ?? 'Slide'),
                                    ]),
                            ]),

                        // ═══════════════════════════════════════
                        // TAB 2: PAGOS & PRECIOS
                        // ═══════════════════════════════════════
                        Tab::make('Pagos & Precios')
                            ->icon('heroicon-o-credit-card')
                            ->schema([
                                Section::make('Código QR de Pago')
                                    ->description('Sube la imagen del código QR que verán los clientes al pagar.')
                                    ->schema([
                                        FileUpload::make('ecommerce_qr_pago')
                                            ->label('Imagen del Código QR')
                                            ->image()
                                            ->disk('public')
                                            ->directory('ecommerce')
                                            ->maxSize(2048)
                                            ->imagePreviewHeight('200')
                                            ->helperText('📐 Dimensiones: 800 × 800 px · Relación 1:1 (Cuadrado) · Formatos: PNG (recomendado para QR), JPG')
                                            ->hint('Código QR de pago que verán los clientes en el checkout. PNG garantiza mejor lectura del escáner.'),
                                    ]),

                                Section::make('Visibilidad de Precios y Stock')
                                    ->schema([
                                        Toggle::make('ecommerce_mostrar_precios')
                                            ->label('Mostrar Precios en la Tienda')
                                            ->helperText('Si se desactiva, los precios no se mostrarán al público.'),
                                        Toggle::make('ecommerce_mostrar_precio_venta')
                                            ->label('Mostrar Precio de Venta'),
                                        Toggle::make('ecommerce_mostrar_precio_credito')
                                            ->label('Mostrar Precio a Crédito'),
                                        Toggle::make('ecommerce_mostrar_stock')
                                            ->label('Mostrar Stock Disponible'),
                                    ])->columns(2),

                                Section::make('Descuentos y Crédito')
                                    ->schema([
                                        TextInput::make('ecommerce_descuento_socios_global')
                                            ->label('Descuento Global para Socios (%)')
                                            ->numeric()
                                            ->suffix('%'),
                                        TextInput::make('ecommerce_limite_credito_default')
                                            ->label('Límite de Crédito por Defecto')
                                            ->numeric()
                                            ->prefix('Bs'),
                                    ])->columns(2),
                            ]),

                        // ═══════════════════════════════════════
                        // TAB 3: DATOS DE LA TIENDA
                        // ═══════════════════════════════════════
                        Tab::make('Datos de la Tienda')
                            ->icon('heroicon-o-building-storefront')
                            ->schema([
                                Section::make('Información de Contacto')
                                    ->schema([
                                        TextInput::make('ecommerce_direccion_tienda')
                                            ->label('Dirección Física')
                                            ->columnSpanFull(),
                                        TextInput::make('ecommerce_telefono_tienda')
                                            ->label('Teléfono')
                                            ->tel(),
                                        TextInput::make('ecommerce_whatsapp_tienda')
                                            ->label('WhatsApp de la Tienda'),
                                        TextInput::make('ecommerce_horario_atencion')
                                            ->label('Horario de Atención')
                                            ->columnSpanFull(),
                                        TextInput::make('whatsapp_soporte')
                                            ->label('WhatsApp Soporte General'),
                                    ])->columns(2),
                            ]),

                        // ═══════════════════════════════════════
                        // TAB 4: AVANZADO
                        // ═══════════════════════════════════════
                        Tab::make('Avanzado')
                            ->icon('heroicon-o-wrench-screwdriver')
                            ->schema([
                                Section::make('Controles del Sistema')
                                    ->schema([
                                        Toggle::make('ecommerce_modo_mantenimiento')
                                            ->label('🚧 Modo Mantenimiento')
                                            ->helperText('Activa para inhabilitar temporalmente la tienda al público.'),
                                        Toggle::make('ecommerce_habilitar_invitados')
                                            ->label('Habilitar Compras de Invitados')
                                            ->helperText('Permite compras sin registro de cuenta.'),
                                        Toggle::make('ecommerce_pago_exige_caja')
                                            ->label('Pago Exige Caja Registradora')
                                            ->helperText('Si se activa, los pagos deben pasar por el módulo de Caja.'),
                                    ])->columns(1),

                                Section::make('Texto Legal')
                                    ->schema([
                                        Textarea::make('ecommerce_nota_legal')
                                            ->label('Nota Legal / Términos de la Tienda')
                                            ->rows(4)
                                            ->columnSpanFull(),
                                    ]),
                            ]),

                        // ═══════════════════════════════════════
                        // TAB 5: APARIENCIA
                        // ═══════════════════════════════════════
                        Tab::make('Apariencia')
                            ->icon('heroicon-o-paint-brush')
                            ->schema([
                                Section::make('Paleta de Colores del Sistema')
                                    ->description('Seleccione el tema visual para su cuenta. El cambio es inmediato y persistente.')
                                    ->schema([
                                        \Filament\Forms\Components\Radio::make('user_theme')
                                            ->label('')
                                            ->options([
                                                'premium-olive' => '🫒 Olivo Premium (SAP Heritage)',
                                                'corporate-blue' => '🔵 Azul Corporativo (Banking)',
                                                'dark-night' => '🌙 Noche Profunda (Dark)',
                                                'classic-light' => '⬜ Blanco Clásico (Light)',
                                            ])
                                            ->default(Auth::user()?->theme_preference ?? 'premium-olive')
                                            ->descriptions([
                                                'premium-olive' => 'Tonos verdes institucionales inspirados en SAP S/4HANA.',
                                                'corporate-blue' => 'Azul corporativo profesional estilo banking.',
                                                'dark-night' => 'Tema oscuro de alto contraste para trabajo nocturno.',
                                                'classic-light' => 'Fondo blanco minimalista de alta legibilidad.',
                                            ])
                                            ->columns(2),
                                    ]),
                            ]),

                        // ═══════════════════════════════════════
                        // TAB 6: BACKUPS
                        // ═══════════════════════════════════════
                        Tab::make('Planificación de Backups')
                            ->icon('heroicon-o-server-stack')
                            ->schema([
                                \Filament\Schemas\Components\Grid::make(2)->schema([
                                    Section::make('BACKUP MANUAL (.SQL)')
                                        ->description('Genera y descarga instantáneamente una copia de la base de datos eligiendo el nombre del archivo.')
                                        ->icon('heroicon-o-arrow-down-tray')
                                        ->columnSpan(1)
                                        ->schema([
                                            TextInput::make('backup_filename')
                                                ->label('TÍTULO DEL ARCHIVO')
                                                ->default('backup_' . date('Y_m_d')),
                                            \Filament\Schemas\Components\Actions::make([
                                                \Filament\Actions\Action::make('descargarArchivo')
                                                    ->label('Descargar Archivo')
                                                    ->icon('heroicon-o-arrow-down-tray')
                                                    ->action('downloadSqlBackup')
                                                    ->color('success')
                                                    ->extraAttributes(['class' => 'w-full justify-center'])
                                            ])->fullWidth(),
                                        ]),

                                    Section::make('PROGRAMACIÓN (SERVIDOR)')
                                        ->description('Una vez configurado, presione "Guardar Configuración" en la pantalla principal.')
                                        ->icon('heroicon-o-calendar')
                                        ->columnSpan(1)
                                        ->schema([
                                            \Filament\Forms\Components\Select::make('backup_cron_status')
                                                ->label('ACTIVACIÓN DEL CRON')
                                                ->options([
                                                    'activo' => '⏳ ACTIVO',
                                                    'pausado' => '❌ PAUSADO'
                                                ])
                                                ->default('pausado'),
                                            \Filament\Forms\Components\CheckboxList::make('backup_days')
                                                ->label('DÍAS AUTORIZADOS')
                                                ->options([
                                                    'L' => 'L',
                                                    'M' => 'M',
                                                    'X' => 'X',
                                                    'J' => 'J',
                                                    'V' => 'V',
                                                    'S' => 'S',
                                                    'D' => 'D'
                                                ])
                                                ->columns(7)
                                                ->gridDirection('row'),
                                            \Filament\Schemas\Components\Grid::make(2)->schema([
                                                \Filament\Forms\Components\TimePicker::make('backup_hora_inicio')->label('HORA INICIO')->default('08:00'),
                                                \Filament\Forms\Components\TimePicker::make('backup_hora_cierre')->label('HORA CIERRE')->default('18:00'),
                                            ]),
                                            \Filament\Forms\Components\Select::make('backup_repeticion')
                                                ->label('REPETICIÓN')
                                                ->options([
                                                    '1_vez_al_dia' => '1 VEZ AL DÍA (EN H. INICIO)',
                                                    'cada_1_hora' => 'CADA 1 HORA (ENTRE RANGOS)',
                                                    'cada_6_horas' => 'CADA 6 HORAS (ENTRE RANGOS)',
                                                ])
                                                ->default('1_vez_al_dia'),
                                        ]),
                                ])
                            ]),

                    ])->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        // ── Hero slides → JSON ──────────────────────────────────
        if (isset($data['ecommerce_hero_slides'])) {
            $slides = $data['ecommerce_hero_slides'];
            unset($data['ecommerce_hero_slides']);
            Configuracion::updateOrCreate(
                ['key' => 'ecommerce_hero_slides'],
                ['value' => json_encode($slides)]
            );
        }

        // ── QR image path ───────────────────────────────────────
        if (isset($data['ecommerce_qr_pago']) && $data['ecommerce_qr_pago']) {
            $qrValue = $data['ecommerce_qr_pago'];
            // FileUpload returns a path relative to disk; store full url
            if (!str_starts_with($qrValue, '/') && !str_starts_with($qrValue, 'http')) {
                $qrValue = Storage::disk('public')->url($qrValue);
            }
            $data['ecommerce_qr_pago'] = $qrValue;
        }

        // ── Persist each key ────────────────────────────────────
        foreach ($data as $key => $value) {
            // Cast booleans to 'si'/'no' or '1'/'0'
            if (is_bool($value)) {
                if ($key === 'ecommerce_pago_exige_caja') {
                    $value = $value ? '1' : '0';
                } else {
                    $value = $value ? 'si' : 'no';
                }
            }

            Configuracion::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        Notification::make()
            ->title('Configuración guardada exitosamente')
            ->success()
            ->send();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Guardar Configuración')
                ->icon('heroicon-o-check')
                ->action('save')
                ->color('success'),
            Action::make('applyTheme')
                ->label('Aplicar Tema')
                ->icon('heroicon-o-paint-brush')
                ->action('setTheme')
                ->color('warning'),
        ];
    }

    public function setTheme(): void
    {
        $data = $this->form->getState();
        $theme = $data['user_theme'] ?? 'premium-olive';

        $user = Auth::user();
        $user->theme_preference = $theme;
        $user->save();

        Notification::make()
            ->title('Tema actualizado a: ' . match ($theme) {
                'premium-olive' => 'Olivo Premium',
                'corporate-blue' => 'Azul Corporativo',
                'dark-night' => 'Noche Profunda',
                'classic-light' => 'Blanco Clásico',
                default => $theme,
            })
            ->success()
            ->send();
    }

    public function downloadSqlBackup()
    {
        $data = $this->form->getState();
        $filename = $data['backup_filename'] ?? 'backup_' . date('Y_m_d');
        if (!str_ends_with($filename, '.sql')) {
            $filename .= '.sql';
        }
        $path = storage_path('app/' . $filename);

        try {
            \Spatie\DbDumper\Databases\MySql::create()
                ->setDbName(config('database.connections.mysql.database'))
                ->setUserName(config('database.connections.mysql.username'))
                ->setPassword(config('database.connections.mysql.password'))
                ->dumpToFile($path);

            return response()->download($path)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Notification::make()
                ->title('Error al generar backup SQL')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}
