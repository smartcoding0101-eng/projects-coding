import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { History, Search, Filter, Box, ArrowLeft, RefreshCw, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KardexGlobal({ movimientos, filtros, auth }) {
    const [q, setQ] = useState(filtros?.q || '');
    const [tipo, setTipo] = useState(filtros?.tipo || '');
    const [fechaInicio, setFechaInicio] = useState(filtros?.fecha_inicio || '');
    const [fechaFin, setFechaFin] = useState(filtros?.fecha_fin || '');

    const applyFilters = () => {
        router.get(route('admin.ecommerce.kardex-global'), {
            q, tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin
        }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setQ(''); setTipo(''); setFechaInicio(''); setFechaFin('');
        router.get(route('admin.ecommerce.kardex-global'), {}, { preserveScroll: true });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg border border-primary/20">
                        <History className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                            Auditoría Global de Movimientos
                        </span>
                        <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                            Kardex Físico General
                        </span>
                    </div>
                </div>
            </div>
        }>
            <Head title="Kardex Físico General" />

            <div className="py-6 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* ENCABEZADO Y TOOLBAR DE FILTROS */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.inventario.index')} className="px-4 py-2 bg-card-fap border border-brand text-brand-main hover:text-white hover:bg-black text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg shadow-sm active:scale-95 flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" /> Retornar a Catálogo
                            </Link>
                        </div>
                        
                        <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-blue-500"></div>
                            <div className="px-5 py-4 border-b border-brand bg-card-fap flex items-center gap-4 mt-1">
                                <div className="p-2.5 bg-brand/5 border border-brand/50 rounded-xl text-primary">
                                    <History className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-brand-main uppercase tracking-widest">
                                        Registro Central (Asientos Físicos)
                                    </h3>
                                    <p className="text-[11px] text-brand-muted font-bold tracking-wider mt-0.5">
                                        Auditoría completa de toda entrada, salida y merma de inventario.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Filtros Densos */}
                            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 bg-card-fap/[0.03]">
                                <div className="md:col-span-4">
                                    <label className="block text-[10px] font-black text-brand-main uppercase tracking-widest mb-1.5 ml-1">Criterio / Material</label>
                                    <div className="relative">
                                        <input 
                                            type="text" value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleKeyDown}
                                            placeholder="SKU o Descripción..." 
                                            className="field-input text-xs w-full pl-9 h-10 font-bold" 
                                        />
                                        <Search className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-brand-main uppercase tracking-widest mb-1.5 ml-1">Naturaleza</label>
                                    <select value={tipo} onChange={e => setTipo(e.target.value)} className="field-input text-[11px] w-full font-black uppercase tracking-wider h-10">
                                        <option value="">TODAS LAS OP.</option>
                                        <option value="ingreso">+ INGRESOS</option>
                                        <option value="egreso">- EGRESOS</option>
                                        <option value="ajuste">+/- MERMAS</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-brand-main uppercase tracking-widest mb-1.5 ml-1">Desde Fecha</label>
                                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} onKeyDown={handleKeyDown} className="field-input text-[11px] font-black w-full h-10 uppercase text-center tracking-wider" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-brand-main uppercase tracking-widest mb-1.5 ml-1">Hasta Fecha</label>
                                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} onKeyDown={handleKeyDown} className="field-input text-[11px] font-black w-full h-10 uppercase text-center tracking-wider" />
                                </div>
                                <div className="md:col-span-2 flex items-end gap-2 pb-0.5">
                                    <button onClick={applyFilters} className="flex-1 h-9 bg-primary hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-transparent">
                                        <Filter className="w-3.5 h-3.5" /> Filtrar
                                    </button>
                                    {(q || tipo || fechaInicio || fechaFin) && (
                                        <button onClick={clearFilters} className="px-3 h-9 bg-white hover:bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-200 shadow-sm transition-all active:scale-95 flex items-center justify-center" title="Limpiar Filtros">
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DATAGRID DE MOVIMIENTOS GLOBALES */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 pl-6 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider w-36">Marca de Tiempo</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider lg:w-1/4">Artículo / SKU</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider">Glosa Funcional</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-center w-28 border-l border-brand">Naturaleza</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-right w-24 border-l border-brand">Variación</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-right w-28 border-l border-brand bg-card-fap/[0.04]">Saldo Final</th>
                                        <th className="px-4 pr-6 py-3.5 text-[10px] font-bold text-brand-main uppercase tracking-wider text-right w-28 border-l border-brand">Operador</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movimientos.data.map((mov, index) => {
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
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 bg-brand/5 rounded border border-brand/50">
                                                            <Box className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <Link href={route('admin.inventario.kardex', mov.producto_id)} className="flex-1 min-w-0 flex flex-col hover:underline decoration-primary">
                                                            <span className="text-[12px] font-black text-brand-main uppercase truncate" title={mov.producto?.nombre}>{mov.producto?.nombre}</span>
                                                            <span className="text-[10px] font-mono font-bold text-brand-muted mt-0.5 tracking-wider">REF: {mov.producto?.codigo_sku}</span>
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-[11px] font-bold text-brand-main uppercase truncate max-w-[200px]" title={mov.concepto}>
                                                    {mov.concepto}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center border-l border-brand bg-card-fap/[0.04]">
                                                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest border ${
                                                        isIngreso ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                                                        isEgreso ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                    }`}>
                                                        {mov.tipo_movimiento === 'ajuste' ? 'MERMA' : mov.tipo_movimiento.substring(0, 6)}
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
                                    {movimientos.data.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-16 text-center bg-card-fap">
                                                <p className="text-[11px] font-black text-brand-muted uppercase tracking-widest">
                                                    Carencia de Movimientos (Parámetros Vacíos)
                                                </p>
                                                <p className="text-[10px] font-medium text-brand-muted/70 mt-1">Ajuste los filtros para encontrar registros físicos.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINACIÓN ESTRUCTURAL */}
                    {movimientos.links && movimientos.links.length > 3 && (
                        <div className="flex justify-between items-center bg-card-fap px-5 py-3 border border-brand shadow-sm rounded-xl">
                            <Link 
                                href={movimientos.first_page_url} 
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${movimientos.current_page === 1 ? 'text-brand-muted bg-brand/5 pointer-events-none' : 'text-primary bg-white border border-brand shadow-sm hover:bg-black hover:text-white'}`}
                                preserveScroll
                            >
                                Primera Pág
                            </Link>
                            
                            <div className="flex space-x-1.5 hidden md:flex">
                                {movimientos.links.slice(1, -1).map((link, i) => (
                                    <Link 
                                        key={i} 
                                        href={link.url || '#'} 
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-[11px] font-black transition-colors ${link.active ? 'bg-primary text-white shadow-md' : 'bg-white text-brand-muted border border-brand hover:border-primary hover:text-primary'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                    />
                                ))}
                            </div>

                            <Link 
                                href={movimientos.last_page_url} 
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${movimientos.current_page === movimientos.last_page ? 'text-brand-muted bg-brand/5 pointer-events-none' : 'text-primary bg-white border border-brand shadow-sm hover:bg-black hover:text-white'}`}
                                preserveScroll
                            >
                                Última Pág
                            </Link>
                        </div>
                    )}
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
