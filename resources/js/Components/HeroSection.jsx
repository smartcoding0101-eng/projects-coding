import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import BlurText from './BlurText';

// ─── Slides de FALLBACK (se usan SOLO si Filament no tiene slides configurados) ───
const defaultSlides = [
    {
        id: 1,
        title: "Trabajas por todos.",
        subtitle: "Nosotros trabajamos por ti.",
        description: "Créditos, ahorro y servicios exclusivos para la familia policial. Sin burocracia, sin filas.",
        cta_text: "Conoce tus beneficios",
        cta_link: "#servicios",
        image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 2,
        title: "Tu esfuerzo",
        subtitle: "merece crecer.",
        description: "Cuentas de ahorro con 5% de rentabilidad anual. Seguridad garantizada para tu familia.",
        cta_text: "Abre tu cuenta hoy",
        cta_link: "#ahorro",
        image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 3,
        title: "¿Necesitas un préstamo?",
        subtitle: "Lo tienes.",
        description: "Aprobación rápida, tasas justas y descuento directo por planilla. Sin estrés.",
        cta_text: "Simula tu crédito",
        cta_link: "#creditos",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
];

/**
 * HeroSection — Componente Híbrido CMS/Estático con BlurText Animation
 * 
 * @param {Array} cmsSlides - Slides provenientes de Filament/CMS (prioridad)
 *   Si cmsSlides tiene contenido, se usan esos.
 *   Si cmsSlides está vacío o no existe, se usan los defaultSlides.
 */
export default function HeroSection({ cmsSlides = [] }) {
    // ─── Determinar qué slides usar: CMS tiene PRIORIDAD ───
    const slides = (cmsSlides && cmsSlides.length > 0)
        ? cmsSlides.map((slide, i) => ({
            id: i + 1,
            title: slide.title || '',
            subtitle: slide.subtitle || '',
            description: slide.description || '',
            cta_text: slide.cta_text || '',
            cta_link: slide.cta_link || '#',
            image: slide.image ? (slide.image.startsWith('http') ? slide.image : `/storage/${slide.image}`) : null,
        }))
        : defaultSlides;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showContent, setShowContent] = useState(true);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setIsAnimating(true);
            setShowContent(false);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setIsAnimating(false);
                // Small delay before showing new content to let BlurText re-mount
                setTimeout(() => setShowContent(true), 50);
            }, 400);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        setIsAnimating(true);
        setShowContent(false);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsAnimating(false);
            setTimeout(() => setShowContent(true), 50);
        }, 400);
    };

    const current = slides[currentSlide];

    return (
        <section className="relative h-[380px] sm:h-[500px] md:h-[650px] lg:h-[750px] flex items-center justify-center bg-zinc-900 overflow-hidden">
            {/* Background container — overflow-hidden ONLY here */}
            <div className="absolute inset-0 overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        {slide.image ? (
                            slide.image.endsWith('.mp4') || slide.image.endsWith('.webm') ? (
                                <video
                                    src={slide.image}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="none"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[12000ms] ease-linear origin-center"
                                    style={{ transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)' }}
                                />
                            ) : (
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-linear origin-center"
                                    style={{
                                        backgroundImage: `url(${slide.image})`,
                                        transform: index === currentSlide ? 'scale(1.08)' : 'scale(1)'
                                    }}
                                ></div>
                            )
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"></div>
                        )}
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className={`relative z-20 text-left w-full max-w-5xl px-4 sm:px-6 text-white transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 sm:px-5 sm:py-2 mb-3 sm:mb-8 self-start text-left">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-white/90">Cooperativa FAPCLAS R.L.</span>
                </div>

                {/* ─── Title con BlurText ─── */}
                {showContent && current.title && (
                    <BlurText
                        key={`title-${currentSlide}`}
                        text={current.title}
                        delay={0.12}
                        animateBy="words"
                        direction="top"
                        align="left"
                        className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-0.5 sm:mb-2 font-display leading-tight text-white [text-shadow:_0_10px_20px_rgba(0,0,0,0.4)]"
                    />
                )}

                {/* ─── Subtitle con BlurText (dorado) ─── */}
                {showContent && current.subtitle && (
                    <BlurText
                        key={`subtitle-${currentSlide}`}
                        text={current.subtitle}
                        delay={0.15}
                        animateBy="words"
                        direction="top"
                        align="left"
                        className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-2 sm:mb-6 font-display leading-tight text-secondary [text-shadow:_0_10px_20px_rgba(0,0,0,0.4)]"
                    />
                )}

                {/* ─── Description con BlurText ─── */}
                {showContent && current.description && (
                    <BlurText
                        key={`desc-${currentSlide}`}
                        text={current.description}
                        delay={0.04}
                        animateBy="words"
                        direction="top"
                        align="left"
                        className="text-[10px] sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-12 max-w-2xl text-left text-white/90 font-medium [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]"
                    />
                )}

                <div className="flex flex-row items-center justify-start gap-2 sm:gap-4 w-full sm:w-auto">
                    {current.cta_text && (
                        <a
                            href={current.cta_link || '#'}
                            className="bg-primary hover:bg-primary-dark text-white px-3.5 py-2 sm:px-8 sm:py-4.5 lg:px-10 lg:py-5 rounded-xl sm:rounded-2xl font-bold sm:font-black text-[10px] sm:text-lg transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 flex items-center justify-center gap-1.5 sm:gap-3 flex-1 sm:flex-initial"
                        >
                            {current.cta_text}
                            <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    )}
                    <Link
                        href="/login"
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 sm:px-8 sm:py-4.5 lg:px-10 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-lg transition-all hover:bg-white/20 flex items-center justify-center gap-1.5 sm:gap-3 flex-1 sm:flex-initial"
                    >
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Acceso Portal
                    </Link>
                </div>
            </div>

            {/* Slide Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? "bg-secondary w-12" : "bg-white/30 hover:bg-white/60 w-6"
                                }`}
                            aria-label={`Ir al slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

        </section>
    );
}
