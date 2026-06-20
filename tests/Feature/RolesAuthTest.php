<?php

namespace Tests\Feature;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Filament\Pages\Dashboard;
use PHPUnit\Framework\Attributes\Test;

class RolesAuthTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $socio;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Roles
        Role::create(['name' => 'SuperAdmin']);
        Role::create(['name' => 'Socio']);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('SuperAdmin');

        $this->socio = User::factory()->create();
        $this->socio->assignRole('Socio');
    }

    #[Test]
    public function socio_no_puede_acceder_al_panel_admin()
    {
        // En Filament, el acceso al panel se rige por canAccessPanel
        // Esto normalmente retorna 403 si el usuario no debe acceder.
        $response = $this->actingAs($this->socio)->get('/admin');

        $response->assertStatus(403);
    }

    #[Test]
    public function admin_puede_acceder_al_panel_admin()
    {
        $response = $this->actingAs($this->admin)->get('/admin');

        $response->assertStatus(200);
    }
}
