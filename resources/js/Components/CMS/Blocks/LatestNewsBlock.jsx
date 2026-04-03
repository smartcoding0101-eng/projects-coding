import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Tag } from 'lucide-react';

const LatestNewsBlock = ({ data }) => {
    const { title = 'Últimas Noticias', subtitle, noticias = [] } = data;

    if (!noticias || noticias.length === 0) {
        return null;
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const featured = noticias[0];
    const rest = noticias.slice(1, 4);

    return (
        <section className="py-16 bg-surface relative overflow-hidden" id="noticias">
            {/* Background */}
            <div className="absolute top-0 left-0 -mt-20 -ml-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">
                            Noticias
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-black text-on-surface tracking-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-3 text-gray-500 text-lg max-w-xl">{subtitle}</p>
                        )}
                    </div>
                    <Link
                        href="/noticias"
                        className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all shrink-0"
                    >
                        Ver todas las noticias
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Featured */}
                    {featured && (
                        <Link
                            href={`/noticias/${featured.slug}`}
                            className="lg:col-span-3 group block bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                        >
                            {featured.imagen && (
                                <div className="h-64 overflow-hidden">
                                    <img
                                        src={`/storage/${featured.imagen_path}`}
                                        alt={featured.titulo}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            )}
                            {!featured.imagen && (
                                <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                    <span className="text-6xl">📰</span>
                                </div>
                            )}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(featured.created_at)}
                                    </span>
                                    {featured.categoria && (
                                        <span className="flex items-center gap-1.5">
                                            <Tag className="w-4 h-4" />
                                            {featured.categoria}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-display text-2xl font-black text-on-surface group-hover:text-primary transition-colors mb-3 leading-snug">
                                    {featured.titulo}
                                </h3>
                                {featured.resumen && (
                                    <p className="text-gray-500 leading-relaxed line-clamp-3">{featured.resumen}</p>
                                )}
                            </div>
                        </Link>
                    )}

                    {/* Side list */}
                    {rest.length > 0 && (
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            {rest.map((noticia, idx) => (
                                <Link
                                    key={idx}
                                    href={`/noticias/${noticia.slug}`}
                                    className="group flex gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {noticia.imagen_path ? (
                                        <img
                                            src={`/storage/${noticia.imagen_path}`}
                                            alt={noticia.titulo}
                                            className="w-20 h-20 rounded-xl object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-2xl">
                                            📰
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(noticia.created_at)}
                                        </p>
                                        <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors text-sm leading-snug line-clamp-2">
                                            {noticia.titulo}
                                        </h4>
                                    </div>
                                </Link>
                            ))}

                            <Link
                                href="/noticias"
                                className="mt-auto flex items-center justify-center gap-2 border-2 border-primary/20 text-primary font-bold py-4 rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all text-sm"
                            >
                                Ver todas las noticias
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LatestNewsBlock;
