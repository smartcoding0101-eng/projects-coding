import { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        title: "Tu Seguridad Financiera es Nuestra Misión",
        description: "Únete a la cooperativa de la familia policial. Ofrecemos soluciones con solidez, respaldo y confianza.",
        cta: "Únete Hoy",
        image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 2,
        title: "Cuentas de Ahorro con Altos Rendimientos",
        description: "Haz crecer tus ahorros y asegura el futuro de tu familia con tasas preferenciales y seguridad garantizada.",
        cta: "Abre tu Cuenta",
        image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    {
        id: 3,
        title: "Créditos Inmediatos para la Familia Policial",
        description: "Aprobación rápida, mínimos requisitos y las mejores tasas del mercado para consolidar deudas o emergencias.",
        cta: "Solicitar Crédito",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[600px] flex items-center justify-center bg-zinc-900 overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear origin-center"
                        style={{ 
                            backgroundImage: `url(${slide.image})`,
                            transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
            ))}

            <div className="relative z-20 text-center max-w-4xl px-4 text-white">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-display drop-shadow-lg transition-all duration-700 translate-y-0 opacity-100">
                    {slides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto drop-shadow-md text-gray-200">
                    {slides[currentSlide].description}
                </p>
                <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    {slides[currentSlide].cta}
                </button>
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === currentSlide ? "bg-secondary scale-125 w-6" : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
