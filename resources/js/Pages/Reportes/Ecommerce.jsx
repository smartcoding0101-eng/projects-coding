import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Calendar, 
    ChevronLeft, 
    ShoppingBag, 
    TrendingUp, 
    Package, 
    Users,
    ChevronRight,
    QrCode,
    CreditCard,
    ArrowUpRight,
    Activity,
    Layers,
    DollarSign,
    Trophy,
    Filter,
    FileText,
    FileSpreadsheet,
    CheckCircle2,
    X,
    Clock,
    Search,
    ShieldAlert
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

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
                <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
                {sublabel && <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter opacity-60">/ {sublabel}</span>}
            </div>
        </motion.div>
    );
}

export default function Ecommerce({ 
    auth, 
    filtros, 
    kpis, 
    recientes, 
    chart_labels, 
    chart_data, 
    top_productos, 
    ventas_por_tipo, 
    fecha_reporte 
}) {
    const [desde, setDesde] = useState(filtros.desde);
    const [hasta, setHasta] = useState(filtros.hasta);
    const [estadoPago, setEstadoPago] = useState(filtros.estado_pago || '');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleFilter = () => {
        router.get(route('reportes.ecommerce'), { desde, hasta, estado_pago: estadoPago }, { 
            preserveState: true,
            replace: true 
        });
    };

    const notifyExport = (tipo) => {
        setNotification({
            title: `Exportación ${tipo} Iniciada`,
            message: 'El sistema analítico está procesando los datos dinámicos. Tu descarga comenzará en breve.',
            type: 'success'
        });
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { size: 10, weight: '900', family: 'Inter' },
                bodyFont: { size: 12, weight: 'bold', family: 'Inter' },
                padding: 12,
                borderRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context) => `Bs ${context.parsed.y.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(156, 163, 175, 0.05)', drawBorder: false },
                ticks: { 
                    color: '#9ca3af', 
                    font: { size: 9, weight: 'bold' },
                    callback: (value) => `Bs ${value >= 1000 ? (value/1000) + 'k' : value}`
                }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 9, weight: 'bold' } }
            }
        },
        elements: {
            line: { tension: 0.45, borderWidth: 3 },
            point: { radius: 0, hoverRadius: 6, hitRadius: 10, backgroundColor: '#f97316' }
        }
    };

    const data = {
        labels: chart_labels,
        datasets: [
            {
                fill: true,
                label: 'Ventas Consolidadas',
                data: chart_labels.map((_, i) => chart_data[i] || 0),
                borderColor: '#f97316',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.15)');
                    gradient.addColorStop(1, 'rgba(249, 115, 22, 0.01)');
                    return gradient;
                },
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center py-0.5 gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                            <ShoppingBag className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex flex-col min-w-fit">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Business Intelligence E-Commerce
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase whitespace-nowrap">
                                Análisis Dinámico de Rendimiento Comercial | v3.5
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a 
                            href={route('reportes.ecommerce', { desde, hasta, estado_pago: estadoPago, formato: 'pdf' })}
                            target="_blank"
                            onClick={() => notifyExport('PDF')}
                            className="hidden sm:flex bg-card-fap border border-brand text-brand-muted hover:text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all items-center px-4 py-2 gap-2 shadow-sm"
                        >
                            <FileText className="w-3.5 h-3.5 text-red-500" /> Exportar PDF
                        </a>
                        <a 
                            href={route('reportes.ecommerce', { desde, hasta, estado_pago: estadoPago, formato: 'xlsx' })}
                            target="_blank"
                            onClick={() => notifyExport('Excel')}
                            className="hidden sm:flex bg-orange-600 border border-orange-700 text-white hover:bg-orange-700 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all items-center px-4 py-2 gap-2 shadow-md shadow-orange-500/20"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-white" /> Exportar Excel
                        </a>
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
            <Head title="Inteligencia Comercial | FAPCLAS" />

            {/* Notification Toast Estandarizado */}
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

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Barra de Filtros Dinámicos */}
                    <div className="bg-card-fap border border-brand p-4 rounded-2xl shadow-sm flex flex-wrap items-end gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                            <Filter className="w-24 h-24 text-brand-main" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-orange-500" /> Fecha Inicio
                            </label>
                            <input 
                                type="date" 
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                className="bg-brand/5 border border-brand/40 rounded-xl px-4 py-2 text-[11px] font-bold text-brand-main focus:ring-1 focus:ring-orange-500/50 w-44"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-orange-500" /> Fecha Fin
                            </label>
                            <input 
                                type="date" 
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                className="bg-brand/5 border border-brand/40 rounded-xl px-4 py-2 text-[11px] font-bold text-brand-main focus:ring-1 focus:ring-orange-500/50 w-44"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                <Activity className="w-3 h-3 text-orange-500" /> Estado de Pago
                            </label>
                            <select 
                                value={estadoPago}
                                onChange={(e) => setEstadoPago(e.target.value)}
                                className="bg-brand/5 border border-brand/40 rounded-xl px-4 py-2 text-[11px] font-bold text-brand-main focus:ring-1 focus:ring-orange-500/50 w-44 appearance-none"
                            >
                                <option value="">TODOS</option>
                                <option value="pagado">PAGADO</option>
                                <option value="pendiente">PENDIENTE</option>
                                <option value="error">ERROR / EXPIRADO</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleFilter}
                            className="bg-brand-main hover:bg-brand-dark text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-brand-main/20 active:scale-95"
                        >
                            <Search className="w-3.5 h-3.5" /> Procesar Reporte
                        </button>
                    </div>

                    {/* Fila de KPIs Dinámicos */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard 
                            label="Ingresos en Periodo" 
                            value={`Bs ${parseFloat(kpis.ventas_periodo).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={DollarSign} 
                            color="text-orange-600"
                            sublabel="VENTAS NETAS"
                        />
                        <StatCard 
                            label="Nivel Transaccional" 
                            value={`${kpis.pedidos_total} PEDIDOS`} 
                            icon={TrendingUp} 
                            color="text-blue-600"
                            sublabel="MOVIMIENTOS"
                        />
                        <StatCard 
                            label="Ticket Promedio" 
                            value={`Bs ${parseFloat(kpis.ticket_promedio).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={Activity} 
                            color="text-emerald-600"
                            sublabel="POR VENTA"
                        />
                        <StatCard 
                            label="Activos en Inventario" 
                            value={`Bs ${parseFloat(kpis.stock_valorizado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={Package} 
                            color="text-purple-600"
                            sublabel="STOCK TOTAL"
                        />
                    </div>

                    {/* Fila de Gráficos e Inteligencia de Productos */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Gráfico de Ventas */}
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 bg-card-fap border border-brand p-8 rounded-3xl shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                                <Activity className="w-48 h-48 text-brand-main" />
                            </div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2 mb-1">
                                        <TrendingUp className="w-4 h-4 text-orange-500" /> Curva de Rendimiento Estratégico
                                    </h3>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest bg-brand/5 px-2 py-0.5 rounded border border-brand/50 inline-block">Periodo de Análisis Consolidado</p>
                                </div>
                                <div className="text-[9px] font-black text-brand-muted uppercase tracking-widest bg-card-fap border border-brand px-3 py-1.5 rounded-xl">
                                    BI CORE v3.5
                                </div>
                            </div>
                            <div className="h-[320px] relative z-10">
                                <Line options={options} data={data} />
                            </div>
                        </motion.div>

                        {/* Top Productos High-Impact */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card-fap border border-brand rounded-3xl shadow-sm overflow-hidden flex flex-col relative group"
                        >
                            <div className="p-6 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-brand-main" /> Estrategia de Productos
                                </h3>
                                <Layers className="w-4 h-4 text-brand-muted opacity-30" />
                            </div>
                            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[360px]">
                                {top_productos.map((item, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-4 p-4 bg-brand/5 rounded-2xl border border-transparent hover:border-orange-500/30 transition-all group/item shadow-sm"
                                    >
                                        <div className="w-10 h-10 bg-main border border-brand rounded-xl flex items-center justify-center font-black text-brand-muted text-[11px] shadow-inner group-hover/item:border-orange-500/50 group-hover/item:text-orange-600 transition-colors">
                                            #{i+1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-black text-brand-main truncate uppercase tracking-tighter mb-1">{item.nombre}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest bg-brand/10 px-1.5 py-0.5 rounded leading-none">{item.total_vendido} UND</span>
                                                <span className="text-[9px] font-bold text-orange-500 uppercase tracking-tighter italic">Top Ventas</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-emerald-600 tracking-tighter leading-none mb-1">Bs {parseFloat(item.recaudado).toLocaleString()}</p>
                                            <p className="text-[8px] font-black text-brand-muted uppercase tracking-tighter opacity-60 leading-none">TOTAL</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Tabla de Auditoría Detallada Pedidos */}
                    <div className="bg-card-fap border border-brand rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-8 py-6 bg-brand/5 border-b border-brand flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" /> Registro Detallado de Transacciones
                                </h3>
                                <p className="text-[9px] font-black text-brand-muted uppercase tracking-[0.3em] mt-1">Audit Log en Tiempo Real</p>
                            </div>
                            <span className="text-[10px] font-black text-brand-muted uppercase bg-card-fap border border-brand px-4 py-1.5 rounded-xl">
                                {recientes.length} Ítems Cargados
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand/5">
                                        <th className="px-8 py-5 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Orden #</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Cliente Estratégico</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Método</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Estado Pago</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] text-right">Total Bs.</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-brand-muted uppercase tracking-[0.2em]">Fecha Auditoría</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand/30">
                                    {recientes.map((p) => (
                                        <tr key={p.id} className="hover:bg-brand/5 transition-colors group">
                                            <td className="px-8 py-4 text-[10px] font-black text-orange-600 italic">#{p.orden}</td>
                                            <td className="px-8 py-4 text-[11px] font-black text-brand-main uppercase group-hover:text-primary transition-colors">{p.cliente}</td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-2">
                                                    {p.metodo === 'qr' ? <QrCode className="w-3.5 h-3.5 text-indigo-500" /> : <CreditCard className="w-3.5 h-3.5 text-blue-500" />}
                                                    <span className="text-[10px] font-black uppercase text-brand-muted tracking-widest">{p.metodo}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                                                    p.estado === 'pagado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                                                    p.estado === 'pendiente' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                                                }`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-[11px] font-black text-brand-main text-right">Bs. {p.total.toLocaleString()}</td>
                                            <td className="px-8 py-4 text-[10px] font-bold text-brand-muted/70 italic">{p.fecha}</td>
                                        </tr>
                                    ))}
                                    {recientes.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-24 text-center">
                                                <p className="text-[10px] font-black uppercase text-brand-muted tracking-[0.3em] opacity-40 italic">No se encontraron registros en el rango seleccionado</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Security Audit Link */}
                    <div className="mt-8 flex items-center justify-center gap-8 opacity-25 grayscale hover:grayscale-0 transition-all cursor-default">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Seguridad Transaccional SSL</span>
                        </div>
                        <div className="w-2 h-2 bg-brand-muted/30 rounded-full" />
                        <div className="flex items-center gap-2">
                           <Activity className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">FAPCLAS AI ENGINE v3.5</span>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
