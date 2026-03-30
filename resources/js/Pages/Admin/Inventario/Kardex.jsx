import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Plus, History, PackageSearch, AlertTriangle } from 'lucide-react';

export default function Kardex({ producto, movimientos, auth }) {
    const [isAjusteOpen, setIsAjusteOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tipo_movimiento: 'ingreso',
        cantidad: '',
        concepto: '',
        es_merma: false
    });

    const submitAjuste = (e) => {
        e.preventDefault();
        post(route('admin.inventario.ajustar', producto.id), {
            onSuccess: () => {
                setIsAjusteOpen(false);
                reset();
            },
            preserveScroll: true
        });
    };

    const isLowStock = producto.stock_actual <= producto.stock_minimo;

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Auditoría Kardex / {producto.codigo_sku}</h2>}>
            <Head title={`Kardex: ${producto.codigo_sku}`} />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* NAVEGACIÓN Y ENCABEZADO */}
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.inventario.index')} className="px-3 py-1.5 bg-white border border-fapclas-300 text-fapclas-700 hover:bg-fapclas-50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 rounded transition-colors shadow-sm">
                            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Catálogo
                        </Link>
                    </div>

                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row p-0 bg-[#fafaf6]">
                        {/* Datos del Producto */}
                        <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-fapclas-200 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono font-bold bg-fapclas-100 text-fapclas-700 px-2 py-0.5 rounded border border-fapclas-200">
                                        REF: {producto.codigo_sku}
                                    </span>
                                    {isLowStock && (
                                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3"/> STOCK CRÍTICO
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-fapclas-900 uppercase tracking-tight">
                                    {producto.nombre}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-bold text-fapclas-500 uppercase tracking-widest mb-0.5">Stock Físico Real</span>
                                <span className={`text-3xl font-black font-mono leading-none ${isLowStock ? 'text-red-600' : 'text-emerald-700'}`}>
                                    {producto.stock_actual}
                                </span>
                            </div>
                        </div>

                        {/* Controles de Ajuste */}
                        <div className="p-5 md:w-80 bg-[#fdfdfc] flex flex-col justify-center">
                            <button onClick={() => setIsAjusteOpen(!isAjusteOpen)} className="w-full bg-fapclas-800 hover:bg-fapclas-900 text-white px-4 py-2.5 rounded flex items-center justify-center text-xs font-bold transition-all shadow-sm active:translate-y-px">
                                <Plus className="w-4 h-4 mr-2" /> Inyectar Ajuste Manual
                            </button>
                            <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-wider font-bold">Autorizado para Egresos o Ingresos</p>
                        </div>
                    </div>

                    {/* FORMULARIO INLINE DE AJUSTE (REEMPLAZA MODAL) */}
                    {isAjusteOpen && (
                        <div className="bg-white border-2 border-fapclas-300 shadow-md rounded-lg overflow-hidden">
                            <div className="bg-fapclas-50/80 px-4 py-3 border-b border-fapclas-200 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-fapclas-600" />
                                <h3 className="text-xs font-bold text-fapclas-900 uppercase tracking-wider">Asiento Físico Manual (Ajuste)</h3>
                            </div>
                            <form onSubmit={submitAjuste} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#fafaf6]">
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-2">Comportamiento del Asiento <span className="text-red-500">*</span></label>
                                    <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
                                        <label className={`flex-1 text-center py-1.5 cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors ${data.tipo_movimiento === 'ingreso' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                            <input type="radio" value="ingreso" checked={data.tipo_movimiento === 'ingreso'} onChange={e => {
                                                setData('tipo_movimiento', 'ingreso');
                                                setData('es_merma', false);
                                            }} className="sr-only"/>
                                            + INGRESO
                                        </label>
                                        <label className={`flex-1 text-center py-1.5 cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-colors ${data.tipo_movimiento === 'ajuste' ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                            <input type="radio" value="ajuste" checked={data.tipo_movimiento === 'ajuste'} onChange={e => {
                                                setData('tipo_movimiento', 'ajuste');
                                                setData('es_merma', true);
                                            }} className="sr-only"/>
                                            - EGRESO
                                        </label>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Volumen / Cantidad <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" value={data.cantidad} onChange={e => setData('cantidad', e.target.value)} className="field-input text-xs w-full text-right font-mono" required />
                                    {errors.cantidad && <p className="text-[9px] font-bold text-red-500 mt-0.5">{errors.cantidad}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Glosa / Motivo del Ajuste <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.concepto} onChange={e => setData('concepto', e.target.value)} placeholder="Ej: Mercadería dañada en exhibición..." className="field-input text-xs w-full" required />
                                </div>
                                <div className="md:col-span-4 flex justify-end gap-2 border-t border-fapclas-100 pt-3 mt-1">
                                    <button type="button" onClick={() => setIsAjusteOpen(false)} className="px-4 py-2 text-[10px] font-bold text-fapclas-500 hover:text-fapclas-800 uppercase tracking-wider">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={processing} className="px-6 py-2 bg-fapclas-800 hover:bg-fapclas-900 text-white text-[11px] font-bold rounded shadow-sm disabled:opacity-50">
                                        Contabilizar Movimiento Físico
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* DATAGRID DE MOVIMIENTOS */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-fapclas-100 bg-[#fafaf6] flex items-center gap-2">
                            <History className="w-4 h-4 text-fapclas-600" />
                            <h3 className="text-xs font-bold text-fapclas-900 uppercase tracking-wider">Libro de Asientos Físicos</h3>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#fdfdfc] border-b border-fapclas-100">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider w-40">Marca de Tiempo</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider">Glosa Funcional</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-center w-28 border-l border-fapclas-50">Naturaleza</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-right w-24 border-l border-fapclas-50">Variación</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-right w-24 border-l border-fapclas-50 bg-[#fafaf6]">Saldo Final</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-fapclas-500 uppercase tracking-wider text-right w-32 border-l border-fapclas-50">Operador</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fapclas-50">
                                    {movimientos.map(mov => {
                                        const isIngreso = mov.tipo_movimiento === 'ingreso';
                                        const isEgreso = mov.tipo_movimiento === 'egreso' || mov.tipo_movimiento === 'ajuste';
                                        return (
                                            <tr key={mov.id} className="hover:bg-fapclas-50/30 transition-colors">
                                                <td className="px-4 py-2 whitespace-nowrap text-[10px] text-gray-500 font-mono">
                                                    {new Date(mov.created_at).toLocaleString('es-BO', {
                                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-4 py-2 text-[11px] font-bold text-fapclas-900 uppercase">
                                                    {mov.concepto}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-fapclas-50 bg-[#fdfdfc]">
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest border ${
                                                        isIngreso ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                        isEgreso ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                        {mov.tipo_movimiento === 'ajuste' ? 'MERMA/EGRESO' : mov.tipo_movimiento.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 bg-[#fdfdfc]">
                                                    <span className={`text-[11px] font-bold font-mono ${isIngreso ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {isIngreso ? '+' : '-'}{mov.cantidad}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 bg-[#fafaf6] shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    <span className="text-[12px] font-black font-mono text-fapclas-900">
                                                        {mov.saldo_stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 text-[10px] font-bold text-gray-400 font-mono">
                                                    {mov.admin?.name ? mov.admin.name.substring(0, 15) : 'SYS_AUTO'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {movimientos.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                Carencia de Movimientos Físicos
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
