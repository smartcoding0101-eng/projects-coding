import React from 'react';
import * as LucideIcons from 'lucide-react';

const NormativeDocuments = ({ data }) => {
    const { title, subtitle, items = [] } = data;

    const getColorClasses = (color) => {
        const colors = {
            blue: {
                bg: 'bg-blue-50',
                text: 'text-blue-600',
                shadow: 'hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]',
                btn: 'text-blue-600 bg-blue-50/50'
            },
            emerald: {
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                shadow: 'hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]',
                btn: 'text-emerald-600 bg-emerald-50/50'
            },
            primary: {
                bg: 'bg-primary/10',
                text: 'text-primary',
                shadow: 'hover:shadow-[0_20px_50px_rgba(85,107,47,0.15)]',
                btn: 'text-primary bg-primary/10'
            },
            gold: {
                bg: 'bg-secondary/15',
                text: 'text-secondary-dark',
                shadow: 'hover:shadow-[0_20px_50px_rgba(255,215,0,0.15)]',
                btn: 'text-secondary-dark bg-secondary/10'
            }
        };

        return colors[color] || colors.primary;
    };

    return (
        <section className="py-24 bg-surface-container/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">
                        Transparencia Activa
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-4">{title}</h2>
                    {subtitle && <p className="text-xl text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {items.map((item, index) => {
                        const IconComponent = LucideIcons[item.icon] || LucideIcons.FileText;
                        const styles = getColorClasses(item.color);

                        return (
                            <div 
                                key={index} 
                                className={`bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300 group ${styles.shadow}`}
                            >
                                <div className="flex items-center gap-5 mb-6">
                                    <div className={`w-16 h-16 ${styles.bg} rounded-2xl flex items-center justify-center ${styles.text} group-hover:scale-110 transition-transform`}>
                                        <IconComponent size={32} strokeWidth={2} />
                                    </div>
                                    <div>
                                        {item.label && (
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                                {item.label}
                                            </span>
                                        )}
                                        <h3 className="font-display font-bold text-2xl text-on-surface">{item.name}</h3>
                                    </div>
                                </div>
                                <p className="text-gray-500 mb-8 font-sans leading-relaxed text-base min-h-[80px]">
                                    {item.description}
                                </p>
                                <a 
                                    href={`/storage/${item.file}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 font-bold hover:underline group-hover:gap-4 transition-all w-max px-6 py-2.5 rounded-full ${styles.btn}`}
                                >
                                    {item.button_text || 'Descargar PDF'} &darr;
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default NormativeDocuments;
