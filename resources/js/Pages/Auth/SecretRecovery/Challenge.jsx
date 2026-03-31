import { Head, useForm, Link } from '@inertiajs/react';
import { ShieldAlert, Fingerprint } from 'lucide-react';

export default function Challenge({ pregunta_secreta, ci }) {
    const { data, setData, post, processing, errors } = useForm({
        respuesta: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('secret.verify'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 selection:bg-primary/20 leading-relaxed font-sans">
            <Head title="Verificación de Identidad - FAPCLAS R.L." />

            {/* Floating Challenge Card */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row border border-gray-100 min-h-[600px] transform transition-all">
                
                {/* 1. Left Column (Visual - Validation Theme) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col justify-between overflow-hidden group">
                    <img 
                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Identity Verification" 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[30s] ease-out opacity-60 mix-blend-luminosity"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-amber-900/70 to-amber-800/30 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent h-1/2 mt-auto"></div>

                    {/* Content Badge */}
                    <div className="relative z-10 p-10 lg:p-12 max-w-lg mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <ShieldAlert className="w-3 h-3 text-amber-400" />
                            Validación de Identidad
                        </div>
                        <h3 className="font-display font-bold text-3xl text-white mb-6 leading-tight drop-shadow-lg">
                            Cuestionario de seguridad personal.
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed font-sans pr-6 opacity-90 border-l-2 border-amber-500/40 pl-4">
                            Para proceder con el cambio de clave, es imperativo que respondas correctamente a la pregunta secreta configurada en tu perfil.
                        </p>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="relative z-10 p-10 lg:p-12 w-full">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                <Fingerprint className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <span className="block text-[10px] text-white/40 uppercase font-black tracking-widest">Socio Autenticado</span>
                                <span className="text-white font-mono text-xs">CI: {ci?.substring(0, 3)}****</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column (The Challenge) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-10 lg:px-16 bg-white z-10">
                    <div className="w-full max-w-sm mx-auto">
                        
                        {/* Header & Isologo */}
                        <div className="mb-10 text-center lg:text-left">
                            <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/30">
                                    F
                                </div>
                                <span className="font-display font-bold text-xl tracking-tight text-gray-800">
                                    FAPCLAS<span className="text-gray-400 font-medium ml-1 text-sm">R.L.</span>
                                </span>
                            </Link>

                            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 tracking-tight">Pregunta de Seguridad</h2>
                            
                            {/* The Question Box */}
                            <div className="relative p-6 bg-amber-50/50 border border-amber-100 rounded-3xl overflow-hidden shadow-inner group/q">
                                <div className="absolute top-0 right-0 p-3 opacity-10 transform translate-x-2 -translate-y-2 group-hover/q:scale-110 transition-transform">
                                    <ShieldAlert className="w-12 h-12 text-amber-600" />
                                </div>
                                <p className="text-xs uppercase tracking-widest font-black text-amber-600/60 mb-2">Desafío del Sistema</p>
                                <p className="text-gray-800 font-bold text-lg leading-relaxed font-serif italic">
                                    "{pregunta_secreta}"
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="respuesta">Tu Respuesta Secreta</label>
                                <input
                                    id="respuesta"
                                    type="password"
                                    name="respuesta"
                                    value={data.respuesta}
                                    className={`w-full px-4 py-4 bg-gray-50 border ${errors.respuesta ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-amber-500 focus:ring-amber-500 focus:bg-white'} rounded-xl text-gray-900 text-sm transition-all font-medium focus:ring-2 focus:ring-opacity-20 outline-none shadow-sm`}
                                    autoFocus={true}
                                    onChange={(e) => setData('respuesta', e.target.value)}
                                    placeholder="Escribe tu respuesta aquí..."
                                    required
                                />
                                {errors.respuesta && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.respuesta}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3.5 px-6 bg-amber-500 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:bg-amber-600 hover:-translate-y-0.5 flex justify-center items-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                            >
                                {processing ? 'Autenticando...' : 'Confirmar Identidad'}
                            </button>
                            
                            <div className="text-center mt-6 pt-5 border-t border-gray-100 flex flex-col gap-3">
                                <Link href={route('secret.request')} className="text-gray-500 text-xs font-semibold hover:text-gray-900 transition-colors underline decoration-gray-200 underline-offset-4">
                                    Volver al paso anterior
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
