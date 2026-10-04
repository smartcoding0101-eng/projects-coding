import React, { useState } from 'react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Search, Filter, ShoppingBag, ArrowRight, EyeOff, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Store({ productos, categorias, filtros, auth, settings }) {
    const { addToCart, cartCount } = useCart();
    const isSocio = auth?.user?.roles?.includes('Socio');

    const mostrarPreciosPublico = settings?.ecommerce_mostrar_precios === 'si' || settings?.ecommerce_mostrar_precios === 'true' || settings?.ecommerce_mostrar_precios === true;
    const isAdmin = auth?.user?.roles?.includes('SuperAdmin') || auth?.user?.roles?.includes('Oficial Crédito') || auth?.user?.roles?.includes('Cajero');
    const puedeVerPrecios = mostrarPreciosPublico || auth?.user !== null;

    const getFirstImage = (imgPath) => {
        if (!imgPath) return null;
        let path = imgPath;
        if (typeof imgPath === 'string') {
            try {
                const parsed = JSON.parse(imgPath);
                if (Array.isArray(parsed)) path = parsed[0];
            } catch(e) {}
        } else if (Array.isArray(imgPath)) {
            path = imgPath.length > 0 ? imgPath[0] : null;
        }
        if (!path || typeof path !== 'string') return null;
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    const getPrecioReal = (producto) => {
        if (!puedeVerPrecios) return null;

        if (isSocio) {
            if (producto.precio_asociado > 0) return producto.precio_asociado;
            const descGlobal = parseFloat(settings?.ecommerce_descuento_socios_global || 0);
            if (descGlobal > 0) return (producto.precio_general * (1 - descGlobal / 100)).toFixed(2);
            return producto.precio_general;
        }
        return producto.precio_general;
    };

    const [searchQuery, setSearchQuery] = useState(filtros?.q || '');
    const [minPrice, setMinPrice] = useState(filtros?.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filtros?.max_price || '');

    const applyFilters = (categoriaSlug = filtros?.categoria) => {
        const queryParams = {};
        if (categoriaSlug) queryParams.categoria = categoriaSlug;
        if (searchQuery) queryParams.q = searchQuery;
        if (minPrice) queryParams.min_price = minPrice;
        if (maxPrice) queryParams.max_price = maxPrice;

        router.get(route('beneficios.index'), queryParams, { preserveState: true });
    };



    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    // --- LÓGICA DEL CARRUSEL HERO (DESLIZADOR CLÁSICO) ---
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideDirection, setSlideDirection] = useState(1); // 1 = forward

    const slides = React.useMemo(() => {
        const slidesString = settings?.ecommerce_hero_slides || '[]';
        try {
            const parsed = JSON.parse(slidesString);
            if (parsed.length > 0) return parsed;
        } catch (e) { /* fallback below */ }

        // 3 imágenes de demostración 4K de alto impacto (productos/promociones)
        return [
            {
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
                title: 'Ofertas Exclusivas',
                subtitle: 'TEMPORADA 2026',
                description: 'Descuentos de hasta el 40% en equipamiento táctico, ropa y accesorios para la familia policial.',
                button_text: 'Ver Ofertas',
                button_link: '#catalogo'
            },
            {
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
                title: 'Compra a Crédito',
                subtitle: 'SIN INTERESES',
                description: 'Descuento directo por planilla. Solo para socios activos de FAPCLAS R.L.',
                button_text: 'Comprar Ahora',
                button_link: '#catalogo'
            },
            {
                image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
                title: 'Víveres y Más',
                subtitle: 'PRECIOS DE MAYORISTA',
                description: 'Canasta básica, víveres y productos de primera necesidad con precios por debajo del mercado.',
                button_text: 'Explorar Catálogo',
                button_link: '#catalogo'
            }
        ];
    }, [settings?.ecommerce_hero_slides]);

    // Auto-play: deslizar cada 5 segundos (más tiempo para apreciar el contenido)
    React.useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Helper para resolver la URL de imagen con fallback premium local si no está definida en la base de datos
    const getImageSrc = (image, index = 0) => {
        if (!image) {
            const fallbacks = [
                "/images/servicios/tienda.png",     // Salud / Farmacia / Bienestar (Local)
                "/images/servicios/bordados.png",   // Ropa / Colección (Local)
                "/images/servicios/tienda.png",     // Bebidas / Promociones (Local)
                "/images/servicios/libreria.png"    // Libros / Conocimiento (Local)
            ];
            return fallbacks[index % fallbacks.length];
        }
        if (image.startsWith('http')) return image;
        if (image.startsWith('/storage/')) return image;
        return `/storage/${image}`;
    };

    return (
        <StoreLayout>
            <Head title="Beneficios y Tienda FAPCLAS" />

            {/* HERO: CARRUSEL CROSSFADE (sin gaps visuales) */}
            <div className="relative min-h-[520px] h-[580px] sm:h-[600px] lg:h-[680px] 2xl:h-[800px] overflow-hidden bg-[var(--sh-bg)] border-b border-[var(--fil-border)]">
                {/* Enlaces de Navegación Superior Derecha */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-12 z-40 flex items-center gap-3 sm:gap-6 font-bold text-xs sm:text-sm text-gray-300">
                    <Link href={route('welcome')} className="hover:text-white transition-colors">Inicio</Link>
                    <Link href={route('register')} className="hover:text-white transition-colors border-b border-transparent hover:border-white">Regístrate</Link>
                    <Link href={route('login')} className="hover:text-white transition-colors bg-card-fap/10 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/20 hover:bg-card-fap/20">Sistema</Link>
                </div>

                {/* Todas las imágenes montadas simultáneamente — Crossfade puro con CSS */}
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                            opacity: index === currentSlide ? 1 : 0,
                            zIndex: index === currentSlide ? 2 : 1
                        }}
                    >
                        <img
                            src={getImageSrc(slide.image, index)}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Degradado sutil para legibilidad del texto */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-fapclas-950/70 via-transparent to-transparent"></div>
                    </div>
                ))}

                {/* Contenido del Slide — Transición suave con CSS */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="max-w-xl absolute transition-all duration-700 ease-in-out"
                            style={{
                                opacity: index === currentSlide ? 1 : 0,
                                transform: index === currentSlide ? 'translateY(0)' : 'translateY(25px)',
                                pointerEvents: index === currentSlide ? 'auto' : 'none'
                            }}
                        >
                            <span className="inline-block py-1.5 px-4 rounded-full bg-[var(--sh-badge-bg)] text-[var(--sh-badge-text)] text-[10px] font-black tracking-widest mb-5 uppercase shadow-lg backdrop-blur-sm">
                                {slide.subtitle || 'BENEFICIOS EXCLUSIVOS'}
                            </span>
                            <h1
                                className="text-2xl sm:text-4xl md:text-5xl lg:text-[length:var(--sh-size-title)] 2xl:text-6xl font-[var(--sh-weight)] text-white text-[var(--sh-color-title)] tracking-tighter leading-tight mb-3 sm:mb-5 drop-shadow-2xl"
                                style={{ fontFamily: 'var(--sh-font)', textAlign: 'var(--sh-align)', color: 'var(--sh-color-title, #ffffff)' }}
                            >
                                {slide.title}
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-[var(--sh-color-sub)] mb-5 sm:mb-8 font-medium leading-relaxed drop-shadow-md max-w-md" style={{ textAlign: 'var(--sh-align)' }}>
                                {slide.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {slide.button_text && (
                                    <a href={slide.button_link || '#catalogo'} className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-[length:var(--pc-btn-font-size)] font-[var(--pc-btn-font-weight)] rounded-2xl text-[var(--pc-btn-text)] bg-[var(--pc-btn-bg)] hover:bg-[var(--pc-btn-hover)] transition-all shadow-2xl uppercase tracking-widest group text-xs sm:text-sm">
                                        {slide.button_text}
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-white/30 text-xs sm:text-sm font-bold rounded-2xl text-white hover:bg-card-fap/10 transition-all backdrop-blur-sm bg-card-fap/5">
                                        Mi Portal Socio
                                    </Link>
                                ) : (
                                    <Link href="/login" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-white/30 text-xs sm:text-sm font-bold rounded-2xl text-white hover:bg-card-fap/10 transition-all backdrop-blur-sm bg-card-fap/5">
                                        Iniciar Sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Indicadores de Slide (Paginación) */}
                {slides.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className={`rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 h-2.5 bg-[var(--sh-badge-bg)] shadow-lg shadow-[var(--sh-badge-bg)]/40' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
                                aria-label={`Ir a slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="catalogo">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filtros / Sidebar */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-[var(--pc-bg)] rounded-[var(--pc-radius)] shadow-sm border border-[var(--fil-border)] p-6 sticky top-6 space-y-8">

                            {/* Búsqueda */}
                            <div>
                                <h3 className="text-sm font-bold text-brand-main mb-3 uppercase tracking-wider">Buscar Producto</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Táctico, café, libros..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleSearchKeyPress}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-[var(--fil-border)] bg-[var(--fil-inactive-bg)] text-[var(--fil-inactive-text)] focus:border-[var(--fil-active-bg)] focus:ring-[var(--fil-active-bg)] text-[length:var(--fil-size)]"
                                    />
                                    <Search className="w-4 h-4 text-[var(--fil-inactive-text)] absolute left-3.5 top-3" />
                                </div>
                            </div>

                            {/* Filtro de Precios */}
                            <div className="border-t border-brand pt-6">
                                <h3 className="text-sm font-bold text-brand-main mb-3 uppercase tracking-wider">Rango de Precios</h3>
                                <div className="flex items-center space-x-2 mb-4">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border-[var(--fil-border)] bg-[var(--fil-inactive-bg)] text-[var(--fil-inactive-text)] focus:border-[var(--fil-active-bg)] focus:ring-[var(--fil-active-bg)] text-[length:var(--fil-size)] text-center"
                                    />
                                    <span className="text-[var(--fil-inactive-text)] font-bold">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border-[var(--fil-border)] bg-[var(--fil-inactive-bg)] text-[var(--fil-inactive-text)] focus:border-[var(--fil-active-bg)] focus:ring-[var(--fil-active-bg)] text-[length:var(--fil-size)] text-center"
                                    />
                                </div>
                                <button
                                    onClick={() => applyFilters()}
                                    className="w-full py-2 bg-[var(--fil-active-bg)] hover:opacity-90 text-[var(--fil-active-text)] font-[var(--fil-weight-active)] rounded-xl transition-all shadow-sm"
                                >
                                    Aplicar Filtros
                                </button>
                                {(searchQuery || minPrice || maxPrice) && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery(''); setMinPrice(''); setMaxPrice('');
                                            router.get(route('beneficios.index'), { categoria: filtros?.categoria }, { preserveState: true });
                                        }}
                                        className="w-full py-2 mt-2 bg-card-fap/5 border border-brand hover:bg-card-fap/10 text-brand-muted text-xs font-bold rounded-xl transition-all"
                                    >
                                        Limpiar Filtros
                                    </button>
                                )}
                            </div>

                            {/* Categorías */}
                            <div className="border-t border-brand pt-6">
                                <h3 className="text-sm font-bold text-brand-main mb-3 uppercase tracking-wider flex items-center">
                                    <Filter className="w-4 h-4 mr-1.5 text-primary" /> Categorías
                                </h3>
                                <div className="space-y-1.5">
                                    <button
                                        onClick={() => applyFilters('')}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-[length:var(--fil-size)] transition-all duration-300 cursor-pointer ${!filtros?.categoria ? 'bg-[var(--fil-active-bg)] text-[var(--fil-active-text)] font-[var(--fil-weight-active)] shadow-sm' : 'text-[var(--fil-inactive-text)] hover:bg-[var(--fil-inactive-bg)] hover:text-[var(--fil-active-text)]'}`}
                                    >
                                        Todos los Productos
                                    </button>
                                    {categorias.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => applyFilters(cat.slug)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-[length:var(--fil-size)] transition-all duration-300 cursor-pointer ${filtros?.categoria === cat.slug ? 'bg-[var(--fil-active-bg)] text-[var(--fil-active-text)] font-[var(--fil-weight-active)] shadow-sm' : 'text-[var(--fil-inactive-text)] hover:bg-[var(--fil-inactive-bg)] hover:text-[var(--fil-active-text)]'}`}
                                        >
                                            {cat.nombre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Catálogo Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-brand-main">
                                {filtros.categoria ? `Categoría: ${filtros.categoria}` : 'Catálogo Completo'}
                            </h2>
                            {settings?.ecommerce_mostrar_stock === 'si' && (
                                <span className="text-sm text-brand-muted">{productos.total} productos</span>
                            )}
                        </div>

                        {productos.data.length === 0 ? (
                            <div className="bg-card-fap rounded-2xl shadow-sm border border-brand p-12 text-center text-brand-muted">
                                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50 text-brand-muted" />
                                No encontramos productos en esta categoría.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {productos.data.map((producto, index) => {
                                    const precio = getPrecioReal(producto);
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            key={producto.id}
                                            className="bg-[var(--pc-bg)] rounded-[var(--pc-radius)] shadow-sm border border-[var(--pc-border)] overflow-hidden hover:bg-[var(--pc-bg-hover)] hover:-translate-y-1 transition-all duration-300 group"
                                        >
                                            <Link href={route('beneficios.show', producto.id)}>
                                                <div className="aspect-[4/3] bg-main relative overflow-hidden">
                                                    {getFirstImage(producto.imagen_path) ? (
                                                        <img src={getFirstImage(producto.imagen_path)} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-brand-muted opacity-50">
                                                            <ShoppingBag className="w-12 h-12" />
                                                        </div>
                                                    )}
                                                    {isSocio && (producto.precio_asociado > 0 || parseFloat(settings?.ecommerce_descuento_socios_global) > 0) && (
                                                        <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                            PRECIO SOCIO
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="p-4">
                                                <div className="text-[length:var(--pc-size-desc)] text-[var(--pc-color-desc)] mb-1 font-semibold tracking-wide uppercase">
                                                    {producto.categoria?.nombre || 'General'}
                                                </div>
                                                <Link href={route('beneficios.show', producto.id)}>
                                                    <h3 style={{ fontFamily: 'var(--pc-font)', fontWeight: 'var(--pc-weight-name)', fontSize: 'var(--pc-size-name)' }} className="text-[var(--pc-color-name)] mb-2 line-clamp-2 hover:text-[var(--pc-color-price)] transition-colors">
                                                        {producto.nombre}
                                                    </h3>
                                                </Link>

                                                <div className="mt-4 flex items-end justify-between">
                                                    <div>
                                                        {puedeVerPrecios ? (
                                                            precio ? (
                                                                <div className="flex flex-col justify-end h-full">
                                                                    {settings?.ecommerce_mostrar_precio_venta === 'si' && (
                                                                        <div className={`${isSocio && settings?.ecommerce_mostrar_precio_credito === 'si' && producto.precio_general > precio ? 'text-[length:var(--pc-size-desc)] text-[var(--pc-color-desc)] line-through' : 'text-[length:var(--pc-size-price)] font-black text-[var(--pc-color-price)]'}`}>
                                                                            Bs. {producto.precio_general}
                                                                        </div>
                                                                    )}
                                                                    {settings?.ecommerce_mostrar_precio_credito === 'si' && isSocio && (
                                                                        <div className="flex flex-col mt-0.5">
                                                                            <div className="text-[10px] text-[var(--pc-color-credit)] font-bold uppercase tracking-wide leading-none mb-0.5">Precio Socio</div>
                                                                            <div className="text-[length:var(--pc-size-price)] font-black text-[var(--pc-color-credit)] leading-none">
                                                                                Bs. {precio}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : null
                                                        ) : (
                                                            <div className="text-xs font-bold text-brand-muted flex items-center pt-2"><EyeOff className="w-3.5 h-3.5 mr-1" /> Precios no disponibles</div>
                                                        )}
                                                    </div>

                                                    {producto.stock_actual > 0 ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                addToCart({ ...producto, precio_final: precio || producto.precio_general });
                                                            }}
                                                            className="w-10 h-10 rounded-full bg-[var(--pc-btn-bg)] text-[var(--pc-btn-text)] flex items-center justify-center hover:bg-[var(--pc-btn-hover)] transition-all shadow-sm"
                                                            title="Añadir al carrito"
                                                        >
                                                            <ShoppingCart className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Agotado</span>
                                                    )}
                                                </div>

                                                {settings?.ecommerce_mostrar_stock === 'si' && producto.stock_actual > 0 && (
                                                    <div className="mt-2 text-[10px] text-brand-muted">
                                                        Disponibles: {producto.stock_actual} un.
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {productos.last_page > 1 && (
                            <div className="mt-16 mb-8 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    {productos.links.map((link, index) => {
                                        let icon = link.label;
                                        if (link.label.includes('Previous') || link.label.includes('Anterior')) {
                                            icon = <ChevronLeft className="w-5 h-5" />;
                                        } else if (link.label.includes('Next') || link.label.includes('Siguiente')) {
                                            icon = <ChevronRight className="w-5 h-5" />;
                                        }

                                        return link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                preserveScroll
                                                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-[var(--fil-weight-active)] transition-all duration-300 ${
                                                    link.active
                                                        ? 'bg-[var(--fil-active-bg)] text-[var(--fil-active-text)] shadow-lg scale-110 border border-[var(--fil-active-bg)]'
                                                        : 'bg-[var(--pc-bg)] text-[var(--fil-inactive-text)] border border-[var(--fil-border)] hover:border-[var(--fil-active-bg)] hover:text-[var(--fil-active-bg)] hover:-translate-y-1 shadow-sm'
                                                }`}
                                            >
                                                {typeof icon === 'string' ? <span dangerouslySetInnerHTML={{ __html: icon }} /> : icon}
                                            </Link>
                                        ) : (
                                            <span
                                                key={index}
                                                className="w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed"
                                            >
                                                {typeof icon === 'string' ? <span dangerouslySetInnerHTML={{ __html: icon }} /> : icon}
                                            </span>
                                        );
                                    })}
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
