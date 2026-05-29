import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FloatingWhatsApp from '../../Components/FloatingWhatsApp';
import ScrollToTop from '../../Components/ScrollToTop';
import ToastContainer from '../../Components/ToastContainer';
import { Calendar, Tag, ChevronLeft, Share2 } from 'lucide-react';

export default function NoticiaDetail({ noticia }) {
    return (
        <>
            <Head>
                <title>{`${noticia.titulo} - FAPCLAS R.L.`}</title>
                <meta name="description" content={noticia.resumen || noticia.titulo} />
                {noticia.imagen_path && <meta property="og:image" content={`/storage/${noticia.imagen_path}`} />}
                <meta property="og:title" content={`${noticia.titulo} - FAPCLAS R.L.`} />
            </Head>
            <div className="min-h-screen font-sans antialiased text-brand-main bg-main flex flex-col selection:bg-primary/20">
                <Header />

                <main className="pt-20 flex-grow">
                    {/* Hero Section for Article */}
                    <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                        <img
                            src={noticia.imagen_path ? `/storage/${noticia.imagen_path}` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'}
                            alt={noticia.titulo}
                            className="w-full h-full object-cover"
                        />
                        {/* Elite Monolith Dark Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-fapclas-950 via-fapclas-950/60 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                            <div className="max-w-4xl mx-auto">
                                <Link
                                    href={route('noticias.index')}
                                    className="inline-flex items-center text-white/80 font-bold mb-6 hover:text-white hover:underline group transition-colors"
                                >
                                    <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                                    Volver a Noticias
                                </Link>
                                <div className="flex flex-wrap gap-4 mb-5">
                                    <span className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg border border-white/20">
                                        {noticia.categoria}
                                    </span>
                                    <span className="flex items-center text-gray-300 text-sm font-medium drop-shadow-md">
                                        <Calendar className="mr-2 opacity-80" size={16} />
                                        {new Date(noticia.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl">
                                    {noticia.titulo}
                                </h1>
                            </div>
                        </div>
                    </section>

                    {/* Article Content */}
                    <section className="py-16 md:py-24 bg-card-fap">
                        <div className="max-w-4xl mx-auto px-6 md:px-8">
                            {noticia.resumen && (
                                <div className="mb-12 p-8 md:p-10 bg-primary/5 rounded-2xl border-l-4 border-primary text-xl md:text-2xl text-brand-main leading-relaxed font-serif shadow-sm">
                                    <p className="italic">{noticia.resumen}</p>
                                </div>
                            )}

                            <div
                                className="prose prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-black prose-headings:text-brand-main prose-p:text-brand-muted prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-xl prose-a:text-primary prose-a:font-bold prose-strong:text-brand-main prose-li:text-brand-muted prose-blockquote:border-primary prose-blockquote:bg-main prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl"
                                dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                            />

                            <div className="mt-20 pt-10 border-t border-brand flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-brand-muted uppercase tracking-widest">Compartir artículo:</span>
                                    <button className="p-3 rounded-full bg-main border border-brand hover:bg-primary hover:text-white transition-all shadow-sm text-brand-muted">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                                <Link
                                    href={route('noticias.index')}
                                    className="w-full sm:w-auto text-center px-10 py-4 rounded-2xl bg-main border border-brand text-brand-main font-bold hover:bg-primary hover:text-white transition-all shadow-sm uppercase tracking-wider text-sm whitespace-nowrap"
                                >
                                    Ir al Índice de Noticias
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
                <FloatingWhatsApp />
                <ScrollToTop />
                <ToastContainer />
            </div>
        </>
    );
}
