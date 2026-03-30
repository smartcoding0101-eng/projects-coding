import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FloatingWhatsApp from '@/Components/FloatingWhatsApp';
import { useCart } from '@/Contexts/CartContext';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

    return (
        <div className={`min-h-screen font-sans antialiased text-brand-main bg-main flex flex-col transition-colors duration-300 ${theme}`}>
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

            <AnimatePresence mode="wait" initial={false}>
                <motion.main
                    key={url}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex-1 ${!isImmersiveRoute ? 'pt-20' : ''}`}
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            <Footer />
            <FloatingAssistant />
            <FloatingWhatsApp />
        </div>
    );
}
