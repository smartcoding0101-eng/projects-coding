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

class ProductosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_path')
                    ->label('Imagen'),
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
                TextColumn::make('fecha_vencimiento')
                    ->date()
                    ->sortable()
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
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
