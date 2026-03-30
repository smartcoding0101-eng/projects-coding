import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, ShoppingBag, Phone, MessageSquare } from 'lucide-react';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Top Utility Bar (Sleeker, smaller typography, strictly utility) */}
            <div className={`w-full bg-[#1b262c] text-white/80 text-[11px] font-medium py-1.5 transition-all duration-300 tracking-wider ${scrolled ? '-translate-y-full absolute opacity-0' : 'translate-y-0 relative opacity-100 z-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <a href="tel:80010XXXX" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            Soporte Socio: 800-10-FAPCLAS
                        </a>
                        <span className="hidden sm:inline w-[1px] h-3 bg-white/20"></span>
                        <a href="http://wa.link/8yl8ow" target="_blank" className="hidden sm:flex items-center gap-1.5 hover:text-green-400 transition-colors">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.573-.187-.981-.342-1.713-.65-2.816-2.39-2.903-2.505-.087-.116-.694-.925-.694-1.765s.437-1.258.59-1.423c.153-.166.332-.208.442-.208s.221-.005.317-.005c.087 0 .208-.032.325.249.122.29.418 1.02.456 1.097.038.077.063.166.012.265-.05.099-.076.158-.152.247s-.152.188-.218.261c-.073.081-.151.17-.064.321.087.151.388.642.836 1.043.578.517 1.055.679 1.206.756.151.076.241.063.33-.038s.344-.403.438-.541c.094-.138.188-.115.326-.065.138.05 .876.413 1.027.489.151.076.251.114.288.177.037.062.037.359-.107.764z"/></svg>
                            WhatsApp Institucional
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <a href="#" className="hover:text-white transition-all">Bolsa de Trabajo</a>
                            <span className="w-[1px] h-3 bg-white/20"></span>
                            <a href="#" className="hover:text-white transition-all">Preguntas Frecuentes</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Floating Pill Nav - More compact & refined spacing */}
            <header className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'top-3' : 'top-8'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex justify-between items-center transition-all duration-500 border origin-top ${scrolled ? 'bg-white/95 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full border-white/50 px-6 h-16' : 'bg-transparent border-transparent px-2 h-20'}`}>
                        
                        {/* Logo */}
                        <div className="flex items-center gap-2.5 shrink-0">
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className={`flex items-center justify-center text-white font-display font-bold group-hover:scale-105 transition-all shadow-md shadow-primary/20 ${scrolled ? 'w-8 h-8 text-lg bg-primary rounded-full' : 'w-10 h-10 text-xl bg-primary rounded-2xl'}`}>
                                    F
                                </div>
                                <span className={`font-display font-bold tracking-tight text-primary-dark transition-all ${scrolled ? 'text-lg' : 'text-xl drop-shadow-sm'}`}>
                                    FAPCLAS<span className="text-gray-400 font-medium ml-1 text-sm tracking-normal">R.L.</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Menu - Title Case, Semibold, Adjusted Spacing */}
                        <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-10 h-full">
                            <Link href="/" className="text-gray-600 hover:text-primary font-semibold text-[13px] tracking-wide transition-colors">
                                Inicio
                            </Link>
                            
                            {/* Mega Menu: Nuestra Entidad */}
                            <div className="relative group/dropdown h-full flex items-center shrink-0">
                                <button className="flex items-center gap-1.5 text-gray-600 hover:text-primary font-semibold text-[13px] tracking-wide transition-colors cursor-default">
                                    Nuestra Entidad
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/dropdown:rotate-180 text-gray-400 group-hover/dropdown:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                
                                <div className={`absolute left-1/2 -translate-x-1/2 mt-1.5 w-[500px] bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform translate-y-3 group-hover/dropdown:translate-y-0 before:absolute before:inset-0 before:-top-6 before:h-6 before:bg-transparent overflow-hidden flex ${scrolled ? 'top-full' : 'top-14'}`}>
                                    {/* Links Column */}
                                    <div className="w-[55%] p-5 space-y-1.5 bg-white relative z-10">
                                        <Link href="/institucional/mision-vision" className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group/link border border-transparent hover:border-gray-100">
                                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 group-hover/link:text-primary text-[13px]">Misión y Visión</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">Horizonte cooperativo policial.</p>
                                            </div>
                                        </Link>
                                        <Link href="/institucional/constitucion" className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group/link border border-transparent hover:border-gray-100">
                                            <div className="w-9 h-9 bg-secondary/20 rounded-xl flex items-center justify-center text-primary-dark shrink-0 group-hover/link:bg-primary-dark group-hover/link:text-secondary transition-all">
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 group-hover/link:text-primary-dark text-[13px]">Quiénes Somos</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">Historia e impacto de FAPCLAS.</p>
                                            </div>
                                        </Link>
                                    </div>
                                    {/* Featured Image */}
                                    <div className="w-[45%] relative bg-primary p-5 flex flex-col justify-end text-white overflow-hidden group/card shadow-inner">
                                        <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Nosotros" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover/card:scale-105 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary/60 to-transparent"></div>
                                        <div className="relative z-10 transform group-hover/card:translate-y-[-3px] transition-transform duration-500">
                                            <span className="bg-secondary text-primary-dark text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">Solidaridad</span>
                                            <h4 className="font-semibold text-sm mt-2 leading-tight font-display mb-1.5">+5,000 socios activos</h4>
                                            <p className="text-[10px] text-gray-200 opacity-90">Únete a la hermandad policial.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mega Menu: Transparencia */}
                            <div className="relative group/dropdown h-full flex items-center shrink-0">
                                <button className="flex items-center gap-1.5 text-gray-600 hover:text-primary font-semibold text-[13px] tracking-wide transition-colors cursor-default">
                                    Transparencia
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/dropdown:rotate-180 text-gray-400 group-hover/dropdown:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                
                                <div className={`absolute left-1/2 -translate-x-1/2 mt-1.5 w-72 bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform translate-y-3 group-hover/dropdown:translate-y-0 before:absolute before:inset-0 before:-top-6 before:h-6 before:bg-transparent ${scrolled ? 'top-full' : 'top-14'}`}>
                                    <div className="p-3 space-y-1 relative z-10">
                                        <Link href="/institucional/normativas" className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group/link border border-transparent hover:border-gray-100">
                                            <div className="w-9 h-9 bg-blue-50/70 rounded-xl flex items-center justify-center text-blue-600 shrink-0 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 group-hover/link:text-primary text-[13px]">Leyes y Normativas</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">Leyes 393, ASFI y AFCOOP.</p>
                                            </div>
                                        </Link>
                                        <div className="flex items-start gap-3.5 p-3 rounded-2xl opacity-40 cursor-not-allowed">
                                            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-500 text-[13px]">Punto de Reclamo (PRF)</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">No disponible temporalmente.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Mega Menu: Informe */}
                            <div className="relative group/dropdown h-full flex items-center shrink-0">
                                <button className="flex items-center gap-1.5 text-gray-600 hover:text-primary font-semibold text-[13px] tracking-wide transition-colors cursor-default">
                                    Informe
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/dropdown:rotate-180 text-gray-400 group-hover/dropdown:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                
                                <div className={`absolute left-1/2 -translate-x-1/2 mt-1.5 w-72 bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform translate-y-3 group-hover/dropdown:translate-y-0 before:absolute before:inset-0 before:-top-6 before:h-6 before:bg-transparent ${scrolled ? 'top-full' : 'top-14'}`}>
                                    <div className="p-3 space-y-1 relative z-10">
                                        <Link href="/institucional/noticias" className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group/link border border-transparent hover:border-gray-100">
                                            <div className="w-9 h-9 bg-green-50/70 rounded-xl flex items-center justify-center text-green-600 shrink-0 group-hover/link:bg-green-600 group-hover/link:text-white transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 group-hover/link:text-primary text-[13px]">Noticias</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">Actualidad, comunicados y convenios.</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* CTAs - Refined sizing */}
                        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
                            <Link href="/login" className="hidden lg:flex font-semibold text-gray-600 hover:text-primary transition-colors items-center gap-1.5 text-[13px] tracking-wide">
                                <LogIn className="w-4 h-4 text-gray-400" />
                                Portal Socio
                            </Link>
                            <Link href="/beneficios" className="bg-primary text-white font-semibold px-5 py-2 rounded-full hover:bg-primary-dark hover:shadow-lg transition-all transform hover:-translate-y-0.5 shadow-md shadow-primary/20 hidden sm:flex items-center gap-1.5 text-[13px] tracking-wide">
                                <ShoppingBag className="w-4 h-4" />
                                Tienda Virtual
                            </Link>
                            
                            {/* Mobile Menu Toggle */}
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-white z-50 lg:hidden transition-all duration-500 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">F</div>
                                <span className="font-display font-bold text-gray-900">FAPCLAS</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="space-y-6 flex-1">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Inicio</Link>
                            
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Institución</p>
                                <Link href="/institucional/mision-vision" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-700">Misión y Visión</Link>
                                <Link href="/institucional/constitucion" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-700">Quiénes Somos</Link>
                                <Link href="/institucional/normativas" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-700">Transparencia</Link>
                                <Link href="/institucional/noticias" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-semibold text-gray-700">Noticias</Link>
                            </div>
                        </nav>

                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <Link 
                                href="/login" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-900 font-bold py-4 rounded-2xl border border-gray-100"
                            >
                                <LogIn className="w-5 h-5" /> Portal Socio
                            </Link>
                            <Link 
                                href="/beneficios" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20"
                            >
                                <ShoppingBag className="w-5 h-5" /> Tienda Virtual
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
