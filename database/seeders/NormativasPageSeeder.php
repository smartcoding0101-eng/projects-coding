<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NormativasPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Page::updateOrCreate(
            ['slug' => 'normativas'],
            [
                'title' => 'Leyes y Normativas',
                'is_active' => true,
                'content' => [
                    [
                        'type' => 'normativas',
                        'data' => [
                            'title' => 'Repositorio Normativo Boliviano',
                            'subtitle' => 'Regulados y respaldados oficialmente por el Estado Plurinacional de Bolivia para brindarte total seguridad técnica y financiera.',
                            'items' => [
                                [
                                    'name' => 'Ley de Servicios Financieros N° 393',
                                    'label' => 'Fiscalización Estatal',
                                    'description' => 'Normativa soberana aprobada en 2013 que regula de forma estricta las actividades plenas de intermediación financiera. FAPCLAS acata irrevocablemente el cumplimiento de los reglamentos determinados por ASFI.',
                                    'icon' => 'Library',
                                    'color' => 'blue',
                                    'file' => 'pages/normativas/ley-393.pdf',
                                    'button_text' => 'Descargar Ley 393 PDF',
                                ],
                                [
                                    'name' => 'Ley General de Cooperativas N° 356',
                                    'label' => 'Supervisión Cooperativa',
                                    'description' => 'Establece categóricamente el marco normativo vinculante para la constitución orgánica, funcionamiento asambleario y disolución del sector cooperativo bajo supervigilancia absoluta de AFCOOP.',
                                    'icon' => 'ShieldCheck',
                                    'color' => 'emerald',
                                    'file' => 'pages/normativas/ley-356.pdf',
                                    'button_text' => 'Descargar Ley 356 PDF',
                                ],
                                [
                                    'name' => 'Estatuto Orgánico Vigente',
                                    'label' => 'Gobernanza Interna',
                                    'description' => 'Nuestro instrumento regidor interno supremo que define simétricamente los derechos irrenunciables, obligaciones institucionales y regímenes jerárquicos de beneficio para nuestros socios.',
                                    'icon' => 'FileText',
                                    'color' => 'primary',
                                    'file' => 'pages/normativas/estatuto.pdf',
                                    'button_text' => 'Ver Documento en Linea',
                                ],
                                [
                                    'name' => 'Punto de Reclamo (PRF)',
                                    'label' => 'Protección al Socio',
                                    'description' => '¿Tienes una consulta técnica o necesitas presentar tu disconformidad sobre los servicios? Accede al registro oficial PRF, respaldado inquebrantablemente por lineamientos de protección ASFI.',
                                    'icon' => 'MessageSquare',
                                    'color' => 'gold',
                                    'file' => 'pages/normativas/prf.pdf',
                                    'button_text' => 'Formulario Electrónico',
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        );
    }
}
