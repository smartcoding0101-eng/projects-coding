<?php

namespace App\Filament\Resources\Pedidos\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Notifications\Notification;
use App\Models\KardexProducto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\HtmlString;

class PedidosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('numero_orden')
                    ->searchable()
                    ->sortable()
                    ->label('N° Orden'),
                TextColumn::make('nombre_cliente')
                    ->searchable()
                    ->label('Cliente'),
                TextColumn::make('tipo_entrega')
                    ->badge()
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'recojo_tienda' => 'Recojo en Tienda',
                        'envio_domicilio' => 'Envío a Domicilio',
                        default => $state,
                    })
                    ->label('Tipo Entrega'),
                TextColumn::make('estado_pago')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pendiente_validacion' => 'warning',
                        'pagado' => 'success',
                        'rechazado' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'pendiente_validacion' => 'Pendiente',
                        'pagado' => 'Pagado',
                        'rechazado' => 'Rechazado',
                        default => $state,
                    })
                    ->label('Pago'),
                TextColumn::make('estado_entrega')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'por_recoger' => 'warning',
                        'entregado' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'por_recoger' => 'Por Recoger',
                        'entregado' => 'Entregado',
                        default => $state,
                    })
                    ->label('Entrega'),
                TextColumn::make('total')
                    ->numeric()
                    ->prefix('Bs ')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->label('Fecha Pedido'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                Action::make('validarPago')
                    ->label('Validar Pago')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Confirmar Validación de Pago')
                    ->modalDescription(fn($record) => "¿Está seguro de validar el pago del pedido #{$record->numero_orden} por Bs {$record->total}?")
                    ->modalSubmitActionLabel('Sí, Validar Pago')
                    ->modalCancelActionLabel('Cancelar')
                    ->visible(fn($record) => $record->estado_pago === 'pendiente_validacion' && auth()->user()->hasRole(['SuperAdmin', 'Administrador']))
                    ->action(function ($record) {
                        DB::transaction(function () use ($record) {
                            $record->update(['estado_pago' => 'pagado']);

                            \App\Models\LibroDiario::create([
                                'user_id' => $record->user_id,
                                'cajero_id' => auth()->id(),
                                'fecha' => now()->toDateString(),
                                'concepto' => "Pago E-commerce - Pedido #{$record->numero_orden}",
                                'ingreso' => $record->total,
                                'egreso' => 0,
                                'tipo_transaccion' => 'venta_ecommerce',
                                'referencia_id' => $record->id,
                            ]);
                        });

                        Notification::make()
                            ->title('Pago Validado con Éxito')
                            ->success()
                            ->send();
                    }),
                Action::make('rechazarPago')
                    ->label('Rechazar')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Confirmar Rechazo de Pago')
                    ->modalDescription(fn($record) => "¿Está seguro de rechazar el pago del pedido #{$record->numero_orden}? Esta acción devolverá el stock reservado.")
                    ->modalSubmitActionLabel('Sí, Rechazar Pago')
                    ->modalCancelActionLabel('Cancelar')
                    ->visible(fn($record) => $record->estado_pago === 'pendiente_validacion' && auth()->user()->hasRole(['SuperAdmin', 'Administrador']))
                    ->action(function ($record) {
                        $record->update(['estado_pago' => 'rechazado']);
                        Notification::make()
                            ->title('Pago Rechazado')
                            ->danger()
                            ->send();
                    }),
                Action::make('entregarPedido')
                    ->label('Entregar')
                    ->icon('heroicon-o-truck')
                    ->color('info')
                    ->requiresConfirmation()
                    ->modalHeading('Confirmar Entrega de Pedido')
                    ->modalDescription(function ($record) {
                        $record->load('detalles.producto');

                        $tipoEntrega = match ($record->tipo_entrega) {
                            'recojo_tienda' => '📍 Recojo en Tienda',
                            'envio_domicilio' => '🚚 Envío a Domicilio',
                            default => $record->tipo_entrega,
                        };

                        $html = "<div style='text-align:left; font-size:0.875rem;'>";
                        $html .= "<p><strong>Pedido:</strong> #{$record->numero_orden}</p>";
                        $html .= "<p><strong>Cliente:</strong> {$record->nombre_cliente}</p>";
                        $html .= "<p><strong>Método:</strong> {$tipoEntrega}</p>";

                        if ($record->tipo_entrega === 'envio_domicilio' && $record->direccion_envio) {
                            $html .= "<p><strong>Dirección:</strong> {$record->direccion_envio}</p>";
                        }

                        $html .= "<hr style='margin: 0.75rem 0; border-color: #e5e7eb;'>";
                        $html .= "<p style='font-weight:600; margin-bottom:0.5rem;'>📦 Productos a entregar (se descontará del stock):</p>";
                        $html .= "<table style='width:100%; border-collapse:collapse; font-size:0.8rem;'>";
                        $html .= "<thead><tr style='border-bottom:2px solid #e5e7eb;'>";
                        $html .= "<th style='text-align:left; padding:4px 8px;'>Producto</th>";
                        $html .= "<th style='text-align:center; padding:4px 8px;'>Cant.</th>";
                        $html .= "<th style='text-align:center; padding:4px 8px;'>Stock Actual</th>";
                        $html .= "<th style='text-align:center; padding:4px 8px;'>Stock Después</th>";
                        $html .= "</tr></thead><tbody>";

                        $hayProblemaStock = false;

                        foreach ($record->detalles as $detalle) {
                            $producto = $detalle->producto;
                            $stockActual = $producto ? $producto->stock_actual : 0;
                            $stockDespues = $stockActual - $detalle->cantidad;
                            $sinStock = $stockDespues < 0;
                            $stockBajo = !$sinStock && $producto && $stockDespues <= $producto->stock_minimo;

                            if ($sinStock)
                                $hayProblemaStock = true;

                            $colorFila = $sinStock ? 'color:#dc2626;' : ($stockBajo ? 'color:#d97706;' : '');
                            $icono = $sinStock ? ' ⚠️' : ($stockBajo ? ' ⚡' : '');

                            $nombreProd = $producto ? $producto->nombre : 'Producto eliminado';

                            $html .= "<tr style='border-bottom:1px solid #f3f4f6; {$colorFila}'>";
                            $html .= "<td style='padding:4px 8px;'>{$nombreProd}</td>";
                            $html .= "<td style='text-align:center; padding:4px 8px;'>{$detalle->cantidad}</td>";
                            $html .= "<td style='text-align:center; padding:4px 8px;'>{$stockActual}</td>";
                            $html .= "<td style='text-align:center; padding:4px 8px; font-weight:600;'>{$stockDespues}{$icono}</td>";
                            $html .= "</tr>";
                        }

                        $html .= "</tbody></table>";

                        if ($hayProblemaStock) {
                            $html .= "<div style='margin-top:0.75rem; padding:0.5rem; background:#fef2f2; border:1px solid #fecaca; border-radius:0.375rem; color:#991b1b; font-size:0.8rem;'>";
                            $html .= "⚠️ <strong>Atención:</strong> Algunos productos no tienen suficiente stock. La entrega se procesará pero el stock quedará en negativo.";
                            $html .= "</div>";
                        }

                        $html .= "<div style='margin-top:0.75rem; padding:0.5rem; background:#eff6ff; border:1px solid #bfdbfe; border-radius:0.375rem; color:#1e40af; font-size:0.8rem;'>";
                        $html .= "ℹ️ Al confirmar, se descontará el stock de cada producto y se registrará el movimiento en el Kardex.";
                        $html .= "</div>";

                        $html .= "<p style='margin-top:0.75rem; font-weight:600;'>Total del pedido: Bs {$record->total}</p>";
                        $html .= "</div>";

                        return new HtmlString($html);
                    })
                    ->modalSubmitActionLabel('Sí, Confirmar Entrega')
                    ->modalCancelActionLabel('Cancelar')
                    ->visible(fn($record) => $record->estado_entrega === 'por_recoger' && $record->estado_pago === 'pagado' && auth()->user()->hasRole(['SuperAdmin', 'Administrador']))
                    ->action(function ($record) {
                        DB::transaction(function () use ($record) {
                            $record->load('detalles.producto');

                            // Descontar stock y registrar kardex por cada producto
                            foreach ($record->detalles as $detalle) {
                                $producto = $detalle->producto;
                                if (!$producto)
                                    continue;

                                $nuevoStock = $producto->stock_actual - $detalle->cantidad;
                                $producto->update(['stock_actual' => $nuevoStock]);

                                KardexProducto::create([
                                    'producto_id' => $producto->id,
                                    'tipo_movimiento' => 'egreso',
                                    'cantidad' => $detalle->cantidad,
                                    'saldo_stock' => $nuevoStock,
                                    'costo_unitario' => $detalle->precio_unitario,
                                    'concepto' => "Venta - Pedido #{$record->numero_orden}",
                                    'usuario_admin_id' => auth()->id(),
                                    'notas' => "Entrega de pedido #{$record->numero_orden} al cliente {$record->nombre_cliente}",
                                ]);
                            }

                            $record->update(['estado_entrega' => 'entregado']);
                        });

                        Notification::make()
                            ->title('Pedido Entregado Exitosamente')
                            ->body("Se descontó el stock y se registró en el Kardex.")
                            ->success()
                            ->send();
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
