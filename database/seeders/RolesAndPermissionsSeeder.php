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
        $roleAdmin = Role::create(['name' => 'SuperAdmin']);
        $roleSocio = Role::create(['name' => 'Socio Base']);

        // Crear Permisos
        Permission::create(['name' => 'gestionar usuarios']);
        Permission::create(['name' => 'aprobar creditos']);
        Permission::create(['name' => 'ver estado cuenta']);

        // Asignar permisos
        $roleAdmin->givePermissionTo(['gestionar usuarios', 'aprobar creditos', 'ver estado cuenta']);
        $roleSocio->givePermissionTo('ver estado cuenta');

        // Crear un usuario Administrador por defecto
        $admin = User::firstOrCreate([
            'email' => 'admin@fapclas.com'
        ], [
            'name' => 'Comandante Root',
            'ci' => '1234567',
            'escalafon' => 'ADMIN-001',
            'grado' => 'Cnl. DESP.',
            'destino' => 'Central FAPCLAS',
            'password' => bcrypt('Admin123!'),
        ]);

        $admin->assignRole($roleAdmin);
    }
}
