import { motion } from 'framer-motion';
import React from 'react';

/**
 * SplitKineticTitle — Revelado Cinemático por Máscara (Hero Principal)
 *
 * Cada palabra o línea emerge desde una máscara inferior con aceleración elástica suave.
 * Soporta gradiente de texto institucional y resplandor tenue.
 */
export default function SplitKineticTitle({
    text = '',
    subtitle = '',
    className = '',
    subtitleClassName = '',
    direction = 'up',
    delayOffset = 0,
}) {
    if (!text && !subtitle) return null;

    const words = text.split(' ').filter(Boolean);
    const subWords = subtitle ? subtitle.split(' ').filter(Boolean) : [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: delayOffset,
            },
        },
    };

    const wordVariants = {
        hidden: {
            y: direction === 'up' ? '110%' : '-110%',
            opacity: 0,
            rotateX: 20,
        },
        visible: {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            transition: {
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1], // Curva cinematográfica premium (Stripe/Apple style)
            },
        },
    };

    return (
        <div className="flex flex-col select-none">
            {/* Título Principal */}
            {words.length > 0 && (
                <motion.h1
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-1 ${className}`}
                >
                    {words.map((word, idx) => (
                        <span
                            key={idx}
                            className="inline-block overflow-hidden py-0.5 sm:py-1 max-w-full"
                            style={{ perspective: '600px' }}
                        >
                            <motion.span
                                variants={wordVariants}
                                className="inline-block will-change-transform drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] break-words"
                            >
                                {word}
                            </motion.span>
                        </span>
                    ))}
                </motion.h1>
            )}

            {/* Subtítulo Destacado (con sutil degradado dorado de acento) */}
            {subWords.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-1 ${subtitleClassName}`}
                >
                    {subWords.map((word, idx) => (
                        <span
                            key={idx}
                            className="inline-block overflow-hidden py-0.5 sm:py-1 max-w-full"
                            style={{ perspective: '600px' }}
                        >
                            <motion.span
                                variants={wordVariants}
                                className="inline-block will-change-transform bg-gradient-to-r from-[#F7BD16] via-[#ffd56b] to-[#F7BD16] bg-clip-text text-transparent drop-shadow-[0_8px_20px_rgba(247,189,22,0.3)] break-words"
                            >
                                {word}
                            </motion.span>
                        </span>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
