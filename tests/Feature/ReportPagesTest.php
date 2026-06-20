<?php

namespace Tests\Feature;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ReportPagesTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Create the permission and role
        $permission = Permission::firstOrCreate(['name' => 'gestionar usuarios']);
        $role = Role::firstOrCreate(['name' => 'SuperAdmin']);
        $role->givePermissionTo($permission);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SuperAdmin');
    }

    #[Test]
    public function reports_index_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.index'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_cartera_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.cartera'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_morosidad_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.morosidad'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_estado_cuenta_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.estado-cuenta'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_planilla_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.planilla'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_historico_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.historico'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_recaudacion_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.recaudacion'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_ecommerce_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.ecommerce'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_caja_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.caja'));
        $response->assertStatus(200);
    }

    #[Test]
    public function report_conciliacion_ecommerce_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('reportes.conciliacion-ecommerce'));
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_personas_page_loads_for_admin()
    {
        $response = $this->actingAs($this->admin)->get(route('admin.personas.index'));
        $response->assertStatus(200);
    }
}
