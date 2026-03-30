export default function BenefitsSection() {
    return (
        <section className="py-24 bg-surface-container overflow-hidden" id="beneficios">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
               <div className="text-center mb-16 relative z-10">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Tu Ecosistema</h2>
                    <h3 className="font-display text-4xl md:text-5xl font-bold text-on-surface">Beneficios Exclusivos</h3>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">Integrados directamente a tu perfil como socio de FAPCLAS R.L. Convenios efectivos sin trámites pesados.</p>
                </div>

                {/* Panel Interactivo Digital */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col md:flex-row gap-12 items-center relative z-10 group">
                    <div className="flex-1 space-y-4 w-full">
                        {/* Tab 1 */}
                        <div className="flex gap-6 p-6 rounded-2xl bg-surface/50 hover:bg-surface hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-gray-100/80">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-display text-2xl font-bold mb-2 text-on-surface">Tienda Virtual Integrada</h4>
                                <p className="text-gray-500 font-sans">Adquiere en cuotas con descuento automático por planilla. Sin aprobaciones lentas.</p>
                                <a href="http://www.controlfacilito.com/tienda.html?i=1999&t=COOP._FAPCLAS%20R.L" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-primary font-bold hover:underline">Ver Tienda &rarr;</a>
                            </div>
                        </div>

                        {/* Tab 2 */}
                        <div className="flex gap-6 p-6 rounded-2xl bg-white hover:bg-surface hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-gray-100/80">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-display text-2xl font-bold mb-2 text-on-surface">Servicios Premium</h4>
                                <p className="text-gray-500 font-sans">Lavandería Ronalyto (Limpieza ejecutiva de uniformes) y Torbordados (identidad visual) asegurados para ti.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Visual Mockup Dashboard Area */}
                    <div className="flex-1 w-full bg-surface-container rounded-[2rem] p-8 relative overflow-hidden h-[400px] flex items-center justify-center border border-gray-100">
                        {/* Decorative background circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] transform translate-x-1/4 -translate-y-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] transform -translate-x-1/4 translate-y-1/4"></div>
                        
                        {/* Fake Mobile UI Panel */}
                        <div className="relative z-10 w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-700">
                            <div className="bg-white/90 p-5 border-b border-gray-100/50 flex items-center justify-between">
                                <span className="font-bold text-sm text-gray-400 uppercase tracking-widest">Aprobación Rápida</span>
                                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                                <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
                                <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full"></div>
                                    <div className="bg-primary text-white px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg shadow-primary/30">Activar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Infinite Marquee Alternative (Logos/Nombres de convenios) */}
                <div className="mt-20 flex flex-wrap justify-center gap-12 items-center opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700">
                    <span className="font-display text-2xl font-bold text-on-surface transition-colors cursor-pointer">Ronalyto Limpieza</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                    <span className="font-display text-2xl font-bold text-on-surface transition-colors cursor-pointer">Control Fácilito</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                    <span className="font-display text-2xl font-bold text-on-surface transition-colors cursor-pointer">Torbordados</span>
                </div>
            </div>
        </section>
    );
}
