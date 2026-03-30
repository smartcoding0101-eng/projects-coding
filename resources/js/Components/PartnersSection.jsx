export default function PartnersSection() {
    const partners = [
        {
            name: "Ronalyto Limpieza",
            description: "Mantenimiento y limpieza industrial de alta calidad.",
            icon: (
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 6l7 7-4 4-7-7M5 10l-2 2c-.8.8-.8 2 0 2.8l2.2 2.2c.8.8 2 .8 2.8 0l2-2m-5-5l5 5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 15l-3 3" />
                </svg>
            )
        },
        {
            name: "Control Fácilito",
            description: "Soluciones de software contable y gestión empresarial.",
            icon: (
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
            )
        },
        {
            name: "Torbordados",
            description: "Confección y bordados corporativos de precisión.",
            icon: (
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 15.536c-1.171 1.952-3.07 1.096-4.242 0A5.962 5.962 0 017 11.293M14.121 15.536l3.535-3.536a2.5 2.5 0 10-3.535-3.535l-3.536 3.535" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21l6-6" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-20 bg-gray-50/50 backdrop-blur-sm relative border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-12">
                    <span className="uppercase font-bold text-xs tracking-widest text-primary block mb-2">Red de Confianza</span>
                    <h2 className="font-display text-3xl font-bold text-on-surface">Empresas en Convenio</h2>
                    <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full opacity-50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                    {partners.map((partner, index) => (
                        <div 
                            key={index} 
                            className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                        >
                            {/* Hover effect background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Icon Container */}
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-inner">
                                {partner.icon}
                            </div>
                            
                            <h3 className="font-display font-bold text-xl text-gray-800 mb-3 relative z-10 group-hover:text-primary transition-colors">
                                {partner.name}
                            </h3>
                            
                            <p className="text-gray-500 text-sm leading-relaxed relative z-10">
                                {partner.description}
                            </p>

                            {/* Decorative dot */}
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-6 group-hover:bg-primary transition-colors duration-300 relative z-10"></div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
