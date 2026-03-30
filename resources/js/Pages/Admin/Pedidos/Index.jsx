import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Eye, DollarSign, CheckCircle, PackageSearch } from 'lucide-react';

export default function Index({ pedidos }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Control de Pedidos (Ventas Web)</h2>}>
            <Head title="Pedidos" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#fafaf6] gap-4">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-fapclas-600" />
                            <div>
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                    Ventas B2B / B2C (Ecommerce)
                                </h3>
                                <p className="text-[11px] text-fapclas-500 font-medium">
                                    Consolidado de órdenes, auditoría de pagos QR y liquidación de entregas (Pick).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DATAGRID PEDIDOS */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#fdfdfc] border-b border-fapclas-100">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider w-36">Orden / Fecha</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider lg:w-1/4">Cliente Comercial</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-right w-28 border-l border-fapclas-50">Monto Total</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-center w-36 border-l border-fapclas-50">Transacción</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-center w-40 border-l border-fapclas-50 bg-[#fafaf6]">Status (Pago / Pick)</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-right w-24 border-l border-fapclas-50">Gestión</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fapclas-50">
                                    {pedidos.map(pedido => {
                                        const isCrítico = pedido.estado_pago === 'pendiente_validacion';
                                        return (
                                            <tr key={pedido.id} className={`hover:bg-fapclas-50/40 transition-colors ${isCrítico ? 'bg-amber-50/10' : ''}`}>
                                                <td className="px-4 py-2 whitespace-nowrap text-[10px] text-gray-500 font-mono">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-fapclas-800 text-[11px]">{pedido.numero_orden}</span>
                                                        <span className="text-[9px] mt-0.5">{new Date(pedido.created_at).toLocaleString('es-BO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-fapclas-900 uppercase truncate" title={pedido.nombre_cliente}>{pedido.nombre_cliente}</span>
                                                        <span className="text-[9px] font-mono text-fapclas-500 mt-0.5">TERCERO: {pedido.user ? 'SOCIO INSCRITO' : 'B2C EVENTUAL'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 bg-[#fdfdfc]">
                                                    <span className="text-[12px] font-black font-mono text-gray-900">
                                                        Bs. {Number(pedido.total).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-fapclas-50 bg-[#fdfdfc]">
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest border ${pedido.tipo_pago === 'qr' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-purple-50 text-purple-800 border-purple-200'}`}>
                                                        {pedido.tipo_pago === 'qr' ? 'QR_BANCARIO' : 'FINANCIADO'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-fapclas-50 bg-[#fafaf6] shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    <div className="flex flex-col gap-1 items-center">
                                                        <span className={`w-full text-center px-1.5 py-0.5 text-[8px] font-bold uppercase rounded border ${
                                                            pedido.estado_pago === 'pagado' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                            pedido.estado_pago === 'pendiente_validacion' ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-[0_0_5px_rgba(245,158,11,0.2)]' : 
                                                            'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                            {pedido.estado_pago === 'pendiente_validacion' ? 'VALIDACIÓN_PEND' : pedido.estado_pago.toUpperCase()}
                                                        </span>
                                                        <span className={`w-full text-center px-1.5 py-0.5 text-[8px] font-bold uppercase rounded border ${
                                                            pedido.estado_entrega === 'entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                            'bg-gray-50 text-gray-600 border-gray-200'
                                                        }`}>
                                                            {pedido.estado_entrega.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50">
                                                    <Link href={route('admin.pedidos.show', pedido.id)} className="text-[10px] font-bold text-fapclas-600 hover:text-fapclas-900 bg-fapclas-50 px-2.5 py-1.5 rounded border border-fapclas-200 inline-flex items-center gap-1 transition-colors">
                                                        <Eye className="w-3.5 h-3.5"/> Inspeccionar
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {pedidos.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                No existen órdenes de compras en el sistema
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
