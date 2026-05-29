<?php

namespace App\Filament\Resources\Configuracions;

use App\Filament\Resources\Configuracions\Pages\CreateConfiguracion;
use App\Filament\Resources\Configuracions\Pages\EditConfiguracion;
use App\Filament\Resources\Configuracions\Pages\ListConfiguracions;
use App\Filament\Resources\Configuracions\Schemas\ConfiguracionForm;
use App\Filament\Resources\Configuracions\Tables\ConfiguracionsTable;
use App\Models\Configuracion;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ConfiguracionResource extends Resource
{
    protected static ?string $model = Configuracion::class;

    protected static ?string $modelLabel = 'Configuración';

    protected static ?string $pluralModelLabel = 'Ajustes del Sistema';

    protected static string|\UnitEnum|null $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 6;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $recordTitleAttribute = 'key';

    public static function form(Schema $schema): Schema
    {
        return ConfiguracionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ConfiguracionsTable::configure($table);
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
            'index' => ListConfiguracions::route('/'),
            'create' => CreateConfiguracion::route('/create'),
            'edit' => EditConfiguracion::route('/{record}/edit'),
        ];
    }
}
