<?php

namespace App\Filament\Resources\Productos\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Filament\Notifications\Notification;
use App\Models\KardexProducto;

class ProductosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_path')
                    ->label('Imagen')
                    ->disk('public')
                    ->square()
                    ->size(50),
                TextColumn::make('codigo_sku')
                    ->searchable()
                    ->label('SKU'),
                TextColumn::make('nombre')
                    ->searchable(),
                TextColumn::make('categoria.nombre')
                    ->numeric()
                    ->sortable()
                    ->label('Categoría'),
                TextColumn::make('precio_general')
                    ->numeric()
                    ->sortable()
                    ->label('Precio'),
                TextColumn::make('stock_actual')
                    ->numeric()
                    ->sortable()
                    ->label('Stock'),
                TextColumn::make('fecha_vencimiento')
                    ->label('Vencimiento')
                    ->date('d/m/Y')
                    ->sortable(),
                ToggleColumn::make('activo')
                    ->label('Activo'),
                TextColumn::make('marca')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('modelo')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('serie')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('calibre')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('precio_asociado')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('precio_credito')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('precio_costo')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('stock_minimo')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
                \Filament\Actions\Action::make('ajustar_stock')
                    ->label('Ajustar Stock')
                    ->icon('heroicon-o-arrows-up-down')
                    ->color('warning')
                    ->form([
                        \Filament\Forms\Components\Select::make('tipo_movimiento')
                            ->label('Tipo de Movimiento')
                            ->options([
                                'ingreso' => 'Ingreso (+)',
                                'egreso' => 'Egreso (-)',
                            ])
                            ->required()
                            ->live(), // Trigger form re-render to toggle cost visibility
                        \Filament\Forms\Components\TextInput::make('cantidad')
                            ->label('Cantidad')
                            ->numeric()
                            ->required()
                            ->minValue(1),
                        \Filament\Forms\Components\TextInput::make('costo_unitario')
                            ->label('Costo Unitario (Bs)')
                            ->numeric()
                            ->prefix('Bs')
                            ->visible(fn($get) => $get('tipo_movimiento') === 'ingreso')
                            ->helperText('Opcional: Si es una compra, ingresa el costo por unidad para actualizar el precio de costo del producto.'),
                        \Filament\Forms\Components\TextInput::make('concepto')
                            ->label('Concepto / Motivo Corto')
                            ->required()
                            ->maxLength(255),
                        \Filament\Forms\Components\Textarea::make('notas')
                            ->label('Respaldos / Notas')
                            ->rows(3)
                            ->helperText('Ej: Factura #123, Proveedor XYZ, Lote #ABC')
                            ->maxLength(1000),
                    ])
                    ->action(function ($record, array $data) {
                        try {
                            app(\App\Services\InventarioService::class)->ajustarStock(
                                $record,
                                (int) $data['cantidad'],
                                $data['tipo_movimiento'],
                                $data['concepto'],
                                auth()->guard('admin')->user()->id ?? auth()->id(),
                                isset($data['costo_unitario']) && $data['costo_unitario'] !== '' ? (float) $data['costo_unitario'] : null,
                                $data['notas'] ?? null
                            );

                            \Filament\Notifications\Notification::make()
                                ->title('Stock actualizado')
                                ->body('El ajuste se registró correctamente en el Kardex.')
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            \Filament\Notifications\Notification::make()
                                ->title('Error al ajustar stock')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    })
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    // SOFT-DELETE: Bloqueo si stock > 0; si pasa, deja registro de auditoría en Kardex
                    DeleteBulkAction::make()
                        ->label('Desactivar / Dar de Baja')
                        ->requiresConfirmation()
                        ->modalHeading('Dar de Baja Productos')
                        ->modalDescription('Los productos con historial de ventas o Kardex no serán eliminados físicamente. Si alguno tiene stock activo, se registrará una baja de inventario en el Kardex antes de desactivarlo.')
                        ->before(function ($records, DeleteBulkAction $action) {
                            foreach ($records as $producto) {
                                // Registrar baja de stock si tiene inventario valorizado
                                if ($producto->stock_actual > 0) {
                                    KardexProducto::create([
                                        'producto_id'      => $producto->id,
                                        'tipo_movimiento'  => 'egreso',
                                        'cantidad'         => $producto->stock_actual,
                                        'saldo_stock'      => 0,
                                        'costo_unitario'   => $producto->precio_costo ?? 0,
                                        'concepto'         => 'Baja Administrativa de Inventario',
                                        'usuario_admin_id' => auth()->id(),
                                        'notas'            => '[AUDITORÍA ' . now()->format('Y-m-d H:i:s') . '] Producto dado de baja con ' . $producto->stock_actual . ' unidades en stock. Stock ajustado a 0 para mantener integridad contable.',
                                    ]);
                                    $producto->update(['stock_actual' => 0]);
                                }
                            }
                        }),

                    // FORCE-DELETE: Bloqueado absolutamente si tiene ventas o kardex histórico
                    ForceDeleteBulkAction::make()
                        ->label('Eliminar Permanentemente')
                        ->requiresConfirmation()
                        ->modalHeading('⚠️ Eliminación Física Permanente')
                        ->modalDescription('ADVERTENCIA: Esta acción es irreversible. Solo se permite si el producto no tiene ningún historial de ventas ni movimientos de Kardex.')
                        ->before(function ($records, ForceDeleteBulkAction $action) {
                            $bloqueados = $records->filter(
                                fn($p) => $p->kardex()->withTrashed()->count() > 0
                                    || \App\Models\PedidoDetalle::where('producto_id', $p->id)->exists()
                            );
                            if ($bloqueados->isNotEmpty()) {
                                $nombres = $bloqueados->pluck('nombre')->join(', ');
                                Notification::make()
                                    ->title('Eliminación Física Bloqueada — Trazabilidad')
                                    ->body("Los siguientes productos tienen historial de ventas o Kardex y no pueden eliminarse físicamente: {$nombres}")
                                    ->danger()
                                    ->persistent()
                                    ->send();
                                $action->cancel();
                            }
                        })
                        ->visible(fn() => auth()->user()->hasRole('SuperAdmin')),

                    RestoreBulkAction::make(),
                ]),
            ])
            ->defaultSort('id', 'desc');
    }
}
