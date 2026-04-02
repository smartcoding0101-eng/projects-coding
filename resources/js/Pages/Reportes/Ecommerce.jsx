import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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
    Trophy
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
import { motion } from 'framer-motion';

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
                <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
                {sublabel && <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter opacity-60">/ {sublabel}</span>}
            </div>
        </motion.div>
    );
}

export default function Ecommerce({ auth, kpis, chart_labels, chart_data, top_productos, ventas_por_tipo }) {
    
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
                label: 'Ventas Proyectadas',
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
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
                            <ShoppingBag className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Business Intelligence E-Commerce
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Análisis de Rendimiento Comercial y Transaccional
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
            <Head title="Inteligencia Comercial | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Fila de KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard 
                            label="Valorización de Inventario" 
                            value={`Bs ${parseFloat(kpis.stock_valorizado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={Package} 
                            color="text-orange-600"
                            sublabel="TOTAL STOCK"
                        />
                        <StatCard 
                            label="Ingresos Históricos" 
                            value={`Bs ${parseFloat(kpis.ventas_historicas).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={TrendingUp} 
                            color="text-blue-600"
                            sublabel="RECAUDACIÓN"
                        />
                        <StatCard 
                            label="Pedidos Registrados" 
                            value={kpis.pedidos_hoy} 
                            icon={Activity} 
                            color="text-emerald-600"
                            sublabel="VENTAS HOY"
                        />
                        <StatCard 
                            label="Ecosistema Digital" 
                            value={kpis.usuarios_activos} 
                            icon={Users} 
                            color="text-purple-600"
                            sublabel="USUARIOS CLAS"
                        />
                    </div>

                    {/* Reporte Visual de Ventas y Top Productos */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Gráfico de Ventas */}
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 bg-card-fap border border-brand p-8 rounded-2xl shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                                <Activity className="w-48 h-48 text-brand-main" />
                            </div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-orange-500" /> Curva de Crecimiento Comercial
                                    </h3>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest bg-brand/5 px-2 py-0.5 rounded border border-brand/50 inline-block">Proyección Semestral Consolidada</p>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-tighter bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                    <ArrowUpRight className="w-3 h-3" /> Tendencia Positiva
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
                            className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col relative group"
                        >
                            <div className="p-6 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-orange-500" /> Líderes de Venta
                                </h3>
                                <Layers className="w-4 h-4 text-brand-muted opacity-30" />
                            </div>
                            <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                {top_productos.map((item, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 p-4 bg-brand/5 rounded-2xl border border-transparent hover:border-orange-500/30 transition-all group/item shadow-sm hover:shadow-md"
                                    >
                                        <div className="w-10 h-10 bg-main border border-brand rounded-xl flex items-center justify-center font-black text-brand-muted text-[11px] shadow-inner group-hover/item:border-orange-500/50 group-hover/item:text-orange-600 transition-colors">
                                            #{i+1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-black text-brand-main truncate uppercase tracking-tighter mb-1">{item.nombre}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest bg-brand/10 px-1.5 py-0.5 rounded leading-none">{item.total_vendido} UNI</span>
                                                <span className="text-[9px] font-bold text-orange-500 uppercase tracking-tighter">MOVIMIENTO ALTO</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-emerald-600 tracking-tighter leading-none mb-1">Bs {parseFloat(item.recaudado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                                            <p className="text-[8px] font-black text-brand-muted uppercase tracking-tighter opacity-60 leading-none">RECAUDADO</p>
                                        </div>
                                    </motion.div>
                                ))}
                                {top_productos.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-24 opacity-30">
                                        <Package className="w-12 h-12 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sin Movimiento Comercial</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>

                    {/* Métodos de Pago Premium Grid */}
                    <div className="bg-card-fap border border-brand p-8 rounded-2xl shadow-sm relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                            <DollarSign className="w-32 h-32 text-brand-main" />
                        </div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2 relative z-10">
                                <CreditCard className="w-4 h-4 text-primary" /> Segmentación Transaccional
                            </h3>
                            <div className="text-[9px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-2.5 py-1 rounded-lg border border-brand/50">Estructura de Capital</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {ventas_por_tipo.map((tipo, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center gap-5 p-6 bg-main rounded-2xl border border-brand hover:border-primary/30 transition-all shadow-md group/payment"
                                >
                                    <div className={`p-4 rounded-xl shadow-inner transition-transform group-hover/payment:rotate-6 ${
                                        tipo.tipo_pago === 'qr' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 
                                        tipo.tipo_pago === 'credito_asociado' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                    }`}>
                                        {tipo.tipo_pago === 'qr' ? <QrCode className="w-7 h-7" /> : <CreditCard className="w-7 h-7" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-brand-muted mb-1 tracking-widest">{tipo.tipo_pago === 'qr' ? 'PASARELA DE PAGO QR' : 'SISTEMA DE LIBRANZA'}</p>
                                        <p className="text-2xl font-black text-brand-main tracking-tighter">Bs {parseFloat(tipo.total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="h-1 w-12 bg-brand/20 rounded-full overflow-hidden">
                                                <div className={`h-full ${tipo.tipo_pago === 'qr' ? 'bg-indigo-500' : 'bg-blue-500'}`} style={{ width: '65%' }} />
                                            </div>
                                            <span className="text-[9px] font-black text-brand-muted opacity-60">DOMINANCIA ALTA</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
