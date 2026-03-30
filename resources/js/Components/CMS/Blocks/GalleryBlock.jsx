import React from 'react';

const GalleryBlock = ({ data }) => {
    const { title, subtitle, items } = data;

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `/storage/${img}`;
    };

    if (!items || items.length === 0) return null;

    return (
        <section className="py-12 bg-white" id="galeria">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Transparencia y Acción</h2>
                    <h3 className="font-display text-4xl font-bold text-on-surface">{title}</h3>
                    {subtitle && <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">{subtitle}</p>}
                </div>

                {/* Asymmetric masonry grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
                    {/* First image — large */}
                    {items[0] && (
                        <div className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                            <img src={getImageUrl(items[0].image)} alt={items[0].caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                <h4 className="text-white font-display font-bold text-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{items[0].caption}</h4>
                            </div>
                        </div>
                    )}

                    {/* Second image — small */}
                    {items[1] && (
                        <div className="md:col-span-1 md:row-span-1 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                            <img src={getImageUrl(items[1].image)} alt={items[1].caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <h4 className="text-white font-bold text-lg">{items[1].caption}</h4>
                            </div>
                        </div>
                    )}

                    {/* Third image — tall */}
                    {items[2] && (
                        <div className="md:col-span-1 md:row-span-2 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                            <img src={getImageUrl(items[2].image)} alt={items[2].caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                <h4 className="text-white font-display font-bold text-2xl">{items[2].caption}</h4>
                            </div>
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white cursor-pointer hover:bg-white/40 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            </div>
                        </div>
                    )}

                    {/* Fourth image — small */}
                    {items[3] && (
                        <div className="md:col-span-1 md:row-span-1 rounded-[2rem] overflow-hidden relative group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50">
                            <img src={getImageUrl(items[3].image)} alt={items[3].caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <h4 className="text-white font-bold text-lg">{items[3].caption}</h4>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default GalleryBlock;
