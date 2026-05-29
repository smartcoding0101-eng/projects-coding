<?php

namespace Database\Seeders;

use App\Models\Servicio;
use Illuminate\Database\Seeder;

class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        $servicios = [
            [
                'nombre' => 'Préstamo Policial',
                'slug' => 'prestamo-policial',
                'descripcion' => 'Tu respaldo financiero inmediato con las tasas más bajas del mercado cooperativo.',
                'imagen' => '/images/servicios/prestamo.png',
                'icono' => 'Banknote',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
                'secciones' => [
                    [
                        'titulo' => 'Aprobación en Tiempo Récord',
                        'contenido' => 'Entendemos las urgencias de la familia policial. Por eso, hemos optimizado nuestros procesos para que tu crédito sea aprobado en menos de 24 horas.',
                        'items' => ['Sin garantes externos', 'Descuento planilla', 'Trámite 100% digital', 'Tasa social'],
                    ],
                    [
                        'titulo' => 'Tasas que Cuidan tu Futuro',
                        'contenido' => 'A diferencia de la banca tradicional, nuestras tasas están diseñadas para el beneficio del socio, permitiéndote crecer sin asfixiar tu economía.',
                        'items' => ['Interés sobre saldo', 'Seguro de desgravamen', 'Sin comisiones ocultas'],
                    ],
                ],
            ],
            [
                'nombre' => 'Tienda Virtual',
                'slug' => 'tienda-virtual',
                'descripcion' => 'Equipamiento, tecnología y hogar a un clic de distancia.',
                'imagen' => '/images/servicios/tienda.png',
                'icono' => 'ShoppingBag',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 2,
                'secciones' => [
                    [
                        'titulo' => 'Compra Hoy, Paga Después',
                        'contenido' => 'Accede a miles de productos con la facilidad del descuento por planilla. Sin aprobaciones lentas ni papeleo innecesario.',
                        'items' => ['Crédito inmediato', 'Cuotas flexibles', 'Precios de convenio'],
                    ],
                    [
                        'titulo' => 'Calidad Garantizada',
                        'contenido' => 'Trabajamos con las mejores marcas nacionales e internacionales para asegurar que cada compra sea una inversión duradera.',
                        'items' => ['Garantía de fábrica', 'Envío a unidades policiales', 'Soporte técnico'],
                    ],
                ],
            ],
            [
                'nombre' => 'Lavado de Ropa',
                'slug' => 'lavanderia',
                'descripcion' => 'Servicio profesional de limpieza ejecutiva para tu uniforme e indumentaria civil.',
                'imagen' => '/images/servicios/lavanderia.png',
                'icono' => 'Sparkles',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3,
                'secciones' => [
                    [
                        'titulo' => 'Pulcritud Institucional',
                        'contenido' => 'Tu uniforme es tu identidad. Utilizamos tecnología de lavado industrial que protege las fibras y mantiene los colores originales por más tiempo.',
                        'items' => ['Lavado en seco profesional', 'Planchado de alta definición', 'Tratamiento de manchas'],
                    ],
                    [
                        'titulo' => 'Rapidez y Comodidad',
                        'contenido' => 'Sabemos que tu tiempo es valioso. Ofrecemos tiempos de entrega preferenciales para que nunca te falte tu indumentaria operativa.',
                        'items' => ['Entrega en 24h disponible', 'Recojo en unidad (Bajo pedido)', 'Precios sociales para el socio'],
                    ],
                ],
            ],
            [
                'nombre' => 'Bordados Digitalizados',
                'slug' => 'bordados',
                'descripcion' => 'Precisión milimétrica en cada hilo para resaltar tu grado y distinción.',
                'imagen' => '/images/servicios/bordados.png',
                'icono' => 'Paintbrush',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 4,
                'secciones' => [
                    [
                        'titulo' => 'Tecnología de Punta',
                        'contenido' => 'Contamos con máquinas de bordado digital de última generación que garantizan una densidad de puntada perfecta y durabilidad extrema.',
                        'items' => ['Grados y nombres', 'Escudos institucionales', 'Parches personalizados', 'Hilos de alta resistencia'],
                    ],
                    [
                        'titulo' => 'Distinción en cada Detalle',
                        'contenido' => 'Nuestros diseños cumplen estrictamente con el reglamento de uniformes, asegurando que tu presentación sea siempre impecable.',
                        'items' => ['Diseño digitalizado propio', 'Acabados premium', 'Entrega inmediata'],
                    ],
                ],
            ],
            [
                'nombre' => 'Salón de Belleza',
                'slug' => 'salon-belleza',
                'descripcion' => 'Tu espacio de cuidado personal y bienestar familiar con atención de primer nivel.',
                'imagen' => '/images/servicios/salon.png',
                'icono' => 'Smile',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 5,
                'secciones' => [
                    [
                        'titulo' => 'Estilo que Inspira',
                        'contenido' => 'Desde cortes clásicos hasta tratamientos modernos, nuestros profesionales están capacitados para brindar el mejor servicio a damas y caballeros.',
                        'items' => ['Corte de cabello masculino/femenino', 'Tratamientos capilares', 'Peinados y tintes'],
                    ],
                    [
                        'titulo' => 'Bienestar para la Familia',
                        'contenido' => 'FAPCLAS R.L. se preocupa por tu familia. Los precios sociales se extienden a tus seres queridos para que todos luzcan bien.',
                        'items' => ['Atención preferencial', 'Ambiente relajante', 'Insumos de alta calidad'],
                    ],
                ],
            ],
            [
                'nombre' => 'Librería Celeste',
                'slug' => 'libreria',
                'descripcion' => 'Todo el soporte académico y de oficina en un solo lugar.',
                'imagen' => '/images/servicios/libreria.png',
                'icono' => 'BookOpen',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 6,
                'secciones' => [
                    [
                        'titulo' => 'Aliado en tu Formación',
                        'contenido' => 'Accede a textos universitarios, leyes y reglamentos esenciales para tu carrera policial y el estudio de tus hijos.',
                        'items' => ['Libros especializados', 'Material escolar completo', 'Papelería de oficina'],
                    ],
                    [
                        'titulo' => 'Servicios Complementarios',
                        'contenido' => 'No solo vendemos papel; ofrecemos soluciones para tus trámites y presentaciones diarias.',
                        'items' => ['Fotocopias e impresiones', 'Anillados y empastados', 'Descuentos por mayor'],
                    ],
                ],
            ],
            [
                'nombre' => 'Conductor Asignado',
                'slug' => 'conductor',
                'descripcion' => 'Seguridad y tranquilidad en tus desplazamientos, en cualquier momento.',
                'imagen' => '/images/servicios/conductor.png',
                'icono' => 'Car',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 7,
                'secciones' => [
                    [
                        'titulo' => 'Confianza en el Camino',
                        'contenido' => 'Nuestros conductores asignados son profesionales verificados, garantizando un traslado seguro para ti y tu vehículo.',
                        'items' => ['Disponible 24/7', 'Choferes capacitados', 'Monitoreo GPS constante'],
                    ],
                    [
                        'titulo' => 'Servicio Institucional',
                        'contenido' => 'Ideal para eventos, traslados urbanos o cuando simplemente necesitas un conductor de confianza que entienda tu labor.',
                        'items' => ['Tarifas fijas y justas', 'Solicitud rápida inalámbrica', 'Seguro de viaje'],
                    ],
                ],
            ],
        ];

        foreach ($servicios as $data) {
            Servicio::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
