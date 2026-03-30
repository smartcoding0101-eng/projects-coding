import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

function Counter({ from, to, duration = 5 }) {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            const controls = animate(count, to, { duration, ease: "easeOut" });
            return controls.stop;
        }
    }, [inView, to, count, duration]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
}

const IdentityBlock = ({ data }) => {
    const { title, description, mission, vision, counter_value, counter_label, images } = data;

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `/storage/${img}`;
    };

    return (
        <section className="py-12 bg-surface" id="institucional">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3 flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            Nuestra Identidad
                        </h2>
                        <h3 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-8">
                            {title || 'Nacimos para Crecer, Servir y Transformar'}
                        </h3>
                        {description && (
                            <p className="text-gray-600 mb-8 font-sans leading-relaxed text-lg text-justify">
                                {description}
                            </p>
                        )}

                        <div className="space-y-4">
                            {mission && (
                                <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-on-surface text-xl">Misión Tecnológica y Social</h4>
                                            <p className="text-gray-500 text-sm mt-1">{mission}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {vision && (
                                <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center text-primary-dark group-hover:bg-secondary group-hover:text-primary-dark transition-colors shrink-0">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-on-surface text-xl">Visión de Liderazgo</h4>
                                            <p className="text-gray-500 text-sm mt-1">{vision}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Masonry Image Gallery + Counter */}
                    <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-[600px] relative">
                        {/* Central Counter Badge */}
                        {counter_value && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl text-center border border-white border-t-4 border-t-primary w-48">
                                <span className="block font-display text-4xl font-bold text-primary mb-1">
                                    +<Counter from={1} to={parseInt(counter_value) || 5000} duration={5} />
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{counter_label || 'Socios Activos'}</span>
                            </div>
                        )}

                        {images && images.length > 0 ? (
                            <>
                                <div className="col-span-1 rounded-3xl overflow-hidden mt-8 shadow-lg group relative">
                                    <img src={getImageUrl(images[0])} alt="Identidad 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="col-span-1 grid grid-rows-2 gap-4">
                                    {images[1] && (
                                        <div className="rounded-3xl overflow-hidden shadow-lg group relative">
                                            <img src={getImageUrl(images[1])} alt="Identidad 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    )}
                                    {images[2] && (
                                        <div className="rounded-3xl overflow-hidden shadow-lg group relative">
                                            <img src={getImageUrl(images[2])} alt="Identidad 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-primary/40 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                <div className="text-center text-white">
                                                    <h4 className="font-display font-bold text-2xl mb-2">Familia Única</h4>
                                                    <p className="text-sm opacity-80">El futuro se construye juntos.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2 flex items-center justify-center bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
                                <span className="text-gray-400">Sube imágenes en el CMS para activar el mosaico</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IdentityBlock;
