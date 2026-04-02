import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pickaxe, ChevronLeft, Construction, Clock, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Construccion({ auth, titulo }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand/10 p-2 rounded-lg border border-brand/20">
                            <Pickaxe className="w-5 h-5 text-brand-muted" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                {titulo || 'Módulo Protegido'}
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Próxima Fase de Implementación Analítica
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <Link 
                            href={route('reportes.index')} 
                            className="bg-card-fap border border-brand text-brand-muted hover:text-brand-main text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center px-4 py-2 gap-2"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Volver
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${titulo} | FAPCLAS`} />

            <div className="py-24 min-h-[85vh] bg-main flex items-center justify-center relative overflow-hidden">
                {/* Fondo Decorativo Premium */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto px-6 text-center z-10"
                >
                    <div className="relative inline-block mb-12">
                        <motion.div 
                            animate={{ rotate: [12, -12, 12] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-24 h-24 bg-card-fap border-2 border-brand rounded-[2.5rem] mx-auto flex items-center justify-center shadow-xl relative z-10"
                        >
                            <Construction className="w-10 h-10 text-brand-muted" />
                        </motion.div>
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl"
                        />
                    </div>
                    
                    <h3 className="text-4xl font-black text-brand-main tracking-tighter uppercase mb-6 leading-none">
                        Ingeniería en <span className="text-primary">Progreso</span>
                    </h3>
                    
                    <p className="text-brand-muted font-bold text-sm max-w-lg mx-auto mb-10 leading-relaxed uppercase tracking-widest opacity-80">
                        Este reporte estadístico está siendo consolidado por nuestro equipo de arquitectura financiera. Estamos refinando la integración de datos para garantizar precisión absoluta.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
                        <div className="p-4 bg-card-fap border border-brand rounded-2xl">
                            <Clock className="w-4 h-4 text-primary mx-auto mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Etapa</p>
                            <p className="text-[11px] font-black text-brand-main uppercase tracking-tighter">Desarrollo</p>
                        </div>
                        <div className="p-4 bg-card-fap border border-brand rounded-2xl">
                            <Activity className="w-4 h-4 text-blue-500 mx-auto mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Audit</p>
                            <p className="text-[11px] font-black text-brand-main uppercase tracking-tighter">Fase 2</p>
                        </div>
                        <div className="p-4 bg-card-fap border border-brand rounded-2xl">
                            <Sparkles className="w-4 h-4 text-emerald-500 mx-auto mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Calidad</p>
                            <p className="text-[11px] font-black text-brand-main uppercase tracking-tighter">Premium UI</p>
                        </div>
                    </div>

                    <Link 
                        href={route('reportes.index')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-main hover:bg-brand-hover text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl hover:-translate-y-1 active:scale-95 group"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Retornar al Centro Analítico
                    </Link>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
