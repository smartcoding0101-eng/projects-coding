<?php

namespace App\Filament\Resources\KardexProductos\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\DatePicker;

class KardexProductosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('producto.nombre')
                    ->label('Producto')
                    ->searchable()
                    ->sortable()
                    ->description(fn($record) => 'SKU: ' . ($record->producto->codigo_sku ?? 'N/A')),
                TextColumn::make('tipo_movimiento')
                    ->label('Tipo')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'ingreso' => 'success',
                        'egreso' => 'danger',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('cantidad')
                    ->numeric()
                    ->sortable()
                    ->alignRight(),
                TextColumn::make('saldo_stock')
                    ->label('Stock Resultante')
                    ->numeric()
                    ->sortable()
                    ->alignRight(),
                TextColumn::make('concepto')
                    ->searchable()
                    ->wrap()
                    ->limit(50),
                TextColumn::make('admin.name')
                    ->label('Responsable')
                    ->searchable()
                    ->sortable()
                    ->placeholder('Sistema'),
                TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('tipo_movimiento')
                    ->label('Tipo de Mov.')
                    ->options([
                        'ingreso' => 'Ingreso (+)',
                        'egreso' => 'Egreso (-)',
                    ]),
                SelectFilter::make('producto_id')
                    ->label('Producto')
                    ->relationship('producto', 'nombre')
                    ->searchable()
                    ->preload(),
                Filter::make('rango_fechas')
                    ->form([
                        DatePicker::make('desde'),
                        DatePicker::make('hasta'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['desde'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['hasta'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    })
            ])
            ->recordActions([
                // Read-only
            ])
            ->bulkActions([
                // Read-only
            ]);
    }
}
