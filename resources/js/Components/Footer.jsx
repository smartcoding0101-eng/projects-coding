import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-zinc-900 border-t border-zinc-800 pt-10 pb-8 text-gray-400">
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
                <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <div className="text-center md:text-left text-gray-400 space-y-1">
                        <p>&copy; 2026 Cooperativa FAPCLAS R.L. Todos los derechos reservados.</p>
                        <p>&copy; copyright SmarCoding SA.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex gap-6 font-bold text-gray-300">
                            <Link href={route('welcome')} className="hover:text-white transition-colors">Inicio</Link>
                            <Link href={route('register')} className="hover:text-white transition-colors">Regístrate</Link>
                            <Link href={route('login')} className="hover:text-white transition-colors">Acceso al Portal</Link>
                        </div>
                        <div className="w-px h-4 bg-zinc-700 hidden md:block"></div>
                        <div className="flex gap-4">
                            <a href="#" className="animate-pulse-slow text-gray-500 hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="animate-pulse-slow text-gray-500 hover:text-[#E4405F] transition-colors" aria-label="Instagram" style={{ animationDelay: '200ms' }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="animate-pulse-slow text-gray-500 hover:text-white transition-colors" aria-label="TikTok" style={{ animationDelay: '400ms' }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.66-.21-3.07 1.87-5.92 4.81-6.71 2.11-.53 4.35-.11 6.13.91l-.1-3.79c-2.31-.61-4.83-.55-7.1.33-1.92.74-3.55 2.16-4.52 3.93-1.12 2.05-1.36 4.54-.57 6.75 1.05 2.94 3.73 5.25 6.78 6.03 2.1.53 4.35.34 6.32-.61 1.99-.96 3.51-2.58 4.31-4.64.69-1.78.96-3.7.83-5.6-.08-4.22.01-8.45-.04-12.67h-4.04c-.01 1.29.02 2.59-.03 3.89-.96-.44-1.96-.8-3.01-.98-.01-1.42-.01-2.84 0-4.26z"/></svg>
                            </a>
                            <a href="#" className="animate-pulse-slow text-gray-500 hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn" style={{ animationDelay: '600ms' }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
