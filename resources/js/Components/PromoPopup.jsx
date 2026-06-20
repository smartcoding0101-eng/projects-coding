import { useEffect, useState, useCallback } from 'react';
import { X, Tag, Newspaper, Info, ExternalLink } from 'lucide-react';

/**
 * PromoPopup — Modal de oferta/promoción/noticia configurable desde Filament.
 *
 * Props:
 *   config {object} — Objeto con la configuración del popup (de SiteSetting)
 *   storageKey {string} — Clave única para sessionStorage ('promo_popup_landing' | 'promo_popup_ecommerce')
 *
 * config shape:
 *   enabled         {bool}
 *   image           {string}  ruta en storage
 *   title           {string}
 *   description     {string}
 *   button_text     {string}
 *   button_link     {string}
 *   type            {string}  'oferta' | 'noticia' | 'informacion'
 *   show_once       {bool}    una vez por sesión o siempre
 *   delay_ms        {number}  ms antes de mostrar
 *   expires_at      {string}  ISO date string o null
 */
export default function PromoPopup({ config = {}, storageKey = 'promo_popup' }) {
    const [visible, setVisible] = useState(false);
    const [animatingOut, setAnimatingOut] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Tipo badge config
    const typeConfig = {
        oferta: {
            label: 'Oferta Especial',
            icon: Tag,
            bg: 'bg-primary',
            text: 'text-white',
            glow: 'shadow-primary/40',
        },
        noticia: {
            label: 'Noticia',
            icon: Newspaper,
            bg: 'bg-blue-600',
            text: 'text-white',
            glow: 'shadow-blue-600/40',
        },
        informacion: {
            label: 'Información',
            icon: Info,
            bg: 'bg-emerald-600',
            text: 'text-white',
            glow: 'shadow-emerald-600/40',
        },
    };

    const type = config.type || 'oferta';
    const badge = typeConfig[type] || typeConfig.oferta;
    const BadgeIcon = badge.icon;

    // Verificar expiración
    const isExpired = useCallback(() => {
        if (!config.expires_at) return false;
        return new Date(config.expires_at) < new Date();
    }, [config.expires_at]);

    useEffect(() => {
        // Condiciones para NO mostrar
        if (!config.enabled) return;
        if (!config.image && !config.title) return;
        if (isExpired()) return;

        // Control de frecuencia
        if (config.show_once !== false) {
            if (sessionStorage.getItem(storageKey)) return;
        }

        const delay = parseInt(config.delay_ms ?? 800);
        const timer = setTimeout(() => {
            if (config.show_once !== false) {
                sessionStorage.setItem(storageKey, '1');
            }
            setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [config.enabled, storageKey]);

    const dismiss = useCallback(() => {
        setAnimatingOut(true);
        setTimeout(() => setVisible(false), 350);
    }, []);

    // Cerrar con Escape
    useEffect(() => {
        if (!visible) return;
        const handler = (e) => { if (e.key === 'Escape') dismiss(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [visible, dismiss]);

    // Bloquear scroll del body cuando el popup está abierto
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [visible]);

    if (!visible) return null;

    const imageUrl = config.image
        ? (config.image.startsWith('http') ? config.image : `/storage/${config.image}`)
        : null;

    const hasContent = config.title || config.description || config.button_text;

    return (
        <>
            {/* ── Backdrop ─────────────────────────────────────────── */}
            <div
                className={`fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm transition-opacity duration-350 ${
                    animatingOut ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={dismiss}
                aria-hidden="true"
            />

            {/* ── Modal ────────────────────────────────────────────── */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={config.title || 'Promoción'}
                className={`
                    fixed inset-0 z-[9999] flex items-center justify-center p-4
                    pointer-events-none
                `}
            >
                <div
                    className={`
                        relative pointer-events-auto
                        w-full max-w-lg sm:max-w-xl md:max-w-2xl
                        rounded-2xl overflow-hidden
                        shadow-2xl shadow-black/50
                        transition-all duration-350 ease-out
                        ${animatingOut
                            ? 'opacity-0 scale-95 translate-y-4'
                            : 'opacity-100 scale-100 translate-y-0'
                        }
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Botón cerrar ─────────────────────────────── */}
                    <button
                        onClick={dismiss}
                        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm shadow-lg"
                        aria-label="Cerrar"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* ── Badge de tipo ────────────────────────────── */}
                    <div className="absolute top-3 left-3 z-20">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${badge.bg} ${badge.text} ${badge.glow}`}>
                            <BadgeIcon className="w-3.5 h-3.5" />
                            {badge.label}
                        </span>
                    </div>

                    {/* ── Imagen ───────────────────────────────────── */}
                    {imageUrl && (
                        <div className={`relative w-full ${hasContent ? 'h-52 sm:h-64 md:h-72' : 'h-72 sm:h-96'}`}>
                            {/* Skeleton mientras carga */}
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                            )}
                            <img
                                src={imageUrl}
                                alt={config.title || 'Promoción'}
                                onLoad={() => setImageLoaded(true)}
                                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            />
                            {/* Gradiente inferior para leer texto */}
                            {hasContent && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            )}
                        </div>
                    )}

                    {/* ── Contenido ────────────────────────────────── */}
                    {hasContent && (
                        <div className="bg-[#1a1a2e] px-6 py-5 space-y-3">
                            {config.title && (
                                <h2 className="text-white text-xl sm:text-2xl font-black leading-tight tracking-tight">
                                    {config.title}
                                </h2>
                            )}
                            {config.description && (
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                    {config.description}
                                </p>
                            )}
                            {config.button_text && config.button_link && (
                                <div className="pt-1">
                                    <a
                                        href={config.button_link}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95"
                                        onClick={dismiss}
                                    >
                                        {config.button_text}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Sin imagen, solo modal de texto ──────────── */}
                    {!imageUrl && !hasContent && (
                        <div className="bg-[#1a1a2e] p-8 text-center text-gray-400 text-sm">
                            Sin contenido configurado.
                        </div>
                    )}
                </div>
            </div>

            {/* Animación CSS */}
            <style>{`
                .duration-350 { transition-duration: 350ms; }
            `}</style>
        </>
    );
}
