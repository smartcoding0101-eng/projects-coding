<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$credito = \App\Models\Credito::with(['user.persona', 'tipoCredito', 'planPagos' => function ($q) {
    $q->orderBy('nro_cuota');
}, 'aprobadoPor'])->find(1);

if (!$credito) {
    echo "NO CREDITO FOUND\n";
    exit;
}

$arr = $credito->toArray();
echo "Keys: " . json_encode(array_keys($arr)) . "\n";
echo "plan_pagos count: " . count($arr['plan_pagos'] ?? []) . "\n";
echo "planPagos count: " . count($arr['planPagos'] ?? []) . "\n";
echo "user: " . ($arr['user']['name'] ?? 'NULL') . "\n";
echo "tipo_credito: " . ($arr['tipo_credito']['nombre'] ?? 'NULL') . "\n";
