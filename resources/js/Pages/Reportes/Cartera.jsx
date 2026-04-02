import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Wallet, 
    DownloadCloud, 
    ChevronLeft, 
    FileText, 
    PieChart, 
    TrendingUp, 
    AlertCircle, 
    CheckCircle2,
    Calendar,
    BadgeDollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

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

function ExportBar({ baseRoute, extraParams = '' }) {
    return (
        <div className="flex items-center gap-3">
            <a 
                href={`${route(baseRoute)}?formato=xlsx${extraParams}`} 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2"
            >
                <DownloadCloud className="w-3.5 h-3.5" /> Planilla Excel
            </a>
            <a 
                href={`${route(baseRoute)}?formato=pdf${extraParams}`} 
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

export default function Cartera({ auth, fecha_generacion, resumen, creditos }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                            <PieChart className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Cartera de Créditos
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Análisis de Colocación y Riesgo
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/50 flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> Generado: {fecha_generacion}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Cartera de Créditos" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card-fap border border-brand p-4 px-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[11px] font-black text-brand-main uppercase tracking-widest leading-none">Datos en Tiempo Real</p>
                        </div>
                        <ExportBar baseRoute="reportes.cartera" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                        <StatCard label="Total Créditos" value={resumen.total_creditos} icon={FileText} />
                        <StatCard label="Vigentes" value={resumen.vigentes} color="text-blue-600" icon={CheckCircle2} />
                        <StatCard label="En Mora" value={resumen.en_mora} color="text-red-600" icon={AlertCircle} />
                        <StatCard label="Pagados" value={resumen.pagados} color="text-emerald-600" icon={TrendingUp} />
                        <StatCard label="Otorgado" value={Number(resumen.monto_total_otorgado).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-brand-main" icon={BadgeDollarSign} />
                        <StatCard label="Sald. Vigente" value={Number(resumen.monto_vigente).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-blue-700" icon={Wallet} />
                        <StatCard label="Sald. Mora" value={Number(resumen.monto_mora).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-red-700" icon={AlertCircle} />
                    </div>

                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-brand-main uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Detalle de Colocación
                            </h3>
                            <span className="text-[10px] font-bold text-brand-muted bg-brand/5 px-2.5 py-1 rounded-lg border border-brand/50">
                                {creditos.length} Registros Encontrados
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 pl-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-16">ID</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Socio / Titular</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Documento</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Tipo Operación</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Aprobado</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Saldo Cap.</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand">Tasa</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand">Estado</th>
                                        <th className="px-4 pr-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">F. Desembolso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {creditos.map((c, index) => (
                                        <motion.tr 
                                            key={c.id} 
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="hover:bg-brand/5 transition-colors border-b border-brand/50 last:border-0"
                                        >
                                            <td className="px-4 pl-6 py-3 text-[11px] font-black text-brand-muted font-mono">{c.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-brand-main uppercase truncate max-w-[200px]">{c.socio}</span>
                                                    <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tight">{c.grado}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[11px] font-bold text-brand-muted font-mono">{c.ci}</td>
                                            <td className="px-4 py-3 text-[11px] font-bold text-brand-main uppercase tracking-tight">{c.tipo}</td>
                                            <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/50">Bs. {Number(c.monto_aprobado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-[12px] text-right font-black font-mono border-l border-brand/50 bg-card-fap/[0.02]">Bs. {Number(c.saldo_capital).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-[11px] text-center font-black text-brand-muted border-l border-brand/50">{c.tasa}%</td>
                                            <td className="px-4 py-3 text-center border-l border-brand/50">
                                                <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest border shadow-sm ${
                                                    c.estado === 'En Mora' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                    c.estado === 'Pagado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                    'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                }`}>{c.estado}</span>
                                            </td>
                                            <td className="px-4 pr-6 py-3 text-[11px] text-right font-bold text-brand-muted border-l border-brand/50">{c.fecha_desembolso}</td>
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
