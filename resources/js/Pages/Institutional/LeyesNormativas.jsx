import { Head } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

export default function LeyesNormativas() {
    return (
        <>
            <Head title="Leyes y Normativas - FAPCLAS R.L." />
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface-container selection:bg-primary/20 flex flex-col">
                <Header />
                <main className="flex-grow pt-32 pb-24">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">Transparencia Activa Institucional</span>
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-4">Repositorio Normativo Boliviano</h1>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Regulados y respaldados oficialmente por el Estado Plurinacional de Bolivia para brindarte total seguridad técnica y financiera.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* LEY 393 ASFI */}
                            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all duration-300 group">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Fiscalización Estatal</span>
                                        <h3 className="font-display font-bold text-2xl text-on-surface">Ley de Servicios Financieros N° 393</h3>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-8 font-sans leading-relaxed text-base min-h-[100px]">
                                    Normativa soberana aprobada en 2013 que regula de forma estricta las actividades plenas de intermediación financiera. FAPCLAS acata irrevocablemente el cumplimiento de los reglamentos determinados por ASFI.
                                </p>
                                <button className="flex items-center gap-2 text-blue-600 font-bold hover:underline group-hover:gap-4 transition-all w-max px-6 py-2.5 bg-blue-50/50 rounded-full">
                                    Descargar Ley 393 PDF &darr;
                                </button>
                            </div>

                            {/* LEY 356 AFCOOP */}
                            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-300 group">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Supervisión Cooperativa</span>
                                        <h3 className="font-display font-bold text-2xl text-on-surface">Ley General de Cooperativas N° 356</h3>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-8 font-sans leading-relaxed text-base min-h-[100px]">
                                    Establece categóricamente el marco normativo vinculante para la constitución orgánica, funcionamiento asambleario y disolución del sector cooperativo bajo supervigilancia absoluta de AFCOOP.
                                </p>
                                <button className="flex items-center gap-2 text-emerald-600 font-bold hover:underline group-hover:gap-4 transition-all w-max px-6 py-2.5 bg-emerald-50/50 rounded-full">
                                    Descargar Ley 356 PDF &darr;
                                </button>
                            </div>

                            {/* ESTATUTO */}
                            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(85,107,47,0.15)] transition-all duration-300 group">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Gobernanza Interna</span>
                                        <h3 className="font-display font-bold text-2xl text-on-surface">Estatuto Orgánico Vigente</h3>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-8 font-sans leading-relaxed text-base min-h-[80px]">
                                    Nuestro instrumento regidor interno supremo que define simétricamente los derechos irrenunciables, obligaciones institucionales y regímenes jerárquicos de beneficio para nuestros socios.
                                </p>
                                <button className="flex items-center gap-2 text-primary font-bold hover:underline group-hover:gap-4 transition-all w-max px-6 py-2.5 bg-primary/10 rounded-full">
                                    Ver Documento en Linea &rarr;
                                </button>
                            </div>
                            
                            {/* PRF */}
                            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(255,215,0,0.15)] transition-all duration-300 group">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 bg-secondary/15 rounded-2xl flex items-center justify-center text-secondary-dark group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Protección al Socio</span>
                                        <h3 className="font-display font-bold text-2xl text-on-surface">Punto de Reclamo (PRF)</h3>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-8 font-sans leading-relaxed text-base min-h-[80px]">
                                    ¿Tienes una consulta técnica o necesitas presentar tu disconformidad sobre los servicios? Accede al registro oficial PRF, respaldado inquebrantablemente por lineamientos de protección ASFI.
                                </p>
                                <button className="flex items-center gap-2 text-secondary-dark font-bold hover:underline group-hover:gap-4 transition-all w-max px-6 py-2.5 bg-secondary/10 rounded-full">
                                    Formulario Electrónico &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
