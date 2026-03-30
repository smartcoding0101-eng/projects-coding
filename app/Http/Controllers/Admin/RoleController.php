<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Gate;

class RoleController extends Controller
{
    public function index()
    {
        Gate::authorize('gestionar usuarios');

        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = Role::create(['name' => $validated['name']]);
        
        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Rol creado exitosamente.');
    }

    public function update(Request $request, Role $role)
    {
        Gate::authorize('gestionar usuarios');

        if ($role->name === 'SuperAdmin') {
            return redirect()->back()->with('error', 'No puedes alterar al SuperAdmin.');
        }

        $validated = $request->validate([
            'permissions' => 'array'
        ]);

        $role->syncPermissions($validated['permissions']);

        return redirect()->back()->with('success', 'Permisos del Rol actualizados.');
    }

    public function destroy(Role $role)
    {
        Gate::authorize('gestionar usuarios');

        if (in_array($role->name, ['SuperAdmin', 'Socio Base'])) {
            return redirect()->back()->with('error', 'No puedes eliminar este rol base.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Rol eliminado exitosamente.');
    }
}
