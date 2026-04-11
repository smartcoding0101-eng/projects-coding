<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Illuminate\Database\QueryException $e, \Illuminate\Http\Request $request) {
            // Error 1146 = Base table or view not found (Fallo de infraestructura)
            if ($e->errorInfo[1] === 1146) {
                if ($request->expectsJson() || $request->hasHeader('X-Inertia')) {
                    // Si es llamada Inertia o JSON, devueve array vacio suavemente o alerta
                    // Pero como necesitamos que Inertia renderice algo y no explote, forzaremos 
                    // a que devuelva un Toast de sistema o redirija al dashboard de forma segura
                    return back()->with('error', 'El sistema está en mantenimiento. Hubo un problema sincronizando las bases de datos (Tabla faltante).');
                }
                return response()->view('errors.500', ['error' => 'Mantenimiento del Sistema en proceso. (DB Sync Pending)'], 503);
            }
        });
    })->create();
