<?php

namespace Database\Seeders;

use App\Models\Noticia;
use Illuminate\Database\Seeder;

class NoticiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $news = [
            [
                'titulo' => 'Nueva Campaña de Crédito de Vivienda Policial 2026',
                'slug' => 'nueva-campana-credito-vivienda-policial-2026',
                'fecha' => '2026-03-20',
                'categoria' => 'Créditos',
                'resumen' => 'Conoce los nuevos requisitos flexibilizados para acceder a tu primera vivienda propia con las tasas más competitivas del sector solidario.',
                'contenido' => '<p>Nos complace anunciar el lanzamiento de nuestra nueva campa&ntilde;a de cr&eacute;dito orientada a la <strong>Vivienda Policial</strong> para la gesti&oacute;n 2026. Esta iniciativa busca facilitar el acceso a la vivienda propia para todos nuestros socios con condiciones preferenciales.</p><h3>Beneficios Principales:</h3><ul><li>Tasas de inter&eacute;s competitivas.</li><li>Plazos extendidos hasta 30 a&ntilde;os.</li><li>Requisitos simplificados para socios activos.</li></ul><p>Para m&aacute;s informaci&oacute;n, puedes visitarnos en nuestras oficinas centrales o solicitar una cita con un asesor financiero.</p>',
                'imagen_path' => null, // Will use placeholder in view
                'color_accent' => 'blue',
            ],
            [
                'titulo' => 'Asamblea Anual Ordinaria Reguladora AFCOOP',
                'slug' => 'asamblea-anual-ordinaria-reguladora-afcoop',
                'fecha' => '2026-03-15',
                'categoria' => 'Institucional',
                'resumen' => 'FAPCLAS R.L. rinde cuentas de la gestión financiera. Transparencia corporativa comprobada y nuevos hitos patrimoniales alcanzados.',
                'contenido' => '<p>En cumplimiento con las normativas vigentes de la <strong>AFCOOP</strong>, se llev&oacute; a cabo la Asamblea Anual Ordinaria donde se presentaron los estados financieros de la gesti&oacute;n pasada.</p><blockquote>&quot;La transparencia es el pilar fundamental de nuestra cooperativa, y los resultados de este a&ntilde;o demuestran la solidez de nuestro patrimonio.&quot;</blockquote><p>Agradecemos a todos los delegados y socios por su participaci&oacute;n activa en la toma de decisiones para el futuro de FAPCLAS R.L.</p>',
                'imagen_path' => null,
                'color_accent' => 'primary',
            ],
            [
                'titulo' => 'Convenio Médico Estratégico: Red Nacional de Salud',
                'slug' => 'convenio-medico-estrategico-red-nacional-salud',
                'fecha' => '2026-03-10',
                'categoria' => 'Beneficios',
                'resumen' => 'Ampliamos nuestra cobertura de convenios hospitalarios para todos los socios policiales activos y sus familias directas en todo Bolivia.',
                'contenido' => '<p>FAPCLAS R.L. ha firmado un acuerdo hist&oacute;rico con la <strong>Red Nacional de Salud</strong> para brindar cobertura m&eacute;dica de alta calidad a todos nuestros socios.</p><ul><li>Descuentos en consultas de especialidad.</li><li>Cobertura en hospitalizaci&oacute;n programada.</li><li>Acceso a farmacias con precios preferenciales.</li></ul><p>Este beneficio ya est&aacute; disponible presentando tu carnet de socio en los centros autorizados a nivel nacional.</p>',
                'imagen_path' => null,
                'color_accent' => 'emerald',
            ]
        ];

        foreach ($news as $item) {
            Noticia::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
