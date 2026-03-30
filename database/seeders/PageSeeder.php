<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Page::updateOrCreate(
            ['slug' => 'inicio'],
            [
                'title' => 'FAPCLAS R.L. - Tu Futuro Seguro',
                'is_active' => true,
                'content' => [
                    [
                        'type' => 'hero',
                        'data' => [
                            'title' => 'FAPCLAS R.L.',
                            'subtitle' => 'Tu Futuro Seguro. Institución líder en bienestar social y financiero para el personal policial.',
                            'cta_text' => 'Ver Beneficios',
                            'cta_link' => '/beneficios',
                        ]
                    ],
                    [
                        'type' => 'stats',
                        'data' => [
                            'title' => 'Nuestra Identidad',
                            'items' => [
                                ['label' => 'Sénior', 'value' => '15k', 'icon' => 'UserCheck'],
                                ['label' => 'Proyectos', 'value' => '120+', 'icon' => 'Briefcase'],
                                ['label' => 'Años', 'value' => '25+', 'icon' => 'Calendar'],
                                ['label' => 'Oficinas', 'value' => '9', 'icon' => 'MapPin'],
                            ]
                        ]
                    ],
                    [
                        'type' => 'video',
                        'data' => [
                            'title' => 'Fapclas en Movimiento',
                            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
                        ]
                    ],
                    [
                        'type' => 'services',
                        'data' => [
                            'title' => 'Nuestros Beneficios Dinámicos',
                            'subtitle' => 'Accede a créditos, tienda virtual y servicios exclusivos diseñados para tu crecimiento.',
                        ]
                    ]
                ]
            ]
        );
    }
}
