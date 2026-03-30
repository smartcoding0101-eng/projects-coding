export default function TestimonialsSection() {
    return (
        <section className="py-12 bg-primary text-white relative overflow-hidden" id="testimonios">
            {/* Iluminación de fondo abstracta */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-sm font-bold tracking-widest text-secondary uppercase mb-3 drop-shadow-sm">Confianza que nos respalda</h2>
                    <h3 className="font-display text-4xl md:text-5xl font-bold">Voces de Nuestra Familia</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/20 relative shadow-2xl hover:bg-white/15 transition-all duration-300 group">
                        <svg className="absolute top-8 right-8 w-12 h-12 text-secondary/40 group-hover:scale-110 group-hover:text-secondary/60 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                        
                        <div className="flex text-secondary mb-6 drop-shadow-md">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            ))}
                        </div>
                        <p className="text-gray-100 italic mb-10 font-sans leading-relaxed text-lg min-h-[120px]">"Gracias a los créditos rápidos de Fapclas pude renovar mi hogar sin trámites burocráticos. La atención fue inmediata, el mismo día desembolsaron mi crédito."</p>
                        
                        <div className="flex items-center gap-4 relative z-10 border-t border-white/10 pt-6">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-14 h-14 rounded-full border-2 border-secondary shadow-lg object-cover" />
                            <div>
                                <h4 className="font-bold text-white text-lg tracking-tight">Sgto. Jorge Luis</h4>
                                <p className="text-xs text-secondary tracking-widest uppercase font-bold mt-1">La Paz, Bolivia</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 (Elevado para asimetría) */}
                    <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/20 relative shadow-2xl hover:bg-white/15 transition-all duration-300 transform md:-translate-y-6 group">
                         <svg className="absolute top-8 right-8 w-12 h-12 text-secondary/40 group-hover:scale-110 group-hover:text-secondary/60 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                        
                        <div className="flex text-secondary mb-6 drop-shadow-md">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            ))}
                        </div>
                        <p className="text-gray-100 italic mb-10 font-sans leading-relaxed text-lg min-h-[120px]">"La caja de ahorro me brinda una rentabilidad del 5% y la comodidad de consultar mi capital desde el celular. Totalmente recomendado para nuestra familia policial, son muy serios."</p>
                        
                        <div className="flex items-center gap-4 relative z-10 border-t border-white/10 pt-6">
                             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-14 h-14 rounded-full border-2 border-secondary shadow-lg object-cover" />
                            <div>
                                <h4 className="font-bold text-white text-lg tracking-tight">Sof. Carmen Rosa</h4>
                                <p className="text-xs text-secondary tracking-widest uppercase font-bold mt-1">Santa Cruz</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                     <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/20 relative shadow-2xl hover:bg-white/15 transition-all duration-300 group">
                         <svg className="absolute top-8 right-8 w-12 h-12 text-secondary/40 group-hover:scale-110 group-hover:text-secondary/60 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                        
                        <div className="flex text-secondary mb-6 drop-shadow-md">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            ))}
                        </div>
                        <p className="text-gray-100 italic mb-10 font-sans leading-relaxed text-lg min-h-[120px]">"Es un alivio contar con convenios con las empresas que usamos a diario. Sacar productos a cuotas por planillas desde la plataforma me parece algo espectacular."</p>
                        
                        <div className="flex items-center gap-4 relative z-10 border-t border-white/10 pt-6">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-14 h-14 rounded-full border-2 border-secondary shadow-lg object-cover" />
                            <div>
                                <h4 className="font-bold text-white text-lg tracking-tight">Sgto. My. Alberto C.</h4>
                                <p className="text-xs text-secondary tracking-widest uppercase font-bold mt-1">Cochabamba</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
