import { useState, useEffect } from 'react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-[100] bg-[#20455d] text-white p-3.5 rounded-full shadow-[0_15px_40px_rgba(32,69,93,0.3)] hover:scale-110 transition-all duration-500 group flex items-center justify-center cursor-pointer border-4 border-white hover:bg-primary ${
                isVisible 
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                    : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
            }`}
            aria-label="Subir al inicio"
        >
            {/* SVG Chevron Up Icon with premium micro-animation */}
            <svg 
                className="w-7 h-7 drop-shadow-md transform group-hover:-translate-y-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
        </button>
    );
}
