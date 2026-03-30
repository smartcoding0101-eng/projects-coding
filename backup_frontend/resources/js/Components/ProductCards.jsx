export default function ProductCards() {
    return (
        <section className="py-24 bg-surface relative overflow-hidden" id="ahorro">
            {/* Background Abstract Glow */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Nuestros Servicios Financieros</h2>
                    <h3 className="font-display text-4xl md:text-5xl font-bold text-on-surface">Impulsa tu Futuro Económico</h3>
                </div>
                
                {/* Bento Box Layout */}
                <div className="grid md:grid-cols-12 gap-6">
                    
                    {/* Tarjeta Principal: Caja de Ahorro (Colspan 7 max-w) */}
                    <div className="group md:col-span-7 relative bg-white/60 backdrop-blur-xl rounded-3xl p-10 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(85,107,47,0.1)] transition-all duration-500 overflow-hidden flex flex-col justify-between">
                        {/* 3D Object Illusion */}
                        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-500"></div>
                        <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500 transform translate-x-4 translate-y-4">
                            <svg className="w-48 h-48 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-8 shadow-sm border border-gray-100">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="font-display text-4xl font-bold mb-4 text-on-surface">Caja de Ahorro <span className="text-primary block text-2xl mt-2">Rentabilidad 5%</span></h4>
                            <p className="text-gray-500 mb-8 max-w-md font-sans text-lg leading-relaxed">
                                Haz crecer tu dinero de forma inteligente. Seguridad absoluta para el futuro de la familia policial, garantizando crecimiento estable.
                            </p>
                            <button className="bg-primary text-white font-bold px-8 py-3 rounded-xl flex items-center gap-3 hover:bg-primary-dark transition-all hover:gap-5 w-max">
                                Simular Ahorro <span>&rarr;</span>
                            </button>
                        </div>
                    </div>

                    {/* Tarjeta Secundaria: Créditos (Colspan 5) */}
                    <div className="group md:col-span-5 relative bg-primary text-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(85,107,47,0.2)] hover:shadow-[0_20px_40px_rgba(85,107,47,0.4)] transition-all duration-500 overflow-hidden flex flex-col justify-between" id="creditos">
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-transparent"></div>
                        <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                             <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10h3v7H4zM10.5 10h3v7h-3zM2 19h20v3H2zM17 10h3v7h-3zM12 1L2 6v2h20V6z"/></svg>
                        </div>

                        <div className="relative z-10 w-full h-full flex flex-col">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-secondary mb-8 border border-white/20">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </div>
                            <h4 className="font-display text-3xl font-bold mb-4">Créditos Rápidos</h4>
                            <p className="text-gray-200 mb-8 font-sans leading-relaxed flex-grow">
                                Soluciones inmediatas para consolidar deudas, refaccionar viviendas, o emergencias con tasas de tratamiento preferencial.
                            </p>
                            
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 flex items-center justify-between group-hover:bg-white text-white group-hover:text-primary transition-colors cursor-pointer">
                                <span className="font-bold">Solicitar Ahora</span>
                                <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-primary/10 flex items-center justify-center">
                                    <span className="font-bold">&rarr;</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
