import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    FileText, Search, Calendar, Filter, 
    ArrowLeft, Download, ShoppingBag, 
    CheckCircle, XCircle, Clock, Package, 
    User, DollarSign, BarChart3
} from 'lucide-react';

export default function ReporteMovimientos({ auth, pedidos, filters, stats }) {
    
    const handleFilterChange = (key, value) => {
        router.get(route('admin.ecommerce.reporte.movimientos'), {
            ...filters,
            [key]: value
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Reporte: Movimientos Ecommerce</h2>}
        >
            <Head title="Reporte Movimientos Ecommerce" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* ENCABEZADO Y ACCIONES */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link 
                                href={route('admin.ecommerce.dashboard')}
                                className="p-2 bg-card-fap border border-brand text-brand-muted hover:text-primary rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h3 className="text-lg font-bold text-brand-main uppercase tracking-tight flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" /> Flujo de Ventas Digitales
                                </h3>
                                <p className="text-xs text-brand-muted font-medium">Auditoría detallada de pedidos, productos y estados financieros.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-card-fap border border-brand text-brand-main hover:bg-main text-xs font-bold rounded flex items-center gap-2 transition-all shadow-sm">
                                <Download className="w-4 h-4" /> Exportar .PDF
                            </button>
                        </div>
                    </div>

                    {/* TARJETAS DE ESTADÍSTICAS (KPIs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Ingresos Pagados', value: `Bs ${stats.total_ventas.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                            { label: 'Total Pedidos', value: stats.cantidad_pedidos, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
                            { label: 'Pedidos Pagados', value: stats.pedidos_pagados, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
                            { label: 'Pedidos Rechazados', value: stats.pedidos_rechazados, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-card-fap border border-brand p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h4 className="text-xl font-bold text-brand-main">{stat.value}</h4>
                                    </div>
                                    <div className={`p-3 ${stat.bg} ${stat.color} rounded-lg`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FILTROS AVANZADOS */}
                    <div className="bg-card-fap border border-brand rounded-xl p-5 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-black text-brand-muted uppercase mb-1.5 tracking-wider">Buscar (Orden / Cliente)</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                                    <input 
                                        type="text"
                                        value={filters.q || ''}
                                        onChange={e => handleFilterChange('q', e.target.value)}
                                        placeholder="Ej: ORD-001..."
                                        className="w-full bg-main border-brand rounded-lg pl-10 pr-4 py-2 text-xs text-brand-main placeholder-brand-muted/50 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-brand-muted uppercase mb-1.5 tracking-wider">Estado Financiero</label>
                                <select 
                                    value={filters.estado_pago || ''}
                                    onChange={e => handleFilterChange('estado_pago', e.target.value)}
                                    className="w-full bg-main border-brand rounded-lg px-4 py-2 text-xs text-brand-main focus:ring-primary font-bold"
                                >
                                    <option value="">TODOS LOS ESTADOS</option>
                                    <option value="pendiente_validacion">PENDIENTE VALIDACIÓN</option>
                                    <option value="pagado">PAGADO (CONTABILIZADO)</option>
                                    <option value="rechazado">RECHAZADO (AUDITORÍA)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-brand-muted uppercase mb-1.5 tracking-wider">Desde Fecha</label>
                                <input 
                                    type="date"
                                    value={filters.fecha_inicio || ''}
                                    onChange={e => handleFilterChange('fecha_inicio', e.target.value)}
                                    className="w-full bg-main border-brand rounded-lg px-4 py-2 text-xs text-brand-main focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-brand-muted uppercase mb-1.5 tracking-wider">Hasta Fecha</label>
                                <input 
                                    type="date"
                                    value={filters.fecha_fin || ''}
                                    onChange={e => handleFilterChange('fecha_fin', e.target.value)}
                                    className="w-full bg-main border-brand rounded-lg px-4 py-2 text-xs text-brand-main focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* LISTADO DE MOVIMIENTOS */}
                    <div className="bg-card-fap border border-brand rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-main border-b border-brand">
                                    <th className="px-5 py-4 text-[10px] font-black text-brand-muted uppercase tracking-widest">Orden / Digital ID</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-brand-muted uppercase tracking-widest">Cliente / Afiliado</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-brand-muted uppercase tracking-widest">Detalle Productos</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-brand-muted uppercase tracking-widest text-right">Valoración</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-brand-muted uppercase tracking-widest text-center">Estado Financiero</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-brand-muted uppercase tracking-widest text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand">
                                {pedidos.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <Filter className="w-12 h-12 text-brand-muted/30 mb-3" />
                                                <p className="text-sm font-bold text-brand-muted uppercase">No se encontraron movimientos para el filtro aplicado</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pedidos.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-main/50 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-primary uppercase tracking-tighter">#{p.numero_orden}</span>
                                                    <span className="text-[10px] text-brand-muted font-medium flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {new Date(p.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-xs font-bold text-brand-main uppercase tracking-tight">
                                                {p.user?.name || 'Cliente Externo'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {p.detalles.map((d, i) => (
                                                        <div key={i} className="text-[10px] font-medium text-brand-muted flex items-center gap-1.5">
                                                            <Package className="w-3 h-3 text-primary opacity-60" /> {d.cantidad}x {d.producto?.nombre}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-black text-brand-main tracking-tight">Bs {Number(p.total).toLocaleString()}</span>
                                                    <span className="text-[9px] text-brand-muted font-bold uppercase tracking-widest">
                                                        {p.tipo_pago === 'qr' ? 'Venta Digital (QR)' : 'Efectivo / Otros'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-center">
                                                    {p.estado_pago === 'pagado' ? (
                                                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/20">
                                                            <CheckCircle className="w-3 h-3" /> Pagado
                                                        </span>
                                                    ) : p.estado_pago === 'rechazado' ? (
                                                        <span className="px-2.5 py-1 bg-red-500/10 text-red-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 border border-red-500/20">
                                                            <XCircle className="w-3 h-3" /> Rechazado
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 border border-orange-500/20">
                                                            <Clock className="w-3 h-3" /> Pendiente
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-center">
                                                    <Link 
                                                        href={route('admin.pedidos.show', p.id)}
                                                        className="p-1.5 text-brand-muted hover:text-primary transition-colors"
                                                        title="Ver Detalles"
                                                    >
                                                        <FileText className="w-5 h-5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINACIÓN */}
                    {pedidos.links.length > 3 && (
                        <div className="flex justify-center gap-2 py-4">
                            {pedidos.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url, filters)}
                                    disabled={!link.url || link.active}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        link.active ? 'bg-primary text-white shadow-md' : 'bg-card-fap border border-brand text-brand-muted hover:bg-main'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
