import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart3, 
    ArrowLeft, 
    TrendingUp, 
    TrendingDown, 
    Layers,
    DollarSign,
    Calendar
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Recaudacion({ auth, labels, dataset_colocacion, dataset_recaudacion, totales }) {
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#6b7280',
                    font: { weight: 'bold', size: 11 }
                }
            },
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
        }
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Colocación (Préstamos)',
                data: dataset_colocacion,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6,
            },
            {
                label: 'Recaudación (Pagos)',
                data: dataset_recaudacion,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 py-1">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                            Recaudación vs Colocación (12 Meses)
                        </h2>
                    </div>
                    <a href={route('reportes.index')} className="text-sm text-brand-muted hover:text-brand-main font-semibold transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </a>
                </div>
            }
        >
            <Head title="Reporte de Recaudación | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Fila de Totales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card-fap border border-brand p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-125 transition-transform" />
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-brand-muted mb-1">Colocación Anual</p>
                                    <p className="text-2xl font-black text-brand-main">Bs {totales.anual_colocacion.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card-fap border border-brand p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-125 transition-transform" />
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                    <TrendingDown className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-brand-muted mb-1">Recaudación Anual</p>
                                    <p className="text-2xl font-black text-brand-main">Bs {totales.anual_recaudacion.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card-fap border border-brand p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand/5 rounded-full group-hover:scale-125 transition-transform" />
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                                    <Layers className="w-6 h-6 text-brand-main" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-brand-muted mb-1">Liquidez Neta (Cashback)</p>
                                    <p className={`text-2xl font-black ${totales.liquidez_neta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        Bs {totales.liquidez_neta.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico y Tabla */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        
                        {/* Gráfico */}
                        <div className="lg:col-span-3 bg-card-fap border border-brand p-6 rounded-2xl shadow-sm">
                            <h3 className="text-sm font-black uppercase text-brand-main mb-6 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" /> Rendimiento Comparativo Mensual
                            </h3>
                            <div className="h-[350px]">
                                <Bar options={options} data={data} />
                            </div>
                        </div>

                        {/* Desglose Lateral */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-card-fap border border-brand rounded-2xl shadow-sm flex flex-col h-full max-h-[440px] overflow-hidden">
                                <div className="p-4 border-b border-brand bg-main">
                                    <h3 className="text-xs font-black uppercase text-brand-main">Detalle Mensual</h3>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <table className="w-full text-[10px] text-left">
                                        <thead className="bg-main text-brand-muted sticky top-0 uppercase font-black border-b border-brand">
                                            <tr>
                                                <th className="p-3">Mes</th>
                                                <th className="p-3 text-right">Liquidez</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand/50">
                                            {labels.map((label, i) => {
                                                const diff = dataset_recaudacion[i] - dataset_colocacion[i];
                                                return (
                                                    <tr key={i} className="hover:bg-brand/5 border-b border-brand/20">
                                                        <td className="p-3 font-bold text-brand-main uppercase">{label}</td>
                                                        <td className={`p-3 text-right font-black ${diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {diff >= 0 ? '+' : ''}{diff.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                );
                                            }).reverse()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
