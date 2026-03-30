<?php

namespace Tests\Feature;

use App\Models\Credito;
use App\Models\PlanPago;
use App\Models\TipoCredito;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CreditoFlowTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $socio;
    private TipoCredito $tipoCredito;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear permisos y roles
        $permission = Permission::create(['name' => 'gestionar usuarios']);
        $role = Role::create(['name' => 'SuperAdmin']);
        $role->givePermissionTo($permission);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SuperAdmin');

        $this->socio = User::factory()->create([
            'ci' => '12345678',
            'grado' => 'Sgto.',
            'destino' => 'FELCC',
            'escalafon' => 'E-001',
        ]);

        $this->tipoCredito = TipoCredito::create([
            'nombre' => 'Consumo Test',
            'descripcion' => 'Para pruebas',
            'tasa_interes' => 12.0,
            'plazo_min_meses' => 1,
            'plazo_max_meses' => 24,
            'monto_min' => 100,
            'monto_max' => 50000,
            'tasa_mora' => 3.0,
            'activo' => true,
        ]);
    }

    /** @test */
    public function socio_puede_solicitar_credito(): void
    {
        $response = $this->actingAs($this->socio)->post(route('creditos.store'), [
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_solicitado' => 10000,
            'plazo_meses' => 12,
            'metodo_descuento' => 'Planilla',
        ]);

        $response->assertRedirect(route('creditos.index'));
        $this->assertDatabaseHas('creditos', [
            'user_id' => $this->socio->id,
            'estado' => Credito::ESTADO_SOLICITADO,
            'monto_aprobado' => 10000,
        ]);
    }

    /** @test */
    public function solicitud_rechaza_monto_fuera_de_rango(): void
    {
        $response = $this->actingAs($this->socio)->post(route('creditos.store'), [
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_solicitado' => 999999,
            'plazo_meses' => 12,
            'metodo_descuento' => 'Planilla',
        ]);

        $response->assertSessionHasErrors('monto_solicitado');
    }

    /** @test */
    public function admin_puede_aprobar_credito_y_genera_plan_pagos(): void
    {
        $credito = Credito::create([
            'user_id' => $this->socio->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 10000,
            'tasa_interes' => 12.0,
            'plazo_meses' => 6,
            'estado' => Credito::ESTADO_SOLICITADO,
            'metodo_descuento' => 'Planilla',
        ]);

        $response = $this->actingAs($this->admin)->post(route('creditos.evaluar', $credito), [
            'estado' => 'Aprobado',
            'monto_aprobado' => 10000,
            'observaciones' => 'Aprobado por test',
        ]);

        $response->assertRedirect();

        $credito->refresh();
        $this->assertEquals(Credito::ESTADO_DESEMBOLSADO, $credito->estado);
        $this->assertEquals(10000, $credito->saldo_capital);
        $this->assertNotNull($credito->aprobado_por);
        $this->assertEquals(6, $credito->planPagos()->count());
    }

    /** @test */
    public function admin_puede_registrar_pago_de_cuota(): void
    {
        $credito = Credito::create([
            'user_id' => $this->socio->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 6000,
            'tasa_interes' => 0,
            'plazo_meses' => 6,
            'estado' => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital' => 6000,
            'metodo_descuento' => 'Planilla',
        ]);

        $cuota1 = PlanPago::create([
            'credito_id' => $credito->id,
            'nro_cuota' => 1,
            'cuota_total' => 1000,
            'capital_amortizado' => 1000,
            'interes_pagado' => 0,
            'monto_mora' => 0,
            'fecha_vencimiento' => now()->addMonth()->toDateString(),
            'estado' => PlanPago::ESTADO_PENDIENTE,
        ]);

        // Cuota 2 todavía pendiente — evita que el crédito pase a "Pagado"
        PlanPago::create([
            'credito_id' => $credito->id,
            'nro_cuota' => 2,
            'cuota_total' => 1000,
            'capital_amortizado' => 1000,
            'interes_pagado' => 0,
            'monto_mora' => 0,
            'fecha_vencimiento' => now()->addMonths(2)->toDateString(),
            'estado' => PlanPago::ESTADO_PENDIENTE,
        ]);

        $response = $this->actingAs($this->admin)->post(
            route('creditos.registrar-pago', [$credito, $cuota1]),
            ['metodo_pago' => 'Efectivo']
        );

        $response->assertRedirect();

        $cuota1->refresh();
        $credito->refresh();

        $this->assertEquals(PlanPago::ESTADO_PAGADA, $cuota1->estado);
        $this->assertEqualsWithDelta(5000, (float) $credito->saldo_capital, 0.01);
        $this->assertEquals(Credito::ESTADO_DESEMBOLSADO, $credito->estado);
    }

    /** @test */
    public function credito_pasa_a_pagado_cuando_todas_cuotas_pagadas(): void
    {
        $credito = Credito::create([
            'user_id' => $this->socio->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 2000,
            'tasa_interes' => 0,
            'plazo_meses' => 2,
            'estado' => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital' => 1000,
            'metodo_descuento' => 'Planilla',
        ]);

        // Solo 1 cuota pendiente
        $cuota = PlanPago::create([
            'credito_id' => $credito->id,
            'nro_cuota' => 2,
            'cuota_total' => 1000,
            'capital_amortizado' => 1000,
            'interes_pagado' => 0,
            'monto_mora' => 0,
            'fecha_vencimiento' => now()->addMonth()->toDateString(),
            'estado' => PlanPago::ESTADO_PENDIENTE,
        ]);

        // Cuota 1 ya pagada
        PlanPago::create([
            'credito_id' => $credito->id,
            'nro_cuota' => 1,
            'cuota_total' => 1000,
            'capital_amortizado' => 1000,
            'interes_pagado' => 0,
            'monto_mora' => 0,
            'fecha_vencimiento' => now()->toDateString(),
            'estado' => PlanPago::ESTADO_PAGADA,
        ]);

        $this->actingAs($this->admin)->post(
            route('creditos.registrar-pago', [$credito, $cuota]),
            ['metodo_pago' => 'Planilla']
        );

        $credito->refresh();
        $this->assertEquals(Credito::ESTADO_PAGADO, $credito->estado);
        $this->assertEquals(0, $credito->saldo_capital);
    }

    /** @test */
    public function socio_puede_ver_detalle_de_su_credito(): void
    {
        $credito = Credito::create([
            'user_id' => $this->socio->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 5000,
            'tasa_interes' => 12.0,
            'plazo_meses' => 6,
            'estado' => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital' => 5000,
            'metodo_descuento' => 'Planilla',
        ]);

        $response = $this->actingAs($this->socio)->get(route('creditos.show', $credito));
        $response->assertStatus(200);
    }

    /** @test */
    public function socio_no_puede_ver_credito_ajeno(): void
    {
        $otroSocio = User::factory()->create();
        $credito = Credito::create([
            'user_id' => $otroSocio->id,
            'tipo_credito_id' => $this->tipoCredito->id,
            'monto_aprobado' => 5000,
            'tasa_interes' => 12.0,
            'plazo_meses' => 6,
            'estado' => Credito::ESTADO_DESEMBOLSADO,
            'saldo_capital' => 5000,
            'metodo_descuento' => 'Planilla',
        ]);

        $response = $this->actingAs($this->socio)->get(route('creditos.show', $credito));
        $response->assertStatus(403);
    }
}
