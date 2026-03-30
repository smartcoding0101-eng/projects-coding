export default function InstitutionalSection() {
    return (
        <section className="py-24 bg-surface" id="institucional">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Texto y Biografía */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3 flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            Nuestra Identidad
                        </h2>
                        <h3 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-8">
                            Nacimos para Crecer, Servir y Transformar
                        </h3>
                        <p className="text-gray-600 mb-8 font-sans leading-relaxed text-lg text-justify">
                            Queridos socios y miembros de la familia policial boliviana, es un honor ser el sustento económico que respalda cada jornada de servicio. La transparencia, ayuda mutua y solidaridad no son solo ideales, sino el pilar en nuestra cooperativa.
                        </p>
                        
                        {/* Interactive Accordion-style Panels */}
                        <div className="space-y-4">
                            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex gap-4 items-center">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-on-surface text-xl">Misión Tecnológica y Social</h4>
                                        <p className="text-gray-500 text-sm mt-1">Garantizar estabilidad económica mediante sistemas modernos con alcance nacional.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex gap-4 items-center">
                                    <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center text-primary-dark group-hover:bg-secondary group-hover:text-primary-dark transition-colors shrink-0">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-on-surface text-xl">Visión de Liderazgo</h4>
                                        <p className="text-gray-500 text-sm mt-1">Ser absolutos referentes de solvencia y atención competitiva en el mercado de cooperativas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Masonry Image Gallery */}
                    <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-[600px] relative">
                        {/* Central Confianza Badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl text-center border border-white border-t-4 border-t-primary w-48">
                            <span className="block font-display text-4xl font-bold text-primary mb-1">+5,000</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Socios Activos</span>
                        </div>

                        {/* Top Left Tall Image */}
                        <div className="col-span-1 rounded-3xl overflow-hidden mt-8 shadow-lg group relative">
                            <img src="https://images.unsplash.com/photo-1541888031534-110034a78107?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Oficinas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        
                        {/* Top Right Short Image */}
                        <div className="col-span-1 grid grid-rows-2 gap-4">
                            <div className="rounded-3xl overflow-hidden shadow-lg group relative">
                                <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Atención" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            {/* Bottom Right Short Image */}
                            <div className="rounded-3xl overflow-hidden shadow-lg group relative bg-primary flex items-center justify-center p-8">
                                <div className="text-center text-white">
                                    <h4 className="font-display font-bold text-2xl mb-2">Familia Única</h4>
                                    <p className="text-sm opacity-80">El futuro se construye juntos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}
