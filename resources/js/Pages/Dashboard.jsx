import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Wallet, TrendingUp, Users, ShieldCheck,
    ArrowRightLeft, CheckCircle2, ShoppingBag, 
    Banknote, PieChart, Activity, AlertCircle, Calendar,
    Package, Bell, Search, LayoutDashboard, Store
} from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Registra todos los elementos automáticamente

export default function Dashboard({ auth, metrics, charts, actividadReciente, filtros }) {
    const isAdmin = metrics?.tipo === 'admin';
    const [activeTab, setActiveTab] = useState('resumen');

    // Estado local para los filtros
    const { data, setData, get, processing } = useForm({
        desde: filtros?.desde || '',
        hasta: filtros?.hasta || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('dashboard'), { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setData({ desde: '', hasta: '' });
        router.get(route('dashboard'), {}, { preserveState: true });
    };

    // Configuración Base Gráficos
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 10, family: 'Inter' } } }
        }
    };

    // Preparar Data: Créditos Pie
    const creditosData = charts?.creditosEstados ? {
        labels: Object.keys(charts.creditosEstados),
        datasets: [{
            data: Object.values(charts.creditosEstados),
            backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6'],
            borderWidth: 0,
        }]
    } : null;

    // Preparar Data: Demografía Socios Bar
    const demoData = charts?.usuariosPorGrado ? {
        labels: Object.keys(charts.usuariosPorGrado),
        datasets: [{
            label: 'Socios Activos',
            data: Object.values(charts.usuariosPorGrado),
            backgroundColor: '#4ade80',
            borderRadius: 4,
        }]
    } : null;

    // Preparar Data: Flujo de Ventas Line
    const flujoVentasData = charts?.flujoVentas ? {
        labels: Object.keys(charts.flujoVentas),
        datasets: [{
            label: 'Ingresos Diarios (Bs.)',
            data: Object.values(charts.flujoVentas),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
        }]
    } : null;

    // Preparar Data: Top Productos Doughnut
    const topProdData = charts?.topProductos ? {
        labels: Object.keys(charts.topProductos),
        datasets: [{
            data: Object.values(charts.topProductos),
            backgroundColor: ['#f97316', '#a855f7', '#ec4899', '#06b6d4', '#84cc16'],
            borderWidth: 0,
        }]
    } : null;

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl text-brand-main leading-tight flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-primary" /> Cockpit / Inteligencia de Negocios
                </h2>
            </div>
        }>
            <Head title="Panel de Control BI" />

            <div className="py-6 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ✅ FILTROS GLOBALES (Solo Admin) */}
                    {isAdmin && (
                        <div className="bg-card-fap border border-brand shadow-sm rounded-lg p-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <form onSubmit={handleFilter} className="flex flex-col md:flex-row items-end gap-3 flex-1">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-brand-muted mb-1">Desde Fecha</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                                        <input type="date" value={data.desde} onChange={e => setData('desde', e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-main text-brand-main border border-brand rounded text-xs focus:ring-primary" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-brand-muted mb-1">Hasta Fecha</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                                        <input type="date" value={data.hasta} onChange={e => setData('hasta', e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-main text-brand-main border border-brand rounded text-xs focus:ring-primary" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" disabled={processing} className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded text-xs font-bold transition-all shadow-sm flex items-center gap-2">
                                        <Search className="w-3.5 h-3.5" /> Analizar
                                    </button>
                                    {(data.desde || data.hasta) && (
                                        <button type="button" onClick={clearFilters} className="px-4 py-1.5 bg-main hover:bg-card-fap border border-brand text-brand-muted hover:text-brand-main rounded text-xs font-bold transition-all">
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </form>
                            <div className="text-right border-l border-brand pl-4 hidden md:block">
                                <p className="text-[10px] uppercase font-black tracking-widest text-brand-muted">Análisis Profundo</p>
                                <p className="text-xs font-bold text-brand-main font-mono">{new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    )}


                    {/* ✅ VISTA ADMINISTRADOR (BI TABBED INTERFACE) */}
                    {isAdmin ? (
                        <>
                            {/* NAVEGACIÓN TABS */}
                            <div className="flex space-x-1 bg-card-fap border border-brand p-1 rounded-lg overflow-x-auto scroller-hide">
                                <TabBtn active={activeTab === 'resumen'} onClick={() => setActiveTab('resumen')} icon={PieChart} label="Visión Global" />
                                <TabBtn active={activeTab === 'erp'} onClick={() => setActiveTab('erp')} icon={Banknote} label="ERP Financiero" />
                                <TabBtn active={activeTab === 'ecommerce'} onClick={() => setActiveTab('ecommerce')} icon={ShoppingBag} label="Ventas & E-Commerce" />
                                <TabBtn active={activeTab === 'institucional'} onClick={() => setActiveTab('institucional')} icon={Users} label="Módulo Institucional" />
                            </div>

                            {/* CONTENIDO TAB: RESUMEN GRÁFICO (CHARTJS) */}
                            {activeTab === 'resumen' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="bg-card-fap border border-brand rounded-xl p-5 shadow-sm h-80 flex flex-col">
                                        <h3 className="text-xs font-black uppercase text-brand-muted tracking-widest mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-primary" /> Estados de Cartera de Créditos</h3>
                                        <div className="flex-1 relative">
                                            {creditosData && Object.keys(charts.creditosEstados).length > 0 ? (
                                                <Doughnut data={creditosData} options={{...chartOptions, maintainAspectRatio: false }} />
                                            ) : (
                                                <EmptyChartState />
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-card-fap border border-brand rounded-xl p-5 shadow-sm h-80 flex flex-col">
                                        <h3 className="text-xs font-black uppercase text-brand-muted tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Demografía General por Grado</h3>
                                        <div className="flex-1 relative">
                                            {demoData && Object.keys(charts.usuariosPorGrado).length > 0 ? (
                                                <Bar data={demoData} options={{...chartOptions, maintainAspectRatio: false }} />
                                            ) : (
                                                <EmptyChartState />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CONTENIDO TAB: ERP FINANCIERO */}
                            {activeTab === 'erp' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <KpiCard title="Monto Total Colocado" value={`Bs. ${Number(metrics.erp.montoPrestado).toLocaleString()}`} icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                                        <KpiCard title="Capital Neto Recuperado" value={`Bs. ${Number(metrics.erp.capitalRecuperado).toLocaleString()}`} icon={Wallet} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" />
                                        <KpiCard title="Saldo Actual Caja Central" value={`Bs. ${Number(metrics.erp.saldoCaja).toLocaleString()}`} icon={Banknote} color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/20" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Riesgo Extendido */}
                                        <div className="sm:col-span-2">
                                           <KpiCard title="Riesgo de Capital Global (Deuda en Mora extendida)" value={`Bs. ${Number(metrics.erp.exposicionGlobalMora).toLocaleString()}`} icon={AlertCircle} color="text-red-500" bg="bg-red-500/10" border="border-red-500/20" isAlert={metrics.erp.exposicionGlobalMora > 0} 
                                           subtitle={`Incluye Bs. ${Number(metrics.erp.capitalEnMora).toLocaleString()} de cuotas estrictamente vencidas.`} />
                                        </div>
                                        <div className="sm:col-span-1">
                                            <KpiCard title="Convenios Externos Autorizados" value={`Bs. ${Number(metrics.erp.volumenConvenios).toLocaleString()}`} icon={Store} color="text-fapclas-300" bg="bg-fapclas-300/10" border="border-fapclas-300/20" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CONTENIDO TAB: ECOMMERCE */}
                            {activeTab === 'ecommerce' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <KpiCard title="Ventas Netas Cerradas" value={`Bs. ${Number(metrics.ecommerce.ingresosTotales).toLocaleString()}`} icon={ShoppingBag} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
                                        <KpiCard title="Pedidos Efectivos" value={metrics.ecommerce.totalPedidos} icon={CheckCircle2} color="text-emerald-400" bg="bg-emerald-400/10" border="border-emerald-400/20" />
                                        <KpiCard title="Productos en Alerta Crítica (Stock)" value={`${metrics.ecommerce.alertasStock} Prod.`} icon={Package} color={metrics.ecommerce.alertasStock > 0 ? "text-orange-500" : "text-brand-muted"} bg="bg-main" border={metrics.ecommerce.alertasStock > 0 ? "border-orange-500" : "border-brand"} isAlert={metrics.ecommerce.alertasStock > 0} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="bg-card-fap border border-brand rounded-xl p-5 shadow-sm h-72 flex flex-col lg:col-span-2">
                                            <h3 className="text-xs font-black uppercase text-brand-muted tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Curva de Ventas Diarias</h3>
                                            <div className="flex-1 relative">
                                                {flujoVentasData && Object.keys(charts.flujoVentas).length > 0 ? (
                                                    <Line data={flujoVentasData} options={{...chartOptions, plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                                                ) : (
                                                    <EmptyChartState />
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-card-fap border border-brand rounded-xl p-5 shadow-sm h-72 flex flex-col">
                                            <h3 className="text-xs font-black uppercase text-brand-muted tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Top 5 Productos</h3>
                                            <div className="flex-1 relative">
                                                {topProdData && Object.keys(charts.topProductos).length > 0 ? (
                                                    <Doughnut data={topProdData} options={{...chartOptions, maintainAspectRatio: false }} />
                                                ) : (
                                                    <EmptyChartState />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CONTENIDO TAB: INSTITUCIONAL */}
                            {activeTab === 'institucional' && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <KpiCard title="Fuerza Societaria (Total)" value={metrics.institucional.totalUsuarios} icon={Users} color="text-blue-400" bg="bg-blue-400/10" border="border-blue-400/20" />
                                    <KpiCard title="Crecimiento Integración (Nuevos)" value={`+${metrics.institucional.nuevosUsuarios}`} icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-400/10" border="border-emerald-400/20" />
                                    <KpiCard title="Volumen RRPP / Noticias" value={metrics.institucional.totalNoticias} icon={Bell} color="text-purple-400" bg="bg-purple-400/10" border="border-purple-400/20" />
                                </div>
                            )}

                            {/* HISTORIAL GLOBAL (Siempre visible abajo) */}
                            <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden mt-6">
                                <div className="px-4 py-3 border-b border-brand flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-brand-main uppercase tracking-wider flex items-center gap-2">
                                        <ArrowRightLeft className="w-4 h-4 text-primary" /> Auditoría Transaccional Relevante
                                    </h3>
                                    <Link href={route('libro-diario.index')} className="text-[10px] font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary px-3 py-1.5 rounded transition-colors uppercase tracking-widest border border-primary/20">
                                        Libro Diario
                                    </Link>
                                </div>
                                <TransactionTable records={actividadReciente} isAdmin={isAdmin} />
                            </div>

                        </>
                    ) : (
                        /* ✅ VISTA SOCIO (SIMPLE) */
                        <>
                            <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden mb-6">
                                <div className="p-4 border-b border-brand bg-card-fap/[0.02] flex items-center gap-3">
                                    <Wallet className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                            Estado de Cuenta Personal — {auth.user.name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border-brand">
                                    <KpiItem title="Mi Saldo Aportes" value={`Bs. ${Number(metrics.miSaldo).toLocaleString()}`} />
                                    <KpiItem title="Mis Préstamos" value={metrics.misPrestamos} />
                                    <div className="p-4 flex flex-col justify-center bg-primary/5">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-2">Acción Rápida</p>
                                        <Link href={route('creditos.index')} className="text-xs font-bold bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                                            Ver Plan de Pagos
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                                <div className="px-4 py-3 border-b border-brand flex items-center gap-2">
                                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold text-brand-main uppercase tracking-wider">Mis Últimos Movimientos</h3>
                                </div>
                                <TransactionTable records={actividadReciente} isAdmin={false} />
                            </div>
                        </>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// ==========================================
// SUB-COMPONENTES UI ESTILIZADOS
// ==========================================

function TabBtn({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                active 
                ? 'bg-primary text-white shadow-md' 
                : 'text-brand-muted hover:text-brand-main hover:bg-main'
            }`}
        >
            <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function KpiCard({ title, value, icon: Icon, color, bg, border, isAlert = false }) {
    return (
        <div className={`p-5 rounded-xl border ${border} bg-card-fap shadow-sm relative overflow-hidden group`}>
            {isAlert && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse"></div>}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2.5 rounded-lg ${bg} ${border} border`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-1">{title}</p>
                <h4 className={`text-2xl font-bold tracking-tight ${color}`}>{value}</h4>
            </div>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
        </div>
    );
}

function KpiItem({ title, value }) {
    return (
        <div className="p-5 flex flex-col justify-center">
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1.5">{title}</p>
            <p className="text-2xl font-bold text-brand-main tracking-tight">{value}</p>
        </div>
    );
}

function EmptyChartState() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <PieChart className="w-10 h-10 text-brand-muted/30 mb-2" />
            <p className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">Sin Data en el Periodo</p>
        </div>
    );
}

function TransactionTable({ records, isAdmin }) {
    if (!records || records.length === 0) {
        return (
            <div className="p-8 text-center border-t border-brand bg-main">
                <CheckCircle2 className="w-8 h-8 text-brand-muted mx-auto mb-3" />
                <p className="text-xs text-brand-muted font-bold uppercase tracking-wider">Sin movimientos registrados</p>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-main border-b border-brand">
                    <tr>
                        <th className="text-left px-4 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest">Fecha</th>
                        {isAdmin && <th className="text-left px-4 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest">Socio / CI</th>}
                        <th className="text-left px-4 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest">Concepto</th>
                        <th className="text-right px-4 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest">Importe (Bs.)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand">
                    {records.map((mov) => {
                        const esIngreso = Number(mov.ingreso) > 0;
                        const montoValor = esIngreso ? Number(mov.ingreso) : Number(mov.egreso);
                        
                        return (
                        <tr key={mov.id} className="hover:bg-primary/5 transition-colors">
                            <td className="px-4 py-3 text-xs text-brand-muted whitespace-nowrap font-medium">
                                {new Date(mov.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </td>
                            {isAdmin && (
                                <td className="px-4 py-3">
                                    <div className="font-bold text-brand-main text-[11px] leading-tight">{mov.user?.name || 'Sistema'}</div>
                                    <div className="text-[9px] text-brand-muted uppercase mt-0.5 tracking-wider">{mov.user?.persona?.ci || 'N/A'} - {mov.user?.persona?.grado || ''}</div>
                                </td>
                            )}
                            <td className="px-4 py-3">
                                <div className="font-bold text-brand-main text-xs uppercase">{mov.concepto}</div>
                                <div className="text-[9px] text-fapclas-300 font-bold uppercase tracking-widest mt-0.5">{mov.tipo_transaccion}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                <span className={`text-[13px] font-black ${esIngreso ? 'text-emerald-500' : 'text-red-400'}`}>
                                    {esIngreso ? '+' : '-'}{montoValor.toLocaleString()}
                                </span>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
}
