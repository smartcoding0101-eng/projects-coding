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
use App\Models\LibroDiario;
use App\Models\KardexProducto;
use App\Models\Configuracion;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * E2E HTTP Layer Tests — Pruebas a nivel de rutas HTTP reales.
 * Cubre: acceso a rutas, protección de middleware, respuestas Inertia,
 * envíos de formularios, redirecciones y validaciones de seguridad.
 */
class E2EHttpLayerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $socio;
    private Producto $producto;

    protected function setUp(): void
    {
        parent::setUp();

        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'gestionar usuarios']);
        $roleAdmin = Role::firstOrCreate(['name' => 'SuperAdmin']);
        $roleAdmin->givePermissionTo('gestionar usuarios');
        Role::firstOrCreate(['name' => 'Socio']);

        $persona = Persona::create([
            'nombres' => 'Pedro', 'apellidos' => 'Quispe', 'ci' => '7654321',
            'celular' => '76543210', 'genero' => 'MASCULINO',
            'institucion' => 'FELCN', 'tipo_afiliacion' => 'Activo', 'garantia_tipo' => 'Ninguna',
        ]);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SuperAdmin');

        $this->socio = User::factory()->create(['ci' => '7654321']);
        $this->socio->assignRole('Socio');
        $this->socio->update(['persona_id' => $persona->id]);

        $cat = Categoria::create(['nombre' => 'Tecnología', 'slug' => 'tech', 'activa' => true]);
        $this->producto = Producto::create([
            'nombre' => 'Tablet Samsung', 'slug' => 'tablet-samsung',
            'codigo_sku' => 'TECH-001', 'categoria_id' => $cat->id,
            'stock_actual' => 20, 'stock_minimo' => 2,
            'precio_general' => 1500.00, 'precio_asociado' => 1350.00, 'activo' => true,
        ]);

        Configuracion::updateOrCreate(['key' => 'ecommerce_modo_mantenimiento'], ['value' => 'no']);
        Configuracion::updateOrCreate(['key' => 'ecommerce_descuento_socios_global'], ['value' => '0']);
        Configuracion::updateOrCreate(['key' => 'ecommerce_limite_credito_default'], ['value' => '50000']);
        Configuracion::updateOrCreate(['key' => 'ecommerce_habilitar_invitados'], ['value' => 'si']);
    }

    // ═══════════════════════════════════════════════════════════════
    // GRUPO 1: RUTAS PÚBLICAS — Landing Page y E-commerce
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function http_landing_page_carga_correctamente(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Welcome'));
    }

    #[Test]
    public function http_ecommerce_catalogo_publico_accesible(): void
    {
        $response = $this->get('/beneficios');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Ecommerce/Store')
                ->has('productos')
                ->has('categorias')
                ->has('filtros')
        );
    }

    #[Test]
    public function http_ecommerce_filtro_por_categoria(): void
    {
        $response = $this->get('/beneficios?categoria=tech');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Ecommerce/Store')
                ->where('filtros.categoria', 'tech')
        );
    }

    #[Test]
    public function http_ecommerce_busqueda_por_nombre(): void
    {
        $response = $this->get('/beneficios?q=Samsung');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Ecommerce/Store')
                ->where('filtros.q', 'Samsung')
        );
    }

    #[Test]
    public function http_detalle_producto_accesible_publicamente(): void
    {
        $response = $this->get("/beneficios/producto/{$this->producto->id}");
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Ecommerce/Show')
                ->has('producto')
        );
    }

    // ═══════════════════════════════════════════════════════════════
    // GRUPO 2: SEGURIDAD — Middleware Auth en Rutas Protegidas
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function http_dashboard_redirige_a_login_si_no_autenticado(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    #[Test]
    public function http_creditos_redirige_a_login_si_no_autenticado(): void
    {
        $response = $this->get('/creditos');
        $response->assertRedirect('/login');
    }

    #[Test]
    public function http_kardex_redirige_a_login_si_no_autenticado(): void
    {
        $response = $this->get('/kardex');
        $response->assertRedirect('/login');
    }

    #[Test]
    public function http_libro_diario_redirige_a_login_si_no_autenticado(): void
    {
        $response = $this->get('/libro-diario');
        $response->assertRedirect('/login');
    }

    #[Test]
    public function http_caja_admin_redirige_a_login_si_no_autenticado(): void
    {
        $response = $this->get('/admin/caja');
        $response->assertRedirect('/login');
    }

    // ═══════════════════════════════════════════════════════════════
    // GRUPO 3: ACCESO AUTENTICADO — Socio accede a su portal
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function http_socio_autenticado_accede_al_dashboard(): void
    {
        $response = $this->actingAs($this->socio)->get('/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Dashboard'));
    }

    #[Test]
    public function http_socio_autenticado_accede_a_su_kardex(): void
    {
        $response = $this->actingAs($this->socio)->get('/kardex');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Kardex/Index'));
    }

    #[Test]
    public function http_socio_autenticado_accede_al_libro_diario_retorna_forbidden(): void
    {
        $response = $this->actingAs($this->socio)->get('/libro-diario');
        $response->assertStatus(403);
    }

    #[Test]
    public function http_socio_con_permiso_accede_al_libro_diario(): void
    {
        \Spatie\Permission\Models\Permission::firstOrCreate(['name' => 'ver reportes']);
        $this->socio->givePermissionTo('ver reportes');
        $response = $this->actingAs($this->socio)->get('/libro-diario');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('LibroDiario/Index'));
    }

    #[Test]
    public function http_socio_autenticado_ve_sus_creditos(): void
    {
        $response = $this->actingAs($this->socio)->get('/creditos');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Creditos/Index'));
    }

    #[Test]
    public function http_socio_ve_precio_especial_en_detalle_producto(): void
    {
        $response = $this->actingAs($this->socio)->get("/beneficios/producto/{$this->producto->id}");
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Ecommerce/Show')
                ->has('producto')
        );
    }

    // ═══════════════════════════════════════════════════════════════
    // GRUPO 4: CHECKOUT HTTP — Envío de formulario de compra
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function http_checkout_get_accesible(): void
    {
        $response = $this->get('/beneficios/checkout');
        $response->assertStatus(200);
    }

    #[Test]
    public function http_checkout_post_crea_pedido_y_redirige_a_pasarela(): void
    {
        $payload = [
            'cliente' => [
                'nombre' => 'Pedro Quispe',
                'ci' => '7654321',
                'telefono' => '76543210',
                'observaciones' => 'Prueba HTTP E2E'
            ],
            'carrito' => [
                ['id' => $this->producto->id, 'cantidad' => 1]
            ],
            'tipo_pago' => 'qr',
            'logistica' => [
                'tipo_entrega' => 'recojo_tienda',
                'direccion_envio' => null
            ]
        ];

        $response = $this->actingAs($this->socio)
            ->post('/beneficios/checkout', $payload);

        // Debe redirigir a la pasarela de pago QR con el número de orden
        $response->assertRedirectContains('/beneficios/pasarela/');

        // Verificar que el pedido se creó en BD
        $this->assertDatabaseHas('pedidos', [
            'ci_cliente'   => '7654321',
            'tipo_pago'    => 'qr',
            'estado_pago'  => 'pendiente_validacion',
        ]);
    }

    // ═══════════════════════════════════════════════════════════════
    // GRUPO 5: ADMIN — Panel Filament y Módulos Restringidos
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function http_admin_accede_al_panel_filament(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin');
        $response->assertStatus(200);
    }

    #[Test]
    public function http_socio_no_accede_al_panel_filament(): void
    {
        $response = $this->actingAs($this->socio)->get('/admin');
        $response->assertStatus(403);
    }

    #[Test]
    public function http_admin_accede_al_modulo_caja(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/caja');
        $response->assertStatus(200);
    }

    #[Test]
    public function http_admin_accede_al_dashboard_ecommerce(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/ecommerce/dashboard');
        $response->assertStatus(200);
    }

    // ═══════════════════════════════════════════════════════════════
    // GRUPO 6: SEGURIDAD AVANZADA — Aislamiento entre Socios
    // ═══════════════════════════════════════════════════════════════

    #[Test]
    public function http_socio_no_puede_ver_credito_ajeno(): void
    {
        $otroSocio = User::factory()->create();
        $otroSocio->assignRole('Socio');

        $tipoCredito = \App\Models\TipoCredito::create([
            'nombre' => 'Test', 'tasa_interes' => 5, 'plazo_min_meses' => 1,
            'plazo_max_meses' => 12, 'monto_min' => 100, 'monto_max' => 10000, 'activo' => true,
        ]);

        $creditoAjeno = Credito::create([
            'user_id' => $otroSocio->id,
            'tipo_credito_id' => $tipoCredito->id,
            'monto_aprobado' => 5000,
            'tasa_interes' => 5,
            'plazo_meses' => 6,
            'estado' => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital' => 5000,
            'metodo_descuento' => 'Planilla',
        ]);

        // El socio actual intenta acceder al crédito del otro socio
        $response = $this->actingAs($this->socio)->get("/creditos/{$creditoAjeno->id}");
        $response->assertStatus(403);
    }

    #[Test]
    public function http_noticias_publicas_accesibles(): void
    {
        $response = $this->get('/noticias');
        $response->assertStatus(200);
    }

    #[Test]
    public function http_ruta_inexistente_retorna_404(): void
    {
        $response = $this->get('/ruta-que-no-existe-jamas');
        $response->assertStatus(404);
    }
}
