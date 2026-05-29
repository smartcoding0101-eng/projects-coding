<?php

namespace App\Filament\Resources\KardexProductos;

use App\Filament\Resources\KardexProductos\Pages\CreateKardexProducto;
use App\Filament\Resources\KardexProductos\Pages\EditKardexProducto;
use App\Filament\Resources\KardexProductos\Pages\ListKardexProductos;
use App\Filament\Resources\KardexProductos\Schemas\KardexProductoForm;
use App\Filament\Resources\KardexProductos\Tables\KardexProductosTable;
use App\Models\KardexProducto;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class KardexProductoResource extends Resource
{
    protected static ?string $model = KardexProducto::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static string|\UnitEnum|null $navigationGroup = 'E-commerce';

    protected static ?string $modelLabel = 'Movimiento de Inventario';

    protected static ?string $pluralModelLabel = 'Kardex de Productos';

    protected static ?int $navigationSort = 4;

    protected static ?string $recordTitleAttribute = 'id';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return false;
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return KardexProductoForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KardexProductosTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListKardexProductos::route('/'),
        ];
    }
}
