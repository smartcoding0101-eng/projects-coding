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
        Gate::authorize('gestionar usuarios'); // o 'gestionar roles y permisos' según convenga, mantendré 'gestionar usuarios' por compatibilidad hacia atrás

        $roles = Role::with('permissions')->withCount('users')->get();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array'
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

        if (in_array($role->name, ['SuperAdmin', 'Socio Base'])) {
            return redirect()->back()->with('error', 'No puedes alterar este rol.');
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id
        ]);

        $role->update($validated);

        return redirect()->back()->with('success', 'Nombre del Rol actualizado.');
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
