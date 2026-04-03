import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Eye, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, TrendingUp, AlertCircle, Package } from 'lucide-react';

// ═══════════════════════════════════════════════════════
//  KPI CARD — ERP Fiori Style con top border
// ═══════════════════════════════════════════════════════
function KpiCard({ label, value, icon, iconColorClass = 'text-primary', borderColorClass = 'border-t-primary' }) {
    return (
        <div className={`bg-card-fap border border-brand border-t-4 ${borderColorClass} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">{label}</p>
                    <h3 className="text-2xl font-black text-brand-main tabular-nums tracking-tight">{value}</h3>
                </div>
                <div className={`p-2.5 rounded-lg bg-brand/5 border border-brand/10 group-hover:scale-110 transition-transform ${iconColorClass}`}>
                    {icon}
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] transform group-hover:scale-150 group-hover:-rotate-12 transition-transform duration-500">
                {icon}
            </div>
        </div>
    );
}

const PER_PAGE = 40;

export default function Index({ pedidos, stats }) {
    const [page, setPage] = useState(1);
    const kpis = [
        { label: 'Ingresos (Mes en Curso)', value: `Bs. ${Number(stats?.ingresos_mes || 0).toLocaleString('es-BO')}`, icon: <TrendingUp className="w-6 h-6" />, borderColorClass: 'border-t-emerald-500', iconColorClass: 'text-emerald-500' },
        { label: 'Validaciones Ptes.', value: stats?.pendientes_validacion || 0, icon: <AlertCircle className="w-6 h-6" />, borderColorClass: 'border-t-amber-500', iconColorClass: 'text-amber-500' },
        { label: 'Pick / Envíos Ptes.', value: stats?.entregas_pendientes || 0, icon: <Package className="w-6 h-6" />, borderColorClass: 'border-t-blue-500', iconColorClass: 'text-blue-500' },
        { label: 'Histórico Órdenes', value: stats?.total_pedidos || 0, icon: <ShoppingBag className="w-6 h-6" />, borderColorClass: 'border-t-indigo-500', iconColorClass: 'text-indigo-500' },
    ];
    const totalPages = Math.max(1, Math.ceil(pedidos.length / PER_PAGE));
    const paged = pedidos.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const goFirst = () => setPage(1);
    const goPrev  = () => setPage(p => Math.max(1, p - 1));
    const goNext  = () => setPage(p => Math.min(totalPages, p + 1));
    const goLast  = () => setPage(totalPages);

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Control de Pedidos (Ventas Web)</h2>}>
            <Head title="Pedidos" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 bg-card-fap gap-4">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                    Ventas B2B / B2C (Ecommerce)
                                </h3>
                                <p className="text-[11px] text-brand-muted font-medium">
                                    Consolidado de órdenes, auditoría de pagos QR y liquidación de entregas (Pick).
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                                {pedidos.length} Registro{pedidos.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* ─── KPIs ─── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
                    </div>

                    {/* DATAGRID PEDIDOS */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider w-36">Orden / Fecha</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider lg:w-1/4">Cliente Comercial</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-right w-28 border-l border-brand">Monto Total</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-center w-36 border-l border-brand">Transacción</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-center w-40 border-l border-brand bg-card-fap">Status (Pago / Pick)</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-right w-24 border-l border-brand">Gestión</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fapclas-50">
                                    {paged.map(pedido => {
                                        const isCrítico = pedido.estado_pago === 'pendiente_validacion';
                                        return (
                                            <tr key={pedido.id} className={`hover:bg-brand/10 transition-colors ${isCrítico ? 'bg-amber-50/10' : ''}`}>
                                                <td className="px-4 py-2 whitespace-nowrap text-[10px] text-brand-muted font-mono">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-brand-main text-[11px]">{pedido.numero_orden}</span>
                                                        <span className="text-[9px] mt-0.5">{new Date(pedido.created_at).toLocaleString('es-BO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-brand-main uppercase truncate" title={pedido.nombre_cliente}>{pedido.nombre_cliente}</span>
                                                        <span className="text-[9px] font-mono text-brand-muted mt-0.5">TERCERO: {pedido.user ? 'SOCIO INSCRITO' : 'B2C EVENTUAL'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand bg-card-fap">
                                                    <span className="text-[12px] font-black font-mono text-brand-main">
                                                        Bs. {Number(pedido.total).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-brand bg-card-fap">
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest border ${pedido.tipo_pago === 'qr' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-purple-50 text-purple-800 border-purple-200'}`}>
                                                        {pedido.tipo_pago === 'qr' ? 'QR_BANCARIO' : 'FINANCIADO'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    <div className="flex flex-col gap-1 items-center">
                                                        <span className={`w-full text-center px-1.5 py-0.5 text-[8px] font-bold uppercase rounded border ${
                                                            pedido.estado_pago === 'pagado' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                            pedido.estado_pago === 'pendiente_validacion' ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-[0_0_5px_rgba(245,158,11,0.2)]' : 
                                                            'bg-red-50 text-red-700 border-red-500/50'
                                                        }`}>
                                                            {pedido.estado_pago === 'pendiente_validacion' ? 'VALIDACIÓN_PEND' : pedido.estado_pago.toUpperCase()}
                                                        </span>
                                                        <span className={`w-full text-center px-1.5 py-0.5 text-[8px] font-bold uppercase rounded border ${
                                                            pedido.estado_entrega === 'entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                            'bg-brand/5 text-gray-600 border-brand'
                                                        }`}>
                                                            {pedido.estado_entrega.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand">
                                                    <Link href={route('admin.pedidos.show', pedido.id)} className="text-[10px] font-bold text-primary hover:text-brand-main bg-brand/10 px-2.5 py-1.5 rounded border border-brand inline-flex items-center gap-1 transition-colors">
                                                        <Eye className="w-3.5 h-3.5"/> Inspeccionar
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {pedidos.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-xs font-bold text-brand-muted uppercase tracking-wider">
                                                No existen órdenes de compras en el sistema
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINADOR */}
                        {totalPages > 1 && (
                            <div className="px-4 py-2.5 bg-card-fap border-t border-brand flex items-center justify-between">
                                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                                    Mostrando {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, pedidos.length)} de {pedidos.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button onClick={goFirst} disabled={page === 1} className="p-1.5 rounded border border-brand bg-card-fap text-brand-muted hover:bg-brand/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Ir al inicio">
                                        <ChevronsLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={goPrev} disabled={page === 1} className="p-1.5 rounded border border-brand bg-card-fap text-brand-muted hover:bg-brand/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Anterior">
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="px-3 py-1 text-[10px] font-black text-primary bg-brand/10 border border-brand rounded tracking-widest">
                                        {page} / {totalPages}
                                    </span>
                                    <button onClick={goNext} disabled={page === totalPages} className="p-1.5 rounded border border-brand bg-card-fap text-brand-muted hover:bg-brand/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Siguiente">
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={goLast} disabled={page === totalPages} className="p-1.5 rounded border border-brand bg-card-fap text-brand-muted hover:bg-brand/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Ir al final">
                                        <ChevronsRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
