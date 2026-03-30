import { useState } from 'react';

export default function CreditSimulator() {
    const [amount, setAmount] = useState(20000);
    const [months, setMonths] = useState(36);
    const annualRate = 15; // Tasa referencial del 15% anual para policías
    
    // Cálculo de cuota fija (Sistema Francés)
    const calculateEMI = () => {
        const monthlyRate = annualRate / 12 / 100;
        if (amount === 0 || months === 0) return 0;
        const x = Math.pow(1 + monthlyRate, months);
        const emi = (amount * x * monthlyRate) / (x - 1);
        return emi.toFixed(2);
    };

    return (
        <section className="py-24 bg-surface relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-dark/5 to-transparent"></div>
            <div className="absolute -right-64 -top-64 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Text & Marketing */}
                    <div>
                        <span className="bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-4 py-1.5 rounded-full inline-block mb-6">Proyéctate al Futuro</span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-dark mb-6 leading-tight">
                            Simula tu próximo crédito al instante.
                        </h2>
                        <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                            Nuestra calculadora financiera transparente te permite planificar créditos de consumo, vivienda o vehículo con las tasas más competitivas del sector solidario.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                "Aprobación expedita para sector policial.",
                                "Sin costos ocultos ni penalidades de prepago.",
                                "Débito directo del seguro para mayor comodidad."
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="font-medium text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary-dark hover:shadow-xl transition-all shadow-primary/30 flex items-center gap-3">
                            Solicitar Crédito Ahora
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>

                    {/* Right: Interactive Simulator Panel */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 relative">
                        {/* Glass Top Label */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-on-surface text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                            Simulador Dinámico
                        </div>

                        <div className="space-y-10 mt-4">
                            {/* Amount Slider */}
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label className="font-bold text-gray-500 uppercase tracking-widest text-xs">Monto que necesitas (Bs.)</label>
                                    <span className="font-display font-bold text-3xl text-primary-dark">
                                        {parseInt(amount).toLocaleString('es-BO')}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1000" 
                                    max="200000" 
                                    step="1000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                    <span>Bs. 1,000</span>
                                    <span>Bs. 200,000</span>
                                </div>
                            </div>

                            {/* Terms Slider */}
                            <div>
                                <div className="flex justify-between items-end mb-4">
                                    <label className="font-bold text-gray-500 uppercase tracking-widest text-xs">Plazo a pagar (Meses)</label>
                                    <span className="font-display font-bold text-3xl text-primary-dark">
                                        {months}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="6" 
                                    max="72" 
                                    step="6"
                                    value={months}
                                    onChange={(e) => setMonths(e.target.value)}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary-dark"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                    <span>6 meses</span>
                                    <span>72 meses</span>
                                </div>
                            </div>
                        </div>

                        <hr className="my-10 border-gray-100" />

                        {/* Result Block */}
                        <div className="bg-surface rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-primary/10">
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Cuota Mensual Estimada</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-display font-bold text-5xl text-primary-dark">{calculateEMI()}</span>
                                    <span className="font-bold text-gray-400">Bs.</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tasa Referencial</p>
                                <span className="font-display font-bold justify-end text-3xl text-secondary-dark flex items-center gap-1">
                                    {annualRate}% <span className="text-sm font-normal text-gray-400">Anual</span>
                                </span>
                            </div>
                        </div>
                        
                        <p className="text-center text-[10px] text-gray-400 mt-6 max-w-sm mx-auto">
                            * Los valores calculados son escenarios referenciales sujetos a evaluación crediticia y capacidad de pago según normativas ASFI. No constituyen compromiso normativo.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
