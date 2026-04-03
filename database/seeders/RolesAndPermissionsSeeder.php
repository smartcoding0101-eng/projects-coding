<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar caché de permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear Roles
        $roleAdmin = Role::firstOrCreate(['name' => 'SuperAdmin']);
        $roleOficial = Role::firstOrCreate(['name' => 'Oficial Crédito']);
        $roleCajero = Role::firstOrCreate(['name' => 'Cajero']);
        $roleSocio = Role::firstOrCreate(['name' => 'Socio Base']);

        // Crear Permisos
        Permission::firstOrCreate(['name' => 'gestionar usuarios']);
        Permission::firstOrCreate(['name' => 'gestionar creditos']);
        Permission::firstOrCreate(['name' => 'aprobar creditos']);
        Permission::firstOrCreate(['name' => 'ver reportes']);
        Permission::firstOrCreate(['name' => 'ver estado cuenta']);
        Permission::firstOrCreate(['name' => 'gestionar caja']);
        Permission::firstOrCreate(['name' => 'gestionar ecommerce']);

        // Asignar permisos
        $roleAdmin->givePermissionTo(Permission::all());
        $roleOficial->givePermissionTo(['gestionar creditos', 'aprobar creditos', 'ver reportes', 'ver estado cuenta']);
        $roleCajero->givePermissionTo(['gestionar caja', 'ver reportes', 'ver estado cuenta', 'gestionar ecommerce']);
        $roleSocio->givePermissionTo('ver estado cuenta');

        $personaAdmin = \App\Models\Persona::firstOrCreate([
            'ci' => '1234567'
        ], [
            'nombres' => 'Comandante',
            'apellidos' => 'Root',
            'escalafon' => 'ADMIN-001',
            'grado' => 'Cnl. DESP.',
            'institucion' => 'Policía Boliviana',
            'destino' => 'Central FAPCLAS',
            'garantia_tipo' => 'Ninguna',
            'email' => 'admin@fapclas.com',
        ]);

        // Crear un usuario Administrador por defecto
        $admin = User::firstOrCreate([
            'email' => 'admin@fapclas.com'
        ], [
            'name' => 'Comandante Root',
            'persona_id' => $personaAdmin->id,
            'password' => bcrypt('Admin123!'),
        ]);

        $admin->assignRole($roleAdmin);
    }
}
