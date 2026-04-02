import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { TrendingUp, Package, AlertTriangle, Users, QrCode, CreditCard, LayoutDashboard } from 'lucide-react';
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
                backgroundColor: ['#28361d', '#618541'],
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
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Dashboard Ecommerce Admin</h2>}
        >
            <Head title="Admin Tienda" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y KPI BAR */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="px-5 py-4 border-b border-brand bg-card-fap flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <LayoutDashboard className="w-5 h-5 text-primary" />
                                <div>
                                    <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                        Métricas Comerciales B2C / B2B
                                    </h3>
                                    <p className="text-[11px] text-brand-muted font-medium">
                                        Visión general del desempeño de la tienda virtual FAPCLAS R.L.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* KPI Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-brand">
                            <KpiItem label="Ventas Totales Brutas" value={`Bs. ${kpis.ventas_totales.toFixed(2)}`} color="text-brand-main" highlight />
                            <KpiItem label="Recaudación QR (Liquidez)" value={`Bs. ${kpis.ventas_qr.toFixed(2)}`} color="text-primary" />
                            <KpiItem label="Ventas por Crédito" value={`Bs. ${kpis.ventas_credito.toFixed(2)}`} color="text-primary" />
                            <KpiItem label="Valorizado Inventario" value={`Bs. ${kpis.valorizado_inventario.toFixed(2)}`} color="text-primary" />
                            <KpiItem label="Nuevos Usuarios (Mes)" value={`${kpis.nuevos_usuarios_mes} altas`} color="text-brand-main" />
                        </div>
                    </div>

                    {/* VISTAS GRÁFICAS (DENSAS) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden lg:col-span-2 flex flex-col">
                            <div className="px-4 py-3 border-b border-brand bg-card-fap">
                                <h3 className="text-[11px] font-bold text-brand-main uppercase tracking-wider">Top 5 Artículos de Mayor Rotación</h3>
                            </div>
                            <div className="p-4 h-64">
                                {ranking_abc.length > 0 ? (
                                    <Bar data={barData} options={{ maintainAspectRatio: false }} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs font-bold text-brand-muted uppercase tracking-wider">Sin Datos de Rotación</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-brand bg-card-fap">
                                <h3 className="text-[11px] font-bold text-brand-main uppercase tracking-wider">Participación de Medios de Pago</h3>
                            </div>
                            <div className="p-4 h-64">
                                {kpis.ventas_qr > 0 || kpis.ventas_credito > 0 ? (
                                    <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs font-bold text-brand-muted uppercase tracking-wider">Sin Transacciones Consolidadas</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ALERTAS Y RANKING (DATA GRIDS) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Alertas Stockout */}
                        <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-brand bg-card-fap flex justify-between items-center">
                                <h3 className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Quiebres de Stock Detectados
                                </h3>
                                <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-500/50">{stockouts.length} Alertas</span>
                            </div>
                            <div className="overflow-x-auto flex-1 h-64">
                                <table className="w-full text-sm">
                                    <thead className="bg-card-fap border-b border-brand">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-[9px] font-bold text-brand-muted uppercase tracking-wider">SKU / Artículo</th>
                                            <th className="px-4 py-2 text-left text-[9px] font-bold text-brand-muted uppercase tracking-wider w-32 border-l border-brand">Stock Actual</th>
                                            <th className="px-4 py-2 text-right text-[9px] font-bold text-brand-muted uppercase tracking-wider w-24">Revisar Kardex</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-fapclas-50">
                                        {stockouts.length === 0 ? (
                                            <tr><td colSpan="3" className="px-4 py-8 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider">Niveles Óptimos de Inventario</td></tr>
                                        ) : (
                                            stockouts.map(item => (
                                                <tr key={item.id} className="hover:bg-red-50/30">
                                                    <td className="px-4 py-2 whitespace-nowrap text-[11px] font-bold text-brand-main truncate max-w-[200px]" title={item.nombre}>{item.nombre}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap border-l border-brand">
                                                        <span className="text-xs font-mono font-bold text-red-600">{item.stock_actual}</span>
                                                        <span className="text-[10px] text-brand-muted ml-1">/ min {item.stock_minimo}</span>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right">
                                                        <Link href={route('admin.inventario.kardex', item.id)} className="text-[10px] font-bold text-primary hover:text-brand-main underline decoration-fapclas-300">Auditar</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Ranking ABC */}
                        <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-brand bg-card-fap">
                                <h3 className="text-[11px] font-bold text-brand-main uppercase tracking-wider flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Segmentación A-B-C (Volumen de Negocio)
                                </h3>
                            </div>
                            <div className="overflow-x-auto flex-1 h-64">
                                <table className="w-full text-sm">
                                    <thead className="bg-card-fap border-b border-brand">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-[9px] font-bold text-brand-muted uppercase tracking-wider">Identificador Comercial</th>
                                            <th className="px-4 py-2 text-right text-[9px] font-bold text-brand-muted uppercase tracking-wider w-24">U. Vendidas</th>
                                            <th className="px-4 py-2 text-right text-[9px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand bg-card-fap w-28">Facturación (Bs)</th>
                                            <th className="px-4 py-2 text-center text-[9px] font-bold text-brand-muted uppercase tracking-wider w-24">Segmento</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-fapclas-50">
                                        {ranking_abc.length === 0 ? (
                                            <tr><td colSpan="4" className="px-4 py-8 text-center text-xs font-bold text-brand-muted uppercase tracking-wider">Carencia de Flujo Comercial</td></tr>
                                        ) : (
                                            ranking_abc.map((prod, i) => (
                                                <tr key={i} className="hover:bg-brand/10">
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <div className="text-[11px] font-bold text-brand-main">{prod.producto}</div>
                                                        <div className="text-[9px] font-mono text-brand-muted">Ref: {prod.sku}</div>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right text-xs font-mono text-gray-600">{prod.ventas}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                        <span className="text-xs font-bold font-mono text-emerald-700">{prod.recaudado.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-center">
                                                        <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase tracking-widest ${prod.clase === 'A' ? 'bg-brand/10 text-brand-main border-brand shadow-[inset_2px_0_0_#28361d]' : prod.clase === 'B' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-brand/5 text-gray-600 border-brand'}`}>
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

function KpiItem({ label, value, color, highlight }) {
    return (
        <div className={`p-4 ${highlight ? 'bg-card-fap shadow-[inset_0_-2px_0_rgba(72,107,44,0.1)]' : ''}`}>
            <p className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`text-xl font-extrabold ${color}`}>{value}</p>
        </div>
    );
}
