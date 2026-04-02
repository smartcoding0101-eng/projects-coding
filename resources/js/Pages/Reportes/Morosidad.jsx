import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    AlertTriangle, 
    DownloadCloud, 
    ChevronLeft, 
    FileWarning, 
    TrendingDown, 
    Users, 
    BadgeDollarSign,
    Calendar,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

function ExportBar({ baseRoute }) {
    return (
        <div className="flex items-center gap-3">
            <a 
                href={`${route(baseRoute)}?formato=xlsx`} 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2"
            >
                <DownloadCloud className="w-3.5 h-3.5" /> Planilla Excel
            </a>
            <a 
                href={`${route(baseRoute)}?formato=pdf`} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2" 
                target="_blank"
            >
                <FileText className="w-3.5 h-3.5" /> Informe PDF
            </a>
            <Link 
                href={route('reportes.index')} 
                className="px-4 py-2 bg-card-fap border border-brand text-brand-muted hover:text-brand-main text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
            >
                <ChevronLeft className="w-3.5 h-3.5" /> Volver
            </Link>
        </div>
    );
}

function StatCard({ label, value, color = 'text-primary', prefix = '', icon: Icon }) {
    return (
        <div className="bg-card-fap rounded-2xl shadow-sm border border-brand p-5 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-brand/5 border border-brand/50 ${color.replace('text-', 'text- opacity-70')}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.15em]">{label}</p>
            </div>
            <p className={`text-2xl font-black tracking-tighter ${color}`}>{prefix}{value}</p>
        </div>
    );
}

export default function Morosidad({ auth, fecha_generacion, resumen, cuotas }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                            <FileWarning className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Morosidad Corporativa
                            </span>
                            <span className="text-[11px] text-red-600 font-bold tracking-wider uppercase">
                                Reporte Crítico de Incumplimiento
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/50 flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> Corte al: {fecha_generacion}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Morosidad | FAPCLAS" />
            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card-fap border border-brand p-4 px-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-[11px] font-black text-red-600 uppercase tracking-widest leading-none">Alerta de Riesgo Crediticio</p>
                        </div>
                        <ExportBar baseRoute="reportes.morosidad" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Cuotas Atrasadas" value={resumen.total_cuotas_atrasadas} color="text-red-600" icon={AlertTriangle} />
                        <StatCard label="Socios Afectados" value={resumen.socios_afectados} color="text-orange-600" icon={Users} />
                        <StatCard label="Capital Moroso" value={Number(resumen.total_capital_moroso).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-red-700" icon={BadgeDollarSign} />
                        <StatCard label="Mora Acumulada" value={Number(resumen.total_mora_acumulada).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-red-800" icon={TrendingDown} />
                    </div>

                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-brand bg-red-500/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-brand-main uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" /> Detalle de Mora Exigible
                            </h3>
                            <span className="text-[10px] font-bold text-red-700 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                                {cuotas.length} Cuotas en Mora
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 pl-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-24">Crédito</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Socio / Titular</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Tipo Operación</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand">Nro C.</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand w-32">Vencimiento</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand w-24">Días Mora</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Capital</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Interés/Mora</th>
                                        <th className="px-4 pr-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand bg-red-500/5">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuotas.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-16 text-center bg-card-fap">
                                                <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                                                    ✅ Cartera Saludable (Sin Mora Registrada)
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                    {cuotas.map((c, i) => (
                                        <motion.tr 
                                            key={i} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="hover:bg-red-500/5 transition-colors border-b border-brand/50 last:border-0"
                                        >
                                            <td className="px-4 pl-6 py-3 text-[11px] font-black text-brand-muted font-mono">#{c.credito_id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-brand-main uppercase truncate max-w-[200px]">{c.socio}</span>
                                                    <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tight">{c.ci} · {c.grado}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[11px] font-bold text-brand-muted uppercase tracking-tight">{c.tipo_credito}</td>
                                            <td className="px-4 py-3 text-[11px] text-center font-black font-mono border-l border-brand/50">{c.nro_cuota}</td>
                                            <td className="px-4 py-3 text-[11px] text-center font-bold text-brand-muted border-l border-brand/50">{c.fecha_vencimiento}</td>
                                            <td className="px-4 py-3 text-center border-l border-brand/50">
                                                <span className="px-2.5 py-0.5 bg-red-600 text-white font-black rounded-lg text-[10px] uppercase tracking-tighter shadow-sm">{c.dias_mora} Días</span>
                                            </td>
                                            <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/50">Bs. {Number(c.capital).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-[11px] text-right font-black font-mono text-red-600 border-l border-brand/50 tracking-tighter">Bs. {Number(c.mora).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 pr-6 py-3 text-[12px] text-right font-black font-mono text-red-700 bg-red-500/5 border-l border-brand/50 tracking-tighter">Bs. {Number(c.total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
