export default function RatesBoard() {
    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-16">
                    <span className="uppercase font-bold text-xs tracking-widest text-gray-400 block mb-3">Maximiza tu economía</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-dark mb-6">Pizarra de Tasas y Rendimientos</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Tus ahorros blindados ganan más, y tus créditos cuestan menos. Compara nuestros indicadores.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    
                    {/* DPFs (Ahorros) Table */}
                    <div className="bg-secondary/5 rounded-3xl border border-secondary/20 p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full pointer-events-none"></div>
                        <h3 className="font-display text-2xl font-bold text-secondary-dark mb-2 flex items-center gap-3">
                            <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Depósitos a Plazo Fijo (DPF)
                        </h3>
                        <p className="text-gray-500 text-sm mb-8">El mayor retorno 100% seguro para tu capital pasivo.</p>
                        
                        <div className="overflow-hidden rounded-xl bg-white border border-secondary/20 shadow-sm relative z-10">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-secondary/10 font-bold uppercase tracking-wider text-xs text-secondary-dark">
                                    <tr>
                                        <th className="px-6 py-4">Plazo</th>
                                        <th className="px-6 py-4 text-right">Tasa Efectiva</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">De 31 a 90 días</td>
                                        <td className="px-6 py-4 text-right font-display text-lg text-secondary-dark">4.00%</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">De 91 a 180 días</td>
                                        <td className="px-6 py-4 text-right font-display text-lg text-secondary-dark">4.50%</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">De 181 a 360 días</td>
                                        <td className="px-6 py-4 text-right font-display text-lg text-secondary-dark">5.50%</td>
                                    </tr>
                                    <tr className="bg-secondary-dark/5 hover:bg-secondary-dark/10 transition-colors">
                                        <td className="px-6 py-4 font-bold text-primary-dark">Más de 360 días</td>
                                        <td className="px-6 py-4 text-right font-display font-bold text-2xl text-primary-dark">7.00%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Créditos Table */}
                    <div className="bg-primary/5 rounded-3xl border border-primary/10 p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none"></div>
                        <h3 className="font-display text-2xl font-bold text-primary-dark mb-2 flex items-center gap-3">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            Tasas Activas (Créditos)
                        </h3>
                        <p className="text-gray-500 text-sm mb-8">Financiamiento estratégico en condiciones exclusivas.</p>
                        
                        <div className="overflow-hidden rounded-xl bg-white border border-primary/10 shadow-sm relative z-10">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-primary/5 font-bold uppercase tracking-wider text-xs text-primary-dark">
                                    <tr>
                                        <th className="px-6 py-4">Producto</th>
                                        <th className="px-6 py-4 text-right">Tasa Fija (Anual)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">Crédito Estudiantil / Social</td>
                                        <td className="px-6 py-4 text-right font-display text-lg text-primary">11.00%</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">Crédito de Vehículos</td>
                                        <td className="px-6 py-4 text-right font-display text-lg text-primary">13.50%</td>
                                    </tr>
                                    <tr className="bg-primary-dark/5 hover:bg-primary-dark/10 transition-colors">
                                        <td className="px-6 py-4 font-bold text-primary-dark flex items-center gap-2">
                                            Crédito Vivienda Social
                                            <span className="bg-secondary text-primary-dark text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest">Estatal</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-display font-bold text-2xl text-primary-dark">5.50%*</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">Libre Disponibilidad (Consumo)</td>
                                        <td className="px-6 py-4 text-right font-display text-lg text-primary">15.00%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
