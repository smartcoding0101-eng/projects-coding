import { useEffect, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * SplashScreen - Premium landing page intro animation.
 * Reads config from Inertia shared props via siteSettings.splash
 * Supports: text-only, image, or text+image logo modes.
 * Shows once per session (or every N minutes if show_every_minutes > 0).
 */
export default function SplashScreen() {
    const pageProps = usePage().props;
    // Soporta ambas fuentes: prop directo 'splash' (middleware legacy)
    // y siteSettings.splash (nuevo). El primero tiene prioridad si tiene datos.
    const splash = (pageProps.splash && Object.keys(pageProps.splash).length > 0)
        ? pageProps.splash
        : (pageProps.siteSettings?.splash ?? {});

    // ── Configuración con valores por defecto (calculada antes del state) ────
    const config = {
        enabled:           splash?.enabled ?? false,
        logo_type:         splash?.logo_type ?? 'text',       // 'text' | 'image' | 'both'
        style:             splash?.style ?? 'dark',           // 'dark' | 'light' | 'brand'
        logo_image:        splash?.logo_image ? `/storage/${splash.logo_image}` : null,
        logo_size:         splash?.logo_size ?? 'md',         // 'sm' | 'md' | 'lg' | 'xl'
        animation:         splash?.animation ?? 'fade',       // 'fade' | 'slide-up' | 'zoom-out'
        title:             splash?.title ?? 'FAPCLAS',
        subtitle:          splash?.subtitle ?? 'R.L.',
        tagline:           splash?.tagline ?? '',
        duration:          parseInt(splash?.duration_ms ?? 2500),
        showEveryMinutes:  parseInt(splash?.show_every_minutes ?? 0),
    };

    // ── Resolver visibilidad SINCRÓNICAMENTE (antes del primer paint) ────────
    // Esto evita el flash del contenido principal antes de que aparezca el splash.
    const [visible, setVisible] = useState(() => {
        if (!config.enabled) return false;
        if (typeof window === 'undefined') return false;

        try {
            const key = 'fapclas_splash_shown_at';
            const lastShown = parseInt(sessionStorage.getItem(key) ?? '0');
            const now = Date.now();

            if (config.showEveryMinutes > 0) {
                const elapsed = (now - lastShown) / 1000 / 60;
                if (lastShown && elapsed < config.showEveryMinutes) return false;
            } else {
                if (lastShown) return false;
            }

            // Marcar como mostrado inmediatamente
            sessionStorage.setItem(key, String(now));
            return true;
        } catch {
            return false;
        }
    });

    const [animatingOut, setAnimatingOut] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);

    // ── Colores según estilo ────────────────────────────────────────────────
    const styleMap = {
        dark:  { bg: '#20455d', text: '#ffffff', accent: '#F7BD16' },
        light: { bg: '#f8fafc', text: '#1e293b', accent: '#20455d' },
        brand: { bg: '#556B2F', text: '#ffffff', accent: '#F7BD16' },
    };
    const theme = styleMap[config.style] || styleMap.dark;

    // ── Clases del Tamaño del Logo ──────────────────────────────────────────
    const sizeMap = {
        sm: 'w-24 h-24 md:w-32 md:h-32',
        md: 'w-36 h-36 md:w-40 md:h-40',
        lg: 'w-48 h-48 md:w-52 md:h-52',
        xl: 'w-56 h-56 md:w-64 md:h-64',
    };
    const logoSizeClass = sizeMap[config.logo_size] || sizeMap.md;

    // ── Clases de Animación de Salida ────────────────────────────────────────
    const animationMap = {
        'fade':      animatingOut ? 'opacity-0 scale-100 transition-all duration-[700ms] ease-in-out' : '',
        'slide-up':  animatingOut ? 'opacity-0 -translate-y-full transition-all duration-[800ms] ease-in-out' : '',
        'zoom-out':  animatingOut ? 'opacity-0 scale-75 transition-all duration-[800ms] ease-in-out' : '',
    };
    const exitClass = animationMap[config.animation] || (animatingOut ? 'opacity-0 transition-opacity duration-700' : '');

    const showImage = (config.logo_type === 'image' || config.logo_type === 'both') && config.logo_image && !imageError;
    const showText  = config.logo_type === 'text' || config.logo_type === 'both';

    // ── Cleanup del timer ───────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // ── Timer de seguridad para forzar la carga visual si la imagen tarda o falla ──
    useEffect(() => {
        if (visible && showImage) {
            const safetyTimer = setTimeout(() => {
                setLogoLoaded(true);
            }, 800);
            return () => clearTimeout(safetyTimer);
        }
    }, [visible, showImage]);

    // ── Progress bar ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!visible) return;

        let start = null;
        let raf;

        const tick = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const pct = Math.min((elapsed / config.duration) * 100, 100);
            setProgress(pct);

            if (pct < 100) {
                raf = requestAnimationFrame(tick);
            } else {
                dismiss();
            }
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [visible]);

    const dismiss = () => {
        setAnimatingOut(true);
        timerRef.current = setTimeout(() => setVisible(false), 750);
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center
                        transition-all duration-700 ease-in-out cursor-pointer select-none ${exitClass}`}
            style={{ backgroundColor: theme.bg }}
            onClick={dismiss}
            aria-label="Pantalla de bienvenida – haz clic para continuar"
        >
            {/* ── Fondo decorativo ──────────────────────────────────────── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 animate-ping"
                    style={{ width: 480, height: 480, backgroundColor: theme.accent, animationDuration: '2s' }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5"
                    style={{ width: 700, height: 700, background: `radial-gradient(circle, ${theme.accent}33 0%, transparent 70%)` }}
                />
            </div>

            {/* ── Logo central ──────────────────────────────────────────── */}
            <div className="relative flex flex-col items-center justify-center gap-1">

                {/* Imagen (si aplica y no ha dado error) */}
                {showImage && (
                    <div className="relative mb-2">
                        <div
                            className="absolute inset-0 rounded-full blur-3xl opacity-30"
                            style={{ backgroundColor: theme.accent }}
                        />
                        <img
                            src={config.logo_image}
                            alt={config.title}
                            onLoad={() => setLogoLoaded(true)}
                            onError={() => {
                                setImageError(true);
                                setLogoLoaded(true);
                            }}
                            className={`relative z-10 object-contain drop-shadow-2xl transition-all duration-[1000ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${logoSizeClass} ${
                                logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-4'
                            }`}
                        />
                    </div>
                )}

                {/* Texto (si aplica) */}
                {showText && (
                    <div
                        className={`flex flex-col items-center text-center transition-all duration-[1000ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                    ${showImage
                                        ? (logoLoaded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4')
                                        : 'opacity-100 scale-100 translate-y-0'
                                    }`}
                        style={{ gap: '2px' }}
                    >
                        {/* Título — jerarquía 1: el más grande y pesado */}
                        <span
                            className="font-black tracking-tight"
                            style={{
                                fontSize: 'clamp(2.8rem, 7vw, 5rem)',
                                color: theme.text,
                                lineHeight: 1.15,
                            }}
                        >
                            {config.title}
                        </span>

                        {/* Subtítulo — jerarquía 2: color acento, tamaño medio */}
                        {config.subtitle && (
                            <span
                                className="font-bold tracking-[0.2em] uppercase"
                                style={{
                                    fontSize: 'clamp(0.75rem, 1.8vw, 1rem)',
                                    color: theme.accent,
                                    lineHeight: 1.15,
                                    marginTop: '2px',
                                }}
                            >
                                {config.subtitle}
                            </span>
                        )}
                    </div>
                )}

                {/* Tagline — jerarquía 3: pequeño, discreto, separado */}
                {config.tagline && (
                    <p
                        className={`text-center font-medium tracking-[0.18em] uppercase
                                    transition-all duration-1000 delay-500
                                    ${(showImage ? logoLoaded : true) ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{
                            color: theme.text,
                            fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
                            lineHeight: 1.15,
                            marginTop: '14px',
                            letterSpacing: '0.22em',
                        }}
                    >
                        {config.tagline}
                    </p>
                )}
            </div>

            {/* ── Barra de progreso ─────────────────────────────────────── */}
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: `${theme.text}1A` }}>
                <div
                    className="h-full transition-none"
                    style={{ width: `${progress}%`, backgroundColor: theme.accent }}
                />
            </div>

            {/* ── Hint ─────────────────────────────────────────────────── */}
            <p className="absolute bottom-5 right-6 text-xs font-medium tracking-wider" style={{ color: `${theme.text}4D` }}>
                Toca para continuar
            </p>
        </div>
    );
}
