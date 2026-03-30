import React from 'react';
import * as LucideIcons from 'lucide-react';

const StatsBlock = ({ data }) => {
    const { title, items } = data;

    if (!items || items.length === 0) return null;

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="font-display text-3xl md:text-4xl font-black text-on-surface tracking-tight mb-12">
                    {title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {items.map((item, idx) => {
                        const IconComponent = LucideIcons[item.icon] || LucideIcons.CheckCircle;
                        return (
                            <div
                                key={idx}
                                className="group p-8 rounded-[2rem] bg-surface border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <IconComponent className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div className="text-4xl font-black text-primary-dark mb-2 font-display tracking-tight">
                                    {item.value}
                                </div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    {item.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsBlock;
