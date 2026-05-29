<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make([
                    Section::make('Información Principal')->schema([
                        TextInput::make('name')
                            ->required()
                            ->label('Nombre'),
                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->label('Correo Electrónico'),
                        TextInput::make('password')
                            ->password()
                            ->dehydrated(fn($state) => filled($state))
                            ->required(fn(string $context): bool => $context === 'create')
                            ->label('Contraseña'),
                    ])->columns(2),

                    Section::make('Adicionales')->schema([
                        TextInput::make('persona_id')
                            ->numeric()
                            ->label('ID Persona Associada (Opcional)')
                            ->default(null),
                        TextInput::make('whatsapp')
                            ->tel()
                            ->label('WhatsApp')
                            ->default(null),
                    ])->columns(2),
                ])->columnSpan(['lg' => 2]),

                Group::make([
                    Section::make('Roles y Permisos')->schema([
                        Select::make('roles')
                            ->multiple()
                            ->relationship('roles', 'name')
                            ->preload()
                            ->label('Rol del Usuario'),
                    ]),
                ])->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }
}
