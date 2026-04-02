import React, { useState } from 'react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Search, Filter, ShoppingBag, ArrowRight, EyeOff } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Store({ productos, categorias, filtros, auth, settings }) {
    const { addToCart, cartCount } = useCart();
    const isSocio = auth?.user?.roles?.includes('Socio');

    const getPrecioReal = (producto) => {
        if (settings?.ecommerce_mostrar_precios === 'no' && !auth?.user) return null;
        
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

    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        const removeStart = router.on('start', () => setIsLoading(true));
        const removeFinish = router.on('finish', () => setIsLoading(false));
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

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
        } catch(e) { /* fallback below */ }

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

    // Auto-play: deslizar cada 3 segundos
    React.useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setSlideDirection(1);
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setSlideDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    // Variantes de animación para deslizamiento horizontal
    const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 }),
    };

    return (
        <StoreLayout>
            <Head title="Beneficios y Tienda FAPCLAS" />

            {/* HERO: CARRUSEL DESLIZADOR CLÁSICO */}
            <div className="relative h-[500px] lg:h-[650px] overflow-hidden bg-fapclas-950 border-b border-brand">
                {/* Enlaces de Navegación Superior Derecha */}
                <div className="absolute top-6 right-6 lg:right-12 z-40 flex items-center gap-6 font-bold text-sm text-gray-300">
                    <Link href={route('welcome')} className="hover:text-white transition-colors">Inicio</Link>
                    <Link href={route('register')} className="hover:text-white transition-colors border-b border-transparent hover:border-white">Regístrate</Link>
                    <Link href={route('login')} className="hover:text-white transition-colors bg-card-fap/10 px-5 py-2 rounded-full border border-white/20 hover:bg-card-fap/20">Sistema</Link>
                </div>

                {/* Imagen de fondo — deslizamiento horizontal */}
                <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                    <motion.div
                        key={currentSlide}
                        custom={slideDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].title}
                            className="w-full h-full object-cover"
                        />
                        {/* Degradado sutil para legibilidad del texto */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-fapclas-950/70 via-transparent to-transparent"></div>
                    </motion.div>
                </AnimatePresence>

                {/* Contenido del Slide */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-xl"
                        >
                            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/90 text-white text-[10px] font-black tracking-widest mb-5 border border-white/20 uppercase shadow-lg backdrop-blur-sm">
                                {slides[currentSlide].subtitle || 'BENEFICIOS EXCLUSIVOS'}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-5 drop-shadow-2xl">
                                {slides[currentSlide].title}
                            </h1>
                            <p className="text-lg text-gray-100 mb-8 font-medium leading-relaxed drop-shadow-md max-w-md">
                                {slides[currentSlide].description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href={slides[currentSlide].button_link} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-sm font-black rounded-2xl text-white bg-primary hover:bg-card-fap hover:text-primary transition-all shadow-2xl uppercase tracking-widest group">
                                    {slides[currentSlide].button_text}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </a>
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-sm font-bold rounded-2xl text-white hover:bg-card-fap/10 transition-all backdrop-blur-sm bg-card-fap/5">
                                        Mi Portal Socio
                                    </Link>
                                ) : (
                                    <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-sm font-bold rounded-2xl text-white hover:bg-card-fap/10 transition-all backdrop-blur-sm bg-card-fap/5">
                                        Iniciar Sesión
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Indicadores de Slide (Paginación) */}
                {slides.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className={`rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 h-2.5 bg-primary shadow-lg shadow-primary/40' : 'w-2.5 h-2.5 bg-card-fap/40 hover:bg-card-fap/70'}`}
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
                        <div className="bg-card-fap rounded-2xl shadow-sm border border-brand p-6 sticky top-6 space-y-8">
                            
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
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-brand bg-main text-brand-main focus:border-primary focus:ring-primary text-sm" 
                                    />
                                    <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
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
                                        className="w-full px-3 py-2 rounded-lg border-brand bg-main text-brand-main focus:border-primary focus:ring-primary text-sm text-center" 
                                    />
                                    <span className="text-brand-muted font-bold">-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border-brand bg-main text-brand-main focus:border-primary focus:ring-primary text-sm text-center" 
                                    />
                                </div>
                                <button 
                                    onClick={() => applyFilters()}
                                    className="w-full py-2 bg-primary hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
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
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-pointer ${!filtros?.categoria ? 'bg-primary text-white font-bold shadow-sm' : 'text-brand-muted hover:bg-primary/10 hover:text-primary hover:translate-x-1'}`}
                                    >
                                        Todos los Productos
                                    </button>
                                    {categorias.map(cat => (
                                        <button 
                                            key={cat.id} 
                                            onClick={() => applyFilters(cat.slug)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-pointer ${filtros?.categoria === cat.slug ? 'bg-primary text-white font-bold shadow-sm' : 'text-brand-muted hover:bg-primary/10 hover:text-primary hover:translate-x-1'}`}
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

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-card-fap rounded-2xl border border-brand p-4 animate-pulse">
                                        <div className="aspect-[4/3] bg-card-fap/5 rounded-xl mb-4"></div>
                                        <div className="h-4 bg-card-fap/5 rounded w-1/3 mb-2"></div>
                                        <div className="h-5 bg-card-fap/5 rounded w-3/4 mb-4"></div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="h-6 bg-card-fap/5 rounded w-1/2"></div>
                                            <div className="h-10 w-10 bg-card-fap/5 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : productos.data.length === 0 ? (
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
                                            className="bg-card-fap rounded-2xl shadow-sm border border-brand overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                        >
                                            <Link href={route('beneficios.show', producto.id)}>
                                                <div className="aspect-[4/3] bg-main relative overflow-hidden">
                                                    {producto.imagen_path ? (
                                                        <img src={`/storage/${producto.imagen_path}`} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                                                <div className="text-xs text-brand-muted mb-1 font-semibold tracking-wide uppercase">
                                                    {producto.categoria?.nombre || 'General'}
                                                </div>
                                                <Link href={route('beneficios.show', producto.id)}>
                                                    <h3 className="font-bold text-brand-main text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                                                        {producto.nombre}
                                                    </h3>
                                                </Link>
                                                
                                                <div className="mt-4 flex items-end justify-between">
                                                    <div>
                                                        {precio ? (
                                                            <>
                                                                <div className="text-lg font-black text-brand-main">
                                                                    Bs. {precio}
                                                                </div>
                                                                {isSocio && producto.precio_general > precio && (
                                                                    <div className="text-xs text-brand-muted line-through">Bs. {producto.precio_general}</div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="text-xs font-bold text-brand-muted flex items-center"><EyeOff className="w-3 h-3 mr-1"/> Login para ver precio</div>
                                                        )}
                                                    </div>
                                                    
                                                    {producto.stock_actual > 0 ? (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                addToCart({ ...producto, precio_final: precio || producto.precio_general });
                                                            }}
                                                            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
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
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
