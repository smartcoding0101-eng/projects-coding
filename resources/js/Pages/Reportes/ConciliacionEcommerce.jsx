import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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
    Search
} from 'lucide-react';

export default function ConciliacionEcommerce({ pendientes, resumen, productos }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Conciliación: Finanzas vs Almacén</h2>}
        >
            <Head title="Conciliación Ecommerce" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* INFO ALERTA - CONCENTRACIÓN DE RIESGO */}
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded shadow-sm">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                            <div>
                                <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                                    Control de Triangulación Activo
                                </p>
                                <p className="text-[11px] text-amber-700 font-medium">
                                    Este tablero muestra la brecha entre los ingresos validados en **Caja** y los productos que aún no han sido descargados del **Kardex Físico**.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-card-fap border border-brand p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Monto Retenido</p>
                                    <h3 className="text-xl font-black text-brand-main font-mono">Bs. {Number(resumen.monto_total_retenido).toFixed(2)}</h3>
                                </div>
                                <div className="p-2 bg-emerald-100 rounded text-emerald-700">
                                    <Wallet className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-[9px] text-brand-muted mt-2 font-medium">Flujo de caja recibido y auditado.</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Órdenes en Almacén</p>
                                    <h3 className="text-xl font-black text-brand-main font-mono">{resumen.total_pedidos_retenidos}</h3>
                                </div>
                                <div className="p-2 bg-blue-100 rounded text-blue-700">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-[9px] text-brand-muted mt-2 font-medium">Pedidos pagados pendientes de Pick-up.</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Unidades Pendientes</p>
                                    <h3 className="text-xl font-black text-brand-main font-mono">{resumen.unidades_totales_pendientes}</h3>
                                </div>
                                <div className="p-2 bg-amber-100 rounded text-amber-700">
                                    <Package className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-[9px] text-brand-muted mt-2 font-medium">Total de items físicos comprometidos.</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Último Corte</p>
                                    <h3 className="text-[12px] font-bold text-brand-main mt-1.5 uppercase">{resumen.fecha_corte}</h3>
                                </div>
                                <div className="p-2 bg-brand/10 rounded text-primary">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-[9px] text-brand-muted mt-3 font-medium">Sincronización en tiempo real.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* TABLA DE PRODUCTOS RETENIDOS (RESUMEN DE ALMACÉN) */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-card-fap border border-brand rounded-lg shadow-sm overflow-hidden flex flex-col">
                                <div className="px-4 py-2.5 border-b border-brand flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold text-brand-main uppercase tracking-widest">Inventario Comprometido</h3>
                                    <Package className="w-4 h-4 text-brand-muted" />
                                </div>
                                <div className="p-0 overflow-y-auto max-h-[500px]">
                                    <table className="w-full text-left text-[10px]">
                                        <thead className="bg-brand/5 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-2 font-bold uppercase tracking-tighter">Producto</th>
                                                <th className="px-4 py-2 font-bold uppercase tracking-tighter text-right">Cant.</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand/5">
                                            {productos.map((prod, idx) => (
                                                <tr key={idx} className="hover:bg-brand/5 transition-colors">
                                                    <td className="px-4 py-2">
                                                        <span className="font-bold block text-brand-main truncate uppercase w-40">{prod.nombre}</span>
                                                        <span className="text-[8px] text-brand-muted font-mono">{prod.codigo_sku}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <span className="font-black text-primary text-[11px]">{prod.total_unidades}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {productos.length === 0 && (
                                                <tr>
                                                    <td colSpan="2" className="px-4 py-8 text-center text-brand-muted italic">No hay productos retenidos</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* LISTADO DE ÓRDENES PENDIENTES DE ENTREGA (FINANZAS) */}
                        <div className="lg:col-span-8 flex flex-col">
                            <div className="bg-card-fap border border-brand rounded-lg shadow-sm overflow-hidden flex flex-col">
                                <div className="px-4 py-2.5 border-b border-brand flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold text-brand-main uppercase tracking-widest">Órdenes Pagadas Pendientes de Despacho</h3>
                                    <div className="flex gap-2">
                                        <button className="px-2 py-1 text-[9px] font-bold uppercase border border-brand rounded bg-brand/5 hover:bg-brand/10 transition-colors">Exportar Auditoría</button>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left text-[11px]">
                                        <thead className="bg-brand/5">
                                            <tr>
                                                <th className="px-4 py-2 font-bold uppercase tracking-tighter text-brand-muted text-[10px]">Orden</th>
                                                <th className="px-4 py-2 font-bold uppercase tracking-tighter text-brand-muted text-[10px]">Cliente</th>
                                                <th className="px-4 py-2 font-bold uppercase tracking-tighter text-brand-muted text-[10px] text-right">Valorizado</th>
                                                <th className="px-4 py-2 font-bold uppercase tracking-tighter text-brand-muted text-[10px] text-center">Antigüedad</th>
                                                <th className="px-4 py-2 font-bold uppercase tracking-tighter text-brand-muted text-[10px] text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand/5">
                                            {pendientes.map((pedido) => {
                                                const dias = Math.floor((new Date() - new Date(pedido.created_at)) / (1000 * 60 * 60 * 24));
                                                return (
                                                    <tr key={pedido.id} className="hover:bg-brand/10 transition-colors">
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <span className="font-black text-brand-main font-mono">{pedido.numero_orden}</span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-brand-main uppercase truncate w-32">{pedido.nombre_cliente}</span>
                                                                <span className="text-[9px] text-brand-muted">{pedido.tipo_pago.toUpperCase()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-right font-black font-mono">
                                                            Bs. {Number(pedido.total).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${dias > 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                                                {dias === 0 ? 'HOY' : `${dias} DÍAS`}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <Link 
                                                                href={route('admin.pedidos.show', pedido.id)}
                                                                className="p-1 px-2.5 bg-primary text-white text-[9px] font-bold uppercase rounded hover:bg-black transition-colors"
                                                            >
                                                                Gestionar Entrega
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {pendientes.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-brand-muted uppercase font-bold text-xs tracking-widest opacity-50">
                                                        Todo al día: El inventario coincide con los cobros de caja.
                                                    </td>
                                                </tr>
                                            )}
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
