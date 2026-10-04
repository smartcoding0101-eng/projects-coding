import { motion } from 'framer-motion';
import React from 'react';

/**
 * GradientKineticTitle — Efecto Degradado Cinemático para el Hero de la Tienda Virtual
 *
 * Muestra el título con un degradado de texto de alta gama (White -> Soft Cream/Gold)
 * con brillo sutil y animación de entrada cinemática fluida, eliminando el efecto de ola.
 */
export default function GradientKineticTitle({
    text = '',
    as: Component = 'h1',
    className = '',
    style = {},
    align = 'left',
}) {
    if (!text) return null;

    const words = text.split(' ').filter(Boolean);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.05,
            },
        },
    };

    const wordVariants = {
        hidden: {
            opacity: 0,
            y: 24,
            filter: 'blur(6px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Curva cinemática suave estilo Apple
            },
        },
    };

    return (
        <Component
            className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 select-none ${className}`}
            style={{
                justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
                ...style,
            }}
        >
            <motion.span
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
                }}
            >
                {words.map((word, wordIdx) => (
                    <motion.span
                        key={wordIdx}
                        variants={wordVariants}
                        className="inline-block bg-gradient-to-r from-white via-slate-100 to-[#F7BD16] bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.span>
        </Component>
    );
}
