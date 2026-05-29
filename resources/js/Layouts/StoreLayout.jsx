import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FloatingWhatsApp from '@/Components/FloatingWhatsApp';
import ScrollToTop from '@/Components/ScrollToTop';
import { useCart } from '@/Contexts/CartContext';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';

import FloatingAssistant from '@/Components/FloatingAssistant';

export default function StoreLayout({ children }) {
    const user = usePage().props.auth?.user;
    const theme = user?.theme || user?.theme_preference || 'premium-olive';
    const { cartCount } = useCart();
    const { url } = usePage();

    // React effect to apply theme dynamically, same as AuthenticatedLayout
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('premium-olive', 'corporate-blue', 'dark-night', 'classic-light', 'dark');
        root.classList.add(theme);
        if (theme === 'dark-night' || theme === 'dark') {
            root.classList.add('dark');
        }
    }, [theme]);

    // Check if we are on immersive benefits routes (Index or Checkout)
    const isImmersiveRoute = url.startsWith('/beneficios') && (url === '/beneficios' || url.startsWith('/beneficios?') || url.startsWith('/beneficios/checkout'));

    // Inject custom colors from CMS if settings are passed via page props
    const settings = usePage().props.settings || {};
    const customStyles = {};
    if (settings.ecommerce_color_primary) {
        customStyles['--color-primary'] = settings.ecommerce_color_primary;
    }
    if (settings.ecommerce_color_primary_dark) {
        customStyles['--color-primary-dark'] = settings.ecommerce_color_primary_dark;
    }

    return (
        <div style={customStyles} className={`min-h-screen font-sans antialiased text-brand-main bg-main flex flex-col transition-colors duration-300 ${theme}`}>
            {!isImmersiveRoute && <Header />}

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <Link
                    href={route('beneficios.checkout')}
                    className="fixed bottom-40 right-6 z-50 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-black/30 hover:scale-110 transition-transform"
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                        {cartCount}
                    </span>
                </Link>
            )}

            <main className={`flex-1 ${!isImmersiveRoute ? 'pt-20' : ''}`}>
                {children}
            </main>

            <Footer settings={usePage().props.site_settings || {}} ecommerceSettings={settings} />
            <FloatingAssistant />
            <FloatingWhatsApp settings={settings} />
            <ScrollToTop />
        </div>
    );
}
