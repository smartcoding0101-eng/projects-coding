import { Head, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FloatingWhatsApp from '../Components/FloatingWhatsApp';
import BlockRenderer from '../Components/CMS/BlockRenderer';

// Secciones estáticas (fallback canónico de Producción)
import HeroSection from '../Components/HeroSection';
import ProductCards from '../Components/ProductCards';
import CreditSimulator from '../Components/CreditSimulator';
import BenefitsSection from '../Components/BenefitsSection';
import InstitutionalSection from '../Components/InstitutionalSection';
import GallerySection from '../Components/GallerySection';
import VideoSection from '../Components/VideoSection';
import TestimonialsSection from '../Components/TestimonialsSection';
import FAQSection from '../Components/FAQSection';

// Extra: Módulo de noticias dinámicas importado para la Home
import LatestNewsBlock from '../Components/CMS/Blocks/LatestNewsBlock';

export default function Welcome({ page, isDynamic, siteSettings = {}, latest_noticias = [] }) {
    const { header = {}, footer = {}, whatsapp = {} } = siteSettings;

    return (
        <>
            <Head title={page?.title || "FAPCLAS R.L. - Tu Futuro Seguro"} />
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface selection:bg-primary/20">
                <Header settings={header} />

                <main className="pt-20">
                    {/* 
                     Siempre usamos la estructura de producción para /inicio. 
                     isDynamic solo será false en la home forzadamente por el PageController.
                    */}
                    {isDynamic ? (
                        <BlockRenderer blocks={page.content} />
                    ) : (
                        <>
                            <HeroSection />
                            <InstitutionalSection />
                            <ProductCards />
                            
                            <section className="py-12 bg-card-fap border-y border-brand/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container/30 -skew-x-12 transform translate-x-1/2"></div>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                                        <CreditSimulator />
                                        <div className="lg:border-l lg:border-brand lg:pl-16">
                                            <BenefitsSection />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <GallerySection />
                            <VideoSection />
                            <TestimonialsSection />
                            
                            {/* Inyectamos dinámicamente las noticias conservando la arquitectura estática */}
                            {latest_noticias && latest_noticias.length > 0 && (
                                <LatestNewsBlock data={{ title: 'Últimas Novedades', noticias: latest_noticias }} />
                            )}

                            <FAQSection />
                        </>
                    )}
                </main>
                <Footer settings={footer} />
                
                {whatsapp?.enabled !== false && (
                    <FloatingWhatsApp settings={whatsapp} />
                )}
            </div>
        </>
    );
}
