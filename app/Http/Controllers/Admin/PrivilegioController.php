<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Gate;

class PrivilegioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('gestionar roles y permisos');

        // Extraer todos los roles con sus permisos asignados
        $roles = Role::with('permissions')->get();
        
        // Extraer todos los permisos disponibles en el sistema
        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('Admin/Privilegios/Index', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        Gate::authorize('gestionar roles y permisos');

        if ($role->name === 'SuperAdmin') {
            return redirect()->back()->with('error', 'El rol de SuperAdmin no puede ser alterado. Tiene acceso total por defecto.');
        }

        $validated = $request->validate([
            'permissions' => 'array'
        ]);

        // Sincronizar (reemplazar la lista anterior con la nueva)
        $role->syncPermissions($validated['permissions']);

        return redirect()->back()->with('success', 'Matriz de seguridad actualizada para el rol ' . $role->name);
    }
}
