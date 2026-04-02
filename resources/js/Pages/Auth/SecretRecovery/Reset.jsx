import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { CheckCircle2, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function Reset() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('secret.update'));
    };

    return (
        <div className="min-h-screen bg-brand/5 flex items-center justify-center p-4 sm:p-8 selection:bg-primary/20 leading-relaxed font-sans">
            <Head title="Restablecer Contraseña - FAPCLAS R.L." />

            {/* Floating Reset Card */}
            <div className="w-full max-w-5xl bg-card-fap rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row border border-brand min-h-[600px] transform transition-all">
                
                {/* 1. Left Column (Visual - Success Theme) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col justify-between overflow-hidden group">
                    <img 
                        src="https://images.unsplash.com/photo-1510511459019-5dee9954ff92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Security Access" 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[30s] ease-out opacity-60 mix-blend-luminosity"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-emerald-900/70 to-emerald-800/30 mix-blend-multiply"></div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent h-1/2 mt-auto"></div>

                    {/* Content Badge */}
                    <div className="relative z-10 p-10 lg:p-12 max-w-lg mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card-fap/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Identidad Validada
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-6 leading-tight drop-shadow-lg">
                            Casi hemos terminado. Define tu nueva clave.
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed font-sans pr-6 opacity-90 border-l-2 border-emerald-500/40 pl-4">
                            Has superado con éxito todos los protocolos de seguridad. Procede a establecer una contraseña robusta para recuperar el acceso total a tu ecosistema FAPCLAS.
                        </p>
                    </div>

                    {/* Security Info */}
                    <div className="relative z-10 p-10 lg:p-12 w-full">
                        <div className="bg-card-fap/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-[10px] text-white/60 leading-tight uppercase tracking-wider font-bold">
                                Canal de cambio de clave <br/> <span className="text-white">CIFRADO Y MONITORIZADO</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column (The Reset) */}
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

                            <h2 className="font-display text-2xl font-bold text-brand-main mb-2 tracking-tight">Nueva Contraseña</h2>
                            <p className="text-brand-muted font-medium text-sm leading-relaxed">Establece una combinación segura que no hayas usado anteriormente.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password">Nueva Contraseña de Seguridad</label>
                                <div className="relative group flex items-center">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className={`w-full pl-11 pr-12 py-3 bg-brand/5 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-brand focus:border-primary focus:ring-primary focus:bg-card-fap'} rounded-xl text-brand-main text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                        autoFocus={true}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Min. 8 caracteres"
                                        required
                                    />
                                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-primary transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-brand-muted hover:text-primary transition-all duration-200 z-20 hover:scale-110 focus:outline-none"
                                        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password_confirmation">Confirmar Nueva Contraseña</label>
                                <div className="relative group flex items-center">
                                    <input
                                        id="password_confirmation"
                                        type={showPasswordConfirm ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className={`w-full pl-11 pr-12 py-3 bg-brand/5 border ${errors.password_confirmation ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-brand focus:border-primary focus:ring-primary focus:bg-card-fap'} rounded-xl text-brand-main text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Repite la contraseña"
                                        required
                                    />
                                    <ShieldCheck className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-primary transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center justify-center text-brand-muted hover:text-primary transition-all duration-200 z-20 hover:scale-110 focus:outline-none"
                                        title={showPasswordConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPasswordConfirm ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.password_confirmation}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3.5 px-6 bg-zinc-900 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-xl shadow-zinc-900/20 hover:shadow-zinc-900/40 hover:bg-black hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                            >
                                {processing ? 'Procesando...' : 'Restablecer Acceso Total'}
                            </button>
                            
                            <div className="text-center mt-6 pt-5 border-t border-brand italic">
                                <p className="text-[10px] text-brand-muted font-medium leading-relaxed px-4">
                                    Al cambiar tu contraseña, se cerrarán todas las sesiones activas en otros dispositivos por motivos de seguridad institucional.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
