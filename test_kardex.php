<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = \App\Models\User::first();
if (!$user) { echo "NO USER"; exit; }

$request = Illuminate\Http\Request::create(
    '/kardex',
    'GET'
);
$request->setUserResolver(function() use ($user) { return $user; });

// To bypass auth middleware we can just resolve the controller manually
try {
    $controller = new \App\Http\Controllers\KardexController();
    $response = $controller->index($request);
    
    // Si devuelve un Response normal 
    if ($response instanceof \Illuminate\Http\Response || $response instanceof \Illuminate\Http\JsonResponse || $response instanceof \Symfony\Component\HttpFoundation\Response) {
        echo "STATUS: " . $response->getStatusCode() . "\n";
        echo "CONTENT LENGTH: " . strlen($response->getContent()) . "\n";
    } else {
        echo "RETURNED INERTIA RESULT\n";
    }
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "FILE: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
