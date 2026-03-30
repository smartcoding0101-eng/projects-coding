import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import FloatingWhatsApp from '../../Components/FloatingWhatsApp';
import { Calendar, Tag, ChevronLeft, Share2 } from 'lucide-react';

export default function NoticiaDetail({ noticia }) {
    return (
        <>
            <Head title={`${noticia.titulo} - FAPCLAS R.L.`} />
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface flex flex-col selection:bg-primary/20">
                <Header />
                
                <main className="pt-20 flex-grow">
                    {/* Hero Section for Article */}
                    <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                        <img 
                            src={noticia.imagen_path ? `/storage/${noticia.imagen_path}` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'} 
                            alt={noticia.titulo}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                            <div className="max-w-4xl mx-auto">
                                <Link 
                                    href={route('noticias.index')}
                                    className="inline-flex items-center text-primary font-bold mb-6 hover:underline group"
                                >
                                    <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                                    Volver a Noticias
                                </Link>
                                <div className="flex flex-wrap gap-4 mb-4">
                                    <span className="px-4 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                        {noticia.categoria}
                                    </span>
                                    <span className="flex items-center text-gray-500 text-sm font-medium">
                                        <Calendar className="mr-2" size={16} />
                                        {new Date(noticia.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <h1 className="font-display text-4xl md:text-6xl font-bold text-on-surface leading-tight">
                                    {noticia.titulo}
                                </h1>
                            </div>
                        </div>
                    </section>

                    {/* Article Content */}
                    <section className="py-12 md:py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-6 md:px-8">
                            {noticia.resumen && (
                                <div className="mb-12 p-8 bg-surface-container/30 rounded-3xl border-l-4 border-primary italic text-xl text-gray-600 leading-relaxed font-serif">
                                    {noticia.resumen}
                                </div>
                            )}

                            <div 
                                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-img:rounded-3xl prose-a:text-primary"
                                dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                            />

                            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compartir:</span>
                                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"><Share2 size={20} className="text-gray-500" /></button>
                                </div>
                                <Link 
                                    href={route('noticias.index')}
                                    className="px-8 py-3 rounded-full bg-gray-50 text-gray-600 font-bold hover:bg-primary/10 hover:text-primary transition-all"
                                >
                                    Más Noticias
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
                <FloatingWhatsApp />
            </div>
        </>
    );
}
