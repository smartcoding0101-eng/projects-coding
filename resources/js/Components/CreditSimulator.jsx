import { useState } from 'react';

export default function CreditSimulator() {
    const [amount, setAmount] = useState(20000);
    const [months, setMonths] = useState(12);
    const monthlyRateValue = 10; // Tasa referencial del 10% mensual
    
    const calculateEMI = () => {
        const i = monthlyRateValue / 100;
        if (amount === 0 || months === 0) return 0;
        const x = Math.pow(1 + i, months);
        const emi = (amount * x * i) / (x - 1);
        return Math.round(emi).toLocaleString('es-BO');
    };

    const getTotals = () => {
        const i = monthlyRateValue / 100;
        if (amount === 0 || months === 0) return { emi: 0, total: 0, interest: 0 };
        const x = Math.pow(1 + i, months);
        const emi = (amount * x * i) / (x - 1);
        const total = emi * months;
        const interest = total - amount;
        return {
            emi: Math.round(emi).toLocaleString('es-BO'),
            total: Math.round(total).toLocaleString('es-BO'),
            interest: Math.round(interest).toLocaleString('es-BO')
        };
    };

    const totals = getTotals();

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="text-left mb-10">
                <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 px-3 py-1 rounded-full mb-4">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark">Simulador Financiero Pro</span>
                </div>
                <h2 className="font-display text-3xl font-black text-on-surface tracking-tight leading-none mb-2">
                    Tu Solución <span className="text-primary italic">Inmediata</span>
                </h2>
                <p className="text-black text-xs font-bold">Calcula con total transparencia institucional.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
                {/* Configuration Area */}
                <div className="p-8 space-y-10">
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="font-bold text-black uppercase tracking-widest text-[9px]">Monto del Crédito</label>
                            <span className="font-display font-black text-2xl text-primary-dark">
                                <span className="text-sm font-bold text-black mr-2">Bs.</span>
                                {parseInt(amount).toLocaleString('es-BO')}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="1000" 
                            max="150000" 
                            step="1000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="font-bold text-black uppercase tracking-widest text-[9px]">Plazo de Pago</label>
                            <span className="font-display font-black text-2xl text-primary-dark">
                                {months} <span className="text-xs font-bold text-black uppercase">Meses</span>
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="36" 
                            step="1"
                            value={months}
                            onChange={(e) => setMonths(e.target.value)}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                {/* Advanced Result Area (Dark Card) */}
                <div className="bg-primary-dark p-8 text-white relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Cuota Mensual Fija</p>
                            <div className="text-5xl font-black text-secondary tracking-tight">
                                <span className="text-sm align-top mr-1 font-bold">Bs.</span>
                                {totals.emi}
                            </div>
                        </div>

                        <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-[10px] font-bold text-white/40 uppercase">Total Intereses</span>
                                <span className="text-xs font-black text-white">Bs. {totals.interest}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-white/40 uppercase">Monto Total</span>
                                <span className="text-xs font-black text-secondary">Bs. {totals.total}</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-8 bg-secondary text-primary-dark font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all shadow-xl shadow-secondary/10">
                        Iniciar Solicitud de Crédito
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-4 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Tasa fija {monthlyRateValue}%</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Seguro Incluido</div>
                    </div>
                </div>
            </div>
            
            <p className="text-[9px] text-black font-bold mt-6 leading-relaxed text-left italic max-w-sm">
                * Valores referenciales determinados por el sistema francés de amortización. Sujeto a evaluación crediticia institucional.
            </p>
        </div>
    );
}
