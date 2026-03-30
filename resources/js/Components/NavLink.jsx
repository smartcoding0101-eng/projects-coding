import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold leading-5 transition duration-200 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-primary text-header-text focus:border-primary/50'
                    : 'border-transparent text-header-muted hover:text-header-text hover:border-header-hover focus:text-header-text focus:border-header-hover') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
