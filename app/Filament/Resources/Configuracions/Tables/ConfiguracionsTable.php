<?php

namespace App\Filament\Resources\Configuracions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class ConfiguracionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->searchable()
                    ->label('Llave Interna')
                    ->width('25%'),
                TextColumn::make('description')
                    ->searchable()
                    ->wrap()
                    ->label('Descripción')
                    ->description(fn ($record) => !in_array(strtolower($record->value), ['si', 'no', 'true', 'false', '1', '0']) ? "Valor: {$record->value}" : null)
                    ->width('45%'),
                ToggleColumn::make('value_toggle')
                    ->label('Valor')
                    ->getStateUsing(fn ($record) => in_array(strtolower($record->value), ['si', 'true', '1']))
                    ->updateStateUsing(function ($record, $state) {
                        if (in_array(strtolower($record->value), ['si', 'no'])) {
                            $record->value = $state ? 'si' : 'no';
                        } else {
                            $record->value = $state ? 'true' : 'false';
                        }
                        $record->save();
                    })
                    ->disabled(fn ($record) => !in_array(strtolower($record->value), ['si', 'no', 'true', 'false', '1', '0']))
                    ->width('30%'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
