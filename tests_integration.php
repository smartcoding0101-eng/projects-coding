<?php
/**
 * TEST DE INTEGRACIÓN DEL NÚCLEO — FAPCLAS
 * Verifica: Modelo ↔ BD ↔ Controlador ↔ Servicio
 */

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Route;

$pass = 0;
$fail = 0;
$warnings = 0;
$results = [];

function test($name, $condition, $detail = '') {
    global $pass, $fail, $results;
    if ($condition) {
        $pass++;
        $results[] = "  ✅ PASS: $name";
    } else {
        $fail++;
        $results[] = "  ❌ FAIL: $name" . ($detail ? " → $detail" : "");
    }
}

function warn($name, $detail = '') {
    global $warnings, $results;
    $warnings++;
    $results[] = "  ⚠️  WARN: $name" . ($detail ? " → $detail" : "");
}

echo "╔══════════════════════════════════════════════════════════════════╗\n";
echo "║   TEST DE INTEGRACIÓN DEL NÚCLEO — FAPCLAS                     ║\n";
echo "║   Fecha: " . date('Y-m-d H:i:s') . "                              ║\n";
echo "╚══════════════════════════════════════════════════════════════════╝\n\n";

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 1: MODELO ↔ BD (Fillable vs Columnas Reales)
// ═══════════════════════════════════════════════════════════════
echo "━━━ SECCIÓN 1: MODELO ↔ BD (Fillable vs Columnas Reales) ━━━\n";

$models = [
    'App\Models\User' => 'users',
    'App\Models\Persona' => 'personas',
    'App\Models\Credito' => 'creditos',
    'App\Models\PlanPago' => 'plan_pagos',
    'App\Models\TipoCredito' => 'tipos_credito',
    'App\Models\CuentaAportacion' => 'cuentas_aportacion',
    'App\Models\Kardex' => 'kardex',
    'App\Models\LibroDiario' => 'libro_diarios',
    'App\Models\Configuracion' => 'configuraciones',
    'App\Models\Producto' => 'productos',
    'App\Models\Categoria' => 'categorias',
    'App\Models\KardexProducto' => 'kardex_productos',
    'App\Models\Pedido' => 'pedidos',
    'App\Models\PedidoDetalle' => 'pedido_detalles',
    'App\Models\Caja' => 'cajas',
    'App\Models\CajaMovimiento' => 'caja_movimientos',
    'App\Models\CajaDenominacion' => 'caja_denominaciones',
    'App\Models\Page' => 'pages',
    'App\Models\Noticia' => 'noticias',
    'App\Models\SiteSetting' => 'site_settings',
];

foreach ($models as $modelClass => $expectedTable) {
    if (!class_exists($modelClass)) {
        test("Modelo $modelClass existe", false, "Clase no encontrada");
        continue;
    }
    
    $model = new $modelClass;
    $actualTable = $model->getTable();
    
    // 1a. Verificar nombre de tabla
    test("$modelClass → tabla '$actualTable'", $actualTable === $expectedTable, 
         "Esperado: $expectedTable, Obtenido: $actualTable");
    
    // 1b. Verificar que la tabla existe
    $tableExists = Schema::hasTable($actualTable);
    test("Tabla '$actualTable' existe en BD", $tableExists);
    
    if (!$tableExists) continue;
    
    // 1c. Verificar fillable vs columnas reales
    $fillable = $model->getFillable();
    $dbColumns = Schema::getColumnListing($actualTable);
    
    $missingInDb = array_diff($fillable, $dbColumns);
    $missingInDb = array_filter($missingInDb); // Remove empties
    
    if (count($missingInDb) > 0) {
        test("$modelClass fillable ⊂ BD", false, 
             "Columnas en fillable pero NO en BD: " . implode(', ', $missingInDb));
    } else {
        test("$modelClass fillable ⊂ BD", true);
    }
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 2: RELACIONES DE MODELOS
// ═══════════════════════════════════════════════════════════════
echo "\n━━━ SECCIÓN 2: RELACIONES DE MODELOS ━━━\n";

$relationTests = [
    ['App\Models\User', 'persona', 'Persona belongsTo desde User'],
    ['App\Models\User', 'roles', 'Roles via Spatie desde User'],
    ['App\Models\User', 'creditos', 'Creditos hasMany desde User'],
    ['App\Models\User', 'libroDiario', 'LibroDiario hasMany desde User'],
    ['App\Models\Persona', 'user', 'User hasOne desde Persona'],
    ['App\Models\Persona', 'creditos', 'Creditos hasMany desde Persona'],
    ['App\Models\Persona', 'cuentaAportacion', 'CuentaAportacion hasOne desde Persona'],
    ['App\Models\Persona', 'kardex', 'Kardex hasMany desde Persona'],
    ['App\Models\Credito', 'user', 'User belongsTo desde Credito'],
    ['App\Models\Credito', 'tipoCredito', 'TipoCredito belongsTo desde Credito'],
    ['App\Models\Credito', 'planPagos', 'PlanPagos hasMany desde Credito'],
    ['App\Models\Credito', 'persona', 'Persona belongsTo desde Credito'],
    ['App\Models\PlanPago', 'credito', 'Credito belongsTo desde PlanPago'],
    ['App\Models\TipoCredito', 'creditos', 'Creditos hasMany desde TipoCredito'],
    ['App\Models\Producto', 'categoria', 'Categoria belongsTo desde Producto'],
    ['App\Models\Producto', 'kardex', 'KardexProducto hasMany desde Producto'],
    ['App\Models\KardexProducto', 'producto', 'Producto belongsTo desde KardexProducto'],
    ['App\Models\KardexProducto', 'admin', 'User belongsTo desde KardexProducto'],
    ['App\Models\LibroDiario', 'user', 'User belongsTo desde LibroDiario'],
    ['App\Models\LibroDiario', 'cajero', 'Cajero belongsTo desde LibroDiario'],
    ['App\Models\Pedido', 'user', 'User belongsTo desde Pedido'],
    ['App\Models\Pedido', 'detalles', 'Detalles hasMany desde Pedido'],
    ['App\Models\PedidoDetalle', 'producto', 'Producto belongsTo desde PedidoDetalle'],
    ['App\Models\Caja', 'denominaciones', 'Denominaciones hasMany desde Caja'],
    ['App\Models\Caja', 'movimientos', 'Movimientos hasMany desde Caja'],
    ['App\Models\CajaMovimiento', 'caja', 'Caja belongsTo desde CajaMovimiento'],
];

foreach ($relationTests as [$modelClass, $relation, $label]) {
    if (!class_exists($modelClass)) {
        test($label, false, "Modelo $modelClass no existe");
        continue;
    }
    
    $model = new $modelClass;
    $hasMethod = method_exists($model, $relation);
    test($label, $hasMethod, $hasMethod ? '' : "Método '$relation' no existe en $modelClass");
    
    if ($hasMethod) {
        try {
            $relInstance = $model->$relation();
            $relatedModel = get_class($relInstance->getRelated());
            test("  ↳ Relación $relation → $relatedModel", true);
        } catch (\Throwable $e) {
            test("  ↳ Relación $relation ejecutable", false, $e->getMessage());
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 3: FOREIGN KEYS EN BD
// ═══════════════════════════════════════════════════════════════
echo "\n━━━ SECCIÓN 3: FOREIGN KEYS EN BD ━━━\n";

$fkTests = [
    ['creditos', 'user_id', 'users', 'id'],
    ['creditos', 'persona_id', 'personas', 'id'],
    ['creditos', 'tipo_credito_id', 'tipos_credito', 'id'],
    ['plan_pagos', 'credito_id', 'creditos', 'id'],
    ['kardex', 'persona_id', 'personas', 'id'],
    ['libro_diarios', 'user_id', 'users', 'id'],
    ['libro_diarios', 'cajero_id', 'users', 'id'],
    ['kardex_productos', 'producto_id', 'productos', 'id'],
    ['kardex_productos', 'usuario_admin_id', 'users', 'id'],
    ['pedidos', 'user_id', 'users', 'id'],
    ['pedido_detalles', 'pedido_id', 'pedidos', 'id'],
    ['pedido_detalles', 'producto_id', 'productos', 'id'],
    ['caja_movimientos', 'caja_id', 'cajas', 'id'],
    ['productos', 'categoria_id', 'categorias', 'id'],
    ['cuentas_aportacion', 'persona_id', 'personas', 'id'],
];

foreach ($fkTests as [$table, $column, $refTable, $refColumn]) {
    $colExists = Schema::hasColumn($table, $column);
    test("FK $table.$column → $refTable.$refColumn (columna existe)", $colExists);
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 4: QUERIES DE CONTROLADORES (SIMULACIÓN)
// ═══════════════════════════════════════════════════════════════
echo "\n━━━ SECCIÓN 4: QUERIES CRÍTICAS DE CONTROLADORES ━━━\n";

// Test CreditoController::index KPI queries
try {
    $result = App\Models\Credito::whereIn('estado', ['Desembolsado', 'En Mora'])->sum('saldo_capital');
    test("Credito::sum('saldo_capital')", true);
} catch (\Throwable $e) {
    test("Credito::sum('saldo_capital')", false, $e->getMessage());
}

try {
    $result = App\Models\Credito::whereIn('estado', ['Desembolsado', 'En Mora', 'Pagado'])
        ->selectRaw('sum(monto_aprobado - saldo_capital) as aggregate')->first();
    test("Credito::selectRaw('monto_aprobado - saldo_capital')", true);
} catch (\Throwable $e) {
    test("Credito::selectRaw('monto_aprobado - saldo_capital')", false, $e->getMessage());
}

// Test PersonaController KPI queries
try {
    $result = App\Models\Persona::withSum(['creditos as deuda_total' => function($query) {
        $query->whereIn('estado', ['Desembolsado', 'En Mora']);
    }], 'saldo_capital')->take(1)->get();
    test("Persona::withSum creditos.saldo_capital", true);
} catch (\Throwable $e) {
    test("Persona::withSum creditos.saldo_capital", false, $e->getMessage());
}

try {
    $result = App\Models\Credito::whereIn('estado', ['Desembolsado', 'En Mora'])->sum('saldo_capital');
    test("Credito cartera vigente sum", true);
} catch (\Throwable $e) {
    test("Credito cartera vigente sum", false, $e->getMessage());
}

// Test CuentaAportacion
try {
    $result = App\Models\CuentaAportacion::sum('saldo_actual');
    test("CuentaAportacion::sum('saldo_actual')", true);
} catch (\Throwable $e) {
    test("CuentaAportacion::sum('saldo_actual')", false, $e->getMessage());
}

// Test Configuracion queries (EcommerceController)
try {
    $result = App\Models\Configuracion::where('key', 'like', 'ecommerce_%')->get()->pluck('value', 'key');
    test("Configuracion ecommerce settings", true);
    test("  ↳ Tiene settings cargados: " . $result->count() . " keys", $result->count() > 0);
} catch (\Throwable $e) {
    test("Configuracion ecommerce settings", false, $e->getMessage());
}

// Test PlanPago scopes
try {
    $result = App\Models\PlanPago::vencidas()->count();
    test("PlanPago::vencidas() scope", true);
} catch (\Throwable $e) {
    test("PlanPago::vencidas() scope", false, $e->getMessage());
}

try {
    $result = App\Models\PlanPago::pendientes()->count();
    test("PlanPago::pendientes() scope", true);
} catch (\Throwable $e) {
    test("PlanPago::pendientes() scope", false, $e->getMessage());
}

// Test Producto queries
try {
    $result = App\Models\Producto::with('categoria')->where('activo', true)->count();
    test("Producto::with('categoria')->activo query", true);
    test("  ↳ Productos activos: $result", $result >= 0);
} catch (\Throwable $e) {
    test("Producto::with('categoria')->activo query", false, $e->getMessage());
}

// Test Pedidos fecha query (was fecha_pedido, now created_at)
try {
    $result = DB::table('pedidos')->where('estado_pago', 'pagado')
        ->whereYear('created_at', 2026)->whereMonth('created_at', 4)->sum('total');
    test("Pedidos::sum por created_at (fix fecha_pedido)", true);
} catch (\Throwable $e) {
    test("Pedidos::sum por created_at (fix fecha_pedido)", false, $e->getMessage());
}

// Test LibroDiario con cajero
try {
    $result = App\Models\LibroDiario::with(['user', 'cajero'])->take(1)->get();
    test("LibroDiario::with(['user', 'cajero'])", true);
} catch (\Throwable $e) {
    test("LibroDiario::with(['user', 'cajero'])", false, $e->getMessage());
}

// Test TipoCredito columns
try {
    $result = App\Models\TipoCredito::activos()->get();
    test("TipoCredito::activos() scope", true);
    foreach ($result as $tc) {
        $tc->plazo_min_meses; $tc->plazo_max_meses; $tc->monto_min; $tc->monto_max; $tc->tasa_mora;
    }
    test("TipoCredito columnas (plazo_min/max, monto_min/max, tasa_mora)", true);
} catch (\Throwable $e) {
    test("TipoCredito columnas", false, $e->getMessage());
}

// Test Caja static method
try {
    $result = App\Models\Caja::cajaAbiertaDe(1);
    test("Caja::cajaAbiertaDe() static", true);
} catch (\Throwable $e) {
    test("Caja::cajaAbiertaDe() static", false, $e->getMessage());
}

// Test AccountingService::getDeudaTotal (was using 'pagada')
try {
    $service = app(App\Services\AccountingService::class);
    $user = App\Models\User::first();
    if ($user) {
        $deuda = $service->getDeudaTotal($user);
        test("AccountingService::getDeudaTotal (fix pagada→estado)", true);
    } else {
        warn("AccountingService::getDeudaTotal - no user found to test");
    }
} catch (\Throwable $e) {
    test("AccountingService::getDeudaTotal", false, $e->getMessage());
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 5: USER ACCESSORS (delegación a Persona)
// ═══════════════════════════════════════════════════════════════
echo "\n━━━ SECCIÓN 5: USER ACCESSORS → PERSONA ━━━\n";

$adminUser = App\Models\User::with('persona')->first();
if ($adminUser && $adminUser->persona) {
    test("User->ci accede a Persona->ci", $adminUser->ci === $adminUser->persona->ci);
    test("User->grado accede a Persona->grado", $adminUser->grado === $adminUser->persona->grado);
    test("User->destino accede a Persona->destino", $adminUser->destino === $adminUser->persona->destino);
    test("User->escalafon accede a Persona->escalafon", $adminUser->escalafon === $adminUser->persona->escalafon);
} else {
    warn("No hay User con Persona para testear accessors");
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 6: SEEDERS — DATOS CRÍTICOS
// ═══════════════════════════════════════════════════════════════
echo "\n━━━ SECCIÓN 6: DATOS CRÍTICOS (Seeders) ━━━\n";

// Roles
$roles = Spatie\Permission\Models\Role::pluck('name')->toArray();
$expectedRoles = ['SuperAdmin', 'Oficial Crédito', 'Cajero', 'Socio Base'];
foreach ($expectedRoles as $role) {
    test("Rol '$role' existe", in_array($role, $roles));
}

// Permisos clave
$permissions = Spatie\Permission\Models\Permission::pluck('name')->toArray();
$expectedPerms = ['gestionar usuarios', 'gestionar creditos', 'ver reportes'];
foreach ($expectedPerms as $perm) {
    test("Permiso '$perm' existe", in_array($perm, $permissions));
}

// Admin user
$admin = App\Models\User::where('email', 'admin@fapclas.com')->first();
test("Admin user admin@fapclas.com existe", $admin !== null);
if ($admin) {
    test("Admin tiene rol SuperAdmin", $admin->hasRole('SuperAdmin'));
    test("Admin tiene persona vinculada", $admin->persona_id !== null);
}

// Tipos de crédito
$tiposCredito = App\Models\TipoCredito::count();
test("Tipos de crédito sembrados ($tiposCredito)", $tiposCredito > 0);

// Configuraciones ecommerce
$configCount = App\Models\Configuracion::where('key', 'like', 'ecommerce_%')->count();
test("Configuraciones ecommerce ($configCount settings)", $configCount >= 6);

// Categorías y productos
$catCount = App\Models\Categoria::count();
$prodCount = App\Models\Producto::count();
test("Categorías sembradas ($catCount)", $catCount > 0);
test("Productos sembrados ($prodCount)", $prodCount > 0);

// Pages
$pageCount = App\Models\Page::count();
test("Páginas CMS sembradas ($pageCount)", $pageCount > 0);

// Noticias
$noticiaCount = App\Models\Noticia::count();
test("Noticias sembradas ($noticiaCount)", $noticiaCount > 0);

// SiteSettings
$siteSettingsCount = App\Models\SiteSetting::count();
test("SiteSettings configurados ($siteSettingsCount)", $siteSettingsCount > 0);

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 7: RUTAS COMPILADAS
// ═══════════════════════════════════════════════════════════════
echo "\n━━━ SECCIÓN 7: RUTAS COMPILADAS ━━━\n";

$criticalRoutes = [
    'GET /',
    'GET dashboard',
    'GET creditos',
    'GET creditos/solicitar',
    'GET kardex',
    'GET libro-diario',
    'GET reportes',
    'GET reportes/cartera',
    'GET reportes/morosidad',
    'GET reportes/estado-cuenta',
    'GET reportes/ecommerce',
    'GET reportes/caja',
    'GET beneficios',
    'GET admin/ecommerce/inventario',
    'GET admin/ecommerce/pedidos',
    'GET admin/personas',
    'GET admin/users',
    'GET admin/caja',
];

$registeredRoutes = collect(Route::getRoutes())->map(function($r) {
    return implode('|', $r->methods()) . ' ' . $r->uri();
})->toArray();

foreach ($criticalRoutes as $route) {
    $parts = explode(' ', $route, 2);
    $method = $parts[0];
    $uri = $parts[1];
    
    $found = collect(Route::getRoutes())->first(function($r) use ($method, $uri) {
        return in_array($method, $r->methods()) && $r->uri() === $uri;
    });
    
    test("Ruta $route registrada", $found !== null);
}

// ═══════════════════════════════════════════════════════════════
// REPORTE FINAL
// ═══════════════════════════════════════════════════════════════
echo "\n╔══════════════════════════════════════════════════════════════════╗\n";
echo "║                    REPORTE DEL TEST                            ║\n";
echo "╠══════════════════════════════════════════════════════════════════╣\n";

foreach ($results as $r) {
    echo "$r\n";
}

echo "\n╠══════════════════════════════════════════════════════════════════╣\n";
echo "║  ✅ PASS: $pass | ❌ FAIL: $fail | ⚠️  WARN: $warnings" . str_repeat(' ', max(0, 35 - strlen("$pass$fail$warnings"))) . "║\n";
$total = $pass + $fail;
$pct = $total > 0 ? round(($pass / $total) * 100, 1) : 0;
echo "║  Tasa de éxito: $pct%" . str_repeat(' ', max(0, 47 - strlen("$pct"))) . "║\n";
echo "╚══════════════════════════════════════════════════════════════════╝\n";

exit($fail > 0 ? 1 : 0);
