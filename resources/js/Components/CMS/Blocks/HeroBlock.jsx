import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const HeroBlock = ({ data }) => {
    const { slides } = data;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const displaySlides = slides && slides.length > 0 ? slides : [{ title: 'FAPCLAS R.L.', subtitle: 'Tu Futuro Seguro', description: '', cta_text: '', cta_link: '#', image: null }];

    useEffect(() => {
        if (displaySlides.length <= 1) return;
        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
                setIsAnimating(false);
            }, 400);
        }, 6000);
        return () => clearInterval(timer);
    }, [displaySlides.length]);

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsAnimating(false);
        }, 400);
    };

    const current = displaySlides[currentSlide];
    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `/storage/${img}`;
    };

    return (
        <section className="relative h-[700px] flex items-center justify-center bg-zinc-900 overflow-hidden">
            {/* Background Images */}
            {displaySlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    {slide.image ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-linear origin-center"
                            style={{
                                backgroundImage: `url(${getImageUrl(slide.image)})`,
                                transform: index === currentSlide ? 'scale(1.08)' : 'scale(1)'
                            }}
                        ></div>
                    ) : (
                        <div className="absolute inset-0 bg-zinc-800"></div>
                    )}
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
                    {current.title}
                </h1>
                {current.subtitle && (
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 font-display leading-[0.9] text-secondary drop-shadow-xl">
                        {current.subtitle}
                    </h1>
                )}
                {current.description && (
                    <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-white/90 font-medium drop-shadow-md">
                        {current.description}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {current.cta_text && (
                        <a
                            href={current.cta_link || '#'}
                            className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 flex items-center gap-3"
                        >
                            {current.cta_text}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    )}
                    <Link
                        href="/login"
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-white/20 flex items-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Portal del Socio
                    </Link>
                </div>
            </div>

            {/* Slide Indicators */}
            {displaySlides.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                    {displaySlides.map((_, index) => (
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
            )}
        </section>
    );
};

export default HeroBlock;
