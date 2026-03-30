<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Configuracion;

class WhatsAppSoporteSeeder extends Seeder
{
    public function run(): void
    {
        Configuracion::firstOrCreate(
            ['key' => 'whatsapp_soporte'],
            [
                'key' => 'whatsapp_soporte',
                'value' => '59170000000',
                'description' => 'Número de WhatsApp de soporte para Servicios y E-commerce (formato internacional, ej: 59170000000)',
            ]
        );

        $this->command->info('✅ WhatsApp soporte configurado.');
    }
}
