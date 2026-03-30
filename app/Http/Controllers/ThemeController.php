<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ThemeController extends Controller
{
    /**
     * Update the user's theme preference.
     */
    public function update(Request $request)
    {
        $request->validate([
            'theme' => 'required|string|in:premium-olive,classic-light,dark-night,corporate-blue',
        ]);

        $user = Auth::user();
        $user->theme_preference = $request->theme;
        $user->save();

        return back()->with('success', 'Tema actualizado correctamente');
    }
}
