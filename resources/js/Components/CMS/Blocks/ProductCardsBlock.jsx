import React from 'react';
import { Link } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Shield;
    return <IconComponent className={className} />;
};

const ProductCardsBlock = ({ data }) => {
    const { title, subtitle, items } = data;

    if (!items || items.length === 0) return null;

    const getImageUrl = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        return `/storage/${img}`;
    };

    // Split items into rows: first 3, then rest in groups of 4
    const row1 = items.slice(0, 3);
    const row2 = items.slice(3, 7);

    return (
        <section className="py-12 bg-surface relative overflow-hidden" id="servicios">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">
                        Todo en un solo lugar
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-black text-on-surface tracking-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">{subtitle}</p>
                    )}
                </div>

                {/* Row 1: 3 cards */}
                {row1.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {row1.map((item, idx) => (
                            <ServiceCard key={idx} item={item} getImageUrl={getImageUrl} />
                        ))}
                    </div>
                )}

                {/* Row 2: 4 cards */}
                {row2.length > 0 && (
                    <div className="grid md:grid-cols-4 gap-6">
                        {row2.map((item, idx) => (
                            <ServiceCard key={idx + 3} item={item} getImageUrl={getImageUrl} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

function ServiceCard({ item, getImageUrl }) {
    const isDestacado = item.is_featured;
    const Wrapper = item.route ? Link : 'div';
    const wrapperProps = item.route ? { href: item.route } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`group relative rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 block ${
                isDestacado
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(85,107,47,0.12)]'
            }`}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                {item.image ? (
                    <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${isDestacado ? 'bg-primary-dark' : 'bg-gray-100'}`}>
                        <DynamicIcon name={item.icon} className="w-16 h-16 opacity-20" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`p-6 ${isDestacado ? 'pt-4' : ''}`}>
                {/* Icon Badge */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center -mt-12 relative z-10 shadow-lg ${
                    isDestacado
                        ? 'bg-secondary text-primary-dark'
                        : 'bg-white text-primary border border-gray-100'
                }`}>
                    <DynamicIcon name={item.icon} className="w-7 h-7" />
                </div>

                <h4 className={`font-display text-xl font-black mt-4 mb-2 tracking-tight ${
                    isDestacado ? 'text-white' : 'text-on-surface'
                }`}>
                    {item.name}
                </h4>
                <p className={`text-sm leading-relaxed mb-4 ${
                    isDestacado ? 'text-white/70' : 'text-gray-500'
                }`}>
                    {item.description}
                </p>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-4 ${
                    isDestacado ? 'text-secondary' : 'text-primary'
                }`}>
                    <span>Más información</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>

            {/* Featured ribbon */}
            {isDestacado && (
                <div className="absolute top-4 right-4 bg-secondary text-primary-dark text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    ★ Principal
                </div>
            )}
        </Wrapper>
    );
}

export default ProductCardsBlock;
