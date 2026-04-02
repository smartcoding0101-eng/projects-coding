import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-brand/5 flex items-center justify-center p-4 sm:p-8 selection:bg-primary/20">
            <Head title="Registro de Socio - FAPCLAS R.L." />

            {/* Floating Portal Card */}
            <div className="w-full max-w-5xl bg-card-fap rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row border border-brand min-h-[650px] transform transition-all">

                {/* 1. Left Column (Visual Image) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col justify-between overflow-hidden group">
                    {/* High Resolution Photography Base */}
                    <img
                        src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                        alt="Corporate Partnership"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[30s] ease-out opacity-75 mix-blend-luminosity"
                    />

                    {/* Advanced Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-primary-dark/80 to-primary/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/40 to-transparent h-1/2"></div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent h-1/2 mt-auto"></div>

                    {/* Top Content */}
                    <div className="relative z-10 p-10 lg:p-12 max-w-lg mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card-fap/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_#60a5fa]"></span>
                            Nueva Afiliación Disponible
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-6 leading-tight drop-shadow-lg">
                            Bienvenido al primer paso de tu seguridad financiera.
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed font-sans pr-6 opacity-90 border-l-2 border-primary/40 pl-4">
                            Únete a FAPCLAS R.L. y accede a una red robusta de servicios diseñados exclusivamente para el bienestar del socio policial internacional.
                        </p>
                    </div>

                    {/* Bottom Content */}
                    <div className="relative z-10 p-10 lg:p-12 w-full">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">Protocolo Seguro</span>
                                    <span className="text-xs text-white/90 font-mono">KYC-VERIFIED STACK</span>
                                </div>
                                <div className="h-8 w-[1px] bg-card-fap/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">Conexión</span>
                                    <span className="text-xs text-blue-400 font-bold flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                        ENcriptada
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/50 leading-tight pr-10">
                                Tus datos están protegidos bajo los más altos estándares internacionales de seguridad financiera. FAPCLAS R.L. garantiza transparencia absoluta.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column (Interactive Form Area) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-10 lg:px-16 bg-card-fap z-10">
                    <div className="w-full max-w-sm mx-auto">

                        {/* Header & Isologo */}
                        <div className="mb-8 text-center lg:text-left">
                            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/30">
                                    F
                                </div>
                                <span className="font-display font-bold text-xl tracking-tight text-brand-main">
                                    FAPCLAS<span className="text-brand-muted font-medium ml-1 text-sm">R.L.</span>
                                </span>
                            </Link>

                            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-main mb-2 tracking-tight">Registro de Socio</h2>
                            <p className="text-brand-muted font-medium text-sm leading-relaxed">Completa los campos para procesar tu solicitud de ingreso.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="name">Nombre Completo del Socio</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className={`w-full px-4 py-3 bg-brand/5 border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-brand focus:border-primary focus:ring-primary focus:bg-card-fap'} rounded-xl text-brand-main text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                    autoComplete="name"
                                    autoFocus={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ingresa tu nombre y apellido"
                                />
                                {errors.name && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.name}</p>}
                            </div>

                            {/* Institutional Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="email">Correo Institucional</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`w-full px-4 py-3 bg-brand/5 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-brand focus:border-primary focus:ring-primary focus:bg-card-fap'} rounded-xl text-brand-main text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="tu.correo@fapclas.com"
                                />
                                {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password">Contraseña de Seguridad</label>
                                <div className="relative flex items-center group/pass">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className={`w-full px-4 pr-12 py-3 bg-brand/5 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-brand focus:border-primary focus:ring-primary focus:bg-card-fap'} rounded-xl text-brand-main text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-brand-muted hover:text-primary transition-all duration-200 z-20 hover:scale-110 focus:outline-none"
                                        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.password}</p>}
                            </div>

                            {/* Password Confirmation */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password_confirmation">Confirmar Contraseña</label>
                                <div className="relative flex items-center group/pass">
                                    <input
                                        id="password_confirmation"
                                        type={showPasswordConfirm ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className={`w-full px-4 pr-12 py-3 bg-brand/5 border ${errors.password_confirmation ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-brand focus:border-primary focus:ring-primary focus:bg-card-fap'} rounded-xl text-brand-main text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-brand-muted hover:text-primary transition-all duration-200 z-20 hover:scale-110 focus:outline-none"
                                        title={showPasswordConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPasswordConfirm ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.password_confirmation}</p>}
                            </div>

                            {/* Master CTA Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3 px-6 bg-primary text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 hover:bg-primary-dark hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed transform-none shadow-none' : ''}`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registrando...
                                    </>
                                ) : (
                                    'Solicitar registro de socio'
                                )}
                            </button>

                            {/* Diverted Route to Login */}
                            <div className="text-center mt-6 pt-5 border-t border-brand">
                                <p className="text-brand-muted text-xs font-medium">
                                    ¿Ya tienes una cuenta activa?
                                    <Link href={route('login')} className="ml-1 text-primary font-bold hover:text-primary-dark hover:underline transition-colors">
                                        Ingresa aquí
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
