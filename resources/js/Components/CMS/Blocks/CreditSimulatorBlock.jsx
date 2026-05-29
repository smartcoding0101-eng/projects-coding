import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import TextType from '../../TextType';

const CreditSimulatorBlock = ({ data }) => {
    const {
        title = 'Tu Solución Inmediata',
        subtitle = 'Calcula con total transparencia institucional.',
        rate = 10,
        min_amount = 1000,
        max_amount = 150000,
        min_months = 1,
        max_months = 36,
        default_amount = 20000,
        default_months = 12,
        cta_text = 'Iniciar Solicitud de Crédito',
    } = data;

    const monthlyRate = parseFloat(rate) || 10;
    const [amount, setAmount] = useState(parseInt(default_amount) || 20000);
    const [months, setMonths] = useState(parseInt(default_months) || 12);
    const [saved, setSaved] = useState(false);

    const { auth } = usePage().props;
    const isAuthenticated = !!auth?.user;

    const handleRequestCredit = () => {
        localStorage.setItem('simulated_amount', amount);
        localStorage.setItem('simulated_months', months);
        setSaved(true);
        setTimeout(() => {
            if (isAuthenticated) {
                window.location.href = '/creditos/solicitar';
            } else {
                window.location.href = '/login?redirect=creditos.create';
            }
        }, 350);
    };

    const getTotals = () => {
        const i = monthlyRate / 100;
        if (amount === 0 || months === 0) return { emi: '0', total: '0', interest: '0' };
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
                <h2 className="font-display text-3xl font-black text-on-surface tracking-tight leading-none mb-2 md:min-h-[40px]">
                    <TextType text={title} as="span" typingSpeed={75} deletingSpeed={50} showCursor cursorCharacter="_" />
                </h2>
                <p className="text-black text-xs font-bold">{subtitle}</p>
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
                            min={parseInt(min_amount) || 1000}
                            max={parseInt(max_amount) || 150000}
                            step="1000"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
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
                            min={parseInt(min_months) || 1}
                            max={parseInt(max_months) || 36}
                            step="1"
                            value={months}
                            onChange={(e) => setMonths(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                {/* Result Area */}
                <div className="bg-primary-dark p-8 text-white relative overflow-hidden">
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
                    <button
                        onClick={handleRequestCredit}
                        disabled={saved}
                        className="w-full mt-8 bg-secondary text-primary-dark font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all shadow-xl shadow-secondary/10 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {saved ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                Redirigiendo...
                            </>
                        ) : cta_text}
                    </button>
                    <div className="mt-6 flex items-center justify-center gap-4 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Tasa fija {monthlyRate}%</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Seguro Incluido</div>
                    </div>
                </div>
            </div>

            <p className="text-[9px] text-black font-bold mt-6 leading-relaxed text-left italic max-w-sm">
                * Valores referenciales determinados por el sistema francés de amortización. Sujeto a evaluación crediticia institucional.
            </p>
        </div>
    );
};

export default CreditSimulatorBlock;
