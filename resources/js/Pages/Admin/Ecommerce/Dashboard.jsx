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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Ecommerce Admin</h2>}
        >
            <Head title="Admin Tienda" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y KPI BAR */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden">
                        <div className="px-5 py-4 border-b border-fapclas-100 bg-[#fafaf6] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <LayoutDashboard className="w-5 h-5 text-fapclas-600" />
                                <div>
                                    <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                        Métricas Comerciales B2C / B2B
                                    </h3>
                                    <p className="text-[11px] text-fapclas-500 font-medium">
                                        Visión general del desempeño de la tienda virtual FAPCLAS R.L.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* KPI Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-fapclas-100">
                            <KpiItem label="Ventas Totales Brutas" value={`Bs. ${kpis.ventas_totales.toFixed(2)}`} color="text-fapclas-900" highlight />
                            <KpiItem label="Recaudación QR (Liquidez)" value={`Bs. ${kpis.ventas_qr.toFixed(2)}`} color="text-fapclas-700" />
                            <KpiItem label="Ventas por Crédito" value={`Bs. ${kpis.ventas_credito.toFixed(2)}`} color="text-fapclas-700" />
                            <KpiItem label="Valorizado Inventario" value={`Bs. ${kpis.valorizado_inventario.toFixed(2)}`} color="text-fapclas-600" />
                            <KpiItem label="Nuevos Usuarios (Mes)" value={`${kpis.nuevos_usuarios_mes} altas`} color="text-fapclas-900" />
                        </div>
                    </div>

                    {/* VISTAS GRÁFICAS (DENSAS) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden lg:col-span-2 flex flex-col">
                            <div className="px-4 py-3 border-b border-fapclas-100 bg-[#fafaf6]">
                                <h3 className="text-[11px] font-bold text-fapclas-900 uppercase tracking-wider">Top 5 Artículos de Mayor Rotación</h3>
                            </div>
                            <div className="p-4 h-64">
                                {ranking_abc.length > 0 ? (
                                    <Bar data={barData} options={{ maintainAspectRatio: false }} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-wider">Sin Datos de Rotación</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-fapclas-100 bg-[#fafaf6]">
                                <h3 className="text-[11px] font-bold text-fapclas-900 uppercase tracking-wider">Participación de Medios de Pago</h3>
                            </div>
                            <div className="p-4 h-64">
                                {kpis.ventas_qr > 0 || kpis.ventas_credito > 0 ? (
                                    <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-wider">Sin Transacciones Consolidadas</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ALERTAS Y RANKING (DATA GRIDS) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Alertas Stockout */}
                        <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-fapclas-100 bg-[#fafaf6] flex justify-between items-center">
                                <h3 className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Quiebres de Stock Detectados
                                </h3>
                                <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">{stockouts.length} Alertas</span>
                            </div>
                            <div className="overflow-x-auto flex-1 h-64">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#fdfdfc] border-b border-fapclas-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-[9px] font-bold text-fapclas-500 uppercase tracking-wider">SKU / Artículo</th>
                                            <th className="px-4 py-2 text-left text-[9px] font-bold text-fapclas-500 uppercase tracking-wider w-32 border-l border-fapclas-50">Stock Actual</th>
                                            <th className="px-4 py-2 text-right text-[9px] font-bold text-fapclas-500 uppercase tracking-wider w-24">Revisar Kardex</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-fapclas-50">
                                        {stockouts.length === 0 ? (
                                            <tr><td colSpan="3" className="px-4 py-8 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider">Niveles Óptimos de Inventario</td></tr>
                                        ) : (
                                            stockouts.map(item => (
                                                <tr key={item.id} className="hover:bg-red-50/30">
                                                    <td className="px-4 py-2 whitespace-nowrap text-[11px] font-bold text-fapclas-900 truncate max-w-[200px]" title={item.nombre}>{item.nombre}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap border-l border-fapclas-50">
                                                        <span className="text-xs font-mono font-bold text-red-600">{item.stock_actual}</span>
                                                        <span className="text-[10px] text-gray-500 ml-1">/ min {item.stock_minimo}</span>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right">
                                                        <Link href={route('admin.inventario.kardex', item.id)} className="text-[10px] font-bold text-fapclas-600 hover:text-fapclas-900 underline decoration-fapclas-300">Auditar</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Ranking ABC */}
                        <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-fapclas-100 bg-[#fafaf6]">
                                <h3 className="text-[11px] font-bold text-fapclas-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Segmentación A-B-C (Volumen de Negocio)
                                </h3>
                            </div>
                            <div className="overflow-x-auto flex-1 h-64">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#fdfdfc] border-b border-fapclas-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-[9px] font-bold text-fapclas-500 uppercase tracking-wider">Identificador Comercial</th>
                                            <th className="px-4 py-2 text-right text-[9px] font-bold text-fapclas-500 uppercase tracking-wider w-24">U. Vendidas</th>
                                            <th className="px-4 py-2 text-right text-[9px] font-bold text-fapclas-500 uppercase tracking-wider border-l border-fapclas-50 bg-[#fafaf6] w-28">Facturación (Bs)</th>
                                            <th className="px-4 py-2 text-center text-[9px] font-bold text-fapclas-500 uppercase tracking-wider w-24">Segmento</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-fapclas-50">
                                        {ranking_abc.length === 0 ? (
                                            <tr><td colSpan="4" className="px-4 py-8 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Carencia de Flujo Comercial</td></tr>
                                        ) : (
                                            ranking_abc.map((prod, i) => (
                                                <tr key={i} className="hover:bg-fapclas-50/40">
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <div className="text-[11px] font-bold text-fapclas-900">{prod.producto}</div>
                                                        <div className="text-[9px] font-mono text-fapclas-500">Ref: {prod.sku}</div>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right text-xs font-mono text-gray-600">{prod.ventas}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 bg-[#fafaf6] shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                        <span className="text-xs font-bold font-mono text-emerald-700">{prod.recaudado.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-center">
                                                        <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase tracking-widest ${prod.clase === 'A' ? 'bg-fapclas-50 text-fapclas-800 border-fapclas-200 shadow-[inset_2px_0_0_#28361d]' : prod.clase === 'B' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
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
        <div className={`p-4 ${highlight ? 'bg-[#fdfdfc] shadow-[inset_0_-2px_0_rgba(72,107,44,0.1)]' : ''}`}>
            <p className="text-[9px] font-bold text-fapclas-400 uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`text-xl font-extrabold ${color}`}>{value}</p>
        </div>
    );
}
