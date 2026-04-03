import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    Download, 
    FileText, 
    FileSpreadsheet,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Layers,
    Clock,
    ShieldAlert,
    CheckCircle2,
    X,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Recaudacion({ 
    auth, 
    filtros, 
    resumen, 
    detalle_pagos, 
    detalle_colocaciones, 
    grafico, 
    fecha_reporte 
}) {
    const [desde, setDesde] = useState(filtros.desde);
    const [hasta, setHasta] = useState(filtros.hasta);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleFilter = () => {
        router.get(route('reportes.recaudacion'), { desde, hasta }, { 
            preserveState: true,
            replace: true 
        });
    };

    const notifyExport = (tipo) => {
        setNotification({
            title: `Exportación ${tipo} Iniciada`,
            message: 'El sistema está generando el reporte analítico. La descarga comenzará pronto.',
            type: 'success'
        });
    };

    // Configuración del Gráfico
    const chartData = {
        labels: grafico.map(g => g.name),
        datasets: [
            {
                label: 'Recaudado (Ingresos)',
                data: grafico.map(g => g.recaudado),
                backgroundColor: 'rgba(16, 185, 129, 0.6)', // Emerald
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: 'Colocado (Inversión)',
                data: grafico.map(g => g.colocado),
                backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#94a3b8', font: { weight: 'bold', size: 10 } } },
        },
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Recaudación y Colocación | FAPCLAS" />

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-8 left-1/2 z-[100] w-full max-w-md px-4"
                    >
                        <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.2)] rounded-2xl p-5 flex items-center gap-5 backdrop-blur-xl">
                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-800 dark:text-white mb-1">{notification.title}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {notification.message}
                                </p>
                            </div>
                            <button 
                                onClick={() => setNotification(null)} 
                                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-main py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    
                    {/* Header y Exportaciones */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-brand-main tracking-tight uppercase flex items-center gap-3">
                                <TrendingUp className="w-7 h-7 text-primary" /> Recaudación de Cartera
                            </h2>
                            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-[0.2em] mt-1 ml-10">
                                Colocación vs Recuperación de Capital | {fecha_reporte}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <a 
                                href={route('reportes.recaudacion', { desde, hasta, formato: 'pdf' })}
                                target="_blank"
                                onClick={() => notifyExport('PDF')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-card-fap border border-brand hover:border-red-500/50 text-[10px] font-black uppercase tracking-widest text-brand-muted hover:text-red-600 rounded-xl transition-all shadow-sm"
                            >
                                <FileText className="w-4 h-4" /> Exportar PDF
                            </a>
                            <a 
                                href={route('reportes.recaudacion', { desde, hasta, formato: 'xlsx' })}
                                target="_blank"
                                onClick={() => notifyExport('Excel')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-[10px] font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-md shadow-primary/20"
                            >
                                <FileSpreadsheet className="w-4 h-4" /> Exportar Excel
                            </a>
                        </div>
                    </div>

                    {/* Barra de Filtros */}
                    <div className="bg-card-fap border border-brand rounded-2xl p-4 mb-8 flex flex-wrap items-end gap-6 shadow-sm">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-muted flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-primary" /> Fecha Inicio
                            </label>
                            <input 
                                type="date" 
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                className="bg-brand/5 border border-brand/40 rounded-xl px-4 py-2 text-[11px] font-bold text-brand-main focus:ring-1 focus:ring-primary/50 w-44"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-muted flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-primary" /> Fecha Fin
                            </label>
                            <input 
                                type="date" 
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                className="bg-brand/5 border border-brand/40 rounded-xl px-4 py-2 text-[11px] font-bold text-brand-main focus:ring-1 focus:ring-primary/50 w-44"
                            />
                        </div>
                        <button 
                            onClick={handleFilter}
                            className="bg-brand-main hover:bg-brand-dark text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <Filter className="w-3.5 h-3.5" /> Aplicar Filtros
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KPICard 
                            label="Total Recaudado" 
                            value={`Bs. ${resumen.total_recaudado.toLocaleString()}`} 
                            icon={ArrowUpRight} 
                            color="text-emerald-500"
                            trend="Capital Reintegrado"
                        />
                        <KPICard 
                            label="Capital vs Interés" 
                            value={`Bs. ${resumen.capital.toLocaleString()}`} 
                            secondary={`Bs. ${resumen.interes.toLocaleString()}`}
                            icon={PieChart} 
                            color="text-blue-500"
                            trend="Orgánico"
                        />
                        <KPICard 
                            label="Total Colocación" 
                            value={`Bs. ${resumen.total_colocado.toLocaleString()}`} 
                            icon={ArrowDownRight} 
                            color="text-primary"
                            trend="Nuevos Créditos"
                        />
                        <KPICard 
                            label="Índice Recuperación" 
                            value={`${resumen.recuperacion_ratio}%`} 
                            icon={TrendingUp} 
                            color="text-amber-500"
                            trend="Eficiencia de Cartera"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Gráfico Tendencia */}
                        <div className="lg:col-span-2 bg-card-fap border border-brand rounded-3xl p-6 shadow-sm min-h-[400px]">
                            <h3 className="text-[11px] font-black text-brand-main uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" /> Tendencia Semestral: Recaudación vs Colocación
                            </h3>
                            <div className="h-[300px]">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Listado Rápido */}
                        <div className="bg-card-fap border border-brand rounded-3xl overflow-hidden flex flex-col shadow-sm">
                            <div className="px-6 py-4 bg-brand/5 border-b border-brand">
                                <h3 className="text-[11px] font-black text-brand-main uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-primary" /> Últimas Colocaciones
                                </h3>
                            </div>
                            <div className="divide-y divide-brand/30 overflow-y-auto max-h-[352px]">
                                {detalle_colocaciones.slice(0, 8).map((c) => (
                                    <div key={c.id} className="px-6 py-3.5 hover:bg-brand/5 transition-colors">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <span className="text-[11px] font-black text-brand-main uppercase">{c.socio}</span>
                                            <span className="text-[10px] font-bold text-primary tracking-tight">Bs. {c.monto.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-medium text-brand-muted uppercase">{c.tipo}</span>
                                            <span className="text-[9px] font-bold text-brand-muted/50">{c.fecha}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tabla Detallada Recaudación */}
                    <div className="mt-8 bg-card-fap border border-brand rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-6 py-5 bg-brand/5 border-b border-brand flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-brand-main uppercase tracking-[0.2em] flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5 text-primary" /> Inventario Detallado de Recaudación
                            </h3>
                            <span className="text-[9px] font-black text-brand-muted uppercase bg-card-fap border border-brand px-3 py-1 rounded-lg">
                                {detalle_pagos.length} Movimientos Registrados
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand/5">
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Fecha</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Socio</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Crédito #</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Cuota</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] text-right">Capital</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] text-right">Interés</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] text-right">Total Bs.</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Método</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand/30">
                                    {detalle_pagos.map((p) => (
                                        <tr key={p.id} className="hover:bg-brand/5 transition-colors group">
                                            <td className="px-6 py-4 text-[10px] font-bold text-brand-muted">{p.fecha}</td>
                                            <td className="px-6 py-4 text-[11px] font-black text-brand-main uppercase group-hover:text-primary transition-colors">{p.socio}</td>
                                            <td className="px-6 py-4 text-[10px] font-black text-brand-muted italic">#{p.credito_id}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-brand-muted">{p.cuota}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-brand-muted text-right">{p.capital.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-brand-muted text-right text-amber-600/80">{p.interes.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-[11px] font-black text-brand-main text-right">Bs. {p.total.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                    {p.metodo}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Security */}
                    <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Acceso Central Auditado</span>
                        </div>
                        <div className="w-1 h-1 bg-brand-muted rounded-full" />
                        <div className="flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5" />
                           <span className="text-[9px] font-black uppercase tracking-widest">Core FAPCLAS v3.5 | RECAUDACION BI</span>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function KPICard({ label, value, icon: Icon, color, trend, secondary }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-card-fap border border-brand p-5 rounded-3xl relative overflow-hidden group shadow-sm"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-brand/5 border border-brand/50 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-[9px] font-black text-brand-muted opacity-50 uppercase tracking-widest bg-brand/5 px-2 py-1 rounded-lg">
                    {trend}
                </div>
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">{label}</p>
                <h3 className="text-xl font-black text-brand-main tracking-tight">{value}</h3>
                {secondary && <p className="text-[9px] font-bold text-brand-muted italic">Bs. {secondary} Interés</p>}
            </div>
            
            {/* Subtle background glow */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity ${color.replace('text', 'bg')}`} />
        </motion.div>
    );
}
