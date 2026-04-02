import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { History, Search, Filter, Box, ArrowLeft, RefreshCw } from 'lucide-react';

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
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Auditoría Global de Movimientos</h2>}>
            <Head title="Kardex Físico General" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR DE FILTROS */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.inventario.index')} className="px-3 py-1.5 bg-card-fap border border-brand text-primary hover:bg-brand/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 rounded transition-colors shadow-sm">
                                <ArrowLeft className="w-3.5 h-3.5" /> Catálogo
                            </Link>
                        </div>
                        
                        <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-brand bg-card-fap flex items-center gap-3">
                                <History className="w-5 h-5 text-primary" />
                                <div>
                                    <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                        Registro Central (Asientos Físicos)
                                    </h3>
                                    <p className="text-[11px] text-brand-muted font-medium">
                                        Auditoría completa de toda entrada, salida y merma de inventario.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Filtros Densos */}
                            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 bg-card-fap/30">
                                <div className="md:col-span-4">
                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Criterio / Material</label>
                                    <div className="relative">
                                        <input 
                                            type="text" value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleKeyDown}
                                            placeholder="SKU o Descripción..." 
                                            className="field-input text-xs w-full pl-8" 
                                        />
                                        <Search className="w-4 h-4 text-brand-muted absolute left-2.5 top-[7px]" />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Naturaleza</label>
                                    <select value={tipo} onChange={e => setTipo(e.target.value)} className="field-input text-xs w-full font-bold">
                                        <option value="">TODAS LAS OP.</option>
                                        <option value="ingreso">+ INGRESOS</option>
                                        <option value="egreso">- EGRESOS</option>
                                        <option value="ajuste">+/- AJUSTES</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Desde Fecha</label>
                                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} onKeyDown={handleKeyDown} className="field-input text-xs w-full" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Hasta Fecha</label>
                                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} onKeyDown={handleKeyDown} className="field-input text-xs w-full" />
                                </div>
                                <div className="md:col-span-2 flex items-end gap-2">
                                    <button onClick={applyFilters} className="flex-1 py-1.5 bg-primary hover:bg-primary-dark text-white text-[11px] font-bold rounded shadow-sm active:translate-y-px transition-colors flex items-center justify-center gap-1.5 border border-transparent">
                                        <Filter className="w-3.5 h-3.5" /> Filtrar
                                    </button>
                                    {(q || tipo || fechaInicio || fechaFin) && (
                                        <button onClick={clearFilters} className="px-2.5 py-1.5 bg-card-fap hover:bg-brand/5 text-red-600 text-[11px] font-bold rounded border border-brand shadow-sm transition-colors" title="Limpiar Filtros">
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DATAGRID DE MOVIMIENTOS GLOBALES */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider w-36">Marca de Tiempo</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider lg:w-1/4">Artículo / SKU</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider">Glosa Funcional</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-center w-28 border-l border-brand">Naturaleza</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-right w-24 border-l border-brand">Variación</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-right w-24 border-l border-brand bg-card-fap">Saldo Final</th>
                                        <th className="px-4 py-2.5 text-[9px] font-bold text-brand-muted uppercase tracking-wider text-right w-28 border-l border-brand">Operador</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fapclas-50">
                                    {movimientos.data.map((mov) => {
                                        const isIngreso = mov.tipo_movimiento === 'ingreso';
                                        const isEgreso = mov.tipo_movimiento === 'egreso' || mov.tipo_movimiento === 'ajuste';
                                        return (
                                            <tr key={mov.id} className="hover:bg-brand/10 transition-colors">
                                                <td className="px-4 py-2 whitespace-nowrap text-[10px] text-brand-muted font-mono">
                                                    {new Date(mov.created_at).toLocaleString('es-BO', {
                                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Box className="w-3.5 h-3.5 text-fapclas-300 flex-shrink-0" />
                                                        <Link href={route('admin.inventario.kardex', mov.producto_id)} className="flex-1 min-w-0 flex flex-col hover:underline decoration-fapclas-300">
                                                            <span className="text-[11px] font-bold text-brand-main uppercase truncate" title={mov.producto?.nombre}>{mov.producto?.nombre}</span>
                                                            <span className="text-[9px] font-mono text-brand-muted mt-0.5">REF: {mov.producto?.codigo_sku}</span>
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-[11px] font-bold text-brand-main uppercase truncate max-w-[200px]" title={mov.concepto}>
                                                    {mov.concepto}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-brand bg-card-fap">
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest border ${
                                                        isIngreso ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                        isEgreso ? 'bg-red-50 text-red-700 border-red-500/50' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                        {mov.tipo_movimiento === 'ajuste' ? 'MERMA' : mov.tipo_movimiento.substring(0, 6)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand bg-card-fap">
                                                    <span className={`text-[11px] font-bold font-mono ${isIngreso ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {isIngreso ? '+' : '-'}{mov.cantidad}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    <span className="text-[12px] font-black font-mono text-brand-main">
                                                        {mov.saldo_stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand text-[10px] font-bold text-brand-muted font-mono">
                                                    {mov.admin?.name ? mov.admin.name.substring(0, 15) : 'SYS'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {movimientos.data.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-xs font-bold text-brand-muted uppercase tracking-wider">
                                                Carencia de Movimientos (Parámetros Vacíos)
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINACIÓN ESTRUCTURAL */}
                    {movimientos.links && movimientos.links.length > 3 && (
                        <div className="flex justify-between items-center bg-card-fap px-4 py-3 border border-brand shadow-sm rounded-lg">
                            <Link 
                                href={movimientos.first_page_url} 
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${movimientos.current_page === 1 ? 'text-brand-muted bg-brand/5 border-brand pointer-events-none' : 'text-primary bg-card-fap border-brand hover:bg-brand/10'}`}
                                preserveScroll
                            >
                                Primera Pág
                            </Link>
                            
                            <div className="flex space-x-1">
                                {movimientos.links.slice(1, -1).map((link, i) => (
                                    <Link 
                                        key={i} 
                                        href={link.url || '#'} 
                                        className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-colors ${link.active ? 'bg-primary text-white border-brand shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]' : 'bg-card-fap text-gray-600 border-brand hover:bg-brand/5 hover:border-brand'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                    />
                                ))}
                            </div>

                            <Link 
                                href={movimientos.last_page_url} 
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${movimientos.current_page === movimientos.last_page ? 'text-brand-muted bg-brand/5 border-brand pointer-events-none' : 'text-primary bg-card-fap border-brand hover:bg-brand/10'}`}
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
