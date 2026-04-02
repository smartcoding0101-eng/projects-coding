<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class StandardPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiamos la caché de Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Estructura de Permisos por Módulos
        $permissions = [
            // Módulo Personas (Directorio Maestro)
            'ver personas',
            'crear personas',
            'editar personas',
            'eliminar personas',
            'vincular cuentas usuario',
            
            // Módulo Créditos
            'ver creditos',
            'crear creditos',
            'editar creditos',
            'evaluar creditos',
            'eliminar creditos',
            'cobrar cuotas creditos',
            
            // Módulo Libretas/Kardex
            'ver libro diario',
            'gestionar diario',
            'ver kardex general',
            'exportar kardex pdf',
            'exportar kardex excel',
            
            // Módulo Reportes
            'ver reportes financieros',
            'generar reporte morosidad',
            'generar estado cuenta masivo',
            
            // Módulo Ecommerce / Tienda
            'ver dashboard tienda',
            'gestionar inventario tienda',
            'evaluar pedidos ecommerce',
            'modificar catalogos comerciales',
            
            // Ajustes y Core
            'gestionar roles y permisos',
            'configurar parametros globales',
        ];

        // 2. Creación Idempotente
        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName]);
        }
        
        // 3. Obtener/Crear Roles Técnicos Operativos (Ejemplos)
        $superAdmin = Role::firstOrCreate(['name' => 'SuperAdmin']);
        $oficialCredito = Role::firstOrCreate(['name' => 'Oficial de Créditos']);
        $tesorero = Role::firstOrCreate(['name' => 'Tesorero']);
        $operadorCaja = Role::firstOrCreate(['name' => 'Cajero Operativo']);
        
        // 4. Asignar todos los permisos al SuperAdmin
        $superAdmin->givePermissionTo(Permission::all());
        
        // 5. Asignaciones Estándar
        // Oficial de Créditos (Solo ve personas y gestiona créditos)
        $oficialCredito->syncPermissions([
            'ver personas', 'crear personas', 'editar personas',
            'ver creditos', 'crear creditos', 'editar creditos', 'evaluar creditos'
        ]);

        // Tesorero (Ve reportes, cajas y kardex masivos)
        $tesorero->syncPermissions([
            'ver personas', 'ver creditos', 'cobrar cuotas creditos',
            'ver libro diario', 'gestionar diario', 'ver kardex general',
            'exportar kardex pdf', 'exportar kardex excel', 'ver reportes financieros'
        ]);

        // Cajero Operativo (Visibilidad mínima, solo transaccional)
        $operadorCaja->syncPermissions([
            'ver personas', 'ver creditos', 'cobrar cuotas creditos', 'ver libro diario'
        ]);
        
        $this->command->info('Permisos Estándar granulares generados exitosamente.');
    }
}
