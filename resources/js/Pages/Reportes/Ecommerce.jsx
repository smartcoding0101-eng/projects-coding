import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    Calendar, 
    ArrowLeft, 
    ShoppingBag, 
    TrendingUp, 
    Package, 
    Users,
    ChevronRight,
    QrCode,
    CreditCard
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

export default function Ecommerce({ auth, kpis, chart_labels, chart_data, top_productos, ventas_por_tipo }) {
    
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(156, 163, 175, 0.1)' },
                ticks: { color: '#9ca3af', font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 10 } }
            }
        },
        elements: {
            line: { tension: 0.4 }
        }
    };

    const data = {
        labels: chart_labels,
        datasets: [
            {
                fill: true,
                label: 'Ventas Bs',
                data: chart_labels.map((_, i) => chart_data[i] || 0),
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 py-1">
                        <ShoppingBag className="w-6 h-6 text-orange-500" />
                        <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                            Rendimiento Comercial E-Commerce
                        </h2>
                    </div>
                    <a href={route('reportes.index')} className="text-sm text-brand-muted hover:text-brand-main font-semibold transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </a>
                </div>
            }
        >
            <Head title="Reporte Comercial | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Fila de KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Package className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-brand-muted">Valor Inventario</p>
                            </div>
                            <p className="text-2xl font-black text-brand-main">Bs {parseFloat(kpis.stock_valorizado).toLocaleString()}</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-brand-muted">Ventas Totales</p>
                            </div>
                            <p className="text-2xl font-black text-brand-main">Bs {parseFloat(kpis.ventas_historicas).toLocaleString()}</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <ShoppingBag className="w-5 h-5 text-emerald-500" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-brand-muted">Pedidos Hoy</p>
                            </div>
                            <p className="text-2xl font-black text-brand-main">{kpis.pedidos_hoy}</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Users className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-brand-muted">Base Usuarios</p>
                            </div>
                            <p className="text-2xl font-black text-brand-main">{kpis.usuarios_activos}</p>
                        </div>
                    </div>

                    {/* Gráfico y Tablas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Gráfico de Ventas */}
                        <div className="lg:col-span-2 bg-card-fap border border-brand p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase text-brand-main flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-500" /> Flujo de Ingresos (6 Meses)
                                </h3>
                            </div>
                            <div className="h-[300px]">
                                <Line options={options} data={data} />
                            </div>
                        </div>

                        {/* Top Productos */}
                        <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-brand bg-main">
                                <h3 className="text-xs font-black uppercase text-brand-main">Top 5 Productos</h3>
                            </div>
                            <div className="flex-1 p-2 space-y-2">
                                {top_productos.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-brand/5 rounded-xl border border-transparent hover:border-orange-500/30 transition-all group">
                                        <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center font-black text-brand-muted text-xs">
                                            #{i+1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-brand-main truncate w-40">{item.nombre}</p>
                                            <p className="text-[9px] font-black text-brand-muted uppercase">{item.total_vendido} Unidades</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-emerald-500">Bs {parseFloat(item.recaudado).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {top_productos.length === 0 && (
                                    <div className="py-12 text-center text-brand-muted text-xs font-medium">Sin datos de ventas aún</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Métodos de Pago */}
                    <div className="bg-card-fap border border-brand p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xs font-black uppercase text-brand-main mb-6">Composición por Método de Pago</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {ventas_por_tipo.map((tipo, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-main rounded-xl border border-brand/50">
                                    <div className={`p-3 rounded-lg ${
                                        tipo.tipo_pago === 'qr' ? 'bg-indigo-500/10 text-indigo-500' : 
                                        tipo.tipo_pago === 'credito_asociado' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
                                    }`}>
                                        {tipo.tipo_pago === 'qr' ? <QrCode className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-brand-muted mb-1">{tipo.tipo_pago === 'qr' ? 'Cobros QR' : 'Crédito Libranza'}</p>
                                        <p className="text-lg font-black text-brand-main">Bs {parseFloat(tipo.total).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
