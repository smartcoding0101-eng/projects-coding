import { Head } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

export default function MisionVision() {
    return (
        <>
            <Head title="Misión y Visión - FAPCLAS R.L." />
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface selection:bg-primary/20 flex flex-col">
                <Header />
                <main className="flex-grow pt-32 pb-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">Nuestra Identidad</span>
                            <h1 className="font-display text-5xl font-bold text-primary-dark mb-4 drop-shadow-sm">Misión y Visión</h1>
                            <p className="text-xl text-brand-muted max-w-2xl mx-auto">El horizonte corporativo que guía nuestro servicio, compromiso y acción económica con la familia policial boliviana.</p>
                        </div>
                        <div className="space-y-12">
                            <div className="bg-card-fap rounded-[2rem] p-10 md:p-14 border border-brand shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-bl-full group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                                    </div>
                                    <h2 className="font-display text-4xl font-bold text-primary">Nuestra Misión</h2>
                                </div>
                                <p className="text-xl text-gray-600 leading-relaxed relative z-10 font-sans">
                                    Brindar servicios financieros con calidad, calidez y estricta eficiencia, desarrollando estrategias y soluciones modernas para asegurar la estabilidad económica de nuestros socios, con un alcance nacional y un ecosistema diseñado exclusivamente al servicio de la familia policial boliviana.
                                </p>
                            </div>
                            
                            <div className="bg-card-fap rounded-[2rem] p-10 md:p-14 border border-brand shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-bl-full group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center text-primary-dark">
                                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <h2 className="font-display text-4xl font-bold text-primary-dark">Nuestra Visión</h2>
                                </div>
                                <p className="text-xl text-gray-600 leading-relaxed relative z-10 font-sans">
                                    Convertirnos en la Entidad Solidaria líder en atención y soluciones sumamente competitivas, que garantice estabilidad, seguridad técnica absoluta y solvencia, enfocados directamente en proyectar siempre la mejora en la calidad de vida de nuestra comunidad de socios a través de la responsabilidad social.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
