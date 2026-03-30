import React from 'react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Shield;
    return <IconComponent className={className} />;
};

const BenefitsBlock = ({ data }) => {
    const {
        title = 'Beneficios Exclusivos',
        subtitle = 'Más allá del crédito, somos tu respaldo integral.',
        items = [],
        status_label = 'Socio Activo',
        status_badge = 'Fapclas ERP v3',
    } = data;

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="text-left mb-10">
                <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full mb-4">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary-dark">Ecosistema Institucional</span>
                </div>
                <h2 className="font-display text-3xl font-black text-on-surface tracking-tight leading-none mb-2">
                    {title.split(' ').slice(0, -1).join(' ')} <span className="text-secondary italic">{title.split(' ').pop()}</span>
                </h2>
                <p className="text-gray-400 text-xs font-medium">{subtitle}</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-6 overflow-hidden transition-all hover:shadow-xl group">
                {/* Information Grid */}
                {items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((b, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-surface/50 border border-transparent hover:border-gray-100 transition-all hover:bg-white">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                                    <DynamicIcon name={b.icon} className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider mb-1">{b.title}</h4>
                                <p className="text-[10px] leading-relaxed text-gray-500 font-medium">{b.description}</p>
                                {b.link && (
                                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-[9px] text-primary font-black uppercase mt-2 inline-block hover:underline">Acceso Directo &rarr;</a>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Interactive Status Bar */}
                <div className="mt-2 bg-primary-dark rounded-2xl p-5 flex items-center justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Estado de Afiliación</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                            <span className="text-xs font-bold font-display uppercase tracking-widest">{status_label}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-secondary uppercase">{status_badge}</div>
                        <div className="text-[8px] text-white/30 font-bold uppercase">Acceso Protegido</div>
                    </div>
                </div>
            </div>

            <p className="text-[9px] text-black font-bold mt-6 leading-relaxed italic max-w-sm">
                * Todos los beneficios están sujetos al cumplimiento de los estatutos vigentes de FAPCLAS R.L.
            </p>
        </div>
    );
};

export default BenefitsBlock;
