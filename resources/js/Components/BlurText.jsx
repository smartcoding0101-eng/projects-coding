import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const BlurText = ({
    text = '',
    delay = 0.05,
    className = '',
    as: Component = 'p',
    animateBy = 'words',
    direction = 'top',
    align = 'center'
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const yOffset = direction === 'top' ? -20 : 20;

    return (
        <Component
            ref={ref}
            className={className}
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
                gap: animateBy === 'words' ? '0.25em' : '0em'
            }}
        >
            {elements.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: "blur(10px)", y: yOffset }}
                    animate={isInView ? {
                        opacity: 1,
                        filter: "blur(0px)",
                        y: 0
                    } : undefined}
                    transition={{
                        delay: index * delay,
                        type: "spring",
                        damping: 20,
                        stiffness: 100
                    }}
                    style={{ display: 'inline-block' }}
                >
                    {word === ' ' ? '\u00A0' : word}
                </motion.span>
            ))}
        </Component>
    );
};

export default BlurText;
