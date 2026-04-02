<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        // Insertar configuraciones iniciales
        \DB::table('site_settings')->insert([
            [
                'key' => 'header',
                'value' => json_encode([
                    'phone' => '800-10-FAPCLAS',
                    'phone_link' => 'tel:80010XXXX',
                    'whatsapp_link' => 'http://wa.link/8yl8ow',
                    'whatsapp_label' => 'WhatsApp Institucional',
                    'top_links' => [
                        ['label' => 'Bolsa de Trabajo', 'url' => '#'],
                        ['label' => 'Preguntas Frecuentes', 'url' => '#'],
                    ],
                    'menu' => [
                        [
                            'label' => 'Nuestra Entidad',
                            'children' => [
                                ['label' => 'Misión y Visión', 'url' => '/institucional/mision-vision', 'description' => 'Horizonte cooperativo policial.', 'icon' => 'flag'],
                                ['label' => 'Quiénes Somos', 'url' => '/institucional/constitucion', 'description' => 'Historia e impacto de FAPCLAS.', 'icon' => 'users'],
                            ],
                            'featured_image' => null,
                            'featured_title' => '+5,000 socios activos',
                            'featured_subtitle' => 'Únete a la hermandad policial.',
                            'featured_badge' => 'Solidaridad',
                        ],
                        [
                            'label' => 'Transparencia',
                            'children' => [
                                ['label' => 'Leyes y Normativas', 'url' => '/institucional/normativas', 'description' => 'Leyes 393, ASFI y AFCOOP.', 'icon' => 'book-open'],
                                ['label' => 'Punto de Reclamo (PRF)', 'url' => '#', 'description' => 'No disponible temporalmente.', 'icon' => 'message-circle', 'disabled' => true],
                            ],
                        ],
                        [
                            'label' => 'Informe',
                            'children' => [
                                ['label' => 'Noticias', 'url' => '/institucional/noticias', 'description' => 'Actualidad, comunicados y convenios.', 'icon' => 'newspaper'],
                            ],
                        ],
                    ],
                    'cta_portal_text' => 'Acceso al Portal',
                    'cta_tienda_text' => 'Tienda Virtual',
                    'logo_text' => 'FAPCLAS',
                    'logo_suffix' => 'R.L.',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'footer',
                'value' => json_encode([
                    'description' => 'Soluciones financieras integrales con eficiencia, oportunidad y responsabilidad social diseñadas exclusivamente para el bienestar integral de la familia policial boliviana.',
                    'badges' => [
                        ['top_label' => 'Control Societario', 'bottom_label' => 'Regulada por AFCOOP'],
                        ['top_label' => 'Supervisión Financiera', 'bottom_label' => 'Supervisada por ASFI'],
                    ],
                    'quick_links' => [
                        ['label' => 'Caja de Ahorro', 'url' => '#ahorro'],
                        ['label' => 'Créditos de Emergencia', 'url' => '#creditos'],
                        ['label' => 'Beneficios Exclusivos', 'url' => '#beneficios'],
                        ['label' => 'Misión y Visión', 'url' => '#institucional'],
                    ],
                    'contact_links' => [
                        ['label' => 'WhatsApp Directo', 'url' => 'http://wa.link/8yl8ow'],
                        ['label' => 'Síguenos en Facebook', 'url' => 'http://www.facebook.com/profile.php?id=61582603104419'],
                        ['label' => 'Atención Personalizada 24/7', 'url' => null],
                    ],
                    'social_links' => [
                        ['platform' => 'facebook', 'url' => '#'],
                        ['platform' => 'instagram', 'url' => '#'],
                        ['platform' => 'tiktok', 'url' => '#'],
                        ['platform' => 'linkedin', 'url' => '#'],
                    ],
                    'copyright' => '© 2026 Cooperativa FAPCLAS R.L. Todos los derechos reservados.',
                    'copyright_dev' => '© copyright SmarCoding SA.',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'whatsapp',
                'value' => json_encode([
                    'enabled' => true,
                    'url' => 'https://wa.link/8yl8ow',
                    'tooltip' => 'Oficial de Negocios (En línea)',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
