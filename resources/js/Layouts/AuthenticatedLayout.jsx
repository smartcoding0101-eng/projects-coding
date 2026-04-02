import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X, Bell, ChevronDown, Palette } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const theme = user?.theme || user?.theme_preference || 'premium-olive';
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const isAdmin = user.roles?.includes('SuperAdmin');
    const userPermissions = user.permissions || [];

    // Helper: puede ver el item si es Admin, o si no requiere permisos, o si tiene ALGUNO de los permisos requeridos
    const canView = (item) => {
        if (isAdmin) return true;
        if (!item.permissions || item.permissions.length === 0) return true;
        return item.permissions.some(p => userPermissions.includes(p));
    };

    useEffect(() => {
        const root = window.document.documentElement;
        // Limpiar clases de temas anteriores para evitar conflictos
        root.classList.remove('premium-olive', 'corporate-blue', 'dark-night', 'classic-light', 'dark');
        
        // Aplicar el tema actual
        root.classList.add(theme);

        // Soporte para utilidades 'dark:' de Tailwind
        if (theme === 'dark-night' || theme === 'dark') {
            root.classList.add('dark');
        }
    }, [theme]);

    const navItems = [
        { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') },
    ];

    const administrationItems = [
        { label: 'Créditos', href: route('creditos.index'), active: route().current('creditos.*'), permissions: ['ver creditos', 'evaluar creditos'] },
        { label: 'Libretas', href: route('libro-diario.index'), active: route().current('libro-diario.*'), permissions: ['ver libro diario'] },
        { label: 'Kardex', href: route('kardex.index'), active: route().current('kardex.*'), permissions: ['ver kardex general'] },
        { label: 'Reportes', href: route('reportes.index'), active: route().current('reportes.*'), permissions: ['ver reportes financieros'] },
        { label: 'Caja', href: route('admin.caja.index'), active: route().current('admin.caja.*'), permissions: ['gestionar usuarios'] },
    ];

    const ecommerceItems = [
        { label: 'Admin Dashboard', href: route('admin.ecommerce.dashboard'), active: route().current('admin.ecommerce.dashboard'), permissions: ['ver dashboard tienda'] },
        { label: 'Tienda', href: route('beneficios.index'), active: route().current('beneficios.*') }, // Público a roles básicos
        { label: 'Inventario', href: route('admin.inventario.index'), active: route().current('admin.inventario.*'), permissions: ['gestionar inventario tienda'] },
        { label: 'Pedidos Web', href: route('admin.pedidos.index'), active: route().current('admin.pedidos.*'), permissions: ['evaluar pedidos ecommerce'] },
        { label: 'Movimientos', href: route('admin.ecommerce.reporte.movimientos'), active: route().current('admin.ecommerce.reporte.movimientos'), permissions: ['ver dashboard tienda'] },
        { label: 'Configuración', href: route('admin.ecommerce.config.index'), active: route().current('admin.ecommerce.config.*'), permissions: ['configurar parametros globales'] },
    ];

    const adjustmentsItems = [
        { label: 'Personas', href: route('admin.personas.index'), active: route().current('admin.personas.*'), permissions: ['ver personas'] },
        { label: 'Usuarios', href: route('admin.users.index'), active: route().current('admin.users.*'), permissions: ['gestionar usuarios'] },
        { label: 'Roles', href: route('admin.roles.index'), active: route().current('admin.roles.*'), permissions: ['gestionar roles y permisos'] },
        { label: 'Global', href: route('admin.configuraciones.index'), active: route().current('admin.configuraciones.*'), permissions: ['configurar parametros globales'] },
        { label: 'Portal CMS', href: '/admin', active: false, permissions: ['configurar parametros globales'] }, 
    ];

    const ayudaItems = [
        { label: 'Manual de Usuario', href: '#' },
        { label: 'Preguntas Frecuentes', href: '#' },
        { label: 'Soporte Técnico', href: '#' },
        { label: 'Políticas y Términos', href: '#' },
        { label: 'Acerca del Sistema', href: '#' },
    ];

    return (
        <div className={`min-h-screen text-brand-main bg-main transition-colors duration-300 ${theme}`}>
            <nav className="border-b border-white/10" style={{ background: 'var(--brand-header)' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <div className="flex shrink-0 items-center mr-8">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-header-text" />
                                </Link>
                                <div className="ml-3 hidden md:block">
                                    <span className="text-header-text font-black text-lg tracking-tight">FAPCLAS</span>
                                </div>
                            </div>

                            <div className="hidden space-x-4 sm:-my-px sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Inicio
                                </NavLink>

                                {/* Administración Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-bold leading-4 transition-all duration-200 focus:outline-none ${
                                            route().current('creditos.*') || route().current('libro-diario.*') || route().current('kardex.*') || route().current('reportes.*') || route().current('admin.caja.*')
                                                ? 'bg-header-hover text-header-text shadow-inner border border-header-hover'
                                                : 'text-header-muted hover:text-header-text hover:bg-header-hover border border-transparent'
                                        }`}>
                                            Administración
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" width="48">
                                        {administrationItems.filter(canView).map((item, idx) => (
                                            <Dropdown.Link key={item.label} href={item.href}>
                                                {idx + 1}. {item.label}
                                            </Dropdown.Link>
                                        ))}
                                    </Dropdown.Content>
                                </Dropdown>

                                {/* Ecommerce Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-bold leading-4 transition-all duration-200 focus:outline-none ${
                                            route().current('admin.ecommerce.*') || route().current('admin.inventario.*') || route().current('admin.pedidos.*') || route().current('beneficios.*')
                                                ? 'bg-header-hover text-header-text shadow-inner border border-header-hover'
                                                : 'text-header-muted hover:text-header-text hover:bg-header-hover border border-transparent'
                                        }`}>
                                            Ecommerce
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" width="48">
                                        {ecommerceItems.filter(canView).map((item, idx) => (
                                            <Dropdown.Link key={item.label} href={item.href}>
                                                {idx + 1}. {item.label}
                                            </Dropdown.Link>
                                        ))}
                                    </Dropdown.Content>
                                </Dropdown>

                                {/* Ajustes Dropdown (Visible si hay algún item disponible) */}
                                {adjustmentsItems.some(canView) && (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-bold leading-4 transition-all duration-200 focus:outline-none ${
                                                route().current('admin.users.*') || route().current('admin.roles.*') || route().current('admin.configuraciones.*') || route().current('admin.personas.*')
                                                    ? 'bg-header-hover text-header-text shadow-inner border border-header-hover'
                                                    : 'text-header-muted hover:text-header-text hover:bg-header-hover border border-transparent'
                                            }`}>
                                                Ajustes y Core
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content align="left" width="48" className="bg-card-fap border-brand">
                                            {adjustmentsItems.filter(canView).map((item, idx) => (
                                                <Dropdown.Link key={item.label} href={item.href} className="text-brand-main hover:bg-white/5">
                                                    {idx + 1}. {item.label}
                                                </Dropdown.Link>
                                            ))}
                                        </Dropdown.Content>
                                    </Dropdown>
                                )}

                                {/* Ayuda Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-bold leading-4 transition-all duration-200 focus:outline-none ${false
                                                ? 'bg-header-hover text-header-text shadow-inner border border-header-hover'
                                                : 'text-header-muted hover:text-header-text hover:bg-header-hover border border-transparent'
                                        }`}>
                                            Ayuda
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left" width="48">
                                        {ayudaItems.map((item, idx) => (
                                            <Dropdown.Link key={item.label} href={item.href}>
                                                {idx + 1}. {item.label}
                                            </Dropdown.Link>
                                        ))}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="relative ms-3 flex items-center space-x-3">
                                {/* Selector de Temas */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="p-1.5 text-header-muted hover:text-header-text hover:bg-header-hover rounded-full transition-colors" title="Cambiar Tema">
                                            <Palette className="h-5 w-5" />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="right" width="48" className="bg-card-fap border-brand">
                                        <div className="px-4 py-2 text-xs font-bold text-brand-muted uppercase tracking-widest border-b border-brand mb-1">Paleta de Colores</div>
                                        <Dropdown.Link as="button" method="post" href={route('user.theme.update')} data={{ theme: 'premium-olive' }} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#28361d]" /> Olivo Premium (SAP)
                                        </Dropdown.Link>
                                        <Dropdown.Link as="button" method="post" href={route('user.theme.update')} data={{ theme: 'corporate-blue' }} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#1e40af]" /> Azul Corporativo
                                        </Dropdown.Link>
                                        <Dropdown.Link as="button" method="post" href={route('user.theme.update')} data={{ theme: 'dark-night' }} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#0f172a]" /> Noche Profunda (Dark)
                                        </Dropdown.Link>
                                        <Dropdown.Link as="button" method="post" href={route('user.theme.update')} data={{ theme: 'classic-light' }} className="flex items-center gap-2 text-brand-main hover:bg-white/5">
                                            <div className="w-3 h-3 rounded-full bg-white border border-brand" /> Blanco Clásico (Light)
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>

                                <button className="p-1.5 text-header-muted hover:text-header-text hover:bg-header-hover rounded-full transition-colors">
                                    <Bell className="h-5 w-5" />
                                </button>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center rounded-lg border border-header-hover bg-header-hover/50 px-3 py-2 text-sm font-bold leading-4 text-header-text transition-all hover:bg-header-hover focus:outline-none shadow-sm backdrop-blur-sm">
                                            {user.name}
                                            <ChevronDown className="ms-2 h-4 w-4" />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="right" width="48">
                                        <Dropdown.Link href={route('profile.edit')}>1. Mi Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            2. Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-header-muted hover:text-header-text hover:bg-header-hover focus:outline-none transition-colors"
                            >
                                {showingNavigationDropdown ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden bg-card-fap border-b border-brand`}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Inicio
                        </ResponsiveNavLink>
                        {/* Administración Móvil */}
                        <div className="border-t border-brand pt-2 pb-1">
                            <div className="px-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">
                                Administración
                            </div>
                            {administrationItems.filter(canView).map((item, idx) => (
                                <ResponsiveNavLink key={item.label} href={item.href} active={item.active}>
                                    {idx + 1}. {item.label}
                                </ResponsiveNavLink>
                            ))}
                        </div>

                        {/* Ecommerce Móvil */}
                        <div className="border-t border-brand pt-2 pb-1">
                            <div className="px-4 text-xs font-semibold text-brand-muted uppercase tracking-wider">
                                Ecommerce
                            </div>
                            {ecommerceItems.filter(canView).map((item, idx) => (
                                <ResponsiveNavLink key={item.label} href={item.href} active={item.active}>
                                    {idx + 1}. {item.label}
                                </ResponsiveNavLink>
                            ))}
                        </div>

                        {/* Ajustes Móvil */}
                        {adjustmentsItems.some(canView) && (
                            <div className="pt-4 pb-1 space-y-1 border-t border-brand">
                                <div className="px-4 font-bold text-xs text-brand-muted uppercase tracking-wider">Ajustes y Core</div>
                                {adjustmentsItems.filter(canView).map((item, idx) => (
                                    <ResponsiveNavLink key={item.label} href={item.href} active={item.active}>
                                        {idx + 1}. {item.label}
                                    </ResponsiveNavLink>
                                ))}
                            </div>
                        )}

                        {/* Ayuda Móvil */}
                        <div className="pt-4 pb-1 border-t border-brand space-y-1">
                            <div className="px-4 font-bold text-xs text-brand-muted uppercase tracking-wider">Ayuda</div>
                            {ayudaItems.map((item, idx) => (
                                <ResponsiveNavLink key={item.label} href={item.href} active={false}>
                                    {idx + 1}. {item.label}
                                </ResponsiveNavLink>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-brand pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-brand-main">{user.name}</div>
                            <div className="text-sm font-medium text-brand-muted">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>1. Mi Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                2. Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-card-fap border-b border-brand shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center text-brand-main">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-12">{children}</main>
        </div>
    );
}

