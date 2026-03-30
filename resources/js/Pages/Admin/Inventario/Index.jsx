import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PackageSearch, Plus, Search, FileText, History, Info, XCircle } from 'lucide-react';

export default function Index({ productos, categorias, auth }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        codigo_sku: '',
        slug: '',
        categoria_id: '',
        precio_general: '',
        precio_asociado: '',
        stock_actual: '',
        stock_minimo: '',
        descripcion: ''
    });

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('admin.inventario.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Módulo de Patrística e Inventario</h2>}>
            <Head title="Inventario Global" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#fafaf6] gap-4">
                        <div className="flex items-center gap-3">
                            <PackageSearch className="w-5 h-5 text-fapclas-600" />
                            <div>
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                    Catálogo Central de Materiales y Productos
                                </h3>
                                <p className="text-[11px] text-fapclas-500 font-medium">
                                    Administración de stock, creación de nuevos ítems y acceso al Kardex general.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href={route('admin.ecommerce.kardex-global')} className="px-4 py-2 bg-white border border-fapclas-300 text-fapclas-700 hover:bg-fapclas-50 text-xs font-bold flex items-center gap-1.5 rounded transition-colors shadow-sm">
                                <History className="w-4 h-4" /> Kardex Globalizado
                            </Link>
                            <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 bg-fapclas-800 hover:bg-fapclas-900 text-white text-xs font-bold flex items-center gap-1.5 rounded shadow-sm active:translate-y-px transition-colors">
                                <Plus className="w-4 h-4" /> Alta de Material
                            </button>
                        </div>
                    </div>

                    {isCreateOpen && (
                        <div className="bg-white border border-fapclas-200 shadow-md rounded-lg overflow-hidden flex flex-col mb-5">
                            <div className="px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center justify-between bg-fapclas-50/50 text-fapclas-600 border-fapclas-200">
                                <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Formulario de Ingreso de Nuevo Ítem</span>
                                <button onClick={() => setIsCreateOpen(false)} className="text-fapclas-400 hover:text-red-500"><XCircle className="w-4 h-4" /></button>
                            </div>
                            <form onSubmit={submitCreate} className="p-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-[#fafaf6]/30">
                                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Nombre Descriptivo <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.nombre} onChange={e => {
                                        setData('nombre', e.target.value);
                                        setData('slug', e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                    }} className="field-input text-xs w-full" required />
                                    {errors.nombre && <p className="text-[9px] font-bold text-red-500 mt-0.5">{errors.nombre}</p>}
                                </div>
                                
                                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">SKU / Referencia <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.codigo_sku} onChange={e => setData('codigo_sku', e.target.value)} className="field-input text-xs w-full uppercase font-mono" required />
                                    {errors.codigo_sku && <p className="text-[9px] font-bold text-red-500 mt-0.5">{errors.codigo_sku}</p>}
                                </div>

                                <div className="col-span-1 lg:col-span-1">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Categoría <span className="text-red-500">*</span></label>
                                    <select value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)} className="field-input text-xs w-full" required>
                                        <option value="">-- Asignar --</option>
                                        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                                    </select>
                                </div>

                                <div className="col-span-1 lg:col-span-1">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">P. Lista (Bs) <span className="text-red-500">*</span></label>
                                    <input type="number" step="0.01" value={data.precio_general} onChange={e => setData('precio_general', e.target.value)} className="field-input text-xs w-full text-right font-mono" required />
                                </div>

                                <div className="col-span-1 lg:col-span-1">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">P. Socio (Bs) <span className="text-red-500">*</span></label>
                                    <input type="number" step="0.01" value={data.precio_asociado} onChange={e => setData('precio_asociado', e.target.value)} className="field-input text-xs w-full text-right font-mono text-emerald-700" required />
                                </div>

                                <div className="col-span-1 lg:col-span-1">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Stock Inv. <span className="text-red-500">*</span></label>
                                    <input type="number" value={data.stock_actual} onChange={e => setData('stock_actual', e.target.value)} className="field-input text-xs w-full text-right font-mono" required />
                                </div>

                                <div className="col-span-1 lg:col-span-1 border-r border-fapclas-100 pr-4">
                                    <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Mínimo Alerta <span className="text-red-500">*</span></label>
                                    <input type="number" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)} className="field-input text-xs w-full text-right font-mono" required />
                                </div>

                                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end items-end gap-2">
                                    <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-[11px] font-bold text-fapclas-600 hover:text-fapclas-900 border border-transparent">
                                        Cancelar Ingreso
                                    </button>
                                    <button type="submit" disabled={processing} className="px-5 py-2 bg-fapclas-800 hover:bg-fapclas-900 text-white text-[11px] font-bold rounded shadow-sm active:translate-y-px disabled:opacity-50">
                                        Efectuar Registro en BD
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* DATAGRID INVENTARIO */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#fafaf6] border-b border-fapclas-200">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider">SKU / Ref</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-1/3">Descripción del Material</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider border-l border-fapclas-100 bg-[#fdfdfc] text-center w-24">Fam./Cat.</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider border-l border-fapclas-100 bg-[#fdfdfc] text-right w-24">Stock Físico</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider border-l border-fapclas-100 bg-[#fdfdfc] text-right w-32">P. Venta / P. Socio</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider text-right w-24 border-l border-fapclas-100">Auditoría</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fapclas-100">
                                    {productos.data.map(prod => {
                                        const isLowStock = prod.stock_actual <= prod.stock_minimo;
                                        return (
                                            <tr key={prod.id} className="hover:bg-fapclas-50/40 transition-colors">
                                                <td className="px-4 py-2 whitespace-nowrap text-[11px] font-bold font-mono text-fapclas-500">
                                                    {prod.codigo_sku}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="text-[11px] font-bold text-fapclas-900 truncate max-w-[250px]" title={prod.nombre}>{prod.nombre}</div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-fapclas-50 bg-[#fdfdfc]">
                                                    <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 uppercase tracking-widest">{prod.categoria?.nombre || 'GNR'}</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 bg-[#fdfdfc]">
                                                    <span className={`text-[11px] font-bold font-mono ${isLowStock ? 'text-red-600' : 'text-emerald-700'}`}>
                                                        {prod.stock_actual} un.
                                                    </span>
                                                    {isLowStock && <span className="ml-1 inline-block w-2 h-2 rounded-full bg-red-500 shadow-sm" title={`Bajo el mínimo de ${prod.stock_minimo}`}></span>}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 bg-[#fdfdfc] flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-gray-600 font-mono">Bs. {prod.precio_general}</span>
                                                    <span className="text-[10px] font-bold text-fapclas-700 font-mono">Bs. {prod.precio_asociado}</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-fapclas-50 shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    <Link href={route('admin.inventario.kardex', prod.id)} className="text-[10px] font-bold text-fapclas-600 hover:text-fapclas-900 bg-fapclas-50 px-2 py-1 rounded border border-fapclas-200 inline-flex items-center gap-1 transition-colors">
                                                        <FileText className="w-3 h-3"/> Kardex
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {productos.data.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                                                Base de Datos Vacia
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINACIÓN ESTRUCTURAL */}
                    {productos.links && productos.links.length > 3 && (
                        <div className="flex justify-between items-center bg-white px-4 py-3 border border-fapclas-200 shadow-sm rounded-lg">
                            <Link 
                                href={productos.first_page_url} 
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${productos.current_page === 1 ? 'text-gray-400 bg-gray-50 border-gray-100 pointer-events-none' : 'text-fapclas-700 bg-white border-fapclas-300 hover:bg-fapclas-50'}`}
                                preserveScroll
                            >
                                Primera Pág
                            </Link>
                            
                            <div className="flex space-x-1">
                                {productos.links.slice(1, -1).map((link, i) => (
                                    <Link 
                                        key={i} 
                                        href={link.url || '#'} 
                                        className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-colors ${link.active ? 'bg-fapclas-800 text-white border-fapclas-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                    />
                                ))}
                            </div>

                            <Link 
                                href={productos.last_page_url} 
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${productos.current_page === productos.last_page ? 'text-gray-400 bg-gray-50 border-gray-100 pointer-events-none' : 'text-fapclas-700 bg-white border-fapclas-300 hover:bg-fapclas-50'}`}
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
