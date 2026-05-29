<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // El orden de ejecución es Crítico para no violar llaves foráneas.
        $this->call([
            RolesAndPermissionsSeeder::class,
            StandardPermissionsSeeder::class,
            TipoCreditoSeeder::class,
            InicioPageSeeder::class,
            PageSeeder::class,
            NoticiaSeeder::class,
            NormativasPageSeeder::class,
            WhatsAppSoporteSeeder::class,
            EcommerceSettingsSeeder::class,
            EcommerceCatalogoSeeder::class,
            HistoricalDataSeeder::class,
            ServicioSeeder::class,
        ]);

        // Crear un usuario local de desarrollo adicional
        User::factory()->create([
            'name' => 'Oficial de Pruebas',
            'email' => 'test@example.com',
        ]);
    }
}
