<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// 1. FACHADA PÚBLICA (Landing Page y Entidad)
// ==========================================
Route::get('/', [App\Http\Controllers\PageController::class, 'welcome'])->name('welcome');
Route::get('/p/{slug}', [App\Http\Controllers\PageController::class, 'show'])->name('page.show');

// Noticias (Dinámico)
Route::get('/noticias', [App\Http\Controllers\NoticiaController::class, 'index'])->name('noticias.index');
Route::get('/noticias/{slug}', [App\Http\Controllers\NoticiaController::class, 'show'])->name('noticias.show');
Route::get('/institucional/noticias', function () {
    return redirect()->route('noticias.index');
});

// Institucional dinámico (DESPUÉS de rutas estáticas)
Route::get('/institucional/{slug}', [App\Http\Controllers\PageController::class, 'institutional'])->name('institucional.show');

// ==========================================
// 1.5. SERVICIOS INSTITUCIONALES (Dinámico desde BD — Filament CRUD)
// ==========================================
Route::get('/servicios/{slug}', [\App\Http\Controllers\ServicioController::class, 'show'])->name('servicios.show');

// ==========================================
// 2. NÚCLEO ERP (Portal Socio y Dashboard)
// ==========================================
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/secret-question', [ProfileController::class, 'updateSecretQuestion'])->name('profile.secret');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Portal ERP (Fase 3: Contabilidad)
    Route::get('/libro-diario', [App\Http\Controllers\LibroDiarioController::class, 'index'])->name('libro-diario.index');
    Route::get('/libro-diario/pdf', [App\Http\Controllers\LibroDiarioController::class, 'exportPdf'])->name('libro-diario.pdf');
    Route::get('/libro-diario/excel', [App\Http\Controllers\LibroDiarioController::class, 'exportExcel'])->name('libro-diario.excel');
    Route::get('/kardex', [App\Http\Controllers\KardexController::class, 'index'])->name('kardex.index');

    // Portal ERP (Módulo de Créditos)
    Route::get('/creditos', [App\Http\Controllers\CreditoController::class, 'index'])->name('creditos.index');
    Route::get('/creditos/solicitar', [App\Http\Controllers\CreditoController::class, 'create'])->name('creditos.create');
    Route::post('/creditos', [App\Http\Controllers\CreditoController::class, 'store'])->name('creditos.store');
    Route::get('/creditos/{credito}', [App\Http\Controllers\CreditoController::class, 'show'])->name('creditos.show');
    Route::post('/creditos/{credito}/evaluar', [App\Http\Controllers\CreditoController::class, 'evaluar'])->name('creditos.evaluar');
    Route::post('/creditos/{credito}/cuotas/{cuota}/pagar', [App\Http\Controllers\CreditoController::class, 'registrarPago'])->name('creditos.registrar-pago');
    Route::get('/creditos/{credito}/pdf', [App\Http\Controllers\CreditoController::class, 'imprimirPlanPagos'])->name('creditos.pdf');
    Route::delete('/creditos/{credito}', [App\Http\Controllers\CreditoController::class, 'destroy'])->name('creditos.destroy');

    // Administración de Parámetros de Crédito (Tipos de Crédito)
    Route::post('/tipos-credito', [App\Http\Controllers\TipoCreditoController::class, 'store'])->name('tipos-credito.store');
    Route::put('/tipos-credito/{tipo}', [App\Http\Controllers\TipoCreditoController::class, 'update'])->name('tipos-credito.update');
    Route::delete('/tipos-credito/{tipo}', [App\Http\Controllers\TipoCreditoController::class, 'destroy'])->name('tipos-credito.destroy');

    // Portal E-Commerce / Beneficios QR (DEPRECATED - Moved to Phase 6)
    // Route::get('/beneficios', [App\Http\Controllers\TiendaController::class, 'index'])->name('tienda.index');
    // Route::get('/beneficios/qr/{beneficio}', [App\Http\Controllers\TiendaController::class, 'pasarelaQr'])->name('tienda.pasarela');
    // Route::post('/beneficios/pagar', [App\Http\Controllers\TiendaController::class, 'finalizarPago'])->name('tienda.pagar');

    // Reportes e Históricos
    // NOTA: Los reportes admin se migraron a Filament Pages (/admin/reportes).
    // Se mantienen: index (sidebar React), estado-cuenta e historico (portal socio).
    Route::get('/reportes', [App\Http\Controllers\ReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/cartera', [App\Http\Controllers\ReporteController::class, 'cartera'])->name('reportes.cartera');
    Route::get('/reportes/morosidad', [App\Http\Controllers\ReporteController::class, 'morosidad'])->name('reportes.morosidad');
    Route::get('/reportes/estado-cuenta', [App\Http\Controllers\ReporteController::class, 'estadoCuenta'])->name('reportes.estado-cuenta');
    Route::get('/reportes/planilla', [App\Http\Controllers\ReporteController::class, 'planilla'])->name('reportes.planilla');
    Route::get('/reportes/historico', [App\Http\Controllers\ReporteController::class, 'historico'])->name('reportes.historico');
    Route::get('/reportes/recaudacion', [App\Http\Controllers\ReporteController::class, 'recaudacion'])->name('reportes.recaudacion');
    Route::get('/reportes/ecommerce', [App\Http\Controllers\ReporteController::class, 'ecommerce'])->name('reportes.ecommerce');
    Route::get('/reportes/caja', [App\Http\Controllers\ReporteController::class, 'caja'])->name('reportes.caja');
    Route::get('/reportes/conciliacion-ecommerce', [App\Http\Controllers\ReporteController::class, 'conciliacionEcommerce'])->name('reportes.conciliacion-ecommerce');

    // Módulo de Personas / Afiliados
    Route::get('/admin/personas', [App\Http\Controllers\Admin\PersonaController::class, 'index'])->name('admin.personas.index');
    Route::post('/admin/personas', [App\Http\Controllers\Admin\PersonaController::class, 'store'])->name('admin.personas.store');
    Route::put('/admin/personas/{persona}', [App\Http\Controllers\Admin\PersonaController::class, 'update'])->name('admin.personas.update');
    Route::delete('/admin/personas/{persona}', [App\Http\Controllers\Admin\PersonaController::class, 'destroy'])->name('admin.personas.destroy');
    Route::post('/admin/personas/{persona}/promote', [App\Http\Controllers\Admin\PersonaController::class, 'promote'])->name('admin.personas.promote');
    Route::get('/admin/personas/{persona}/kardex-pdf', [App\Http\Controllers\Admin\PersonaController::class, 'kardexPdf'])->name('admin.personas.kardex-pdf');
    Route::get('/admin/personas/{persona}/kardex-excel', [App\Http\Controllers\Admin\PersonaController::class, 'kardexExcel'])->name('admin.personas.kardex-excel');

    // Módulo de Caja General (Fase 8)
    Route::get('/admin/caja', [App\Http\Controllers\Admin\CajaController::class, 'index'])->name('admin.caja.index');
    Route::post('/admin/caja/abrir', [App\Http\Controllers\Admin\CajaController::class, 'abrir'])->name('admin.caja.abrir');
    Route::get('/admin/caja/{caja}', [App\Http\Controllers\Admin\CajaController::class, 'show'])->name('admin.caja.show');
    Route::post('/admin/caja/{caja}/movimiento', [App\Http\Controllers\Admin\CajaController::class, 'registrarMovimiento'])->name('admin.caja.movimiento');
    Route::post('/admin/caja/{caja}/cerrar', [App\Http\Controllers\Admin\CajaController::class, 'cerrar'])->name('admin.caja.cerrar');

    // Módulo Ecommerce (Fase 6 - Admin)
    Route::get('/admin/ecommerce/dashboard', [App\Http\Controllers\Admin\EcommerceDashboardController::class, 'index'])->name('admin.ecommerce.dashboard');

    // Reportes Ecommerce Avanzados (Migrado a Filament: MovimientosEcommerce)
    // Route::get('/admin/ecommerce/reporte/movimientos', [App\Http\Controllers\Admin\EcommerceReporteController::class, 'movimientos'])->name('admin.ecommerce.reporte.movimientos');

    // Preferencias de Usuario (Temas)
    Route::post('/user/theme', [App\Http\Controllers\ThemeController::class, 'update'])->name('user.theme.update');

    // Mantenimiento y Seguridad
    Route::post('/admin/backups/run', [App\Http\Controllers\BackupController::class, 'run'])->name('admin.backups.run');
    Route::get('/admin/backups/download', [App\Http\Controllers\BackupController::class, 'download'])->name('admin.backups.download');
});

// ==========================================
// 3. BENEFICIOS Y TIENDA (B2C / B2B)
// ==========================================
Route::get('/beneficios', [App\Http\Controllers\EcommerceController::class, 'index'])->name('beneficios.index');
Route::get('/beneficios/producto/{producto}', [App\Http\Controllers\EcommerceController::class, 'show'])->name('beneficios.show');
Route::get('/beneficios/checkout', [App\Http\Controllers\EcommerceController::class, 'checkout'])->name('beneficios.checkout');
Route::post('/beneficios/checkout', [App\Http\Controllers\EcommerceController::class, 'processCheckout'])->name('beneficios.process');
Route::get('/beneficios/pasarela/{numero_orden}', [App\Http\Controllers\EcommerceController::class, 'pasarela'])->name('beneficios.pasarela');
Route::post('/beneficios/webhook-qr', [App\Http\Controllers\EcommerceController::class, 'webhookQr'])->name('beneficios.webhook-qr');
Route::get('/beneficios/success/{numero_orden}', [App\Http\Controllers\EcommerceController::class, 'success'])->name('beneficios.success');
Route::get('/pedidos/comprobante/{numero_orden}', [App\Http\Controllers\PDFController::class, 'comprobantePedido'])->name('pedidos.pdf');

require __DIR__ . '/auth.php';

