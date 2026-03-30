<?php

namespace Database\Seeders;

use App\Models\TipoCredito;
use Illuminate\Database\Seeder;

class TipoCreditoSeeder extends Seeder
{
    /**
     * Seed de tipos de crédito estándar para cooperativa policial FAPCLAS.
     */
    public function run(): void
    {
        $tipos = [
            [
                'nombre' => 'Crédito de Consumo',
                'descripcion' => 'Crédito para gastos personales y familiares del socio policial.',
                'tasa_interes' => 12.00,
                'plazo_min_meses' => 1,
                'plazo_max_meses' => 48,
                'monto_min' => 500,
                'monto_max' => 50000,
                'tasa_mora' => 3.00,
                'activo' => true,
            ],
            [
                'nombre' => 'Crédito de Emergencia',
                'descripcion' => 'Crédito de desembolso rápido para situaciones de urgencia.',
                'tasa_interes' => 10.00,
                'plazo_min_meses' => 1,
                'plazo_max_meses' => 12,
                'monto_min' => 100,
                'monto_max' => 10000,
                'tasa_mora' => 2.00,
                'activo' => true,
            ],
            [
                'nombre' => 'Crédito de Vivienda',
                'descripcion' => 'Crédito a largo plazo para adquisición, construcción o mejora de vivienda.',
                'tasa_interes' => 8.00,
                'plazo_min_meses' => 12,
                'plazo_max_meses' => 120,
                'monto_min' => 10000,
                'monto_max' => 200000,
                'tasa_mora' => 3.00,
                'activo' => true,
            ],
            [
                'nombre' => 'Anticipo de Sueldo',
                'descripcion' => 'Anticipo sobre haberes mensuales del socio policial.',
                'tasa_interes' => 6.00,
                'plazo_min_meses' => 1,
                'plazo_max_meses' => 3,
                'monto_min' => 100,
                'monto_max' => 5000,
                'tasa_mora' => 1.50,
                'activo' => true,
            ],
            [
                'nombre' => 'Crédito Educativo',
                'descripcion' => 'Crédito para formación académica del socio o hijos del socio policial.',
                'tasa_interes' => 7.00,
                'plazo_min_meses' => 6,
                'plazo_max_meses' => 60,
                'monto_min' => 1000,
                'monto_max' => 30000,
                'tasa_mora' => 2.00,
                'activo' => true,
            ],
        ];

        foreach ($tipos as $tipo) {
            TipoCredito::updateOrCreate(
                ['nombre' => $tipo['nombre']],
                $tipo
            );
        }
    }
}
