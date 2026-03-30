<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/institucional/mision-vision', function () {
    return Inertia::render('Institutional/MisionVision');
});

Route::get('/institucional/constitucion', function () {
    return Inertia::render('Institutional/Constitucion');
});

Route::get('/institucional/normativas', function () {
    return Inertia::render('Institutional/LeyesNormativas');
});
