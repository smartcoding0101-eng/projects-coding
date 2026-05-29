import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { TrendingUp, Package, AlertTriangle, Users, QrCode, CreditCard, LayoutDashboard, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Dashboard({ kpis, stockouts, ranking_abc, auth }) {
    const doughnutData = {
        labels: ['Ventas QR', 'Ventas Crédito Especial'],
        datasets: [
            {
                data: [kpis.ventas_qr, kpis.ventas_credito],
                backgroundColor: ['#28361d', '#F7BD16'],
                borderWidth: 0,
            },
        ],
    };

    const barData = {
        labels: ranking_abc.slice(0, 5).map(item => item.producto.substring(0, 15) + '...'),
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: ranking_abc.slice(0, 5).map(item => item.ventas),
                backgroundColor: '#3a5126',
                borderRadius: 2,
            }
        ]
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg border border-primary/20">
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Dashboard Comercio Digital
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Métricas Comerciales B2C / B2B
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Resultados Ecommerce | Fapclas" />

            <div className="py-6 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ─── KPIs FIORI TILES (Estilo Créditos) ─── */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <KpiCard
                            label="Ventas Brutas"
                            value={`Bs. ${kpis.ventas_totales.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
                            icon={<TrendingUp className="w-6 h-6" />}
                            borderColorClass="border-t-red-500"
                            iconColorClass="text-red-500"
                        />
                        <KpiCard
                            label="Liquidez QR"
                            value={`Bs. ${kpis.ventas_qr.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
                            icon={<QrCode className="w-6 h-6" />}
                            borderColorClass="border-t-emerald-500"
                            iconColorClass="text-emerald-500"
                        />
                        <KpiCard
                            label="Ventas Crédito"
                            value={`Bs. ${kpis.ventas_credito.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
                            icon={<CreditCard className="w-6 h-6" />}
                            borderColorClass="border-t-blue-600"
                            iconColorClass="text-blue-600"
                        />
                        <KpiCard
                            label="Valorizado Inventario"
                            value={`Bs. ${kpis.valorizado_inventario.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
                            icon={<Package className="w-6 h-6" />}
                            borderColorClass="border-t-orange-500"
                            iconColorClass="text-orange-500"
                        />
                        <KpiCard
                            label="Nuevos Usuarios"
                            value={kpis.nuevos_usuarios_mes}
                            icon={<Users className="w-6 h-6" />}
                            borderColorClass="border-t-purple-500"
                            iconColorClass="text-purple-500"
                        />
                    </div>

                    {/* VISTAS GRÁFICAS (DENSAS) (FIORI) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden lg:col-span-2 flex flex-col">
                            <div className="px-5 py-3.5 border-b border-brand bg-card-fap/[0.02]">
                                <h3 className="text-[11px] font-black tracking-wider text-brand-main uppercase flex items-center gap-2">Top 5 Rotación de Materiales</h3>
                            </div>
                            <div className="p-5 h-72">
                                {ranking_abc.length > 0 ? (
                                    <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { font: { family: "'Inter', sans-serif", weight: 'bold' } } } } }} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs font-bold text-brand-muted uppercase tracking-wider bg-card-fap/[0.04] rounded-lg border border-dashed border-brand">Sin Rotación Detectada</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                            <div className="px-5 py-3.5 border-b border-brand bg-card-fap/[0.02]">
                                <h3 className="text-[11px] font-black tracking-wider text-brand-main uppercase flex items-center gap-2">Distribución Recaudación</h3>
                            </div>
                            <div className="p-5 h-72">
                                {kpis.ventas_qr > 0 || kpis.ventas_credito > 0 ? (
                                    <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20, font: { family: "'Inter', sans-serif", weight: 'bold', size: 10 } } } } }} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs font-bold text-brand-muted uppercase tracking-wider bg-card-fap/[0.04] rounded-lg border border-dashed border-brand text-center px-4">Sin Movimientos Financieros</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ALERTAS Y RANKING (DATA GRIDS FIORI) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Alertas Stockout (ALV Style) */}
                        <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                            <div className="px-5 py-3.5 border-b border-brand bg-card-fap/[0.02] flex justify-between items-center">
                                <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Quiebres de Stock Crítico
                                </h3>
                                <span className="text-[10px] font-black bg-red-500/10 text-red-600 px-2 py-0.5 rounded-md border border-red-500/20">{stockouts.length} Alertas</span>
                            </div>
                            <div className="overflow-x-auto flex-1 h-[300px]">
                                <table className="w-full text-sm">
                                    <thead className="bg-main border-b border-brand">
                                        <tr>
                                            <th className="px-4 pl-6 py-2.5 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider">Artículo / Material</th>
                                            <th className="px-4 py-2.5 text-right text-[10px] font-bold text-brand-main uppercase tracking-wider w-32 border-l border-brand">Saldos Crit.</th>
                                            <th className="px-4 py-2.5 text-center text-[10px] font-bold text-brand-main uppercase tracking-wider w-24 border-l border-brand">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockouts.length === 0 ? (
                                            <tr><td colSpan="3" className="px-4 py-16 text-center text-xs font-black text-emerald-600 uppercase tracking-wider bg-card-fap">Inventario en Niveles Óptimos</td></tr>
                                        ) : (
                                            stockouts.map(item => (
                                                <tr key={item.id} className="hover:bg-red-50/20 border-b border-brand/50 group bg-card-fap">
                                                    <td className="px-4 pl-6 py-3 whitespace-nowrap text-[11px] font-bold text-brand-main truncate max-w-[200px]" title={item.nombre}>{item.nombre}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap border-l border-brand text-right">
                                                        <span className="text-xs font-black font-mono text-red-600 inline-flex items-center gap-1.5">{item.stock_actual} <span className="text-[9px] text-brand-muted font-bold">(min: {item.stock_minimo})</span></span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center border-l border-brand">
                                                        <Link href={route('admin.inventario.kardex', item.id)} className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline">Kardex</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Ranking ABC (ALV Style) */}
                        <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                            <div className="px-5 py-3.5 border-b border-brand bg-card-fap/[0.02]">
                                <h3 className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-3.5 h-3.5" /> Análisis Multidimensional ABC
                                </h3>
                            </div>
                            <div className="overflow-x-auto flex-1 h-[300px]">
                                <table className="w-full text-sm">
                                    <thead className="bg-main border-b border-brand">
                                        <tr>
                                            <th className="px-4 pl-6 py-2.5 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider">Material / Sku</th>
                                            <th className="px-4 py-2.5 text-right text-[10px] font-bold text-brand-main uppercase tracking-wider w-24 border-l border-brand">Vol.</th>
                                            <th className="px-4 py-2.5 text-right text-[10px] font-bold text-brand-main uppercase tracking-wider border-l border-brand w-28">Valuación</th>
                                            <th className="px-4 py-2.5 text-center text-[10px] font-bold text-brand-main uppercase tracking-wider w-24 border-l border-brand">Clase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ranking_abc.length === 0 ? (
                                            <tr><td colSpan="4" className="px-4 py-16 text-center text-xs font-black text-brand-muted uppercase tracking-wider bg-card-fap">Sin Registros Analíticos</td></tr>
                                        ) : (
                                            ranking_abc.map((prod, i) => (
                                                <tr key={i} className="hover:bg-card-fap/[0.04] border-b border-brand/50 bg-card-fap">
                                                    <td className="px-4 pl-6 py-3 whitespace-nowrap">
                                                        <div className="text-[11px] font-bold text-brand-main truncate max-w-[150px]" title={prod.producto}>{prod.producto}</div>
                                                        <div className="text-[9px] font-mono font-bold text-brand-muted mt-0.5">{prod.sku}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-bold text-brand-muted border-l border-brand">{prod.ventas} u.</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right border-l border-brand">
                                                        <span className="text-[11px] font-black font-mono text-emerald-600">Bs {prod.recaudado.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center border-l border-brand">
                                                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest ring-1 ${prod.clase === 'A' ? 'bg-primary/10 text-primary ring-primary/20' : prod.clase === 'B' ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' : 'bg-brand/5 text-brand-muted ring-brand/50'}`}>
                                                            Tipo {prod.clase}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function KpiCard({ label, value, icon, iconColorClass = 'text-primary', borderColorClass = 'border-t-primary' }) {
    return (
        <div className={`bg-card-fap border border-brand border-t-4 ${borderColorClass} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">{label}</p>
                    <h3 className="text-xl font-black text-brand-main tabular-nums tracking-tight">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-brand/5 border border-brand/10 group-hover:scale-110 transition-transform ${iconColorClass}`}>
                    {icon}
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] transform group-hover:scale-150 group-hover:-rotate-12 transition-transform duration-500">
                {icon}
            </div>
        </div>
    );
}
