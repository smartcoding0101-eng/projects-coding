import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const slides = [
    {
        id: 1,
        title: "Trabajas por todos.",
        subtitle: "Nosotros trabajamos por ti.",
        description: "Créditos, ahorro y servicios exclusivos para la familia policial. Sin burocracia, sin filas.",
        cta: "Conoce tus beneficios",
        ctaLink: "#servicios",
        image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 2,
        title: "Tu esfuerzo",
        subtitle: "merece crecer.",
        description: "Cuentas de ahorro con 5% de rentabilidad anual. Seguridad garantizada para tu familia.",
        cta: "Abre tu cuenta hoy",
        ctaLink: "#ahorro",
        image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 3,
        title: "¿Necesitas un préstamo?",
        subtitle: "Lo tienes.",
        description: "Aprobación rápida, tasas justas y descuento directo por planilla. Sin estrés.",
        cta: "Simula tu crédito",
        ctaLink: "#creditos",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setIsAnimating(false);
            }, 400);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsAnimating(false);
        }, 400);
    };

    return (
        <section className="relative h-[700px] flex items-center justify-center bg-zinc-900 overflow-hidden">
            {/* Background Images */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-linear origin-center"
                        style={{ 
                            backgroundImage: `url(${slide.image})`,
                            transform: index === currentSlide ? 'scale(1.08)' : 'scale(1)'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            ))}

            {/* Content */}
            <div className={`relative z-20 text-center max-w-5xl px-6 text-white transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">Cooperativa FAPCLAS R.L.</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2 font-display leading-[0.9] drop-shadow-xl">
                    {slides[currentSlide].title}
                </h1>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 font-display leading-[0.9] text-secondary drop-shadow-xl">
                    {slides[currentSlide].subtitle}
                </h1>
                <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-white/90 font-medium drop-shadow-md">
                    {slides[currentSlide].description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a 
                        href={slides[currentSlide].ctaLink}
                        className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 flex items-center gap-3"
                    >
                        {slides[currentSlide].cta}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                    <Link 
                        href="/login"
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-white/20 flex items-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Acceso al Portal
                    </Link>
                </div>
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            index === currentSlide ? "bg-secondary w-12" : "bg-white/30 hover:bg-white/60 w-6"
                        }`}
                        aria-label={`Ir al slide ${index + 1}`}
                    />
                ))}
            </div>

        </section>
    );
}
