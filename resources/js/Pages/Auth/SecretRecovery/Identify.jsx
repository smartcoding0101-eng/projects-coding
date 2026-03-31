import { Head, useForm, Link } from '@inertiajs/react';

export default function Identify() {
    const { data, setData, post, processing, errors } = useForm({
        ci: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('secret.store'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 selection:bg-primary/20 leading-relaxed font-sans">
            <Head title="Recuperar Contraseña - FAPCLAS R.L." />

            {/* Floating Recovery Card */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row border border-gray-100 min-h-[600px] transform transition-all">
                
                {/* 1. Left Column (Visual Image - Security Focused) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col justify-between overflow-hidden group">
                    <img 
                        src="https://images.unsplash.com/photo-1454165833767-0275084924a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Security Authentication" 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[30s] ease-out opacity-60 mix-blend-luminosity"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-emerald-900/70 to-emerald-800/30 mix-blend-multiply"></div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent h-1/2 mt-auto"></div>

                    {/* Top Badge */}
                    <div className="relative z-10 p-10 lg:p-12 max-w-lg mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#4ade80]"></span>
                            Recuperación Segura Activa
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-6 leading-tight drop-shadow-lg">
                            Tu acceso es nuestra prioridad número uno.
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed font-sans pr-6 opacity-90 border-l-2 border-emerald-500/40 pl-4">
                            Sigue los protocolos de validación para restablecer tus credenciales de forma autónoma y protegida por nuestra arquitectura institucional.
                        </p>
                    </div>

                    {/* Protection Status */}
                    <div className="relative z-10 p-10 lg:p-12 w-full">
                        <div className="flex items-center gap-6 mb-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">Respaldo Biométrico</span>
                                <span className="text-xs text-white/90 font-mono italic">IDENTITY VERIFICATION SYSTEM</span>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/40 uppercase tracking-tighter font-bold">Estado del Enlace</span>
                                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                                    ESTABLE
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column (Form Area) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-10 lg:px-16 bg-white z-10">
                    <div className="w-full max-w-sm mx-auto">
                        
                        {/* Header & Logo */}
                        <div className="mb-8 text-center lg:text-left">
                            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/30">
                                    F
                                </div>
                                <span className="font-display font-bold text-xl tracking-tight text-gray-800">
                                    FAPCLAS<span className="text-gray-400 font-medium ml-1 text-sm">R.L.</span>
                                </span>
                            </Link>
                            
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Identificación del Socio</h2>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">Ingresa tu Carnet de Identidad (CI) para iniciar el proceso de validación.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="ci">Número de Documento (CI)</label>
                                <input
                                    id="ci"
                                    type="text"
                                    name="ci"
                                    value={data.ci}
                                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.ci ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-primary focus:ring-primary focus:bg-white'} rounded-xl text-gray-900 text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                    autoFocus={true}
                                    onChange={(e) => setData('ci', e.target.value)}
                                    placeholder="Ej. 6543210"
                                    required
                                />
                                {errors.ci && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.ci}</p>}
                            </div>

                            {/* Info Banner */}
                            <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl flex gap-3 items-start">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-[11px] leading-relaxed text-emerald-800/80 font-medium italic">
                                    Tu número de CI debe coincidir exactamente con el registrado en tu expediente institucional FAPCLAS.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3.5 px-6 bg-primary text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 hover:bg-primary-dark hover:-translate-y-0.5 flex justify-center items-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                            >
                                {processing ? 'Validando...' : 'Verificar Identidad'}
                            </button>
                            
                            <div className="text-center mt-6 pt-5 border-t border-gray-100">
                                <Link href={route('login')} className="text-gray-500 text-xs font-bold hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
