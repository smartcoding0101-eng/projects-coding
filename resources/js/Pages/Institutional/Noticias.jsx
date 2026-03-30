import { Head } from '@inertiajs/react';
import Header from '../../Components/Header';
import NewsSection from '../../Components/NewsSection';
import Footer from '../../Components/Footer';
import FloatingWhatsApp from '../../Components/FloatingWhatsApp';

export default function Noticias({ noticias = [] }) {
    return (
        <>
            <Head title="Últimas Noticias - FAPCLAS R.L." />
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface flex flex-col selection:bg-primary/20">
                <Header />
                <main className="pt-20 flex-grow">
                    <NewsSection news={noticias} />
                </main>
                <Footer />
                <FloatingWhatsApp />
            </div>
        </>
    );
}
