import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';

const ICONS = {
    success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const COLORS = {
    success: { bar: 'bg-emerald-500', icon: 'bg-emerald-500/15 text-emerald-500', border: 'border-emerald-500/30' },
    error:   { bar: 'bg-red-500',     icon: 'bg-red-500/15 text-red-500',         border: 'border-red-500/30' },
    warning: { bar: 'bg-amber-500',   icon: 'bg-amber-500/15 text-amber-500',     border: 'border-amber-500/30' },
    info:    { bar: 'bg-blue-500',    icon: 'bg-blue-500/15 text-blue-500',       border: 'border-blue-500/30' },
};

const DURATION = 4500;

function Toast({ id, type, message, onRemove }) {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const timerRef = useRef(null);
    const startRef = useRef(null);
    const colors = COLORS[type] || COLORS.info;

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setVisible(true));

        startRef.current = Date.now();
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startRef.current;
            const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
            setProgress(remaining);
            if (remaining === 0) {
                clearInterval(timerRef.current);
                handleDismiss();
            }
        }, 50);

        return () => clearInterval(timerRef.current);
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(() => onRemove(id), 350);
    };

    // Haptic feedback on mobile
    useEffect(() => {
        if (navigator.vibrate) navigator.vibrate([10]);
    }, []);

    return (
        <div
            className={`relative overflow-hidden bg-white dark:bg-zinc-900 border ${colors.border} rounded-2xl shadow-2xl shadow-black/20 w-full max-w-sm pointer-events-auto transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}
        >
            {/* Progress bar */}
            <div
                className={`absolute top-0 left-0 h-0.5 ${colors.bar} transition-all duration-50 ease-linear`}
                style={{ width: `${progress}%` }}
            />

            <div className="flex items-start gap-3 p-4 pr-5">
                {/* Icon */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${colors.icon}`}>
                    {ICONS[type] || ICONS.info}
                </div>

                {/* Message */}
                <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-snug">{message}</p>
                </div>

                {/* Close */}
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 mt-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    aria-label="Cerrar notificación"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

let toastIdCounter = 0;
export function useToast() {
    return window.__fapclas_toast_push__ || (() => {});
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);
    const { flash } = usePage().props;
    const lastFlashRef = useRef(null);

    // Expose global push function
    useEffect(() => {
        window.__fapclas_toast_push__ = ({ type = 'info', message }) => {
            const id = ++toastIdCounter;
            setToasts(prev => [...prev, { id, type, message }]);
        };
        return () => { delete window.__fapclas_toast_push__; };
    }, []);

    // Auto-show Laravel flash messages
    useEffect(() => {
        const flashKey = JSON.stringify(flash);
        if (!flash || flashKey === lastFlashRef.current) return;
        lastFlashRef.current = flashKey;

        const map = [
            { key: 'success', type: 'success' },
            { key: 'error',   type: 'error' },
            { key: 'warning', type: 'warning' },
            { key: 'info',    type: 'info' },
        ];
        map.forEach(({ key, type }) => {
            if (flash[key]) {
                const id = ++toastIdCounter;
                setToasts(prev => [...prev, { id, type, message: flash[key] }]);
            }
        });
    }, [flash]);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    if (toasts.length === 0) return null;

    return (
        <div
            aria-live="polite"
            className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
        >
            {toasts.map(t => (
                <Toast key={t.id} {...t} onRemove={removeToast} />
            ))}
        </div>
    );
}
