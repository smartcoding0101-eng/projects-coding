import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Plus, History, PackageSearch, AlertTriangle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg border border-primary/20">
                        <PackageSearch className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                            Kardex: {producto.nombre}
                        </span>
                        <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                            Auditoría de Artículo - REF: {producto.codigo_sku}
                        </span>
                    </div>
                </div>
            </div>
        }>
            <Head title={`Kardex: ${producto.codigo_sku}`} />

            <div className="py-6 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* NAVEGACIÓN Y ENCABEZADO */}
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.inventario.index')} className="px-4 py-2 bg-card-fap border border-brand text-brand-main hover:text-white hover:bg-black text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg shadow-sm active:scale-95 flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Retornar a Catálogo
                        </Link>
                    </div>

                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col md:flex-row p-0 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-blue-500"></div>

                        {/* Datos del Producto */}
                        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-brand flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-mono font-black bg-primary/10 text-primary px-2.5 py-0.5 rounded border border-primary/20 tracking-wider">
                                        REF: {producto.codigo_sku}
                                    </span>
                                    {isLowStock && (
                                        <span className="text-[10px] font-black bg-red-500/10 text-red-600 px-2.5 py-0.5 rounded border border-red-500/20 flex items-center gap-1.5 animate-pulse">
                                            <AlertTriangle className="w-3.5 h-3.5"/> STOCK CRÍTICO
                                        </span>
                                    )}
                                    {producto.marca && (
                                        <span className="text-[10px] font-black tracking-widest uppercase bg-brand/5 px-2.5 py-0.5 rounded border border-brand/50 text-brand-muted">
                                            {producto.marca.nombre}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-black text-brand-main uppercase tracking-tight">
                                    {producto.nombre}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span className="block text-[11px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Stock Físico Real</span>
                                <span className={`text-5xl font-black font-mono leading-none tracking-tighter ${isLowStock ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {producto.stock_actual}
                                </span>
                            </div>
                        </div>

                        {/* Controles de Ajuste */}
                        <div className="p-6 md:w-80 bg-card-fap/[0.02] flex flex-col justify-center">
                            <button onClick={() => setIsAjusteOpen(!isAjusteOpen)} className="w-full bg-primary hover:bg-black text-white px-5 py-3.5 rounded-lg flex items-center justify-center text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md hover:shadow-lg active:scale-95 border border-transparent">
                                <Plus className="w-4 h-4 mr-2" /> Inyectar Ajuste
                            </button>
                            <p className="text-[9px] text-brand-muted mt-3 text-center uppercase tracking-widest font-black">Autorizado para Egresos o Ingresos</p>
                        </div>
                    </div>

                    {/* FORMULARIO INLINE DE AJUSTE (FIORI) */}
                    {isAjusteOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-card-fap border-2 border-primary/20 shadow-[0_10px_30px_rgba(72,107,44,0.1)] rounded-2xl overflow-hidden relative"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                            <div className="bg-primary/5 px-6 py-4 border-b border-brand flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="text-[12px] font-black text-brand-main uppercase tracking-widest">Contabilizar Asiento Físico (Ajuste)</h3>
                            </div>
                            <form onSubmit={submitAjuste} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-card-fap">
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Comportamiento <span className="text-red-500">*</span></label>
                                    <div className="flex bg-white border border-brand p-1 rounded-xl h-11 shadow-sm">
                                        <label className={`flex-1 flex items-center justify-center cursor-pointer text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${data.tipo_movimiento === 'ingreso' ? 'bg-emerald-500/15 text-emerald-700 shadow-sm' : 'text-brand-muted hover:bg-brand/5'}`}>
                                            <input type="radio" value="ingreso" checked={data.tipo_movimiento === 'ingreso'} onChange={e => {
                                                setData('tipo_movimiento', 'ingreso');
                                                setData('es_merma', false);
                                            }} className="sr-only"/>
                                            + INGRESO
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center cursor-pointer text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${data.tipo_movimiento === 'ajuste' ? 'bg-red-500/15 text-red-700 shadow-sm' : 'text-brand-muted hover:bg-brand/5'}`}>
                                            <input type="radio" value="ajuste" checked={data.tipo_movimiento === 'ajuste'} onChange={e => {
                                                setData('tipo_movimiento', 'ajuste');
                                                setData('es_merma', true);
                                            }} className="sr-only"/>
                                            - MERMA
                                        </label>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Volumen / Cantidad <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" value={data.cantidad} onChange={e => setData('cantidad', e.target.value)} className="field-input text-sm w-full h-11 text-center font-black font-mono text-brand-main" required placeholder="0" />
                                    {errors.cantidad && <p className="text-[9px] font-bold text-red-500 mt-1">{errors.cantidad}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Glosa del Ajuste <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.concepto} onChange={e => setData('concepto', e.target.value)} placeholder="Ej: Mercadería dañada en vitrina..." className="field-input text-xs w-full h-11 font-bold text-brand-main" required />
                                </div>
                                <div className="md:col-span-4 flex justify-end gap-3 border-t border-brand pt-5 mt-2">
                                    <button type="button" onClick={() => setIsAjusteOpen(false)} className="px-6 py-2.5 text-[10px] font-black text-brand-muted hover:text-red-500 hover:bg-red-50 rounded-lg uppercase tracking-widest transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={processing} className="px-8 py-2.5 bg-primary hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg shadow-md transition-all disabled:opacity-50 active:scale-95">
                                        Generar Asiento Físico
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* DATAGRID DE MOVIMIENTOS */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-brand bg-card-fap flex items-center gap-3">
                            <History className="w-5 h-5 text-primary" />
                            <h3 className="text-sm font-black text-brand-main uppercase tracking-widest">Libro de Asientos Físicos</h3>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 pl-6 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider w-40">Marca de Tiempo</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider">Glosa Funcional</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-center w-28 border-l border-brand">Naturaleza</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-right w-24 border-l border-brand">Variación</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-right w-24 border-l border-brand bg-card-fap/[0.04]">Saldo Final</th>
                                        <th className="px-4 pr-6 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-right w-32 border-l border-brand">Operador</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movimientos.map((mov, index) => {
                                        const isIngreso = mov.tipo_movimiento === 'ingreso';
                                        const isEgreso = mov.tipo_movimiento === 'egreso' || mov.tipo_movimiento === 'ajuste';
                                        return (
                                            <motion.tr 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                key={mov.id} 
                                                className="hover:bg-brand/5 transition-colors border-b border-brand/50 last:border-b-0"
                                            >
                                                <td className="px-4 pl-6 py-3 whitespace-nowrap text-[11px] font-bold text-brand-muted font-mono tracking-tight">
                                                    {new Date(mov.created_at).toLocaleString('es-BO', {
                                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                    }).replace(',', ' ')}
                                                </td>
                                                <td className="px-4 py-3 text-[11px] font-bold text-brand-main uppercase truncate max-w-[300px]" title={mov.concepto}>
                                                    {mov.concepto}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center border-l border-brand bg-card-fap/[0.04]">
                                                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest border ${
                                                        isIngreso ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                                                        isEgreso ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                    }`}>
                                                        {mov.tipo_movimiento === 'ajuste' ? 'MERMA/EGRESO' : mov.tipo_movimiento.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right border-l border-brand bg-card-fap/[0.04]">
                                                    <span className={`text-[12px] font-black font-mono tracking-tighter ${isIngreso ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {isIngreso ? '+' : '-'}{mov.cantidad}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right border-l border-brand bg-card-fap shadow-[inset_2px_0_0_rgba(0,0,0,0.02)] relative">
                                                    <div className="absolute left-0 top-0 w-[3px] h-full" style={{ backgroundColor: isIngreso ? '#10b981' : '#ef4444' }}></div>
                                                    <span className="text-[13px] font-black font-mono tracking-tighter text-brand-main pr-2">
                                                        {mov.saldo_stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 pr-6 py-3 whitespace-nowrap text-right border-l border-brand text-[10px] font-bold text-brand-muted font-mono tracking-wider">
                                                    {mov.admin?.name ? mov.admin.name.substring(0, 15) : 'SYSTEM'}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                    {movimientos.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center bg-card-fap">
                                                <p className="text-[11px] font-black text-brand-muted uppercase tracking-widest">
                                                    Carencia de Movimientos Físicos
                                                </p>
                                                <p className="text-[10px] font-medium text-brand-muted/70 mt-1">Este producto no cuenta con historial de auditoría.</p>
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
