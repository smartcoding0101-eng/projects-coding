export default function VideoSection() {
    return (
        <section className="py-24 bg-surface-container overflow-hidden relative" id="videos">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 items-end justify-between mb-12 relative z-10">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Conoce Nuestra Historia</h2>
                        <h3 className="font-display text-4xl font-bold text-on-surface">Fapclas en Movimiento</h3>
                    </div>
                    <button className="hidden md:flex items-center gap-2 border border-gray-300 px-6 py-2.5 rounded-full hover:border-primary hover:text-primary transition-colors font-bold text-gray-500">
                        Ver más videos <span className="text-xl">&rarr;</span>
                    </button>
                </div>
                
                 <div className="relative rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl group border border-gray-200/50 transform hover:-translate-y-2 transition-transform duration-700 relative z-10">
                    <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Video Promocional Fapclas" className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                        {/* Botón de reproducción Glassmorphism */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 hover:scale-110 transition-all border border-white/50 shadow-[0_0_50px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_80px_rgba(255,255,255,0.4)]">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white ml-2 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                    {/* Badge interactivo superpuesto */}
                    <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 hidden sm:block">
                        <span className="text-primary text-xs font-bold tracking-widest uppercase block mb-1">Spot Institucional</span>
                        <span className="text-on-surface font-display font-bold text-xl">¿Qué significa ser Fapclas?</span>
                    </div>
                 </div>

                 {/* Galería Secundaria de Videos (3 columnas alineadas al ancho del principal) */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 relative z-10 w-full">
                     {[
                         { title: "Campaña de Créditos Solidarios", sub: "Beneficios 2026", img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80" },
                         { title: "Testimonio Socio Activo Oficial", sub: "La Paz, Bolivia", img: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=800&q=80" },
                         { title: "Tutorial Plataforma Digital ERP", sub: "Educación Financiera", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" }
                     ].map((video, idx) => (
                         <div key={idx} className="relative rounded-3xl overflow-hidden aspect-video shadow-md hover:shadow-xl group border border-gray-100 transform hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                             <img src={video.img} alt={video.title} className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000" />
                             
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500 flex items-center justify-center">
                                 {/* Botón Play Mini Glassmorphism */}
                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 hover:scale-110 transition-all border border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                     <svg className="w-5 h-5 text-white ml-1 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                 </div>
                             </div>

                             {/* Capa de Información Título Oculta Reveal en Hover */}
                             <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-5 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                 <span className="text-secondary tracking-widest uppercase block mb-1 font-bold text-[9px] drop-shadow-md">{video.sub}</span>
                                 <span className="text-white font-display font-medium text-xs md:text-sm drop-shadow-lg block leading-tight">{video.title}</span>
                             </div>
                         </div>
                     ))}
                 </div>

                 {/* Botón flotante móvil */}
                 <div className="mt-8 flex justify-center md:hidden">
                     <button className="flex items-center gap-2 border border-gray-300 px-6 py-2.5 rounded-full text-on-surface font-bold">
                        Ver más videos <span className="text-xl">&rarr;</span>
                    </button>
                 </div>
            </div>
        </section>
    );
}
