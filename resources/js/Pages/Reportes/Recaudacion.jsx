import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    BarChart3, 
    ChevronLeft, 
    TrendingUp, 
    TrendingDown, 
    Layers,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Activity,
    ShieldCheck,
    Briefcase,
    PieChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatCard({ label, value, color = 'text-primary', icon: Icon, sublabel, trend }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card-fap rounded-2xl shadow-sm border border-brand p-6 relative overflow-hidden group hover:shadow-md transition-all cursor-default"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform ${color.replace('text-', 'bg-').replace('600', '500')}/5`} />
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-brand/5 border border-brand/50 ${color.replace('text-', 'text- opacity-70')}`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">{label}</p>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                        {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <p className={`text-2xl font-black tracking-tighter ${color} mb-1`}>{value}</p>
                {sublabel && <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest opacity-60">{sublabel}</span>}
            </div>
        </motion.div>
    );
}

export default function Recaudacion({ auth, labels, dataset_colocacion, dataset_recaudacion, totales }) {
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: '#6b7280',
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    padding: 20,
                    font: { weight: '900', size: 10, family: 'Inter', textTransform: 'uppercase' }
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { size: 10, weight: '900', family: 'Inter' },
                bodyFont: { size: 12, weight: 'bold', family: 'Inter' },
                padding: 12,
                borderRadius: 12,
                displayColors: true,
                boxPadding: 6,
                callbacks: {
                    label: (context) => `${context.dataset.label}: Bs ${context.parsed.y.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(156, 163, 175, 0.03)', drawBorder: false },
                ticks: { 
                    color: '#9ca3af', 
                    font: { size: 9, weight: 'bold' },
                    callback: (value) => value >= 1000 ? (value/1000) + 'k' : value
                }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 9, weight: 'bold' } }
            }
        }
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Colocación (Préstamos)',
                data: dataset_colocacion,
                backgroundColor: 'rgba(59, 130, 246, 0.85)',
                hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                borderRadius: 8,
                barThickness: 16,
            },
            {
                label: 'Recaudación (Amortización)',
                data: dataset_recaudacion,
                backgroundColor: 'rgba(16, 185, 129, 0.85)',
                hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
                borderRadius: 8,
                barThickness: 16,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Business Intelligence de Crédito
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Balance de Colocación vs Flujo de Recaudación
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
            <Head title="Inteligencia de Recaudación | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Fila de Totales Premium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard 
                            label="Colocación Bruta Anual" 
                            value={`Bs ${parseFloat(totales.anual_colocacion).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={Briefcase} 
                            color="text-blue-600"
                            sublabel="CAPITAL EXPUESTO"
                        />
                        <StatCard 
                            label="Recaudación Efectiva Anual" 
                            value={`Bs ${parseFloat(totales.anual_recaudacion).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={TrendingUp} 
                            color="text-emerald-600"
                            sublabel="RECUPERO DE CARTERA"
                        />
                        <StatCard 
                            label="Delta de Liquidez (Neto)" 
                            value={`Bs ${parseFloat(totales.liquidez_neta).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={PieChart} 
                            color={totales.liquidez_neta >= 0 ? "text-emerald-600" : "text-red-600"}
                            sublabel="FLUJO DE CAJA NETO"
                            trend={24}
                        />
                    </div>

                    {/* Gráfico y Tabla Analítica */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Gráfico Principal */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-9 bg-card-fap border border-brand p-8 rounded-2xl shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                                <Activity className="w-64 h-64 text-brand-main" />
                            </div>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-blue-600" /> Rendimiento Comparativo Integral
                                    </h3>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest bg-brand/5 px-2 py-0.5 rounded border border-brand/50 inline-block">Perspectiva de 12 Meses Calendario</p>
                                </div>
                                <div className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-3 py-1.5 rounded-xl border border-brand/50">Datos en Tiempo Real</div>
                            </div>
                            <div className="h-[400px] relative z-10">
                                <Bar options={options} data={data} />
                            </div>
                        </motion.div>

                        {/* Desglose Lateral de Liquidez */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-3 space-y-4"
                        >
                            <div className="bg-card-fap border border-brand rounded-2xl shadow-sm flex flex-col h-full max-h-[550px] overflow-hidden relative">
                                <div className="p-5 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-primary" /> Histórico
                                    </h3>
                                    <span className="text-[9px] font-black text-brand-muted bg-brand/5 px-2 py-1 rounded border border-brand/50 uppercase">Delta</span>
                                </div>
                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                    <table className="w-full text-left">
                                        <thead className="bg-main text-brand-muted sticky top-0 z-10 border-b border-brand font-black uppercase">
                                            <tr>
                                                <th className="px-5 py-3 text-[9px] tracking-[0.1em]">Mes / Gestión</th>
                                                <th className="px-5 py-3 text-[9px] tracking-[0.1em] text-right border-l border-brand">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand/10">
                                            {labels.map((label, i) => {
                                                const diff = dataset_recaudacion[i] - dataset_colocacion[i];
                                                return (
                                                    <tr key={i} className="hover:bg-brand/5 transition-colors group/row">
                                                        <td className="px-5 py-4">
                                                            <div className="font-black text-brand-main uppercase tracking-tighter text-[11px] group-hover/row:text-primary transition-colors">{label}</div>
                                                            <div className="text-[8px] font-bold text-brand-muted uppercase tracking-widest mt-0.5 opacity-60">CIERRE MENSUAL</div>
                                                        </td>
                                                        <td className="px-5 py-4 text-right border-l border-brand/50">
                                                            <div className={`font-black font-mono text-[11px] ${diff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                                {diff >= 0 ? '+' : ''}{diff.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                            </div>
                                                            <div className={`text-[8px] font-extrabold uppercase tracking-tighter mt-1 opacity-60 ${diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                {diff >= 0 ? 'SUPERÁVIT' : 'DÉFICIT'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }).reverse()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
