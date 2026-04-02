import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    CalendarDays, 
    DownloadCloud, 
    ChevronLeft, 
    Users, 
    ReceiptText, 
    HandCoins,
    Search,
    FileSpreadsheet,
    FileText,
    Activity,
    ShieldCheck,
    CreditCard,
    ArrowUpRight,
    AlertTriangle,
    Clock,
    DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StatCard({ label, value, color = 'text-primary', icon: Icon, sublabel }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card-fap rounded-2xl shadow-sm border border-brand p-5 relative overflow-hidden group hover:shadow-md transition-all cursor-default"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform ${color.replace('text-', 'bg-').replace('600', '500')}/5`} />
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-brand/5 border border-brand/50 ${color.replace('text-', 'text- opacity-70')}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">{label}</p>
            </div>
            <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
                {sublabel && <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter opacity-60">/ {sublabel}</span>}
            </div>
        </motion.div>
    );
}

export default function Planilla({ auth, titulo, cooperativa, periodo, fecha_generacion, total_socios, total_cuotas, total_general, items }) {
    const [mes, setMes] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const cambiarMes = (e) => {
        e.preventDefault();
        if (mes) router.get(route('reportes.planilla'), { mes }, { preserveState: true });
    };

    const handleExport = async (formato) => {
        setIsDownloading(true);
        try {
            const response = await window.axios({
                url: route('reportes.planilla'),
                params: { mes, formato },
                method: 'GET',
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = formato === 'csv' ? 'csv' : 'pdf';
            link.setAttribute('download', `planilla_descuento_${mes || 'actual'}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error exportando la planilla.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                            <ReceiptText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Planilla Central de Descuentos
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Gestión de RRHH e Integración de Tesorería
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
            <Head title="Exportación de Planillas | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Filtros y Resumen High-Impact */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Selector de Período Premium */}
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-4 bg-card-fap border border-brand p-8 rounded-2xl shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                                <CalendarDays className="w-48 h-48 text-brand-main" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase text-brand-main mb-6 tracking-[0.2em] flex items-center gap-2 relative z-10">
                                <Activity className="w-4 h-4 text-purple-500" /> Parámetros de Generación
                            </h3>
                            <form onSubmit={cambiarMes} className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-brand-muted mb-3 block tracking-widest leading-none">Seleccionar Gestión / Mes</label>
                                    <div className="relative group/input">
                                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted group-hover/input:text-primary transition-colors" />
                                        <input 
                                            type="month" 
                                            value={mes} 
                                            onChange={(e) => setMes(e.target.value)} 
                                            className="w-full bg-main border-brand rounded-2xl pl-11 text-sm font-black text-brand-main focus:ring-primary focus:border-primary transition-all tracking-tight" 
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-brand-main hover:bg-brand-hover text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5">
                                    <Search className="w-4 h-4" /> Sincronizar Planilla
                                </button>
                                
                                <div className="pt-8 border-t border-brand/50 grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => handleExport('pdf')}
                                        disabled={isDownloading}
                                        className="py-3.5 bg-card-fap border border-brand text-brand-muted hover:text-red-600 hover:border-red-600/30 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <FileText className="w-4 h-4" /> PDF
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleExport('csv')}
                                        disabled={isDownloading}
                                        className="py-3.5 bg-card-fap border border-brand text-brand-muted hover:text-emerald-600 hover:border-emerald-600/30 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" /> CSV
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        {/* KPIs Consilidados */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard 
                                label="Sourcing Afiliados" 
                                value={total_socios} 
                                icon={Users} 
                                color="text-purple-600"
                                sublabel="ACTIVOS EN CICLO"
                            />
                            <StatCard 
                                label="Operaciones Identificadas" 
                                value={total_cuotas} 
                                icon={CreditCard} 
                                color="text-blue-600"
                                sublabel="CANT. CUOTAS"
                            />
                            <StatCard 
                                label="Cartera a Recaudar" 
                                value={`Bs ${parseFloat(total_general).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                                icon={DollarSign} 
                                color="text-emerald-600"
                                sublabel="TOTAL PLANILLA"
                            />
                            
                            {/* Card de Información Extra (Solo visible en grandes) */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="md:col-span-3 bg-card-fap border border-brand p-6 rounded-2xl flex items-center justify-between group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:rotate-6 transition-transform">
                                        <ShieldCheck className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">Entidad Certificante</p>
                                        <h4 className="text-sm font-black text-brand-main uppercase tracking-widest">{cooperativa}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">Periodo Vigente</p>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-black rounded-lg border border-primary/20 uppercase tracking-widest">{periodo}</span>
                                </div>
                            </motion.div>
                        </div>

                    </div>

                    {/* Tabla de Detalle High-Density Fiori */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col relative group"
                    >
                        <div className="p-6 border-b border-brand bg-card-fap/50 flex items-center justify-between relative z-10">
                            <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2">
                                <HandCoins className="w-4 h-4 text-primary" /> Desglose Analítico de Deducciones
                            </h3>
                            <div className="text-[9px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-2.5 py-1 rounded-lg border border-brand/50">Generado: {fecha_generacion}</div>
                        </div>
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                            <table className="w-full text-left">
                                <thead className="bg-main text-brand-muted sticky top-0 z-10 border-b border-brand font-black uppercase pointer-events-none">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] tracking-wider w-[25%]">Afiliado / Identidad</th>
                                        <th className="px-6 py-4 text-[10px] tracking-wider border-l border-brand">Escalafón / Destino</th>
                                        <th className="px-6 py-4 text-[10px] tracking-wider text-center border-l border-brand">Cuota</th>
                                        <th className="px-6 py-4 text-[10px] tracking-wider text-right border-l border-brand whitespace-nowrap">Capital + Int.</th>
                                        <th className="px-6 py-4 text-[10px] tracking-wider text-right border-l border-brand whitespace-nowrap">Recargo Mora</th>
                                        <th className="px-6 py-4 text-[10px] tracking-wider text-right border-l border-brand whitespace-nowrap font-black">Total Neto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand/10">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-48 text-center opacity-30">
                                                <ReceiptText className="w-16 h-16 mx-auto mb-6 stroke-1" />
                                                <p className="text-xs font-black uppercase tracking-[0.3em]">Sin Registros de Descuento</p>
                                                <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">No existen deducciones programadas para el ciclo seleccionado.</p>
                                            </td>
                                        </tr>
                                    ) : items.map((item, i) => (
                                        <motion.tr 
                                            key={i} 
                                            initial={{ opacity: 0, x: -5 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.01 }}
                                            className="hover:bg-brand/5 transition-colors group/row"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-black text-brand-main uppercase tracking-tighter text-[12px] group-hover/row:text-primary transition-colors leading-none mb-1.5">{item.socio_nombre}</div>
                                                <div className="text-[9px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                                                    <span className="bg-brand/10 px-1.5 py-0.5 rounded leading-none">CI: {item.socio_ci}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-l border-brand/50">
                                                <div className="font-bold text-[11px] text-brand-main uppercase tracking-tight mb-1 truncate w-40">{item.socio_grado}</div>
                                                <div className="text-[9px] text-brand-muted font-bold uppercase tracking-widest opacity-60 truncate w-40 leading-none">{item.socio_destino}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center border-l border-brand/50">
                                                <span className="inline-block px-2.5 py-1 bg-brand/10 text-brand-main text-[10px] font-black rounded-lg border border-brand/50 tracking-tighter">N° {item.nro_cuota}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right border-l border-brand/50 font-mono text-[11px] text-brand-main">
                                                Bs {(Number(item.capital) + Number(item.interes)).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className={`px-6 py-4 text-right border-l border-brand/50 font-mono text-[11px] ${Number(item.mora) > 0 ? 'text-red-600 font-extrabold' : 'text-brand-muted'}`}>
                                                {Number(item.mora) > 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="leading-none">+ Bs {Number(item.mora).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
                                                        <span className="text-[8px] uppercase tracking-tighter mt-1 opacity-80">Recargo Aplicado</span>
                                                    </div>
                                                ) : <span className="opacity-40">0.00</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right border-l border-brand/50 font-black font-mono text-[13px] text-brand-main group-hover/row:text-emerald-600 transition-colors">
                                                Bs {Number(item.total_descontar).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
