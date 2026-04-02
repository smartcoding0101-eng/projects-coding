import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    PackageSearch, Plus, Search, FileText, History, Info, XCircle, 
    Layers, Tag, Calendar, DollarSign, Settings, Trash2, Edit2, 
    Save, ChevronRight, Hash, Bookmark, Briefcase
} from 'lucide-react';

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
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Módulo de Patrística e Inventario</h2>}>
            <Head title="Inventario Global" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 bg-card-fap gap-4">
                        <div className="flex items-center gap-3">
                            <PackageSearch className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                    Catálogo Central de Materiales y Productos
                                </h3>
                                <p className="text-[11px] text-brand-muted font-medium">
                                    Administración de stock, creación de nuevos ítems y acceso al Kardex general.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsCategoriesModalOpen(true)} className="px-4 py-2 bg-card-fap border border-brand text-primary hover:bg-brand/10 text-xs font-bold flex items-center gap-1.5 rounded transition-colors shadow-sm">
                                <Layers className="w-4 h-4" /> Gestionar Categorías
                            </button>
                            <Link href={route('admin.ecommerce.kardex-global')} className="px-4 py-2 bg-card-fap border border-brand text-primary hover:bg-brand/10 text-xs font-bold flex items-center gap-1.5 rounded transition-colors shadow-sm">
                                <History className="w-4 h-4" /> Kardex Globalizado
                            </Link>
                            <button onClick={() => {
                                setData('codigo_sku', nextSku);
                                setIsCreateOpen(true);
                            }} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-1.5 rounded shadow-sm active:translate-y-px transition-colors">
                                <Plus className="w-4 h-4" /> Alta de Material
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

                    {/* DATAGRID INVENTARIO */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">SKU / Ref</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-1/3">Descripción del Material</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand bg-card-fap text-center w-24">Fam./Cat.</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand bg-card-fap text-right w-24">Stock Físico</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand bg-card-fap text-right w-32">P. Venta / P. Socio</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right w-24 border-l border-brand">Auditoría</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand">
                                    {productos.data.map(prod => {
                                        const isLowStock = prod.stock_actual <= prod.stock_minimo;
                                        return (
                                            <tr key={prod.id} className="hover:bg-brand/10 transition-colors">
                                                <td className="px-4 py-2 whitespace-nowrap text-[11px] font-bold font-mono text-brand-muted">
                                                    {prod.codigo_sku}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="text-[11px] font-bold text-brand-main truncate max-w-[250px]" title={prod.nombre}>{prod.nombre}</div>
                                                    <div className="text-[9px] text-brand-muted flex items-center gap-2">
                                                        {prod.marca && <span>Marca: {prod.marca}</span>}
                                                        {prod.modelo && <span>Mod: {prod.modelo}</span>}
                                                        {prod.calibre && <span className="bg-card-fap px-1.5 rounded">{prod.calibre}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center border-l border-brand bg-card-fap">
                                                    <span className="text-[9px] font-bold bg-brand/10 text-gray-600 px-1.5 py-0.5 rounded border border-brand uppercase tracking-widest">{prod.categoria?.nombre || 'GNR'}</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand bg-card-fap">
                                                    <span className={`text-[11px] font-bold font-mono ${isLowStock ? 'text-red-600' : 'text-emerald-700'}`}>
                                                        {prod.stock_actual} un.
                                                    </span>
                                                    {isLowStock && <span className="ml-1 inline-block w-2 h-2 rounded-full bg-red-500 shadow-sm" title={`Bajo el mínimo de ${prod.stock_minimo}`}></span>}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand bg-card-fap flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-gray-600 font-mono">Bs. {prod.precio_general}</span>
                                                    <span className="text-[10px] font-bold text-primary font-mono">Bs. {prod.precio_asociado}</span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-right border-l border-brand shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    <Link href={route('admin.inventario.kardex', prod.id)} className="text-[10px] font-bold text-primary hover:text-brand-main bg-brand/10 px-2 py-1 rounded border border-brand inline-flex items-center gap-1 transition-colors">
                                                        <FileText className="w-3 h-3"/> Kardex
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {productos.data.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-sm font-bold text-brand-muted uppercase tracking-wider">
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
                        <div className="flex justify-between items-center bg-card-fap px-4 py-1.5 border border-brand shadow-sm rounded-lg">
                            <Link 
                                href={productos.first_page_url} 
                                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded border transition-colors ${productos.current_page === 1 ? 'text-brand-muted bg-brand/5 border-brand pointer-events-none' : 'text-primary bg-card-fap border-brand hover:bg-brand/10'}`}
                                preserveScroll
                            >
                                Primera Pág
                            </Link>
                            
                            <div className="flex space-x-1">
                                {productos.links.slice(1, -1).map((link, i) => (
                                    <Link 
                                        key={i} 
                                        href={link.url || '#'} 
                                        className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors ${link.active ? 'bg-primary text-white border-brand shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]' : 'bg-card-fap text-gray-600 border-brand hover:bg-brand/5 hover:border-brand'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                    />
                                ))}
                            </div>

                            <Link 
                                href={productos.last_page_url} 
                                className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded border transition-colors ${productos.current_page === productos.last_page ? 'text-brand-muted bg-brand/5 border-brand pointer-events-none' : 'text-primary bg-card-fap border-brand hover:bg-brand/10'}`}
                                preserveScroll
                            >
                                Última Pág
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL GESTIONAR CATEGORIAS */}
            {isCategoriesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-main w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border border-brand overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 bg-primary text-white flex items-center justify-between border-b border-brand">
                            <div className="flex items-center gap-3">
                                <Layers className="w-5 h-5" />
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">Maestro de Categorías (Familias)</h3>
                                    <p className="text-[10px] opacity-80 font-medium">Clasificación estructural para el catálogo de productos.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsCategoriesModalOpen(false)} className="hover:rotate-90 transition-transform"><XCircle className="w-6 h-6" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* LISTADO DE CATEGORIAS */}
                            <div className="lg:col-span-3 space-y-4">
                                <h4 className="text-[11px] font-black text-primary uppercase border-b border-brand pb-2 tracking-widest flex items-center gap-2">
                                    <Search className="w-3.5 h-3.5" /> Registros Existentes
                                </h4>
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                    {categorias.map(cat => (
                                        <div key={cat.id} className="bg-card-fap border border-brand p-3 rounded-lg flex items-center justify-between group hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-brand shadow-sm" style={{backgroundColor: `${cat.color}20`, color: cat.color}}>
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[12px] font-black text-brand-main uppercase tracking-tight">{cat.nombre}</div>
                                                    <div className="text-[10px] text-brand-muted truncate max-w-[200px]">{cat.descripcion || 'Sin descripción'}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[8px] bg-brand/10 px-1 py-0.5 rounded border border-brand font-bold uppercase tracking-widest">ORD: {cat.orden}</span>
                                                        {!cat.activa && <span className="text-[8px] bg-red-100 text-red-700 px-1 py-0.5 rounded border border-red-200 font-bold uppercase tracking-widest">Inactiva</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenCategoryEdit(cat)} className="p-2 text-primary hover:bg-brand/10 rounded-full transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Borrar"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {categorias.length === 0 && <p className="text-center py-10 text-[11px] font-bold text-brand-muted uppercase">No hay categorías definidas.</p>}
                                </div>
                            </div>

                            {/* FORMULARIO CATEGORIA */}
                            <div className="lg:col-span-2 bg-card-fap border border-brand rounded-xl p-5 shadow-sm h-fit sticky top-0">
                                <h4 className="text-[11px] font-black text-primary uppercase border-b border-brand pb-2 tracking-widest mb-4 flex items-center gap-2">
                                    {editingCategory ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h4>
                                <form onSubmit={submitCategory} className="space-y-4">
                                    <div>
                                        <label className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1">Nombre Familia <span className="text-red-500">*</span></label>
                                        <input type="text" value={categoryForm.data.nombre} onChange={e => categoryForm.setData('nombre', e.target.value)} className="field-input text-xs w-full" required placeholder="Ej: Bebidas, Ferretería" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1">Breve Descripción</label>
                                        <textarea value={categoryForm.data.descripcion} onChange={e => categoryForm.setData('descripcion', e.target.value)} className="field-input text-xs w-full h-16" placeholder="¿Para qué es esta categoría?"></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1">Color Etiqueta</label>
                                            <input type="color" value={categoryForm.data.color} onChange={e => categoryForm.setData('color', e.target.value)} className="w-full h-9 p-1 rounded border border-brand cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1">Orden Lista</label>
                                            <input type="number" value={categoryForm.data.orden} onChange={e => categoryForm.setData('orden', e.target.value)} className="field-input text-xs w-full" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <input type="checkbox" id="cat-activa" checked={categoryForm.data.activa} onChange={e => categoryForm.setData('activa', e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                                        <label htmlFor="cat-activa" className="text-[10px] font-bold text-gray-700 uppercase tracking-widest cursor-pointer">Categoría Activa</label>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-4">
                                        <button type="submit" disabled={categoryForm.processing} className="w-full bg-primary hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2">
                                            {editingCategory ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                            {editingCategory ? 'Actualizar Registro' : 'Crear Categoría'}
                                        </button>
                                        {editingCategory && (
                                            <button type="button" onClick={() => { setEditingCategory(null); categoryForm.reset(); }} className="w-full text-[10px] font-bold text-brand-muted hover:text-red-500 uppercase tracking-widest py-2 transition-colors">
                                                Cancelar Edición
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="px-6 py-3 bg-brand/5 border-t border-brand flex justify-end">
                            <button onClick={() => setIsCategoriesModalOpen(false)} className="px-5 py-2 text-[10px] font-black text-primary hover:text-brand-main uppercase tracking-[0.2em] transition-colors border border-brand rounded-lg bg-white">Cerrar Maestro</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
