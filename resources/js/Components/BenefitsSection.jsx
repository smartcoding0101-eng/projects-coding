export default function BenefitsSection() {
    const benefits = [
        {
            title: "Patrimonio Seguro",
            desc: "Aportes protegidos por activos reales y auditorías constantes.",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        },
        {
            title: "Tienda Digital",
            desc: "Crédito inmediato en tecnología y hogar por planilla.",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
            link: "http://www.controlfacilito.com/tienda.html?i=1999&t=COOP._FAPCLAS%20R.L"
        },
        {
            title: "Red de Bienestar",
            desc: "Salud, lavandería y bordados con tarifas preferenciales.",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        },
        {
            title: "Retorno Social",
            desc: "Distribución anual de excedentes por antigüedad.",
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        }
    ];

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="text-left mb-10">
                <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full mb-4">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary-dark">Ecosistema Institucional</span>
                </div>
                <h2 className="font-display text-3xl font-black text-on-surface tracking-tight leading-none mb-2">
                    Beneficios <span className="text-secondary italic">Exclusivos</span>
                </h2>
                <p className="text-gray-400 text-xs font-medium">Más allá del crédito, somos tu respaldo integral.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-6 overflow-hidden transition-all hover:shadow-xl group">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((b, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-surface/50 border border-transparent hover:border-gray-100 transition-all hover:bg-white">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                                {b.icon}
                            </div>
                            <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider mb-1">{b.title}</h4>
                            <p className="text-[10px] leading-relaxed text-gray-500 font-medium">{b.desc}</p>
                            {b.link && (
                                <a href={b.link} target="_blank" className="text-[9px] text-primary font-black uppercase mt-2 inline-block hover:underline">Acceso Directo &rarr;</a>
                            )}
                        </div>
                    ))}
                </div>

                {/* Interactive Status Bar (Visual Eye Candy) */}
                <div className="mt-2 bg-primary-dark rounded-2xl p-5 flex items-center justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Estado de Afiliación</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                            <span className="text-xs font-bold font-display uppercase tracking-widest">Socio Activo</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-secondary uppercase">Fapclas ERP v3</div>
                        <div className="text-[8px] text-white/30 font-bold uppercase">Acceso Protegido</div>
                    </div>
                </div>
            </div>
            
            <p className="text-[9px] text-black font-bold mt-6 leading-relaxed italic max-w-sm">
                * Todos los beneficios están sujetos al cumplimiento de los estatutos vigentes de FAPCLAS R.L.
            </p>
        </div>
    );
}
