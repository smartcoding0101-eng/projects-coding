import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    BarChart3, 
    Package, 
    ArrowRight, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    TrendingUp, 
    Wallet,
    Info,
    Search,
    ChevronLeft,
    ShieldCheck,
    Truck,
    ArrowUpRight,
    AlertTriangle,
    Boxes,
    Activity,
    Filter,
    RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StatCard({ label, value, color = 'text-primary', icon: Icon, sublabel }) {
    return (
        <div className="bg-card-fap rounded-2xl shadow-sm border border-brand p-5 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-brand/5 border border-brand/50 ${color.replace('text-', 'text- opacity-70')}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.15em]">{label}</p>
            </div>
            <p className={`text-2xl font-black tracking-tighter ${color} mb-1`}>{value}</p>
            {sublabel && <p className="text-[9px] font-bold text-brand-muted uppercase opacity-60 tracking-wider">{sublabel}</p>}
        </div>
    );
}

export default function ConciliacionEcommerce({ pendientes, resumen, productos, auth, filtros }) {
    const { data, setData, get, processing, reset } = useForm({
        desde: filtros.desde || '',
        hasta: filtros.hasta || '',
        estado_entrega: filtros.estado_entrega || 'por_recoger',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('reportes.conciliacion-ecommerce'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        reset();
        get(route('reportes.conciliacion-ecommerce'), {
            data: {
                desde: '',
                hasta: '',
                estado_entrega: 'por_recoger'
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                            <ShieldCheck className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors uppercase">
                                Conciliación de Triangulación
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Finanzas (Caja General) vs Almacén Central
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
            <Head title="Auditoría de Triangulación | FAPCLAS" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Alerta de Auditoría Premium */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-8 bg-card-fap border border-brand border-l-4 border-l-amber-500 p-6 rounded-2xl shadow-sm relative overflow-hidden group h-full"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-24 h-24 text-amber-500" />
                            </div>
                            <div className="flex items-start gap-5 relative z-10">
                                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                                    <AlertCircle className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-amber-700 uppercase tracking-[0.2em] mb-1">
                                        Protocolo de Control Transaccional Activo
                                    </p>
                                    <p className="text-[11px] text-brand-muted font-bold tracking-tight max-w-3xl leading-relaxed uppercase opacity-80">
                                        Este tablero sistematiza la brecha entre los ingresos validados en <span className="text-brand-main">Caja General</span> y los compromisos de entrega pendientes en el <span className="text-brand-main">Kardex de Almacén</span>. El sistema garantiza que no existan fugas de capital ni discrepancias físicas.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* PANEL DE FILTROS GLASSMORPHISM */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-4 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm h-full"
                        >
                            <form onSubmit={handleFilter} className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-main">Filtros de Auditoría</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-brand-muted tracking-tighter">Desde</label>
                                        <input 
                                            type="date"
                                            value={data.desde}
                                            onChange={e => setData('desde', e.target.value)}
                                            className="w-full bg-main border-brand rounded-xl text-[11px] font-black uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary/50 text-brand-main"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-brand-muted tracking-tighter">Hasta</label>
                                        <input 
                                            type="date"
                                            value={data.hasta}
                                            onChange={e => setData('hasta', e.target.value)}
                                            className="w-full bg-main border-brand rounded-xl text-[11px] font-black uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary/50 text-brand-main"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-brand-muted tracking-tighter">Estado de Entrega</label>
                                    <select 
                                        value={data.estado_entrega}
                                        onChange={e => setData('estado_entrega', e.target.value)}
                                        className="w-full bg-main border-brand rounded-xl text-[11px] font-black uppercase px-3 py-1.5 focus:ring-1 focus:ring-primary/50 text-brand-main cursor-pointer"
                                    >
                                        <option value="todos">Auditando Todos (Global)</option>
                                        <option value="por_recoger">Pendiente de Entrega (En Almacén)</option>
                                        <option value="en_ruta">En Tránsito (Logística)</option>
                                        <option value="entregado">Conciliado (Entregado)</option>
                                        <option value="cancelado">Bajas / Cancelados</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-brand-main hover:bg-brand-hover text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? 'Procesando...' : 'Aplicar Auditoría'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={handleReset}
                                        className="p-2 bg-main border border-brand text-brand-muted hover:text-red-500 rounded-xl transition-all shadow-sm active:scale-95"
                                        title="Reiniciar Filtros"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard 
                            label="Monto Retenido" 
                            value={`Bs ${parseFloat(resumen.monto_total_retenido).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                            icon={Wallet} 
                            color="text-emerald-600"
                            sublabel={data.estado_entrega === 'entregado' ? 'TOTAL DESCARGADO' : 'TOTAL EN CUSTODIA'}
                        />
                        <StatCard 
                            label="Órdenes Analizadas" 
                            value={resumen.total_pedidos_retenidos} 
                            icon={Clock} 
                            color="text-blue-600"
                            sublabel="VOLUMEN TRANSACCIONAL"
                        />
                        <StatCard 
                            label="Items Comprometidos" 
                            value={resumen.unidades_totales_pendientes} 
                            icon={Boxes} 
                            color="text-amber-600"
                            sublabel="STOCK FILTRADO"
                        />
                        <StatCard 
                            label="Fecha del Reporte" 
                            value={resumen.fecha_corte?.toUpperCase() || ''} 
                            icon={Activity} 
                            color="text-primary"
                            sublabel="CORTE DE AUDITORÍA"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* TABLA DE PRODUCTOS RETENIDOS (RESUMEN DE ALMACÉN) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-4 flex flex-col space-y-4"
                        >
                            <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px] relative">
                                <div className="p-5 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2">
                                        <Package className="w-4 h-4 text-primary" /> Inventario Técnico
                                    </h3>
                                    <div className="bg-brand/5 px-2 py-0.5 rounded border border-brand/50 text-[9px] font-black text-brand-muted uppercase tracking-tighter">Resumen Kardex</div>
                                </div>
                                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                    <table className="w-full text-left">
                                        <thead className="bg-main text-brand-muted sticky top-0 z-10 border-b border-brand">
                                            <tr>
                                                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest leading-none">Producto</th>
                                                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-right leading-none border-l border-brand">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand/10">
                                            {productos.map((prod, idx) => (
                                                <tr key={idx} className="hover:bg-brand/5 transition-colors group">
                                                    <td className="px-5 py-4">
                                                        <span className="font-black block text-brand-main uppercase tracking-tighter text-[11px] mb-1 truncate w-48">{prod.nombre}</span>
                                                        <span className="text-[9px] text-brand-muted font-bold tracking-widest uppercase opacity-60">{prod.codigo_sku}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right border-l border-brand/50">
                                                        <span className="font-black text-primary text-[13px] tracking-tighter">{prod.total_unidades}</span>
                                                        <span className="text-[8px] block text-brand-muted font-black uppercase opacity-60 leading-none">Unid.</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {productos.length === 0 && (
                                                <tr>
                                                    <td colSpan="2" className="px-5 py-24 text-center opacity-30">
                                                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Todo Despachado</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>

                        {/* LISTADO DE ÓRDENES PENDIENTES DE ENTREGA (FINANZAS) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-8 flex flex-col"
                        >
                            <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px] relative">
                                <div className="p-5 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase text-brand-main tracking-[0.2em] flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-primary" /> Compromisos de Despacho
                                    </h3>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-muted hover:text-brand-main border border-brand rounded-xl bg-main transition-all flex items-center gap-2 shadow-sm">
                                            <Search className="w-3.5 h-3.5" /> Auditoría Completa
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                    <table className="w-full text-left">
                                        <thead className="bg-main text-brand-muted sticky top-0 z-10 border-b border-brand">
                                            <tr>
                                                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Nro de Orden</th>
                                                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border-l border-brand">Socio / Cliente</th>
                                                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-right border-l border-brand">Total Cobrado</th>
                                                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-center border-l border-brand w-36">Antigüedad</th>
                                                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-right border-l border-brand">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand/10">
                                            {pendientes.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-48 text-center bg-emerald-500/5">
                                                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6 stroke-1 animate-pulse" />
                                                        <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em]">Sistema Sincronizado</p>
                                                        <p className="text-[10px] text-brand-muted mt-2 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                                            No existen discrepancias. Todos los cobros registrados en caja han sido descargados físicamente de almacén.
                                                        </p>
                                                    </td>
                                                </tr>
                                            ) : pendientes.map((pedido, index) => {
                                                const dias = Math.floor((new Date() - new Date(pedido.created_at)) / (1000 * 60 * 60 * 24));
                                                return (
                                                    <motion.tr 
                                                        key={pedido.id} 
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.02 }}
                                                        className="hover:bg-brand/5 transition-colors group"
                                                    >
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="font-black text-brand-main text-[13px] tracking-tighter font-mono group-hover:text-primary transition-colors">#{pedido.numero_orden}</div>
                                                            <div className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mt-1 opacity-60">{new Date(pedido.created_at).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-5 border-l border-brand/50">
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-brand-main uppercase tracking-tighter text-[11px] truncate w-40 leading-none mb-1.5">{pedido.nombre_cliente}</span>
                                                                <span className="text-[9px] text-brand-muted font-black uppercase tracking-widest bg-brand/5 px-1.5 py-0.5 rounded border border-brand/50 inline-block leading-none">{pedido.tipo_pago?.replace('_', ' ') || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right font-black border-l border-brand/50 text-brand-main font-mono text-[12px]">
                                                            Bs {parseFloat(pedido.total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-5 text-center border-l border-brand/50">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black tracking-widest uppercase border shadow-sm ${
                                                                dias > 3 ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                                                                dias > 1 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                                'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                            }`}>
                                                                <Clock className="w-3 h-3" />
                                                                {dias === 0 ? 'HOY' : `${dias} DÍAS`}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right border-l border-brand/50">
                                                            <Link 
                                                                href={route('admin.pedidos.show', pedido.id)}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-main hover:bg-brand-hover text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:-translate-y-0.5"
                                                            >
                                                                Gestionar <ArrowRight className="w-3.5 h-3.5" />
                                                            </Link>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
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
