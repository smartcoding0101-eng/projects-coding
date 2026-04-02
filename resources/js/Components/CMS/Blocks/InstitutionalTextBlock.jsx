import React from 'react';

const InstitutionalTextBlock = ({ data }) => {
    const { title, subtitle, content, image, image_left, badge } = data;

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0" stroke="currentColor" strokeWidth="0.1" fill="none" />
                    <path d="M0 0 L100 100" stroke="currentColor" strokeWidth="0.1" fill="none" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`flex flex-col ${image_left ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>
                    
                    {/* Content Side */}
                    <div className="lg:w-1/2">
                        {badge && (
                            <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6 border border-primary/20">
                                {badge}
                            </span>
                        )}
                        <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 leading-tight mb-4 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-secondary font-bold text-lg mb-8 tracking-wide">
                                {subtitle}
                            </p>
                        )}
                        <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {content}
                        </div>
                    </div>

                    {/* Image Side */}
                    {image && (
                        <div className="lg:w-1/2 relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform transition-transform duration-700 group-hover:scale-[1.02]">
                                <img 
                                    src={`/storage/${image}`} 
                                    alt={title} 
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className={`absolute ${image_left ? '-left-6' : '-right-6'} -bottom-6 w-24 h-24 bg-secondary rounded-3xl -z-10 animate-pulse-slow`}></div>
                            <div className={`absolute ${image_left ? '-right-4' : '-left-4'} -top-4 w-12 h-12 bg-primary rounded-full -z-10`}></div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default InstitutionalTextBlock;
