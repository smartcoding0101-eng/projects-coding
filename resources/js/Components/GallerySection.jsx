export default function GallerySection() {
    return (
        <section className="py-12 bg-white" id="galeria">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Transparencia y Acción</h2>
                    <h3 className="font-display text-4xl font-bold text-on-surface">Nuestra Familia en Imágenes</h3>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">Resultados tangibles, infraestructura moderna y los momentos que definen nuestra vocación de servicio.</p>
                </div>
                
                {/* CSS Grid for Masonry-like look */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                        <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Asambleas Generales" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                            <h4 className="text-white font-display font-bold text-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Asambleas Generales</h4>
                        </div>
                    </div>
                    
                    <div className="md:col-span-1 md:row-span-1 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                         <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Atención Cooperativa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <h4 className="text-white font-bold text-lg">Atención al Socio</h4>
                        </div>
                    </div>
                    
                    <div className="md:col-span-1 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                        <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Responsabilidad Social" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                            <h4 className="text-white font-display font-bold text-2xl">Responsabilidad Social</h4>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white cursor-pointer hover:bg-white/40 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </div>
                    </div>
                    
                    <div className="md:col-span-1 md:row-span-1 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                         <img src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Crecimiento Institucional" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <h4 className="text-white font-bold text-lg">Eventos Sociales</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
