import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { motion } from 'framer-motion';

export default function Show({ servicio, whatsappSoporte }) {
    const { nombre, descripcion, imagen, detalles } = servicio;

    const whatsappUrl = `https://wa.me/${whatsappSoporte || '59170000000'}?text=${encodeURIComponent(`Hola, estoy interesado en el servicio de ${nombre}. ¿Podrían brindarme más información?`)}`;

    return (
        <>
            <Head title={`${nombre} - FAPCLAS R.L.`} />
            <div className="min-h-screen bg-surface font-sans antialiased text-on-surface">
                <Header />

                <main className="pt-20">
                    {/* Hero Section del Servicio */}
                    <section className="relative h-[350px] flex items-center overflow-hidden">
                        <div className="absolute inset-0">
                            <img 
                                src={imagen} 
                                alt={nombre} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/60 to-transparent"></div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="max-w-2xl text-white"
                            >
                                <Link 
                                    href="/" 
                                    className="inline-flex items-center gap-2 text-white/70 hover:text-secondary transition-colors text-sm font-bold uppercase tracking-widest mb-4"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                    Volver al Inicio
                                </Link>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 font-display leading-tight">
                                    {nombre}
                                </h1>
                                <p className="text-xl text-white/80 font-medium max-w-lg leading-relaxed">
                                    {descripcion}
                                </p>
                            </motion.div>
                        </div>
                    </section>

                    {/* Contenido Detallado */}
                    <section className="py-12 bg-surface">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid lg:grid-cols-3 gap-16">
                                
                                {/* Columna Izquierda: Información y Detalles */}
                                <div className="lg:col-span-2 space-y-12">
                                    <div>
                                        <h2 className="font-display text-3xl font-bold text-primary-dark mb-4 flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-secondary rounded-full"></div>
                                            ¿Qué ofrece nuestro servicio?
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {detalles.map((detalle, idx) => (
                                                <motion.div 
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    viewport={{ once: true }}
                                                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                    <p className="font-semibold text-gray-800 leading-snug">
                                                        {detalle}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Texto Adicional Estilo Senior */}
                                    <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
                                        <h3 className="font-display text-2xl font-bold text-primary-dark mb-4">Compromiso Institucional</h3>
                                        <p className="text-gray-600 leading-relaxed text-lg">
                                            En FAPCLAS R.L., entendemos que los servicios complementarios son fundamentales para la calidad de vida de nuestros socios. Por ello, garantizamos estándares de excelencia en cada una de nuestras unidades de negocio, ofreciendo tarifas preferenciales que cuidan su economía familiar.
                                        </p>
                                    </div>
                                </div>

                                {/* Columna Derecha: Sidebar de Acción */}
                                <div className="space-y-8">
                                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                        
                                        <h3 className="font-display text-2xl font-bold text-primary-dark mb-6 relative z-10">Solicitar Servicio</h3>
                                        
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-dark shrink-0">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Horario de Atención</p>
                                                    <p className="font-semibold text-gray-800">Lunes a Viernes: 08:30 - 18:30</p>
                                                    <p className="text-gray-500 text-sm">Sábados: 09:00 - 13:00</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-dark shrink-0">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Ubicación</p>
                                                    <p className="font-semibold text-gray-800">Sede Central FAPCLAS</p>
                                                    <p className="text-gray-500 text-sm">Av. 20 de Octubre esq. J.J. Pérez</p>
                                                </div>
                                            </div>

                                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.573-.187-.981-.342-1.713-.65-2.816-2.39-2.903-2.505-.087-.116-.694-.925-.694-1.765s.437-1.258.59-1.423c.153-.166.332-.208.442-.208s.221-.005.317-.005c.087 0 .208-.032.325.249.122.29.418 1.02.456 1.097.038.077.063.166.012.265-.05.099-.076.158-.152.247s-.152.188-.218.261c-.073.081-.151.17-.064.321.087.151.388.642.836 1.043.578.517 1.055.679 1.206.756.151.076.241.063.33-.038s.344-.403.438-.541c.094-.138.188-.115.326-.065.138.05 .876.413 1.027.489.151.076.251.114.288.177.037.062.037.359-.107.764z"/></svg>
                                                Consultar por WhatsApp
                                            </a>
                                        </div>
                                    </div>

                                    {/* Banner Secundario */}
                                    <div className="bg-secondary rounded-[2.5rem] p-8 text-primary-dark">
                                        <h4 className="font-display font-black text-xl mb-2 italic">¿Eres socio activo?</h4>
                                        <p className="text-sm font-medium opacity-80 mb-4">Pregunta por nuestros planes de financiamiento institucional para todos los servicios.</p>
                                        <Link href="/login" className="text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">Accede a tu portal →</Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
