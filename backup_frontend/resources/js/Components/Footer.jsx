export default function Footer() {
    return (
        <footer className="bg-zinc-900 border-t border-zinc-800 pt-16 pb-8 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-display font-bold text-xl">
                                F
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight text-white">
                                FAPCLAS R.L.
                            </span>
                        </div>
                        <p className="mb-8 max-w-sm text-gray-400">Soluciones financieras integrales con eficiencia, oportunidad y responsabilidad social diseñadas exclusivamente para el bienestar integral de la familia policial boliviana.</p>
                        
                        <div className="flex gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors">
                                <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Control Societario</span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Regulada por AFCOOP</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors">
                                <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Supervisión Financiera</span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Supervisada por ASFI</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Accesos Rápidos</h4>
                        <ul className="space-y-3">
                            <li><a href="#ahorro" className="hover:text-primary transition-colors">Caja de Ahorro</a></li>
                            <li><a href="#creditos" className="hover:text-primary transition-colors">Créditos de Emergencia</a></li>
                            <li><a href="#beneficios" className="hover:text-primary transition-colors">Beneficios Exclusivos</a></li>
                            <li><a href="#institucional" className="hover:text-primary transition-colors">Misión y Visión</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Contáctanos</h4>
                        <ul className="space-y-3">
                            <li><a href="http://wa.link/8yl8ow" target="_blank" className="hover:text-primary transition-colors flex items-center gap-2">WhatsApp Directo</a></li>
                            <li><a href="http://www.facebook.com/profile.php?id=61582603104419" target="_blank" className="hover:text-primary transition-colors flex items-center gap-2">Síguenos en Facebook</a></li>
                            <li>Atención Personalizada 24/7</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Cooperativa FAPCLAS R.L. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
