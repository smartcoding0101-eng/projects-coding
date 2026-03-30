import { Link } from '@inertiajs/react';

const servicios = [
    {
        id: 1,
        nombre: 'Préstamo Policial',
        descripcion: 'Créditos con tasas preferenciales y aprobación rápida. Tu respaldo financiero.',
        imagen: '/images/servicios/prestamo.png?v=3',
        ruta: '/servicios/prestamo-policial',
        destacado: true,
        icono: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
    },
    {
        id: 2,
        nombre: 'Tienda Virtual',
        descripcion: 'Todo lo que necesitas, con descuento directo por planilla.',
        imagen: '/images/servicios/tienda.png?v=3',
        ruta: '/servicios/tienda-virtual',
        destacado: false,
        icono: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        ),
    },
    {
        id: 3,
        nombre: 'Lavado de Ropa',
        descripcion: 'Uniformes impecables. Servicio profesional para tu día a día.',
        imagen: '/images/servicios/lavanderia.png?v=3',
        ruta: '/servicios/lavanderia',
        destacado: false,
        icono: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        ),
    },
    {
        id: 4,
        nombre: 'Bordados Digitalizados',
        descripcion: 'Identidad visual institucional con precisión y calidad.',
        imagen: '/images/servicios/bordados.png?v=3',
        ruta: '/servicios/bordados',
        destacado: false,
        icono: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
        ),
    },
    {
        id: 5,
        nombre: 'Salón de Belleza',
        descripcion: 'Cuidado personal para ti y tu familia. Precios especiales.',
        imagen: '/images/servicios/salon.png?v=3',
        ruta: '/servicios/salon-belleza',
        destacado: false,
        icono: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
    },
    {
        id: 6,
        nombre: 'Librería Celeste',
        descripcion: 'Material de estudio, lectura y papelería a tu alcance.',
        imagen: '/images/servicios/libreria.png?v=3',
        ruta: '/servicios/libreria',
        destacado: false,
        icono: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        ),
    },
    {
        id: 7,
        nombre: 'Conductor Asignado',
        descripcion: 'Transporte seguro para policías y civiles, cuando lo necesites.',
        imagen: '/images/servicios/conductor.png?v=3',
        ruta: '/servicios/conductor',
        destacado: false,
        icono: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        ),
    },
];

export default function ProductCards() {
    return (
        <section className="py-12 bg-surface relative overflow-hidden" id="servicios">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">
                        Todo en un solo lugar
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-black text-on-surface tracking-tight">
                        Nuestros Servicios
                    </h2>
                    <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">
                        Soluciones pensadas exclusivamente para la familia policial y sus seres queridos.
                    </p>
                </div>
                
                {/* Fila 1: 3 tarjetas */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {servicios.slice(0, 3).map((servicio) => (
                        <ServiceCard key={servicio.id} servicio={servicio} />
                    ))}
                </div>

                {/* Fila 2: 4 tarjetas */}
                <div className="grid md:grid-cols-4 gap-6">
                    {servicios.slice(3, 7).map((servicio) => (
                        <ServiceCard key={servicio.id} servicio={servicio} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ servicio }) {
    const isDestacado = servicio.destacado;
    
    return (
        <Link
            href={servicio.ruta}
            className={`group relative rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 block ${
                isDestacado
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(85,107,47,0.12)]'
            }`}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={servicio.imagen} 
                    alt={servicio.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className={`p-6 ${isDestacado ? 'pt-4' : ''}`}>
                {/* Icon Badge */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center -mt-12 relative z-10 shadow-lg ${
                    isDestacado 
                        ? 'bg-secondary text-primary-dark' 
                        : 'bg-white text-primary border border-gray-100'
                }`}>
                    {servicio.icono}
                </div>

                <h4 className={`font-display text-xl font-black mt-4 mb-2 tracking-tight ${
                    isDestacado ? 'text-white' : 'text-on-surface'
                }`}>
                    {servicio.nombre}
                </h4>
                <p className={`text-sm leading-relaxed mb-4 ${
                    isDestacado ? 'text-white/70' : 'text-gray-500'
                }`}>
                    {servicio.descripcion}
                </p>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-4 ${
                    isDestacado ? 'text-secondary' : 'text-primary'
                }`}>
                    <span>Más información</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>

            {/* Destacado ribbon */}
            {isDestacado && (
                <div className="absolute top-4 right-4 bg-secondary text-primary-dark text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    ★ Principal
                </div>
            )}
        </Link>
    );
}
