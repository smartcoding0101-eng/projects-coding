<?php

namespace App\Http\Controllers;

use App\Models\LibroDiario;
use App\Models\Credito;
use App\Models\User;
use App\Models\CompraConvenio;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('SuperAdmin');

        if ($isAdmin) {
            // Admin Metrics
            // Get the latest balance for each user to sum up total capital
            $totalCapitalAhorrado = LibroDiario::whereIn('id', function($query) {
                $query->selectRaw('MAX(id)')->from('libro_diarios')->groupBy('user_id');
            })->sum('saldo');

            $prestamosActivos = Credito::where('estado', 'Desembolsado')->count();
            $montoPrestado = Credito::where('estado', 'Desembolsado')->sum('monto_aprobado');
            $usuariosActivos = User::count();
            
            $ultimosMovimientos = LibroDiario::with('user:id,name')->orderBy('id', 'desc')->take(5)->get();

            return Inertia::render('Dashboard', [
                'metrics' => [
                    'totalCapital' => $totalCapitalAhorrado,
                    'prestamosActivos' => $prestamosActivos,
                    'montoPrestado' => $montoPrestado,
                    'usuariosActivos' => $usuariosActivos,
                    'tipo' => 'admin'
                ],
                'actividadReciente' => $ultimosMovimientos
            ]);
        } else {
            // Socio (User) Metrics
            $miUltimoMovimiento = LibroDiario::where('user_id', $user->id)->orderBy('id', 'desc')->first();
            $miSaldo = $miUltimoMovimiento ? $miUltimoMovimiento->saldo : 0;

            $misPrestamos = Credito::where('user_id', $user->id)->whereIn('estado', ['Solicitado', 'Aprobado', 'Desembolsado'])->count();
            $misConvenios = CompraConvenio::where('user_id', $user->id)->count();
            
            $miActividad = LibroDiario::where('user_id', $user->id)->orderBy('id', 'desc')->take(5)->get();

            return Inertia::render('Dashboard', [
                'metrics' => [
                    'miSaldo' => $miSaldo,
                    'misPrestamos' => $misPrestamos,
                    'misConvenios' => $misConvenios,
                    'tipo' => 'socio'
                ],
                'actividadReciente' => $miActividad
            ]);
        }
    }
}
