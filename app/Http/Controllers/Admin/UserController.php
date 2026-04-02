<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        Gate::authorize('gestionar usuarios');

        $users = User::with(['roles', 'persona'])->orderBy('id', 'desc')->paginate(20);
        $roles = Role::all();
        
        // Personas que no tienen usuario (para el selector de creación)
        $personasDisponibles = \App\Models\Persona::whereDoesntHave('user')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'personasDisponibles' => $personasDisponibles
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $validated = $request->validate([
            'persona_id' => 'nullable|exists:personas,id|unique:users',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'roles' => 'array'
        ]);

        $user = User::create([
            'persona_id' => $validated['persona_id'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        } else {
            $user->assignRole('Socio Base'); // Rol por defecto
        }

        return redirect()->back()->with('success', 'Usuario registrado exitosamente.');
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('gestionar usuarios');

        if ($user->id === 1 && $request->user()->id !== 1) {
            return redirect()->back()->with('error', 'Solo el creador original puede alterar la cuenta del Fundador.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'roles' => 'array'
        ]);

        $user->update([
            'name' => $validated['name'],
        ]);

        if (in_array('SuperAdmin', $validated['roles']) && $user->id !== 1 && $request->user()->id !== 1) {
            return redirect()->back()->with('error', 'No tienes autoridad para otorgar poderes de SuperAdmin.');
        }

        $user->syncRoles($validated['roles']);

        return redirect()->back()->with('success', 'Usuario actualizado existosamente.');
    }

    public function destroy(User $user)
    {
        Gate::authorize('gestionar usuarios');

        if ($user->id === 1) {
            return redirect()->back()->with('error', 'El Fundador del sistema no puede ser eliminado.');
        }
        
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'No puedes auto-eliminarte.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Usuario dado de baja del sistema.');
    }
}
