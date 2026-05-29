import BlurText from './BlurText';

export default function GallerySection({ cmsGallery = null }) {
    // ─── Configuración de Títulos ───
    const title = cmsGallery?.title || "Transparencia y Acción";
    const subtitle = cmsGallery?.subtitle || "Nuestra Familia en Imágenes";
    const description = "Resultados tangibles, infraestructura moderna y los momentos que definen nuestra vocación de servicio.";

    /**
     * ─── Dimensiones Recomendadas (Nano Banana Optimization) ───
     * Para una nitidez cristalina y carga ultrarrápida:
     * - Imagen Destacada (Main): 1200x1200px (1:1) o 1200x800px (3:2)
     * - Imágenes Secundarias: 600x600px (1:1)
     * Formato ideal: WebP o AVIF (Calidad 75-80%)
     */

    // ─── Imágenes de la Galería (Re-ajustadas a 4 items) ───
    const defaultItems = [
        {
            caption: "Nuestra Identidad y Valores",
            image: "/storage/pages/galleries/gallery-3.jpg", // Promoted to featured
            className: "md:col-span-2 md:row-span-2"
        },
        {
            caption: "Compromiso con la Comunidad",
            image: "/storage/pages/galleries/gallery-2.jpg",
            className: "md:col-span-1 md:row-span-1"
        },
        {
            caption: "Atención y Vocación",
            image: "/storage/pages/galleries/gallery-4.jpg",
            className: "md:col-span-1 md:row-span-2"
        },
        {
            caption: "Familia y Unidad",
            image: "/storage/pages/galleries/gallery-5.jpg",
            className: "md:col-span-1 md:row-span-1"
        }
    ];

    // Clases CSS dinámicas para el diseño Masonry (4 items)
    const gridClasses = [
        "md:col-span-2 md:row-span-2", // Destacada
        "md:col-span-1 md:row-span-1",
        "md:col-span-1 md:row-span-2",
        "md:col-span-1 md:row-span-1"
    ];

    const items = (cmsGallery?.items && cmsGallery.items.length > 0)
        ? cmsGallery.items.map((item, index) => ({
            caption: item.caption || "Imagen",
            image: item.image ? (item.image.startsWith('http') ? item.image : `/storage/${item.image}`) : null,
            className: gridClasses[index % gridClasses.length]
        }))
        : defaultItems;

    return (
        <section className="py-16 bg-surface border-y border-zinc-100" id="galeria">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-black tracking-[0.3em] text-primary uppercase mb-4">{title}</h2>
                    <BlurText
                        as="h3"
                        text={subtitle}
                        className="font-display text-5xl font-black text-on-surface tracking-tight"
                    />
                    <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
                    <p className="mt-8 text-zinc-500 max-w-2xl mx-auto text-xl leading-relaxed">{description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
                    {items.slice(0, 4).map((item, index) => (
                        <div
                            key={index}
                            className={`${item.className} rounded-[2.5rem] overflow-hidden relative group shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-white`}
                        >
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.caption}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">Sin imagen</div>
                            )}

                            {/* Overlay de mayor contraste */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                                <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500">Galería FAPCLAS</span>
                                <h4 className="text-white font-display font-black text-2xl md:text-3xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-75">
                                    {item.caption}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

