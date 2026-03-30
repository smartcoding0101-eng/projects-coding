import { Head } from '@inertiajs/react';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';
import ProductCards from '../Components/ProductCards';
import CreditSimulator from '../Components/CreditSimulator';
import BenefitsSection from '../Components/BenefitsSection';
import RatesBoard from '../Components/RatesBoard';
import InstitutionalSection from '../Components/InstitutionalSection';
import GallerySection from '../Components/GallerySection';
import VideoSection from '../Components/VideoSection';
import TestimonialsSection from '../Components/TestimonialsSection';
import FAQSection from '../Components/FAQSection';
import Footer from '../Components/Footer';
import FloatingWhatsApp from '../Components/FloatingWhatsApp';

export default function Welcome() {
    return (
        <>
            <Head title="FAPCLAS R.L. - Tu Futuro Seguro" />
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface selection:bg-primary/20">
                <Header />

                <main className="pt-20">
                    <HeroSection />
                    <ProductCards />
                    <CreditSimulator />
                    <BenefitsSection />
                    <RatesBoard />
                    <InstitutionalSection />
                    <GallerySection />
                    <VideoSection />
                    <TestimonialsSection />
                    <FAQSection />
                </main>
                <Footer />
                
                {/* Herramienta Global Permanente */}
                <FloatingWhatsApp />
            </div>
        </>
    );
}
