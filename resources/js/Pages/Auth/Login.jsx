import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 selection:bg-primary/20">
            <Head title="Acceso - FAPCLAS R.L." />

            {/* Floating Portal Card (Reduced size and footprint) */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row border border-gray-100 min-h-[600px] transform transition-all">
                
                {/* 1. Left Column (Visual Image - Moved from right to left) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col justify-between overflow-hidden group">
                    {/* High Resolution Photography Base */}
                    <img 
                        src="https://images.unsplash.com/photo-1555529771-835f59bfc50c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Corporate Security" 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[30s] ease-out opacity-75 mix-blend-luminosity"
                    />
                    
                    {/* Advanced Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-primary-dark/80 to-primary/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/40 to-transparent h-1/2"></div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent h-1/2 mt-auto"></div>

                    {/* Top Content (Expanded) */}
                    <div className="relative z-10 p-10 lg:p-12 max-w-lg mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></span>
                            Plataforma Cifrada Activa
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-6 leading-tight drop-shadow-lg">
                            Tu futuro asegurado en el ecosistema más sólido.
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed font-sans pr-6 opacity-90 border-l-2 border-primary/40 pl-4">
                            Gestiona tus aportaciones y créditos al instante. Entorno avalado y regulado por la institución para garantizar la máxima transparencia en tus finanzas.
                        </p>
                    </div>

                    {/* Bottom Content (New Protection Info) */}
                    <div className="relative z-10 p-10 lg:p-12 w-full">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">Protocolo de Seguridad</span>
                                    <span className="text-xs text-white/90 font-mono">AES-256 BIT ENCRYPTION</span>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">Estado del Servidor</span>
                                    <span className="text-xs text-green-400 font-bold flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-green-400"></span>
                                        OPTIMIZADO
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/50 leading-tight pr-10">
                                Certificado de seguridad SSL activo. FAPCLAS R.L. garantiza la confidencialidad de los datos personales de sus socios mediante sistemas de vigilancia digital continua.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column (Interactive Form Area - Reduced paddings and elements) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-10 lg:px-16 bg-white z-10">
                    <div className="w-full max-w-sm mx-auto">
                        
                        {/* Header & Isologo */}
                        <div className="mb-8 text-center lg:text-left">
                            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/30">
                                    F
                                </div>
                                <span className="font-display font-bold text-xl tracking-tight text-gray-800">
                                    FAPCLAS<span className="text-gray-400 font-medium ml-1 text-sm">R.L.</span>
                                </span>
                            </Link>
                            
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Portal de Acceso</h2>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">Ingresa tus credenciales para acceder a tu ecosistema financiero.</p>
                        </div>

                        {status && (
                            <div className="mb-5 font-bold text-xs text-green-700 bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2 shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email / Username */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="email">Correo Institucional</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-primary focus:bg-white'} rounded-xl text-gray-900 text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                    autoComplete="username"
                                    autoFocus={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="tu.correo@fapclas.com"
                                />
                                {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.email}</p>}
                            </div>

                            {/* Password Secure Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password">Contraseña de Seguridad</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-primary focus:bg-white'} rounded-xl text-gray-900 text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.password}</p>}
                            </div>

                            {/* Actions Row (Remember & Reset) */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-primary shadow-sm focus:ring-primary focus:ring-opacity-30 w-4 h-4 transition-all cursor-pointer bg-gray-50"
                                    />
                                    <span className="ms-2 text-xs font-semibold text-gray-500 group-hover:text-gray-900 transition-colors">Mantener sesión</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href="/recuperar"
                                        className="text-xs font-bold text-primary hover:text-primary-dark transition-colors drop-shadow-sm"
                                    >
                                        ¿Olvidaste tu clave?
                                    </Link>
                                )}
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
                                        Validando...
                                    </>
                                ) : (
                                    'Ingresar a mi cuenta'
                                )}
                            </button>
                            
                            {/* Diverted Route to Registration */}
                            <div className="text-center mt-6 pt-5 border-t border-gray-100">
                                <p className="text-gray-500 text-xs font-medium">
                                    ¿Aún no eres socio policial? 
                                    <Link href="/register" className="ml-1 text-primary font-bold hover:text-primary-dark hover:underline transition-colors">
                                        Solicita acceso
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
