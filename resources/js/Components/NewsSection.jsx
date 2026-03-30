import React from 'react';
import { Link } from '@inertiajs/react';

export default function NewsSection({ news = [] }) {
    // If no news are passed, we show nothing or a message (could also keep fallbacks)
    if (news.length === 0) {
        return (
            <div className="py-24 text-center">
                <p className="text-gray-500">No hay noticias publicadas en este momento.</p>
            </div>
        );
    }

    const getColorClasses = (color) => {
        const colors = {
            blue: "bg-blue-100 text-blue-700",
            emerald: "bg-emerald-100 text-emerald-700",
            primary: "bg-primary/20 text-primary-dark",
            gold: "bg-amber-100 text-amber-700",
            green: "bg-green-100 text-green-700",
        };
        return colors[color] || colors.primary;
    };

    return (
        <section className="py-24 bg-white relative border-t border-gray-100" id="noticias">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-50/80 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="uppercase font-bold text-xs tracking-widest text-primary block mb-3">Actualidad y Transparencia</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-6">Últimas Noticias</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Mantente informado sobre los avances institucionales, nuevos convenios y campañas financieras de tu cooperativa.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <article 
                            key={item.id || index}
                            className="bg-surface-container rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-2 group flex flex-col h-full"
                        >
                            {/* Image Header */}
                            <div className="relative h-56 overflow-hidden">
                                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                <img 
                                    src={item.imagen_path ? `/storage/${item.imagen_path}` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'} 
                                    alt={item.titulo} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getColorClasses(item.color_accent)} backdrop-blur-md`}>
                                        {item.categoria}
                                    </span>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-8 flex flex-col flex-1 relative bg-white">
                                <div className="flex items-center text-sm text-gray-400 mb-4 font-sans font-medium">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {new Date(item.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                                
                                <h3 className="font-display font-bold text-2xl text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {item.titulo}
                                </h3>
                                
                                <p className="text-gray-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {item.resumen}
                                </p>
                                
                                <Link 
                                    href={route('noticias.show', item.slug)} 
                                    className="inline-flex items-center font-bold text-primary hover:text-primary-dark transition-colors group/link mt-auto w-max"
                                >
                                    Visualizar Nota Completa
                                    <svg className="w-5 h-5 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href={route('noticias.index')} className="inline-block px-8 py-4 rounded-full border-2 border-gray-200 text-gray-600 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300">
                        Ver Repositorio Histórico
                    </Link>
                </div>
            </div>
        </section>
    );
}
