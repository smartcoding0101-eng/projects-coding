import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center border-l-4 py-3 pe-4 ps-4 ${
                active
                    ? 'border-primary bg-primary/10 text-brand-main font-bold shadow-[inset_4px_0_10px_rgba(var(--brand-primary-rgb),0.05)]'
                    : 'border-transparent text-brand-muted hover:border-brand hover:bg-white/5 hover:text-brand-main'
            } text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
