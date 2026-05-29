import { Head, usePage } from '@inertiajs/react';
import React, { Suspense, lazy } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import FloatingWhatsApp from '../Components/FloatingWhatsApp';
import ScrollToTop from '../Components/ScrollToTop';
import BlockRenderer from '../Components/CMS/BlockRenderer';

// Secciones estáticas (fallback canónico de Producción)
import HeroSection from '../Components/HeroSection'; // Keep static for LCP

const ProductCards = lazy(() => import('../Components/ProductCards'));
const CreditSimulator = lazy(() => import('../Components/CreditSimulator'));
const BenefitsSection = lazy(() => import('../Components/BenefitsSection'));
const InstitutionalSection = lazy(() => import('../Components/InstitutionalSection'));
const GallerySection = lazy(() => import('../Components/GallerySection'));
const VideoSection = lazy(() => import('../Components/VideoSection'));
const TestimonialsSection = lazy(() => import('../Components/TestimonialsSection'));
const FAQSection = lazy(() => import('../Components/FAQSection'));

// Extra: Módulo de noticias dinámicas importado para la Home
const LatestNewsBlock = lazy(() => import('../Components/CMS/Blocks/LatestNewsBlock'));

export default function Welcome({
    page,
    isDynamic,
    siteSettings = {},
    latest_noticias = [],
    servicios = [],
    heroSlides = [],
    galleryData = null,
    identityData = null,
    videoData = null,
    testimonialsData = null,
    productCardsData = null,
    benefitsData = null,
}) {
    const { header = {}, footer = {}, whatsapp = {} } = siteSettings;

    return (
        <>
            <Head>
                <title>{page?.metadata?.seo_title || page?.title || "FAPCLAS R.L. - Tu Futuro Seguro"}</title>
                {page?.metadata?.seo_description && <meta name="description" content={page.metadata.seo_description} />}
                {page?.metadata?.og_image && <meta property="og:image" content={`/storage/${page.metadata.og_image}`} />}
                {page?.metadata?.seo_title && <meta property="og:title" content={page.metadata.seo_title} />}
            </Head>
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface selection:bg-primary/20">
                <Header settings={header} />

                <main className="pt-20">
                    {isDynamic ? (
                        <BlockRenderer blocks={page.content} />
                    ) : (
                        <>
                            <HeroSection cmsSlides={heroSlides} />
                            <Suspense fallback={<div className="w-full flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                                <InstitutionalSection cmsData={identityData} />
                                <ProductCards cmsData={productCardsData} servicios={servicios} />

                                <section className="py-12 bg-card-fap border-y border-brand/50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container/30 -skew-x-12 transform translate-x-1/2"></div>
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                                            <CreditSimulator />
                                            <div className="lg:border-l lg:border-brand lg:pl-16">
                                                <BenefitsSection cmsData={benefitsData} />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <GallerySection cmsGallery={galleryData} />
                                <VideoSection cmsData={videoData} />
                                <TestimonialsSection cmsData={testimonialsData} />

                                {/* Inyectamos dinámicamente las noticias conservando la arquitectura estática */}
                                {latest_noticias && latest_noticias.length > 0 && (
                                    <LatestNewsBlock data={{ title: 'Últimas Novedades', noticias: latest_noticias }} />
                                )}

                                <FAQSection />
                            </Suspense>
                        </>
                    )}
                </main>
                <Footer settings={footer} />

                {whatsapp?.enabled !== false && (
                    <FloatingWhatsApp settings={whatsapp} />
                )}
                <ScrollToTop />
            </div>
        </>
    );
}
