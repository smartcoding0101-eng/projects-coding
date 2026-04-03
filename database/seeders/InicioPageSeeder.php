<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class InicioPageSeeder extends Seeder
{
    public function run(): void
    {
        Page::updateOrCreate(
            ['slug' => 'inicio'],
            [
                'title' => 'Inicio - FAPCLAS',
                'is_active' => true,
                'metadata' => [
                    'seo_title' => 'FAPCLAS - Tu Futuro Seguro',
                    'seo_description' => 'Cooperativa de la Familia Policial Boliviana. Créditos, beneficios y servicios exclusivos.',
                ],
                'content' => [
                    // ========== HERO ==========
                    [
                        'type' => 'hero',
                        'data' => [
                            'slides' => [
                                [
                                    'title' => 'Tu Futuro Seguro',
                                    'subtitle' => 'Respaldo Financiero',
                                    'description' => 'Créditos con tasas preferenciales, aprobación rápida y atención personalizada para la familia policial boliviana.',
                                    'cta_text' => 'Solicitar Crédito',
                                    'cta_link' => '/creditos/solicitar',
                                    'image' => null,
                                ],
                                [
                                    'title' => 'Servicios Exclusivos',
                                    'subtitle' => 'Para tu familia',
                                    'description' => 'Tienda virtual, lavandería, salón de belleza y más beneficios diseñados para el bienestar de nuestros socios.',
                                    'cta_text' => 'Ver Beneficios',
                                    'cta_link' => '/beneficios',
                                    'image' => null,
                                ],
                                [
                                    'title' => 'Más de 5,000 Socios',
                                    'subtitle' => 'Cooperativa Líder',
                                    'description' => 'Solidaridad, transparencia y ayuda mutua como pilares de nuestra cooperativa institucional.',
                                    'cta_text' => 'Conocer más',
                                    'cta_link' => '/institucional/mision-vision',
                                    'image' => null,
                                ],
                            ],
                        ],
                    ],

                    // ========== IDENTITY ==========
                    [
                        'type' => 'identity',
                        'data' => [
                            'title' => 'Nacimos para Crecer, Servir y Transformar',
                            'description' => 'Queridos socios y miembros de la familia policial boliviana, es un honor ser el sustento económico que respalda cada jornada de servicio. La transparencia, ayuda mutua y solidaridad no son solo ideales, sino el pilar de nuestra cooperativa.',
                            'mission' => 'Garantizar estabilidad económica mediante sistemas modernos con alcance nacional, brindando servicios financieros de calidad a la familia policial boliviana.',
                            'vision' => 'Ser la cooperativa de referencia en solvencia y atención competitiva, liderando el mercado de cooperativas institucionales en Bolivia.',
                            'counter_value' => 5000,
                            'counter_label' => 'Socios Activos',
                            'images' => [],
                        ],
                    ],

                    // ========== STATS ==========
                    [
                        'type' => 'stats',
                        'data' => [
                            'title' => 'Cifras que Respaldan Nuestra Transparencia',
                            'items' => [
                                [
                                    'value' => '15+',
                                    'label' => 'Años de Servicio',
                                    'icon' => 'Award',
                                ],
                                [
                                    'value' => '5,000+',
                                    'label' => 'Socios Activos',
                                    'icon' => 'Users',
                                ],
                                [
                                    'value' => '10M+',
                                    'label' => 'En Créditos Otorgados',
                                    'icon' => 'TrendingUp',
                                ],
                                [
                                    'value' => '7',
                                    'label' => 'Servicios Exclusivos',
                                    'icon' => 'Shield',
                                ],
                            ],
                        ],
                    ],

                    // ========== PRODUCT CARDS (Servicios) ==========
                    [
                        'type' => 'product_cards',
                        'data' => [
                            'title' => 'Nuestros Servicios',
                            'subtitle' => 'Soluciones pensadas exclusivamente para la familia policial y sus seres queridos.',
                            'items' => [
                                [
                                    'name' => 'Préstamo Policial',
                                    'description' => 'Créditos con tasas preferenciales y aprobación rápida. Tu respaldo financiero.',
                                    'route' => '/servicios/prestamo-policial',
                                    'icon' => 'Banknote',
                                    'image' => null,
                                    'is_featured' => true,
                                ],
                                [
                                    'name' => 'Tienda Virtual',
                                    'description' => 'Todo lo que necesitas, con descuento directo por planilla.',
                                    'route' => '/servicios/tienda-virtual',
                                    'icon' => 'ShoppingBag',
                                    'image' => null,
                                    'is_featured' => false,
                                ],
                                [
                                    'name' => 'Lavandería',
                                    'description' => 'Uniformes impecables. Servicio profesional para tu día a día.',
                                    'route' => '/servicios/lavanderia',
                                    'icon' => 'Shirt',
                                    'image' => null,
                                    'is_featured' => false,
                                ],
                                [
                                    'name' => 'Bordados Digitalizados',
                                    'description' => 'Identidad visual institucional con precisión y calidad.',
                                    'route' => '/servicios/bordados',
                                    'icon' => 'Scissors',
                                    'image' => null,
                                    'is_featured' => false,
                                ],
                            ],
                        ],
                    ],

                    // ========== CREDIT SIMULATOR ==========
                    [
                        'type' => 'credit_simulator',
                        'data' => [
                            'title' => 'Tu Solución Inmediata',
                            'subtitle' => 'Calcula con total transparencia institucional.',
                            'rate' => 10,
                            'min_amount' => 1000,
                            'max_amount' => 150000,
                            'min_months' => 1,
                            'max_months' => 36,
                            'default_amount' => 20000,
                            'default_months' => 12,
                            'cta_text' => 'Iniciar Solicitud de Crédito',
                        ],
                    ],

                    // ========== BENEFITS ==========
                    [
                        'type' => 'benefits',
                        'data' => [
                            'title' => 'Beneficios Exclusivos',
                            'subtitle' => 'Más allá del crédito, somos tu respaldo integral.',
                            'items' => [
                                [
                                    'title' => 'Tasas Preferenciales',
                                    'description' => 'Intereses pensados para la economía policial. Sin sorpresas.',
                                    'icon' => 'TrendingDown',
                                    'link' => '/servicios/prestamo-policial',
                                ],
                                [
                                    'title' => 'Aprobación Rápida',
                                    'description' => 'Proceso ágil y transparente con respuesta en horas.',
                                    'icon' => 'Zap',
                                    'link' => '',
                                ],
                                [
                                    'title' => 'Descuento por Planilla',
                                    'description' => 'Comodidad total: tus cuotas se descuentan automáticamente.',
                                    'icon' => 'CreditCard',
                                    'link' => '',
                                ],
                            ],
                            'status_label' => 'Socio Activo',
                            'status_badge' => 'Fapclas ERP v3',
                        ],
                    ],

                    // ========== GALLERY ==========
                    [
                        'type' => 'gallery',
                        'data' => [
                            'title' => 'Nuestra Galería Institucional',
                            'subtitle' => 'Momentos que reflejan nuestro compromiso con la familia policial.',
                            'items' => [
                                [
                                    'caption' => 'Acto de Aniversario',
                                    'image' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                                ],
                                [
                                    'caption' => 'Nuevas Instalaciones',
                                    'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                ],
                                [
                                    'caption' => 'Entrega de Créditos',
                                    'image' => 'https://images.unsplash.com/photo-1560518884-ce5882228a96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                ],
                            ],
                        ],
                    ],

                    // ========== VIDEO ==========
                    [
                        'type' => 'video',
                        'data' => [
                            'title' => 'Fapclas en Movimiento',
                            'subtitle' => 'Conoce Nuestra Historia',
                            'main_title' => 'Nuestra cooperativa, tu confianza',
                            'main_subtitle' => 'Más de una década de servicio institucional',
                            'main_url' => 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                            'main_thumbnail' => null,
                            'gallery' => [],
                        ],
                    ],
                    
                    // ========== TESTIMONIALS ==========
                    [
                        'type' => 'testimonials',
                        'data' => [
                            'title' => 'Voces de Nuestra Familia',
                            'subtitle' => 'Confianza que nos respalda',
                            'items' => [
                                [
                                    'name' => 'Sgto. Juan Pérez',
                                    'role' => 'Asociado Activo',
                                    'content' => 'Gracias a FAPCLAS pude financiar la educación de mis hijos. La atención es excelente.',
                                    'rating' => 5,
                                    'image' => null,
                                ],
                                [
                                    'name' => 'Cnl. María Gómez',
                                    'role' => 'Asociada Activa',
                                    'content' => 'La cooperativa siempre me ha brindado apoyo oportuno con las tasas más competitivas.',
                                    'rating' => 5,
                                    'image' => null,
                                ],
                                [
                                    'name' => 'Sof. Roberto Mamani',
                                    'role' => 'Asociado Pasivo',
                                    'content' => 'El proceso de crédito fue rápido y muy transparente. Recomendado a toda la familia policial.',
                                    'rating' => 5,
                                    'image' => null,
                                ],
                            ],
                        ],
                    ],
                    
                    // ========== LATEST NEWS ==========
                    [
                        'type' => 'latest_news',
                        'data' => [
                            'title' => 'Últimas Noticias',
                            'subtitle' => 'Información actualizada sobre la Cooperativa.',
                            'count' => 4,
                        ],
                    ],

                    // ========== FAQ ==========
                    [
                        'type' => 'faq',
                        'data' => [
                            'title' => 'Preguntas Frecuentes',
                            'subtitle' => 'Aclaremos tus dudas operativas.',
                            'items' => [
                                [
                                    'question' => '¿Quién puede ser socio de FAPCLAS?',
                                    'answer' => 'Todo miembro activo o en retiro de la Policía Boliviana, así como sus familiares directos.',
                                ],
                                [
                                    'question' => '¿Cómo solicito un préstamo?',
                                    'answer' => 'Puedes iniciar tu solicitud en línea desde nuestro portal.',
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        );

        $this->command->info('✅ Página inicio re-sembrada con stats, gallery, video y news blocks.');
    }
}
