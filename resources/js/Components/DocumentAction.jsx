import React, { useState, useEffect } from 'react';

/**
 * Hook: verifica si un archivo existe en /storage vía HEAD request.
 * Trata tanto 404 como 403 como "no disponible", dado que XAMPP/Apache
 * puede devolver 403 cuando el archivo no existe en lugar de 404.
 */
export function useFileExists(filePath) {
    const [status, setStatus] = useState('checking'); // 'checking' | 'available' | 'unavailable'

    useEffect(() => {
        if (!filePath) {
            setStatus('unavailable');
            return;
        }

        const url = `/storage/${filePath}`;
        let cancelled = false;

        fetch(url, { method: 'HEAD' })
            .then((res) => {
                if (!cancelled) {
                    // res.ok cubre 200–299.
                    // 403/404/500 = no disponible.
                    setStatus(res.ok ? 'available' : 'unavailable');
                }
            })
            .catch(() => {
                if (!cancelled) setStatus('unavailable');
            });

        return () => { cancelled = true; };
    }, [filePath]);

    return status;
}

/**
 * DocumentAction
 * Renderiza un botón de descarga si el archivo existe,
 * o una tarjeta de advertencia ámbar si no está disponible.
 *
 * Props:
 *   - filePath   {string}  Ruta relativa en storage (ej: 'pages/normativas/ley-393.pdf')
 *   - label      {string}  Texto del botón (ej: 'Descargar Ley 393 PDF')
 *   - btnClass   {string}  Clases Tailwind para el botón cuando está disponible
 */
export default function DocumentAction({ filePath, label = 'Descargar PDF', btnClass = '' }) {
    const fileStatus = useFileExists(filePath);

    // ── Skeleton mientras verifica ──────────────────────────────────────────
    if (fileStatus === 'checking') {
        return (
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-100 animate-pulse">
                <span className="w-28 h-4 bg-gray-200 rounded-full" />
            </div>
        );
    }

    // ── Advertencia: documento no disponible ────────────────────────────────
    if (fileStatus === 'unavailable') {
        return (
            <div
                role="alert"
                aria-live="polite"
                className="inline-flex items-start gap-3 px-5 py-3.5 rounded-2xl
                           bg-amber-50 border border-amber-200
                           shadow-sm shadow-amber-100/60"
            >
                {/* Ícono triángulo */}
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8
                                 rounded-full bg-amber-100 text-amber-500 mt-0.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </span>

                {/* Texto */}
                <div className="leading-tight">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-0.5">
                        Documento no disponible
                    </p>
                    <p className="text-xs text-amber-600/75 font-medium">
                        El administrador aún no ha cargado este archivo.
                    </p>
                </div>
            </div>
        );
    }

    // ── Botón de descarga normal ────────────────────────────────────────────
    return (
        <a
            href={`/storage/${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 font-bold hover:underline
                        group-hover:gap-4 transition-all w-max px-6 py-2.5 rounded-full
                        ${btnClass}`}
        >
            {label} ↓
        </a>
    );
}
