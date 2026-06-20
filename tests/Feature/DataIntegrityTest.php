<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Persona;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\TipoCredito;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Suite de Pruebas de Integridad de Datos (DIT) para FAPCLAS R.L.
 *
 * Certifica que las reglas relacionales de integridad referencial,
 * restricciones de unicidad, y protección contra eliminación de registros
 * activos se cumplan estrictamente a nivel de Base de Datos.
 */
class DataIntegrityTest extends TestCase
{
    use RefreshDatabase;

    private Categoria $categoria;
    private TipoCredito $tipoCredito;

    protected function setUp(): void
    {
        parent::setUp();

        // Asegurar que SQLite aplique las restricciones de clave foránea en cada conexión de test
        DB::statement('PRAGMA foreign_keys = ON;');

        // Inyectar datos semilla mínimos
        $this->categoria = Categoria::create([
            'nombre' => 'Equipo de Seguridad',
            'slug' => 'equipo-seguridad',
            'activa' => true
        ]);

        $this->tipoCredito = TipoCredito::create([
            'nombre' => 'Crédito de Emergencia',
            'tasa_interes' => 12.0,
            'plazo_min_meses' => 1,
            'plazo_max_meses' => 12,
            'monto_min' => 100,
            'monto_max' => 10000,
            'tasa_mora' => 5.0,
            'activo' => true
        ]);
    }

    /**
     * DIT 1: Restricción de Unicidad en el Documento de Identidad (CI)
     */
    public function test_ci_uniqueness_constraint_on_personas(): void
    {
        Persona::create([
            'nombres' => 'Jose Luis',
            'apellidos' => 'Apaza Vilca',
            'ci' => '7654321',
            'celular' => '71234567',
            'genero' => 'MASCULINO',
            'institucion' => 'Policía Boliviana',
            'tipo_afiliacion' => 'Activo',
            'garantia_tipo' => 'Ninguna'
        ]);

        // Se espera QueryException al intentar registrar a otra persona con el mismo CI
        $this->expectException(QueryException::class);

        Persona::create([
            'nombres' => 'Jose Armando',
            'apellidos' => 'Flores Luna',
            'ci' => '7654321', // CI duplicado
            'celular' => '77654321',
            'genero' => 'MASCULINO',
            'institucion' => 'Policía Boliviana',
            'tipo_afiliacion' => 'Activo',
            'garantia_tipo' => 'Ninguna'
        ]);
    }

    /**
     * DIT 2: Restricción de Unicidad en SKU de Productos
     */
    public function test_sku_uniqueness_constraint_on_productos(): void
    {
        Producto::create([
            'nombre' => 'Chaleco Antibalas Tipo IV',
            'slug' => 'chaleco-antibalas-iv',
            'codigo_sku' => 'SEC-IV-99',
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 10,
            'stock_minimo' => 2,
            'precio_general' => 1500.00,
            'precio_asociado' => 1400.00,
            'activo' => true
        ]);

        // Se espera QueryException al registrar otro producto con el mismo SKU
        $this->expectException(QueryException::class);

        Producto::create([
            'nombre' => 'Chaleco Confort Anti-trauma',
            'slug' => 'chaleco-anti-trauma',
            'codigo_sku' => 'SEC-IV-99', // SKU duplicado
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 5,
            'stock_minimo' => 1,
            'precio_general' => 800.00,
            'precio_asociado' => 750.00,
            'activo' => true
        ]);
    }

    /**
     * DIT 3: Integridad de Clave Foránea en el Enlace de Usuario con Persona
     */
    public function test_foreign_key_constraint_on_user_persona_link(): void
    {
        $this->expectException(QueryException::class);

        // Crear un usuario apuntando a un persona_id no existente (por ejemplo, 99999)
        User::create([
            'name' => 'Falso Socio',
            'email' => 'falso@socio.com',
            'password' => bcrypt('password123'),
            'persona_id' => 99999, // Clave foránea rota
            'ci' => '0000000'
        ]);
    }

    /**
     * DIT 4: Integridad de Clave Foránea en el Plan de Pagos de un Crédito
     */
    public function test_foreign_key_constraint_on_plan_pago_credito(): void
    {
        $this->expectException(QueryException::class);

        // Crear una cuota en plan_pagos apuntando a un credito_id no existente (99999)
        PlanPago::create([
            'credito_id' => 99999, // Clave foránea rota
            'nro_cuota' => 1,
            'fecha_vencimiento' => now()->addMonth(),
            'capital_amortizado' => 100.00,
            'interes_pagado' => 10.00,
            'cuota_total' => 110.00,
            'monto_mora' => 0.00,
            'estado' => PlanPago::ESTADO_PENDIENTE
        ]);
    }

    /**
     * DIT 5: Restricción de Eliminación Activa (Protección contra Registros Huérfanos - Categoría con Productos)
     *
     * Nota: Ambos modelos usan SoftDeletes. Un delete() normal solo establece deleted_at
     * sin tocar la base de datos físicamente. Se usa forceDelete() para disparar la
     * restricción de clave foránea (RESTRICT) a nivel de motor de base de datos.
     */
    public function test_restrict_deletion_on_active_relations_categoria_producto(): void
    {
        $categoria = Categoria::create([
            'nombre' => 'Categoría Restringida',
            'slug' => 'categoria-restringida',
            'activa' => true
        ]);

        Producto::create([
            'nombre' => 'Producto Vinculado',
            'slug' => 'producto-vinculado',
            'codigo_sku' => 'VINC-889',
            'categoria_id' => $categoria->id,
            'stock_actual' => 10,
            'stock_minimo' => 2,
            'precio_general' => 100.00,
            'precio_asociado' => 90.00,
            'activo' => true
        ]);

        // Se espera QueryException al intentar eliminar FÍSICAMENTE la categoría
        // mientras tiene productos que la referencian (onDelete: restrict)
        $this->expectException(QueryException::class);
        $categoria->forceDelete();
    }

    /**
     * DIT 6: Restricción de Eliminación Activa (Producto con Ventas Registradas en PedidoDetalle)
     */
    public function test_restrict_deletion_on_product_with_active_sales(): void
    {
        $producto = Producto::create([
            'nombre' => 'Cinto Táctico Policial',
            'slug' => 'cinto-tactico',
            'codigo_sku' => 'TAC-CIN-01',
            'categoria_id' => $this->categoria->id,
            'stock_actual' => 50,
            'stock_minimo' => 5,
            'precio_general' => 120.00,
            'precio_asociado' => 100.00,
            'activo' => true
        ]);

        $persona = Persona::create([
            'nombres' => 'Maria',
            'apellidos' => 'Gonzales Ruiz',
            'ci' => '5544332',
            'celular' => '6543211',
            'genero' => 'FEMENINO',
            'institucion' => 'Policía Boliviana',
            'tipo_afiliacion' => 'Externo',
            'garantia_tipo' => 'Ninguna'
        ]);

        $pedido = Pedido::create([
            'numero_orden' => 'ORD-99990',
            'persona_id' => $persona->id,
            'nombre_cliente' => $persona->nombre_completo,
            'ci_cliente' => $persona->ci,
            'tipo_pago' => 'qr',
            'tipo_entrega' => 'recojo_tienda',
            'estado_pago' => 'pagado',
            'estado_entrega' => 'por_recoger',
            'total' => 120.00
        ]);

        PedidoDetalle::create([
            'pedido_id' => $pedido->id,
            'producto_id' => $producto->id,
            'cantidad' => 1,
            'precio_unitario' => 120.00,
            'subtotal' => 120.00
        ]);

        // Se espera QueryException al intentar forzar la eliminación del producto porque está referenciado en un PedidoDetalle
        $this->expectException(QueryException::class);
        $producto->forceDelete();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // BLOQUE 2 — Unicidad Relacional, Cascada y Aislamiento de Datos
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * DIT 7: Unicidad del Número de Orden en Pedidos
     *
     * Certifica que dos pedidos no pueden compartir el mismo numero_orden,
     * previniendo colisiones en el tracking de órdenes de compra.
     */
    public function test_numero_orden_uniqueness_on_pedidos(): void
    {
        $persona = Persona::create([
            'nombres' => 'Carlos', 'apellidos' => 'Mamani', 'ci' => '4433221',
            'celular' => '72200001', 'genero' => 'MASCULINO',
            'institucion' => 'POLICIA', 'tipo_afiliacion' => 'Activo', 'garantia_tipo' => 'Ninguna'
        ]);

        Pedido::create([
            'numero_orden' => 'ORD-UNICA-001',
            'persona_id'   => $persona->id,
            'nombre_cliente' => 'Carlos Mamani',
            'ci_cliente'   => '4433221',
            'tipo_pago'    => 'qr',
            'tipo_entrega' => 'recojo_tienda',
            'estado_pago'  => 'pagado',
            'estado_entrega' => 'entregado',
            'total'        => 200.00,
        ]);

        $this->expectException(QueryException::class);

        Pedido::create([
            'numero_orden' => 'ORD-UNICA-001', // Número de orden duplicado
            'persona_id'   => $persona->id,
            'nombre_cliente' => 'Carlos Mamani',
            'ci_cliente'   => '4433221',
            'tipo_pago'    => 'qr',
            'tipo_entrega' => 'recojo_tienda',
            'estado_pago'  => 'pendiente_validacion',
            'estado_entrega' => 'por_recoger',
            'total'        => 350.00,
        ]);
    }

    /**
     * DIT 8: Eliminación en Cascada Pedido → PedidoDetalles
     *
     * Al eliminar un pedido padre, todos sus detalles de línea deben
     * borrarse automáticamente (onDelete: cascade) sin dejar huérfanos.
     */
    public function test_cascade_delete_pedido_removes_detalles(): void
    {
        $producto = Producto::create([
            'nombre' => 'Botas Tácticas', 'slug' => 'botas-tacticas',
            'codigo_sku' => 'BOT-TAC-01', 'categoria_id' => $this->categoria->id,
            'stock_actual' => 20, 'stock_minimo' => 2,
            'precio_general' => 350.00, 'precio_asociado' => 320.00, 'activo' => true
        ]);

        $persona = Persona::create([
            'nombres' => 'Pedro', 'apellidos' => 'Quispe', 'ci' => '9988776',
            'celular' => '70011223', 'genero' => 'MASCULINO',
            'institucion' => 'POLICIA', 'tipo_afiliacion' => 'Activo', 'garantia_tipo' => 'Ninguna'
        ]);

        $pedido = Pedido::create([
            'numero_orden' => 'ORD-CASCADE-001',
            'persona_id'   => $persona->id,
            'nombre_cliente' => 'Pedro Quispe', 'ci_cliente' => '9988776',
            'tipo_pago' => 'qr', 'tipo_entrega' => 'recojo_tienda',
            'estado_pago' => 'pagado', 'estado_entrega' => 'entregado',
            'total' => 350.00
        ]);

        PedidoDetalle::create([
            'pedido_id' => $pedido->id, 'producto_id' => $producto->id,
            'cantidad' => 1, 'precio_unitario' => 350.00, 'subtotal' => 350.00
        ]);

        $this->assertDatabaseCount('pedido_detalles', 1);

        // Eliminar el pedido padre debe disparar cascade sobre pedido_detalles
        $pedido->delete();

        $this->assertDatabaseCount('pedido_detalles', 0);
    }

    /**
     * DIT 9: Eliminación en Cascada Producto → KardexProductos
     *
     * Al forzar la eliminación de un producto (sin referencias en pedido_detalles),
     * todos sus registros de kardex de almacén deben borrarse en cascada.
     */
    public function test_cascade_delete_producto_removes_kardex_productos(): void
    {
        $admin = User::create([
            'name' => 'Admin Bodega', 'email' => 'bodega@fapclas.com',
            'password' => bcrypt('pass'), 'persona_id' => null
        ]);

        $producto = Producto::create([
            'nombre' => 'Linterna Táctica', 'slug' => 'linterna-tactica',
            'codigo_sku' => 'LIN-TAC-77', 'categoria_id' => $this->categoria->id,
            'stock_actual' => 30, 'stock_minimo' => 3,
            'precio_general' => 85.00, 'precio_asociado' => 75.00, 'activo' => true
        ]);

        // Registrar 2 movimientos de kardex para el producto
        DB::table('kardex_productos')->insert([
            ['producto_id' => $producto->id, 'tipo_movimiento' => 'ingreso', 'cantidad' => 30,
             'saldo_stock' => 30, 'costo_unitario' => 70.00, 'concepto' => 'Ingreso inicial',
             'usuario_admin_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()],
            ['producto_id' => $producto->id, 'tipo_movimiento' => 'egreso', 'cantidad' => 5,
             'saldo_stock' => 25, 'costo_unitario' => 70.00, 'concepto' => 'Despacho venta',
             'usuario_admin_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->assertDatabaseCount('kardex_productos', 2);

        // El producto no tiene detalles de pedido, por lo que forceDelete debe funcionar
        // y todos sus kardex_productos deben eliminarse en cascada
        $producto->forceDelete();

        $this->assertDatabaseCount('kardex_productos', 0);
    }

    /**
     * DIT 10: Aislamiento de SoftDelete — Registros Eliminados No Aparecen en Consultas Activas
     *
     * Valida que productos con SoftDelete no se consulten por defecto, pero sí con withTrashed().
     * Esto es crítico para no mostrar productos descontinuados en el e-commerce.
     */
    public function test_softdelete_isolation_on_productos(): void
    {
        Producto::create([
            'nombre' => 'Rodillera Táctica', 'slug' => 'rodillera-tactica',
            'codigo_sku' => 'ROD-TAC-50', 'categoria_id' => $this->categoria->id,
            'stock_actual' => 10, 'stock_minimo' => 1,
            'precio_general' => 75.00, 'precio_asociado' => 65.00, 'activo' => true
        ]);

        $this->assertDatabaseCount('productos', 1);

        Producto::first()->delete(); // SoftDelete

        // No debe aparecer en queries estándar
        $this->assertSame(0, Producto::count());

        // Sí debe aparecer con withTrashed()
        $this->assertSame(1, Producto::withTrashed()->count());

        // La fila física sigue existiendo en la base de datos
        $this->assertDatabaseCount('productos', 1);
    }

    /**
     * DIT 11: Precisión Decimal en Montos Financieros
     *
     * Certifica que los importes almacenados con 2 decimales de precisión
     * se recuperan exactamente como fueron guardados, sin pérdida de exactitud
     * (crítico para amortizaciones de crédito e informes de caja).
     */
    public function test_decimal_precision_on_financial_amounts(): void
    {
        $persona = Persona::create([
            'nombres' => 'Luis', 'apellidos' => 'Tarqui', 'ci' => '6677889',
            'celular' => '60099887', 'genero' => 'MASCULINO',
            'institucion' => 'POLICIA', 'tipo_afiliacion' => 'Activo', 'garantia_tipo' => 'Ninguna'
        ]);

        $userSocio = User::create([
            'name' => 'Luis Tarqui', 'email' => 'tarqui@fapclas.com',
            'password' => bcrypt('pass'), 'persona_id' => $persona->id
        ]);

        $credito = Credito::create([
            'user_id' => $userSocio->id, 'persona_id' => $persona->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 1234.56,  // Monto con decimales específicos
            'tasa_interes' => 12.75,      // Tasa con precisión decimal
            'plazo_meses' => 6,
            'estado' => Credito::ESTADO_SOLICITADO,
            'metodo_descuento' => 'Planilla'
        ]);

        $this->assertDatabaseHas('creditos', [
            'id'             => $credito->id,
            'monto_aprobado' => '1234.56',
            'tasa_interes'   => '12.75',
        ]);

        // Verificar que el valor recuperado del modelo es idéntico
        $creditoRecuperado = Credito::find($credito->id);
        $this->assertEquals(1234.56, (float) $creditoRecuperado->monto_aprobado);
        $this->assertEquals(12.75,   (float) $creditoRecuperado->tasa_interes);
    }

    /**
     * DIT 12: Restricción NOT NULL en Campos Financieros Críticos del Crédito
     *
     * Garantiza que los campos obligatorios del modelo de crédito (monto_aprobado,
     * tasa_interes, plazo_meses) no admitan valores nulos, protegiendo la
     * integridad del motor de amortización francesa.
     */
    public function test_not_null_constraint_on_critical_credito_fields(): void
    {
        $persona = Persona::create([
            'nombres' => 'Ana', 'apellidos' => 'Callisaya', 'ci' => '3322110',
            'celular' => '77788899', 'genero' => 'FEMENINO',
            'institucion' => 'POLICIA', 'tipo_afiliacion' => 'Activo', 'garantia_tipo' => 'Ninguna'
        ]);

        $userSocio = User::create([
            'name' => 'Ana Callisaya', 'email' => 'ana@fapclas.com',
            'password' => bcrypt('pass'), 'persona_id' => $persona->id
        ]);

        $this->expectException(QueryException::class);

        // Intentar insertar un crédito sin monto_aprobado (campo NOT NULL)
        DB::table('creditos')->insert([
            'user_id'          => $userSocio->id,
            'persona_id'       => $persona->id,
            'tipo_credito_id'  => $this->tipoCredito->id,
            'monto_aprobado'   => null,  // NULL en campo requerido
            'tasa_interes'     => 12.0,
            'plazo_meses'      => 3,
            'estado'           => 'solicitado',
            'metodo_descuento' => 'Planilla',
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);
    }
}
