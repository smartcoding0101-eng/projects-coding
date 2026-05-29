<?php

namespace App\Filament\Resources\Pedidos\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PedidoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make([
                    Section::make('Información del Cliente')
                        ->schema([
                            TextInput::make('nombre_cliente')
                                ->disabled()->label('Nombre Completo'),
                            TextInput::make('ci_cliente')
                                ->disabled()->label('DNI / CI'),
                            TextInput::make('telefono_contacto')
                                ->tel()->disabled()->label('Teléfono'),
                        ])->columns(3),

                    Section::make('Detalles de Entrega')
                        ->schema([
                            Select::make('tipo_entrega')
                                ->options([
                                    'recojo_tienda' => 'Recojo en Local',
                                    'envio_domicilio' => 'Envío a Domicilio',
                                ])
                                ->label('Método de Entrega'),
                            TextInput::make('costo_envio')
                                ->numeric()
                                ->label('Costo de Envío')->prefix('Bs'),
                            Textarea::make('direccion_envio')
                                ->label('Dirección de Envío')->columnSpanFull(),
                        ])->columns(2),

                    Section::make('Lista de Productos')
                        ->schema([
                            Repeater::make('detalles')
                                ->relationship()
                                ->schema([
                                    Select::make('producto_id')
                                        ->relationship('producto', 'nombre')
                                        ->disabled()
                                        ->label('Producto')
                                        ->columnSpan(2),
                                    TextInput::make('cantidad')
                                        ->disabled(),
                                    TextInput::make('precio_unitario')
                                        ->disabled()
                                        ->prefix('Bs'),
                                    TextInput::make('subtotal')
                                        ->disabled()
                                        ->prefix('Bs'),
                                ])
                                ->columns(5)
                                ->addable(false)
                                ->deletable(false)
                                ->reorderable(false),
                        ]),
                ])->columnSpan(['lg' => 2]),

                Group::make([
                    Section::make('Resumen del Pedido')
                        ->schema([
                            TextInput::make('numero_orden')
                                ->disabled()->label('N° de Orden'),
                            Select::make('tipo_pago')
                                ->options([
                                    'qr' => 'QR',
                                    'efectivo' => 'Efectivo',
                                    'transferencia' => 'Transferencia',
                                ])
                                ->label('Método de Pago'),
                            Select::make('estado_pago')
                                ->options([
                                    'pendiente_validacion' => 'Pendiente de Validación',
                                    'pagado' => 'Pagado',
                                    'rechazado' => 'Rechazado',
                                ])
                                ->label('Estado de Pago'),
                            Select::make('estado_entrega')
                                ->options([
                                    'por_recoger' => 'Por Recoger',
                                    'entregado' => 'Entregado',
                                ])
                                ->label('Estado de Entrega'),
                            TextInput::make('total')
                                ->disabled()->prefix('Bs')->label('Total a Pagar')->extraAttributes(['class' => 'text-xl font-bold']),
                        ]),

                    Section::make('Comprobante de Pago')
                        ->schema([
                            FileUpload::make('comprobante_qr_path')
                                ->image()
                                ->disabled()
                                ->label('')
                                ->disk('public')
                                ->directory('tienda/comprobantes'),
                        ])->visible(fn($record) => $record && $record->comprobante_qr_path !== null),

                    Section::make('Observaciones')
                        ->schema([
                            Textarea::make('observaciones')
                                ->label('Notas del Administrador'),
                        ]),
                ])->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }
}
