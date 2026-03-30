<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SecretRecoveryController extends Controller
{
    /**
     * Paso 1: Muestra el formulario para pedir el CI.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/SecretRecovery/Identify');
    }

    /**
     * Valida el CI e inicia la sesión de recuperación.
     */
    public function store(Request $request)
    {
        $request->validate(['ci' => 'required|string']);

        $user = User::where('ci', $request->ci)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'ci' => 'No encontramos ningún registro activo con este CI.',
            ]);
        }

        if (!$user->pregunta_secreta || !$user->respuesta_secreta) {
            throw ValidationException::withMessages([
                'ci' => 'Este usuario no tiene configurada una pregunta de recuperación. Por favor, comunícate con un administrador.',
            ]);
        }

        // Guardamos el CI temporalmente en sesión
        session(['recovery_ci' => $user->ci]);

        return redirect()->route('secret.challenge');
    }

    /**
     * Paso 2: Exponer la pregunta secreta.
     */
    public function challenge()
    {
        $ci = session('recovery_ci');
        if (!$ci) {
            return redirect()->route('secret.request');
        }

        $user = User::where('ci', $ci)->firstOrFail();

        return Inertia::render('Auth/SecretRecovery/Challenge', [
            'pregunta_secreta' => $user->pregunta_secreta,
            'ci' => $user->ci,
        ]);
    }

    /**
     * Verifica que la respuesta sea correcta.
     */
    public function verify(Request $request)
    {
        $ci = session('recovery_ci');
        if (!$ci) {
            return redirect()->route('secret.request');
        }

        $request->validate(['respuesta' => 'required|string']);

        $user = User::where('ci', $ci)->firstOrFail();

        // Validar contra el hash
        $respuestaLimpia = strtolower(trim($request->respuesta));
        
        if (!Hash::check($respuestaLimpia, $user->respuesta_secreta)) {
            throw ValidationException::withMessages([
                'respuesta' => 'La respuesta proporcionada es incorrecta.',
            ]);
        }

        // Si es correcta, permitimos el paso a resetear contraseña
        session(['recovery_verified_user_id' => $user->id]);
        return redirect()->route('secret.reset');
    }

    /**
     * Paso 3: Muestra el formulario para definir nueva clave.
     */
    public function resetForm()
    {
        $userId = session('recovery_verified_user_id');
        if (!$userId) {
            return redirect()->route('secret.request');
        }

        return Inertia::render('Auth/SecretRecovery/Reset');
    }

    /**
     * Guarda la nueva contraseña.
     */
    public function update(Request $request)
    {
        $userId = session('recovery_verified_user_id');
        if (!$userId) {
            return redirect()->route('secret.request');
        }

        $request->validate([
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = User::findOrFail($userId);
        $user->forceFill([
            'password' => Hash::make($request->password)
        ])->save();

        // Limpiar la sesión de recuperación
        session()->forget(['recovery_ci', 'recovery_verified_user_id']);

        return redirect()->route('login')->with('status', 'Tu contraseña ha sido restablecida. Ya puedes iniciar sesión.');
    }
}
