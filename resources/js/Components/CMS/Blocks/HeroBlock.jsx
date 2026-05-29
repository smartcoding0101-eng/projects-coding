import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import BlurText from '../../BlurText';
import { motion } from 'framer-motion';

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
    const isVideo = (url) => url && (url.endsWith('.mp4') || url.endsWith('.webm'));

    return (
        <section className="relative h-[380px] sm:h-[500px] md:h-[650px] lg:h-[750px] flex items-center justify-center bg-zinc-900 overflow-hidden">
            {/* Background Images */}
            {displaySlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {slide.image ? (
                        isVideo(slide.image) ? (
                            <video
                                src={getImageUrl(slide.image)}
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
                                    backgroundImage: `url(${getImageUrl(slide.image)})`,
                                    transform: index === currentSlide ? 'scale(1.08)' : 'scale(1)'
                                }}
                            ></div>
                        )
                    ) : (
                        <div className="absolute inset-0 bg-zinc-800"></div>
                    )}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            ))}

            {/* Content */}
            <div className={`relative z-20 text-left w-full max-w-5xl px-4 sm:px-6 -mt-5 text-white transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 sm:px-5 sm:py-2 mb-3 sm:mb-8 self-start text-left">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-white/90">Cooperativa FAPCLAS R.L.</span>
                </div>

                <BlurText
                    as="h1"
                    text={current.title}
                    delay={0.12}
                    animateBy="words"
                    direction="top"
                    align="left"
                    className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-0.5 sm:mb-2 font-display leading-tight"
                />

                {current.subtitle && (
                    <BlurText
                        as="h2"
                        text={current.subtitle}
                        delay={0.15}
                        animateBy="words"
                        direction="top"
                        align="left"
                        className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-2 sm:mb-6 font-display leading-tight text-secondary"
                    />
                )}

                {current.description && (
                    <BlurText
                        as="p"
                        text={current.description}
                        delay={0.04}
                        animateBy="words"
                        direction="top"
                        align="left"
                        className="text-[10px] sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-12 max-w-2xl text-left text-white/90 font-medium"
                    />
                )}
                <div className="flex flex-row items-center justify-start gap-2 sm:gap-4 w-full sm:w-auto">
                    {current.cta_text && (
                        <motion.a
                            href={current.cta_link || '#'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary text-white px-3.5 py-2 sm:px-8 sm:py-4.5 lg:px-10 lg:py-5 rounded-xl sm:rounded-2xl font-bold sm:font-black text-[10px] sm:text-lg transition-colors hover:bg-primary-dark shadow-2xl shadow-primary/30 hover:shadow-primary/50 flex items-center justify-center gap-1.5 sm:gap-3 relative overflow-hidden group flex-1 sm:flex-initial"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl"></span>
                            <span className="relative z-10">{current.cta_text}</span>
                            <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </motion.a>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial">
                        <Link
                            href="/login"
                            prefetch
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 sm:px-8 sm:py-4.5 lg:px-10 lg:py-5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-lg transition-colors hover:bg-white/20 flex items-center justify-center gap-1.5 sm:gap-3 relative overflow-hidden group w-full"
                        >
                            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl"></span>
                            <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                            <span className="relative z-10">Portal Socio</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Slide Indicators */}
            {displaySlides.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                    {displaySlides.map((_, index) => (
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
};

export default HeroBlock;
