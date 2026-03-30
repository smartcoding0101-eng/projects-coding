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

Route::get('/institucional/mision-vision', function () {
    return Inertia::render('Institutional/MisionVision');
});
Route::get('/institucional/constitucion', function () {
    return Inertia::render('Institutional/Constitucion');
});
Route::get('/institucional/normativas', function () {
    $page = \App\Models\Page::where('slug', 'normativas')->where('is_active', true)->first();
    if ($page) {
        return Inertia::render('Welcome', [
            'page' => $page->only(['title', 'content', 'metadata']),
            'isDynamic' => true
        ]);
    }
    return Inertia::render('Institutional/LeyesNormativas');
});
// Noticias (Dinámico)
Route::get('/noticias', [App\Http\Controllers\NoticiaController::class, 'index'])->name('noticias.index');
Route::get('/noticias/{slug}', [App\Http\Controllers\NoticiaController::class, 'show'])->name('noticias.show');
Route::get('/institucional/noticias', function () {
    return redirect()->route('noticias.index');
});

// ==========================================
// 1.5. SERVICIOS INSTITUCIONALES (Páginas de Información)
// ==========================================
Route::get('/servicios/prestamo-policial', [\App\Http\Controllers\ServicioController::class, 'prestamoPolicial'])->name('servicios.prestamo');
Route::get('/servicios/tienda-virtual', [\App\Http\Controllers\ServicioController::class, 'tiendaVirtual'])->name('servicios.tienda');
Route::get('/servicios/lavanderia', [\App\Http\Controllers\ServicioController::class, 'lavanderia'])->name('servicios.lavanderia');
Route::get('/servicios/bordados', [\App\Http\Controllers\ServicioController::class, 'bordados'])->name('servicios.bordados');
Route::get('/servicios/salon-belleza', [\App\Http\Controllers\ServicioController::class, 'salonBelleza'])->name('servicios.salon');
Route::get('/servicios/libreria', [\App\Http\Controllers\ServicioController::class, 'libreria'])->name('servicios.libreria');
Route::get('/servicios/conductor', [\App\Http\Controllers\ServicioController::class, 'conductor'])->name('servicios.conductor');

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
    Route::get('/reportes', [App\Http\Controllers\ReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/cartera', [App\Http\Controllers\ReporteController::class, 'cartera'])->name('reportes.cartera');
    Route::get('/reportes/morosidad', [App\Http\Controllers\ReporteController::class, 'morosidad'])->name('reportes.morosidad');
    Route::get('/reportes/estado-cuenta', [App\Http\Controllers\ReporteController::class, 'estadoCuenta'])->name('reportes.estado-cuenta');
    Route::get('/reportes/planilla', [App\Http\Controllers\ReporteController::class, 'planilla'])->name('reportes.planilla');

    // Panel de Administración Central (Fase 4)
    Route::get('/admin/configuraciones', [App\Http\Controllers\ConfiguracionController::class, 'index'])->name('admin.configuraciones.index');
    Route::post('/admin/configuraciones', [App\Http\Controllers\ConfiguracionController::class, 'store'])->name('admin.configuraciones.store');

    Route::get('/admin/roles', [App\Http\Controllers\Admin\RoleController::class, 'index'])->name('admin.roles.index');
    Route::post('/admin/roles', [App\Http\Controllers\Admin\RoleController::class, 'store'])->name('admin.roles.store');
    Route::put('/admin/roles/{role}', [App\Http\Controllers\Admin\RoleController::class, 'update'])->name('admin.roles.update');
    Route::delete('/admin/roles/{role}', [App\Http\Controllers\Admin\RoleController::class, 'destroy'])->name('admin.roles.destroy');

    Route::get('/admin/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

    // Módulo Ecommerce (Fase 6 - Admin)
    Route::get('/admin/ecommerce/dashboard', [App\Http\Controllers\Admin\EcommerceDashboardController::class, 'index'])->name('admin.ecommerce.dashboard');
    Route::get('/admin/ecommerce/kardex-global', [App\Http\Controllers\Admin\EcommerceKardexGlobalController::class, 'index'])->name('admin.ecommerce.kardex-global');
    Route::resource('/admin/ecommerce/inventario', App\Http\Controllers\Admin\InventarioController::class)->names('admin.inventario');
    Route::get('/admin/ecommerce/inventario/{producto}/kardex', [App\Http\Controllers\Admin\InventarioController::class, 'kardex'])->name('admin.inventario.kardex');
    Route::post('/admin/ecommerce/inventario/{producto}/ajustar-stock', [App\Http\Controllers\Admin\InventarioController::class, 'ajustarStock'])->name('admin.inventario.ajustar');
    
    Route::get('/admin/ecommerce/pedidos', [App\Http\Controllers\Admin\PedidoController::class, 'index'])->name('admin.pedidos.index');
    Route::get('/admin/ecommerce/pedidos/{pedido}', [App\Http\Controllers\Admin\PedidoController::class, 'show'])->name('admin.pedidos.show');
    Route::post('/admin/ecommerce/pedidos/{pedido}/validar', [App\Http\Controllers\Admin\PedidoController::class, 'validarPago'])->name('admin.pedidos.validar');
    Route::post('/admin/ecommerce/pedidos/{pedido}/rechazar', [App\Http\Controllers\Admin\PedidoController::class, 'rechazarPago'])->name('admin.pedidos.rechazar');
    Route::post('/admin/ecommerce/pedidos/{pedido}/entregar', [App\Http\Controllers\Admin\PedidoController::class, 'marcarEntregado'])->name('admin.pedidos.entregar');

    // Configuración Tienda
    Route::get('/admin/ecommerce/configuracion', [App\Http\Controllers\Admin\EcommerceConfigController::class, 'index'])->name('admin.ecommerce.config.index');
    Route::post('/admin/ecommerce/configuracion', [App\Http\Controllers\Admin\EcommerceConfigController::class, 'update'])->name('admin.ecommerce.config.update');

    // Preferencias de Usuario (Temas)
    Route::post('/user/theme', [App\Http\Controllers\ThemeController::class, 'update'])->name('user.theme.update');

    // Mantenimiento y Seguridad
    Route::post('/admin/backups/run', [App\Http\Controllers\BackupController::class, 'run'])->name('admin.backups.run');
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

require __DIR__.'/auth.php';
