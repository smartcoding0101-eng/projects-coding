import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Shield;
    return <IconComponent className={className} />;
};

const ServicesBlock = ({ data }) => {
    const { title, subtitle, items } = data;

    if (!items || items.length === 0) return null;

    return (
        <section className="py-24 bg-surface relative overflow-hidden" id="servicios">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-6 py-2 rounded-full inline-block mb-6 shadow-sm border border-primary/5">
                        Innovación Constante
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-black text-on-surface tracking-tight leading-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-xl leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <ServiceCard key={index} item={item} index={index} />
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center gap-4 px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5"
                    >
                        Gestionar mis servicios ahora
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

function ServiceCard({ item, index }) {
    return (
        <div className="group relative bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(85,107,47,0.1)] transition-all duration-500 hover:-translate-y-3">
            {/* Icon Badge */}
            <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner overflow-hidden relative">
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <DynamicIcon name={item.icon} className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>

            <h4 className="font-display text-2xl font-black text-on-surface mb-4 tracking-tight group-hover:text-primary transition-colors">
                {item.title}
            </h4>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {item.description}
            </p>

            {item.link && (
                <Link 
                    href={item.link}
                    className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                >
                    <span>Saber más</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>
            )}
        </div>
    );
}

export default ServicesBlock;
