<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicioController extends Controller
{
    /**
     * Helper: renderiza una página de servicio inyectando el WhatsApp de soporte.
     */
    private function renderServicio(string $page, array $servicio)
    {
        $whatsapp = Configuracion::getValor('whatsapp_soporte', '59170000000');

        return Inertia::render("Servicios/{$page}", [
            'servicio' => $servicio,
            'whatsappSoporte' => $whatsapp,
        ]);
    }

    public function prestamoPolicial()
    {
        return $this->renderServicio('Prestamo', [
            'nombre' => 'Préstamo Policial',
            'descripcion' => 'Tu respaldo financiero inmediato con las tasas más bajas del mercado cooperativo.',
            'imagen' => '/images/servicios/prestamo.png?v=3',
            'secciones' => [
                [
                    'titulo' => 'Aprobación en Tiempo Récord',
                    'contenido' => 'Entendemos las urgencias de la familia policial. Por eso, hemos optimizado nuestros procesos para que tu crédito sea aprobado en menos de 24 horas.',
                    'items' => ['Sin garantes externos', 'Descuento planilla', 'Trámite 100% digital', 'Tasa social']
                ],
                [
                    'titulo' => 'Tasas que Cuidan tu Futuro',
                    'contenido' => 'A diferencia de la banca tradicional, nuestras tasas están diseñadas para el beneficio del socio, permitiéndote crecer sin asfixiar tu economía.',
                    'items' => ['Interés sobre saldo', 'Seguro de desgravamen', 'Sin comisiones ocultas']
                ]
            ]
        ]);
    }

    public function tiendaVirtual()
    {
        return $this->renderServicio('Tienda', [
            'nombre' => 'Tienda Virtual',
            'descripcion' => 'Equipamiento, tecnología y hogar a un clic de distancia.',
            'imagen' => '/images/servicios/tienda.png?v=3',
            'secciones' => [
                [
                    'titulo' => 'Compra Hoy, Paga Después',
                    'contenido' => 'Accede a miles de productos con la facilidad del descuento por planilla. Sin aprobaciones lentas ni papeleo innecesario.',
                    'items' => ['Crédito inmediato', 'Cuotas flexibles', 'Precios de convenio']
                ],
                [
                    'titulo' => 'Calidad Garantizada',
                    'contenido' => 'Trabajamos con las mejores marcas nacionales e internacionales para asegurar que cada compra sea una inversión duradera.',
                    'items' => ['Garantía de fábrica', 'Envío a unidades policiales', 'Soporte técnico']
                ]
            ]
        ]);
    }

    public function lavanderia()
    {
        return $this->renderServicio('Lavanderia', [
            'nombre' => 'Lavado de Ropa',
            'descripcion' => 'Servicio profesional de limpieza ejecutiva para tu uniforme e indumentaria civil.',
            'imagen' => '/images/servicios/lavanderia.png?v=3',
            'secciones' => [
                [
                    'titulo' => 'Pulcritud Institucional',
                    'contenido' => 'Tu uniforme es tu identidad. Utilizamos tecnología de lavado industrial que protege las fibras y mantiene los colores originales por más tiempo.',
                    'items' => ['Lavado en seco profesional', 'Planchado de alta definición', 'Tratamiento de manchas']
                ],
                [
                    'titulo' => 'Rapidez y Comodidad',
                    'contenido' => 'Sabemos que tu tiempo es valioso. Ofrecemos tiempos de entrega preferenciales para que nunca te falte tu indumentaria operativa.',
                    'items' => ['Entrega en 24h disponible', 'Recojo en unidad (Bajo pedido)', 'Precios sociales para el socio']
                ]
            ]
        ]);
    }

    public function bordados()
    {
        return $this->renderServicio('Bordados', [
            'nombre' => 'Bordados Digitalizados',
            'descripcion' => 'Precisión milimétrica en cada hilo para resaltar tu grado y distinción.',
            'imagen' => '/images/servicios/bordados.png?v=3',
            'secciones' => [
                [
                    'titulo' => 'Tecnología de Punta',
                    'contenido' => 'Contamos con máquinas de bordado digital de última generación que garantizan una densidad de puntada perfecta y durabilidad extrema.',
                    'items' => ['Grados y nombres', 'Escudos institucionales', 'Parches personalizados', 'Hilos de alta resistencia']
                ],
                [
                    'titulo' => 'Distinción en cada Detalle',
                    'contenido' => 'Nuestros diseños cumplen estrictamente con el reglamento de uniformes, asegurando que tu presentación sea siempre impecable.',
                    'items' => ['Diseño digitalizado propio', 'Acabados premium', 'Entrega inmediata']
                ]
            ]
        ]);
    }

    public function salonBelleza()
    {
        return $this->renderServicio('Salon', [
            'nombre' => 'Salón de Belleza',
            'descripcion' => 'Tu espacio de cuidado personal y bienestar familiar con atención de primer nivel.',
            'imagen' => '/images/servicios/salon.png?v=3',
            'secciones' => [
                [
                    'titulo' => 'Estilo que Inspira',
                    'contenido' => 'Desde cortes clásicos hasta tratamientos modernos, nuestros profesionales están capacitados para brindar el mejor servicio a damas y caballeros.',
                    'items' => ['Corte de cabello masculino/femenino', 'Tratamientos capilares', 'Peinados y tintes']
                ],
                [
                    'titulo' => 'Bienestar para la Familia',
                    'contenido' => 'FAPCLAS R.L. se preocupa por tu familia. Los precios sociales se extienden a tus seres queridos para que todos luzcan bien.',
                    'items' => ['Atención preferencial', 'Ambiente relajante', 'Insumos de alta calidad']
                ]
            ]
        ]);
    }

    public function libreria()
    {
        return $this->renderServicio('Libreria', [
            'nombre' => 'Librería Celeste',
            'descripcion' => 'Todo el soporte académico y de oficina en un solo lugar.',
            'imagen' => '/images/servicios/libreria.png?v=3',
            'secciones' => [
                [
                    'titulo' => 'Aliado en tu Formación',
                    'contenido' => 'Accede a textos universitarios, leyes y reglamentos esenciales para tu carrera policial y el estudio de tus hijos.',
                    'items' => ['Libros especializados', 'Material escolar completo', 'Papelería de oficina']
                ],
                [
                    'titulo' => 'Servicios Complementarios',
                    'contenido' => 'No solo vendemos papel; ofrecemos soluciones para tus trámites y presentaciones diarias.',
                    'items' => ['Fotocopias e impresiones', 'Anillados y empastados', 'Descuentos por mayor']
                ]
            ]
        ]);
    }

    public function conductor()
    {
        return $this->renderServicio('Conductor', [
            'nombre' => 'Conductor Asignado',
            'descripcion' => 'Seguridad y tranquilidad en tus desplazamientos, en cualquier momento.',
            'imagen' => '/images/servicios/conductor.png?v=3',
            'secciones' => [
                [
                    'titulo' => 'Confianza en el Camino',
                    'contenido' => 'Nuestros conductores asignados son profesionales verificados, garantizando un traslado seguro para ti y tu vehículo.',
                    'items' => ['Disponible 24/7', 'Choferes capacitados', 'Monitoreo GPS constante']
                ],
                [
                    'titulo' => 'Servicio Institucional',
                    'contenido' => 'Ideal para eventos, traslados urbanos o cuando simplemente necesitas un conductor de confianza que entienda tu labor.',
                    'items' => ['Tarifas fijas y justas', 'Solicitud rápida inalámbrica', 'Seguro de viaje']
                ]
            ]
        ]);
    }
}
