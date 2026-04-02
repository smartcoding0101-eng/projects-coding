import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    PackageSearch, Plus, Search, FileText, History, Info, XCircle, 
    Layers, Tag, Calendar, DollarSign, Settings, Trash2, Edit2, 
    Save, ChevronRight, Hash, Bookmark, Briefcase, PackageOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ productos, categorias, nextSku, auth }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    
    // Formulario de Producto
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        codigo_sku: '',
        slug: '',
        categoria_id: '',
        precio_general: '',
        precio_asociado: '',
        precio_credito: '',
        precio_costo: '',
        stock_actual: '',
        stock_minimo: '',
        descripcion: '',
        descripcion_larga: '',
        marca: '',
        modelo: '',
        serie: '',
        calibre: '',
        fecha_vencimiento: '',
        observacion: ''
    });

    // Formulario de Categoría
    const categoryForm = useForm({
        nombre: '',
        descripcion: '',
        icono: 'Package',
        color: '#3a5126',
        orden: 0,
        activa: true
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

    const handleOpenCategoryEdit = (cat) => {
        setEditingCategory(cat.id);
        categoryForm.setData({
            nombre: cat.nombre,
            descripcion: cat.descripcion || '',
            icono: cat.icono || 'Package',
            color: cat.color || '#3a5126',
            orden: cat.orden || 0,
            activa: !!cat.activa
        });
    };

    const submitCategory = (e) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(route('admin.categorias.update', editingCategory), {
                onSuccess: () => {
                    setEditingCategory(null);
                    categoryForm.reset();
                }
            });
        } else {
            categoryForm.post(route('admin.categorias.store'), {
                onSuccess: () => categoryForm.reset()
            });
        }
    };

    const deleteCategory = (id) => {
        if (confirm('¿Estás seguro de eliminar esta categoría? Solo se podrá si no tiene productos.')) {
            categoryForm.delete(route('admin.categorias.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg border border-primary/20">
                            <PackageOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Inventario Global
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Catálogo de Materiales y Logística
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Inventario | Fapclas" />

            <div className="py-6 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* ENCABEZADO Y TOOLBAR (FIORI) */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-blue-500"></div>
                        <div className="flex items-start md:items-center gap-3">
                            <div>
                                <h3 className="text-[11px] font-black text-brand-main uppercase tracking-widest mb-1">
                                    Mantenimiento de Catálogo
                                </h3>
                                <p className="text-[10px] text-brand-muted font-semibold max-w-xl">
                                    Añade nuevos ítems, ajusta precios, controla el stock mínimo y clasifica los recursos por familia (categorías).
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => setIsCategoriesModalOpen(true)} className="px-4 py-2 bg-card-fap border border-brand text-brand-main hover:bg-brand/10 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 rounded-lg transition-colors shadow-sm">
                                <Layers className="w-3.5 h-3.5" /> Maestro Categorías
                            </button>
                            <Link href={route('admin.ecommerce.kardex-global')} className="px-4 py-2 bg-card-fap border border-brand text-brand-main hover:bg-brand/10 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 rounded-lg transition-colors shadow-sm">
                                <History className="w-3.5 h-3.5" /> Kardex
                            </Link>
                            <button onClick={() => {
                                setData('codigo_sku', nextSku);
                                setIsCreateOpen(true);
                            }} className="px-5 py-2 bg-primary hover:bg-black text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-2 rounded-lg shadow-md active:scale-95 transition-all">
                                <Plus className="w-3.5 h-3.5" /> Alta Ítem
                            </button>
                        </div>
                    </div>

                    {isCreateOpen && (
                        <div className="bg-card-fap border border-brand shadow-md rounded-lg overflow-hidden flex flex-col mb-5">
                            <div className="px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center justify-between bg-brand/10 text-primary border-brand">
                                <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Formulario de Ingreso de Nuevo Ítem (Vistas Extendidas)</span>
                                <button onClick={() => setIsCreateOpen(false)} className="text-brand-muted hover:text-red-500"><XCircle className="w-4 h-4" /></button>
                            </div>
                            <form onSubmit={submitCreate} className="p-5 flex flex-col gap-6 bg-card-fap/30">
                                
                                {/* SECCIÓN 1: IDENTIFICACIÓN BÁSICA */}
                                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                        <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Nombre Comercial <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.nombre} onChange={e => {
                                            setData('nombre', e.target.value);
                                            setData('slug', e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                        }} className="field-input text-xs w-full" required placeholder="Ej: Gaseosa Coca Cola" />
                                        {errors.nombre && <p className="text-[9px] font-bold text-red-500 mt-0.5">{errors.nombre}</p>}
                                    </div>
                                    
                                    <div className="col-span-1 md:col-span-1">
                                        <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">SKU / REF <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.codigo_sku} readOnly className="field-input text-xs w-full uppercase font-mono bg-gray-50 cursor-not-allowed" required placeholder="SKU-001" />
                                        {errors.codigo_sku && <p className="text-[9px] font-bold text-red-500 mt-0.5">{errors.codigo_sku}</p>}
                                    </div>

                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Familia/Cat. <span className="text-red-500">*</span></label>
                                        <select value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)} className="field-input text-xs w-full" required>
                                            <option value="">-- Asignar --</option>
                                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                                        </select>
                                    </div>

                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">F. Vencimiento</label>
                                        <input type="date" value={data.fecha_vencimiento} onChange={e => setData('fecha_vencimiento', e.target.value)} className="field-input text-xs w-full" />
                                    </div>
                                </div>

                                {/* SECCIÓN 2: ATRIBUTOS TÉCNICOS */}
                                <div className="border-t border-brand/20 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Marca</label>
                                        <input type="text" value={data.marca} onChange={e => setData('marca', e.target.value)} className="field-input text-xs w-full" placeholder="Ej: Samsung, Coca-Cola" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Modelo</label>
                                        <input type="text" value={data.modelo} onChange={e => setData('modelo', e.target.value)} className="field-input text-xs w-full" placeholder="Ej: S21, 2024" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Serie / Identificador Unique</label>
                                        <input type="text" value={data.serie} onChange={e => setData('serie', e.target.value)} className="field-input text-xs w-full" placeholder="Nro Serie o IMEI" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Calibre / Medida (ml, g, etc)</label>
                                        <input type="text" value={data.calibre} onChange={e => setData('calibre', e.target.value)} className="field-input text-xs w-full" placeholder="Ej: 360ml, 1Lt" />
                                    </div>
                                </div>

                                {/* SECCIÓN 3: ESTRUCTURA DE COSTOS Y PRECIOS */}
                                <div className="border-t border-brand/20 pt-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-emerald-50/20 p-3 rounded border border-emerald-100">
                                    <div className="lg:col-span-1">
                                        <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1 font-black">Precio Costo (Bs)</label>
                                        <input type="number" step="0.01" value={data.precio_costo} onChange={e => setData('precio_costo', e.target.value)} className="field-input text-xs w-full text-right font-mono bg-white" placeholder="0.00" />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">P. General / Lista</label>
                                        <input type="number" step="0.01" value={data.precio_general} onChange={e => setData('precio_general', e.target.value)} className="field-input text-xs w-full text-right font-mono" required />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">P. Socio / Aliado</label>
                                        <input type="number" step="0.01" value={data.precio_asociado} onChange={e => setData('precio_asociado', e.target.value)} className="field-input text-xs w-full text-right font-mono text-emerald-700" required />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1 font-black">P. Crédito / Fiado</label>
                                        <input type="number" step="0.01" value={data.precio_credito} onChange={e => setData('precio_credito', e.target.value)} className="field-input text-xs w-full text-right font-mono text-blue-700" placeholder="0.00" />
                                    </div>
                                    <div className="lg:col-span-1 border-l border-brand/20 pl-4">
                                        <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1 font-black underline">Stock Ini.</label>
                                        <input type="number" value={data.stock_actual} onChange={e => setData('stock_actual', e.target.value)} className="field-input text-xs w-full text-right font-mono border-emerald-400" required />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">Min. Alerta</label>
                                        <input type="number" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)} className="field-input text-xs w-full text-right font-mono" required />
                                    </div>
                                </div>

                                {/* SECCIÓN 4: DESCRIPCIONES LARGAS Y NOTAS */}
                                <div className="border-t border-brand/20 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Descripción Técnica / Larga</label>
                                        <textarea value={data.descripcion_larga} onChange={e => setData('descripcion_larga', e.target.value)} className="field-input text-xs w-full h-20" placeholder="Características detalladas del producto..."></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Observaciones Internas / Notas</label>
                                        <textarea value={data.observacion} onChange={e => setData('observacion', e.target.value)} className="field-input text-xs w-full h-20 border-amber-200" placeholder="Notas solo para administradores..."></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end items-center gap-3 pt-4 border-t border-brand/20">
                                    <button type="button" onClick={() => setIsCreateOpen(false)} className="px-6 py-2.5 text-[11px] font-bold text-brand-muted hover:text-red-600 uppercase tracking-widest transition-colors">
                                        Abortar Operación
                                    </button>
                                    <button type="submit" disabled={processing} className="px-8 py-2.5 bg-primary hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded shadow-md active:translate-y-px disabled:opacity-50 transition-all flex items-center gap-2">
                                        <Save className="w-3.5 h-3.5" /> Consolidar Producto en Inventario
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* DATAGRID INVENTARIO (FIORI VIP) */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-5 py-3.5 border-b border-brand flex items-center justify-between bg-card-fap/[0.02]">
                            <h3 className="text-[11px] font-black uppercase tracking-wider text-brand-main flex items-center gap-2">
                                <PackageSearch className="w-3.5 h-3.5 text-primary" /> Inventario Registrado
                            </h3>
                            <span className="text-[11px] text-brand-muted font-semibold whitespace-nowrap">
                                {productos.total || 0} ítems
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 pl-6 py-3 text-[10px] font-extrabold text-brand-main uppercase tracking-wider">SKU / Ref</th>
                                        <th className="px-4 py-3 text-[10px] font-extrabold text-brand-main uppercase tracking-wider w-1/3">Descripción del Material</th>
                                        <th className="px-4 py-3 text-[10px] font-extrabold text-brand-main uppercase tracking-wider border-l border-brand text-center w-24">Fam./Cat.</th>
                                        <th className="px-4 py-3 text-[10px] font-extrabold text-brand-main uppercase tracking-wider border-l border-brand text-right w-24">Stock Físico</th>
                                        <th className="px-4 py-3 text-[10px] font-extrabold text-brand-main uppercase tracking-wider border-l border-brand text-right w-32">P. Venta / P. Socio</th>
                                        <th className="px-4 py-3 text-[10px] font-extrabold text-brand-main uppercase tracking-wider text-right w-24 border-l border-brand">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.data.map((prod, idx) => {
                                        const isLowStock = prod.stock_actual <= prod.stock_minimo;
                                        return (
                                            <motion.tr 
                                                key={prod.id} 
                                                initial={{ opacity: 0, x: -4 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.02 }}
                                                className="border-b border-brand hover:bg-card-fap/[0.03] transition-colors group bg-card-fap"
                                            >
                                                <td className="px-4 pl-6 py-3 whitespace-nowrap text-[11px] font-bold font-mono text-brand-muted">
                                                    {prod.codigo_sku}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="text-[11px] font-bold text-brand-main truncate max-w-[250px]" title={prod.nombre}>{prod.nombre}</div>
                                                    <div className="text-[9px] text-brand-muted mt-0.5 flex flex-wrap gap-1.5 items-center font-medium">
                                                        {prod.marca && <span>Mk: {prod.marca}</span>}
                                                        {prod.modelo && <span>Mod: {prod.modelo}</span>}
                                                        {prod.calibre && <span className="bg-brand/5 border border-brand/50 px-1 rounded uppercase">{prod.calibre}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center border-l border-brand">
                                                    <span className="text-[9px] font-bold bg-brand/5 text-brand-muted px-2 py-0.5 rounded-full ring-1 ring-brand/20 uppercase tracking-widest">{prod.categoria?.nombre || 'GNR'}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right border-l border-brand">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <span className={`text-xs font-black tabular-nums ${isLowStock ? 'text-red-500' : 'text-emerald-600'}`}>
                                                            {prod.stock_actual}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-brand-muted">un.</span>
                                                        {isLowStock && <span className="ml-1 inline-block w-2 h-2 rounded-full bg-red-500 shadow-sm animate-pulse" title={`Bajo el mínimo de ${prod.stock_minimo}`}></span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right border-l border-brand flex flex-col items-end justify-center">
                                                    <span className="text-[10px] font-bold text-brand-muted tabular-nums">Bs. {Number(prod.precio_general).toFixed(2)}</span>
                                                    <span className="text-[10px] font-black text-primary tabular-nums mt-0.5">Bs. {Number(prod.precio_asociado).toFixed(2)}</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right border-l border-brand">
                                                    <Link href={route('admin.inventario.kardex', prod.id)} className="text-[10px] font-black text-primary hover:text-white hover:bg-primary bg-card-fap px-3 py-1.5 rounded-lg border border-primary/20 transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95">
                                                        <FileText className="w-3.5 h-3.5"/> Kardex
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                    {productos.data.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center text-sm font-bold text-brand-muted uppercase tracking-wider">
                                                Base de Datos Vacía
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINACIÓN ESTRUCTURAL */}
                    {productos.links && productos.links.length > 3 && (
                        <div className="flex justify-between items-center bg-card-fap/[0.02] px-5 py-3 border border-brand shadow-sm rounded-2xl">
                            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider hidden md:block">
                                Mostrando pág. {productos.current_page} de {productos.last_page}
                            </p>
                            
                            <div className="flex space-x-1.5 ml-auto md:ml-0">
                                {productos.links.slice(1, -1).map((link, i) => (
                                    <Link 
                                        key={i} 
                                        href={link.url || '#'} 
                                        className={`px-3 py-1.5 rounded border text-[11px] font-black uppercase tracking-wider transition-colors ${link.active ? 'bg-primary text-white border-primary shadow-sm' : 'bg-card-fap text-brand-main border-brand hover:bg-primary/5 hover:text-primary'} ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL GESTIONAR CATEGORIAS (FIORI VIP) */}
            {isCategoriesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-main w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-brand overflow-hidden flex flex-col"
                    >
                        <div className="px-6 py-5 bg-card-fap flex items-center justify-between border-b border-brand relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-blue-500"></div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-primary/10 rounded-lg text-primary border border-primary/20">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-brand-main uppercase tracking-widest">Maestro de Familias (Categorías)</h3>
                                    <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mt-0.5">Organización estructural del catálogo</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCategoriesModalOpen(false)} className="text-brand-muted hover:text-red-500 hover:rotate-90 transition-all bg-card-fap border border-brand p-2 rounded-full shadow-sm"><XCircle className="w-5 h-5" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-8 bg-main">
                            {/* LISTADO DE CATEGORIAS */}
                            <div className="lg:col-span-3 space-y-4">
                                <h4 className="text-[11px] font-black text-primary uppercase border-b border-brand pb-3 tracking-widest flex items-center gap-2">
                                    <Search className="w-4 h-4" /> Registros Activos
                                </h4>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                    {categorias.map(cat => (
                                        <div key={cat.id} className="bg-card-fap border border-brand p-4 rounded-xl flex items-center justify-between group hover:shadow-md hover:border-primary/30 transition-all cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm" style={{backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}40`}}>
                                                    <Layers className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-black text-brand-main uppercase tracking-tight leading-none">{cat.nombre}</div>
                                                    <div className="text-[10px] text-brand-muted font-medium mt-1 truncate max-w-[200px]">{cat.descripcion || 'Sin descripción detallada.'}</div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[9px] bg-brand/10 px-2 py-0.5 rounded-full border border-brand font-extrabold uppercase tracking-widest">ORD: {cat.orden}</span>
                                                        {!cat.activa && <span className="text-[9px] bg-red-100/50 text-red-600 px-2 py-0.5 rounded-full border border-red-200 font-extrabold uppercase tracking-widest">Inactiva</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenCategoryEdit(cat)} className="p-2.5 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20 bg-card-fap shadow-sm" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => deleteCategory(cat.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 bg-card-fap shadow-sm" title="Borrar"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {categorias.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 bg-card-fap/[0.04] border border-dashed border-brand rounded-xl">
                                            <Layers className="w-8 h-8 text-brand-muted opacity-30 mb-2"/>
                                            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">Aún no hay categorías registradas.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FORMULARIO CATEGORIA */}
                            <div className="lg:col-span-2 bg-card-fap border border-brand rounded-2xl p-6 shadow-sm h-fit sticky top-0">
                                <h4 className="text-[11px] font-black text-brand-main uppercase border-b border-brand pb-3 tracking-widest mb-6 flex items-center gap-2">
                                    {editingCategory ? <div className="p-1 bg-amber-500/10 text-amber-600 rounded"><Edit2 className="w-3.5 h-3.5" /></div> : <div className="p-1 bg-primary/10 text-primary rounded"><Plus className="w-3.5 h-3.5" /></div>}
                                    {editingCategory ? 'Modificar Registro' : 'Nueva Clasificación'}
                                </h4>
                                <form onSubmit={submitCategory} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1.5 ml-1">Nombre Familia <span className="text-red-500">*</span></label>
                                        <input type="text" value={categoryForm.data.nombre} onChange={e => categoryForm.setData('nombre', e.target.value)} className="field-input text-xs w-full font-bold" required placeholder="Ej: Herramientas, Abarrotes" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Descripción Breve</label>
                                        <textarea value={categoryForm.data.descripcion} onChange={e => categoryForm.setData('descripcion', e.target.value)} className="field-input text-xs w-full h-20" placeholder="Utilidad de esta familia de productos..."></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Color (Opcional)</label>
                                            <div className="flex bg-white rounded-lg border border-brand overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary h-10 w-full">
                                                <input type="color" value={categoryForm.data.color} onChange={e => categoryForm.setData('color', e.target.value)} className="w-12 h-full border-r p-0 cursor-pointer" />
                                                <div className="flex-1 px-3 text-xs font-mono font-bold flex items-center">{categoryForm.data.color.toUpperCase()}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-extrabold text-brand-muted uppercase tracking-widest mb-1.5 ml-1">Orden en Lista</label>
                                            <input type="number" value={categoryForm.data.orden} onChange={e => categoryForm.setData('orden', e.target.value)} className="field-input text-xs w-full h-10 text-center font-black" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-brand/5 border border-brand rounded-lg mt-2">
                                        <input type="checkbox" id="cat-activa" checked={categoryForm.data.activa} onChange={e => categoryForm.setData('activa', e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5 cursor-pointer shadow-sm" />
                                        <label htmlFor="cat-activa" className="text-[11px] font-extrabold text-brand-main uppercase tracking-widest cursor-pointer select-none">Familia Pública/Activa</label>
                                    </div>
                                    
                                    <div className="flex flex-col gap-3 pt-4 border-t border-brand/50">
                                        <button type="submit" disabled={categoryForm.processing} className="w-full bg-primary hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] py-3.5 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                                            {editingCategory ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                            {editingCategory ? 'Guardar Cambios' : 'Registrar Familia'}
                                        </button>
                                        {editingCategory && (
                                            <button type="button" onClick={() => { setEditingCategory(null); categoryForm.reset(); }} className="w-full text-[10px] font-bold text-brand-muted hover:text-red-500 hover:bg-red-50 uppercase tracking-widest py-2.5 rounded-lg transition-colors border border-transparent">
                                                Cancelar Edición
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-card-fap border-t border-brand flex justify-end">
                            <button onClick={() => setIsCategoriesModalOpen(false)} className="px-6 py-2.5 rounded-lg text-[10px] font-black text-brand-main hover:text-white hover:bg-black uppercase tracking-[0.2em] transition-all border border-brand bg-white shadow-sm active:scale-95">
                                Cerrar Panel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
