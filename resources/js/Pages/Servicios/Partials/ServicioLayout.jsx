import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { motion } from 'framer-motion';

export default function ServicioLayout({ servicio, whatsappSoporte, children }) {
    const { nombre, descripcion, imagen, secciones } = servicio;

    const whatsappUrl = `https://wa.me/${whatsappSoporte || '59170000000'}?text=${encodeURIComponent(`Hola, estoy interesado en el servicio de ${nombre}. ¿Podrían brindarme más información?`)}`;

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-black">
            <Head title={`${nombre} - FAPCLAS R.L.`} />
            <Header />

            <main className="pt-20">
                {/* HERO SECTION STANDARDIZED */}
                <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                    <motion.div 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={imagen} 
                            alt={nombre} 
                            className="w-full h-full object-cover"
                        />
                        {/* Sutil overlay para legibilidad sin ser neblina */}
                        <div className="absolute inset-0 bg-black/40"></div>
                    </motion.div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4 leading-none drop-shadow-2xl">
                                {nombre.split(' ')[0]} <br />
                                <span className="text-secondary italic">{nombre.split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 font-medium drop-shadow-lg leading-relaxed">
                                {descripcion}
                            </p>
                            
                            <div className="flex justify-center gap-6">
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary hover:bg-white text-primary-dark px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center gap-3 group">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.573-.187-.981-.342-1.713-.65-2.816-2.39-2.903-2.505-.087-.116-.694-.925-.694-1.765s.437-1.258.59-1.423c.153-.166.332-.208.442-.208s.221-.005.317-.005c.087 0 .208-.032.325.249.122.29.418 1.02.456 1.097.038.077.063.166.012.265-.05.099-.076.158-.152.247s-.152.188-.218.261c-.073.081-.151.17-.064.321.087.151.388.642.836 1.043.578.517 1.055.679 1.206.756.151.076.241.063.33-.038s.344-.403.438-.541c.094-.138.188-.115.326-.065.138.05 .876.413 1.027.489.151.076.251.114.288.177.037.062.037.359-.107.764z"/></svg>
                                    Contactar por WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Decorative Scroll indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
                             <motion.div 
                                animate={{ y: [0, 12, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-1 h-2 bg-white rounded-full"
                             />
                        </div>
                    </div>
                </section>

                {/* CONTENT FLOW - NO CARDS, Z-PATTERN */}
                <div className="py-10">
                    {secciones.map((sec, i) => (
                        <section key={i} className={`py-12 ${i % 2 !== 0 ? 'bg-primary/5' : 'bg-white'}`}>
                            <div className="max-w-7xl mx-auto px-4">
                                <div className={`flex flex-col md:flex-row items-center gap-20 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="flex-1">
                                        <motion.div
                                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <h2 className="text-5xl font-black text-black mb-4 leading-tight tracking-tighter">
                                                {sec.titulo}
                                            </h2>
                                            <p className="text-xl text-gray-500 mb-6 leading-relaxed font-medium">
                                                {sec.contenido}
                                            </p>
                                            <ul className="space-y-4">
                                                {sec.items?.map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-4 text-lg font-bold text-primary-dark">
                                                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            className="relative"
                                        >
                                            <img 
                                                src={sec.imagenGrid || imagen} 
                                                alt={sec.titulo} 
                                                className="w-full h-[500px] object-cover rounded-[4rem] shadow-2xl"
                                            />
                                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* FINAL CALL TO ACTION STANDARDIZED */}
                <section className="py-20 bg-primary-dark text-white text-center overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 grayscale pointer-events-none">
                        <img src={imagen} alt="Final" className="w-full h-full object-cover" />
                    </div>
                    <div className="max-w-3xl mx-auto px-4 relative z-10">
                        <h3 className="text-5xl font-black mb-10 tracking-tighter">¿Listo para aprovechar este beneficio institucional?</h3>
                        <p className="text-xl text-white/60 mb-12">Estamos a un mensaje de distancia para asesorarte en lo que necesites.</p>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-secondary text-primary-dark px-16 py-6 rounded-3xl font-black text-xl hover:bg-white transition-all shadow-2xl shadow-secondary/10">
                            Chatear con un Asesor
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
