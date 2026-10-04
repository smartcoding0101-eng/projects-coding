import { motion } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';

/**
 * WaveTitle — Efecto de Ola Dinámica para Títulos de la Tienda Virtual
 *
 * Cada palabra o letra entra con desvanecimiento sutil y se mantiene en una
 * ondulación de ola armónica (sinusoidal) continua, creando un efecto fluido y moderno.
 */
export default function WaveTitle({
    text = '',
    as: Component = 'h1',
    className = '',
    style = {},
    align = 'left',
}) {
    if (!text) return null;

    const words = text.split(' ').filter(Boolean);

    return (
        <Component
            className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 select-none ${className}`}
            style={{
                justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
                ...style,
            }}
        >
            {words.map((word, wordIdx) => {
                const letters = Array.from(word);
                return (
                    <span key={wordIdx} className="inline-flex py-1 overflow-visible">
                        {letters.map((char, charIdx) => {
                            // Cálculo matemático del desfase armónico para el efecto ola (ripple)
                            const waveDelay = (wordIdx * 4 + charIdx) * 0.08;

                            return (
                                <motion.span
                                    key={charIdx}
                                    className="inline-block origin-bottom will-change-transform"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{
                                        opacity: 1,
                                        y: [0, -10, 0, 3, 0],
                                        rotateZ: [0, -1.8, 0, 1.8, 0],
                                    }}
                                    transition={{
                                        opacity: { duration: 0.6, delay: waveDelay * 0.5 },
                                        y: {
                                            duration: 2.8,
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                            ease: 'easeInOut',
                                            delay: waveDelay,
                                        },
                                        rotateZ: {
                                            duration: 2.8,
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                            ease: 'easeInOut',
                                            delay: waveDelay,
                                        },
                                    }}
                                >
                                    {char}
                                </motion.span>
                            );
                        })}
                    </span>
                );
            })}
        </Component>
    );
}
