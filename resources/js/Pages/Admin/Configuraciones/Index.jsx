import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Settings, Save, AlertCircle, Database, Palette, ExternalLink, Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Index({ auth, configuraciones }) {
    const { data, setData, post, processing } = useForm({
        settings: configuraciones.map(c => ({ id: c.id, key: c.key, value: c.value, description: c.description }))
    });

    const handleChange = (index, newValue) => {
        const newSettings = [...data.settings];
        newSettings[index].value = newValue;
        setData('settings', newSettings);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.configuraciones.store'), {
            preserveScroll: true
        });
    };

    const isAdmin = auth.user.roles?.includes('SuperAdmin');
    
    // Función de actualización optimizada para el Hero (Mosaico)
    const updateHeroSlide = (slideIdx, field, value) => {
        const ns = [...data.settings];
        const cIdx = ns.findIndex(s => s.key === 'ecommerce_hero_slides');
        if (cIdx === -1) return;

        let slides = [];
        try { slides = JSON.parse(ns[cIdx].value || '[]'); } catch(e) { slides = []; }
        
        if (slides[slideIdx]) {
            slides[slideIdx][field] = value;
            ns[cIdx].value = JSON.stringify(slides);
            setData('settings', ns);
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#f8faf6] flex items-center justify-center p-6">
                <div className="bg-white border border-red-200 p-8 rounded-lg shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Acceso Denegado</h2>
                    <p className="text-sm text-gray-500 mt-2">No tienes los privilegios de SuperAdmin necesarios para ver esta pantalla.</p>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Módulo de Administración</h2>}
        >
            <Head title="Ajustes Globales" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row items-center justify-between p-4 bg-[#fafaf6]">
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-fapclas-600" />
                            <div>
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                    Ajustes Globales del Sistema
                                </h3>
                                <p className="text-[11px] text-fapclas-500 font-medium">
                                    Configuración de parámetros (Key-Value) de la plataforma FAPCLAS R.L.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={submit}
                                disabled={processing || data.settings.length === 0}
                                className="px-4 py-2 bg-fapclas-800 hover:bg-fapclas-900 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors shadow-sm active:translate-y-px disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" /> {processing ? 'Guardando...' : 'Guardar Todos los Cambios'}
                            </button>
                        </div>
                    </div>

                    {/* GRILLA DE CONFIGURACIONES */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#fafaf6] border-b border-fapclas-200">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-1/3">Parámetro / Descripción</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-1/4">Key (Técnico)</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider border-l border-fapclas-100 bg-[#fdfdfc]">Valor Asignado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-fapclas-100">
                                {data.settings.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-fapclas-400 bg-fapclas-50/30">
                                            <p className="text-sm font-bold uppercase tracking-wider">Sin Parámetros</p>
                                        </td>
                                    </tr>
                                ) : (
                                    data.settings.map((setting, index) => (
                                        <tr key={setting.id} className="hover:bg-fapclas-50/40 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-xs font-bold text-fapclas-900">{setting.description || setting.key}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-[10px] bg-fapclas-100 text-fapclas-700 px-2 py-1 rounded border border-fapclas-200 inline-block truncate max-w-[150px]" title={setting.key}>
                                                    {setting.key}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 border-l border-fapclas-100 bg-[#fdfdfc] shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                {['1', '0', 'true', 'false', 'si', 'no', 'yes', 'no'].includes(String(setting.value).toLowerCase()) ? (
                                                    <select
                                                        value={String(setting.value).toLowerCase() === '1' || String(setting.value).toLowerCase() === 'true' || String(setting.value).toLowerCase() === 'si' || String(setting.value).toLowerCase() === 'yes' ? '1' : '0'}
                                                        onChange={(e) => handleChange(index, e.target.value)}
                                                        className="w-full text-xs font-bold text-fapclas-900 bg-white border border-fapclas-300 rounded focus:ring-fapclas-500 focus:border-fapclas-500 transition-shadow px-3 py-1.5"
                                                    >
                                                        <option value="1">Sí</option>
                                                        <option value="0">No</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={setting.value}
                                                        onChange={(e) => handleChange(index, e.target.value)}
                                                        className="w-full text-xs font-bold text-fapclas-900 bg-white border border-fapclas-300 rounded focus:ring-fapclas-500 focus:border-fapclas-500 transition-shadow px-3 py-1.5"
                                                        placeholder="Valor..."
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SECCIÓN AVANZADA: CARRUSEL HERO IMPACTO (NUEVO) */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden mt-8">
                        <div className="p-4 bg-[#fafaf6] border-b border-fapclas-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Palette className="w-5 h-5 text-fapclas-600" />
                                <div>
                                    <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                        Administración del Carrusel Hero (Para Beneficios)
                                    </h3>
                                    <p className="text-[10px] text-fapclas-500 font-medium font-mono">Gestión de impacto visual / Diapositivas 4K</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const newSettings = [...data.settings];
                                    const carouselIndex = newSettings.findIndex(s => s.key === 'ecommerce_hero_slides');
                                    if (carouselIndex !== -1) {
                                        const slides = JSON.parse(newSettings[carouselIndex].value || '[]');
                                        slides.push({ image: '', title: '', subtitle: '', description: '', button_text: 'Ver más', button_link: '#' });
                                        newSettings[carouselIndex].value = JSON.stringify(slides);
                                        setData('settings', newSettings);
                                    }
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded flex items-center gap-1.5 uppercase tracking-wider transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" /> Añadir Diapositiva
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {(() => {
                                const carouselSetting = data.settings.find(s => s.key === 'ecommerce_hero_slides');
                                if (!carouselSetting) return <p className="text-xs text-red-500 font-bold p-4 bg-red-50 rounded">Error: Llave 'ecommerce_hero_slides' no encontrada en la base de datos.</p>;
                                
                                let slides = [];
                                try { slides = JSON.parse(carouselSetting.value || '[]'); } catch(e) { slides = []; }

                                if (slides.length === 0) {
                                    return (
                                        <div className="py-12 border-2 border-dashed border-fapclas-100 rounded-xl text-center">
                                            <Palette className="w-10 h-10 text-fapclas-200 mx-auto mb-3" />
                                            <p className="text-[11px] font-bold text-fapclas-400 uppercase tracking-widest">Sin diapositivas activas configuradas</p>
                                            <p className="text-[10px] text-fapclas-300 mt-1">Haga clic en el botón superior para añadir la primera.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {slides.map((slide, sIdx) => (
                                            <div key={sIdx} className="bg-fapclas-50/50 border border-fapclas-200 rounded-xl p-4 flex flex-col relative group">
                                                <div className="absolute top-2 right-2 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const newSettings = [...data.settings];
                                                            const cIdx = newSettings.findIndex(s => s.key === 'ecommerce_hero_slides');
                                                            const newSlides = JSON.parse(newSettings[cIdx].value);
                                                            newSlides.splice(sIdx, 1);
                                                            newSettings[cIdx].value = JSON.stringify(newSlides);
                                                            setData('settings', newSettings);
                                                        }}
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg border border-red-200 transition-all shadow-sm"
                                                        title="Eliminar Slide"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="block text-[9px] font-black text-fapclas-500 uppercase">URL Imagen (4K Recomendada)</label>
                                                        <input 
                                                            type="text" 
                                                            value={slide.image} 
                                                            onChange={(e) => updateHeroSlide(sIdx, 'image', e.target.value)}
                                                            placeholder="https://images.unsplash.com/..." 
                                                            className="w-full text-[10px] p-2 bg-white border border-fapclas-200 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 space-y-1">
                                                            <label className="block text-[9px] font-black text-fapclas-500 uppercase">Título (Impacto)</label>
                                                            <input 
                                                                type="text" 
                                                                value={slide.title} 
                                                                onChange={(e) => updateHeroSlide(sIdx, 'title', e.target.value)}
                                                                className="w-full text-[10px] p-2 bg-white border border-fapclas-200 rounded font-bold"
                                                            />
                                                        </div>
                                                        <div className="w-1/3 space-y-1">
                                                            <label className="block text-[9px] font-black text-fapclas-500 uppercase">Subtítulo</label>
                                                            <input 
                                                                type="text" 
                                                                value={slide.subtitle} 
                                                                onChange={(e) => {
                                                                    const ns = [...data.settings];
                                                                    const cI = ns.findIndex(s => s.key === 'ecommerce_hero_slides');
                                                                    const nSl = JSON.parse(ns[cI].value);
                                                                    nSl[sIdx].subtitle = e.target.value;
                                                                    ns[cI].value = JSON.stringify(nSl);
                                                                    setData('settings', ns);
                                                                }}
                                                                className="w-full text-[10px] p-2 bg-white border border-fapclas-200 rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-[9px] font-black text-fapclas-500 uppercase">Descripción / Frase Gancho</label>
                                                        <textarea 
                                                            rows={2}
                                                            value={slide.description} 
                                                            onChange={(e) => updateHeroSlide(sIdx, 'description', e.target.value)}
                                                            className="w-full text-[10px] p-2 bg-white border border-fapclas-200 rounded placeholder:opacity-40"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 space-y-1">
                                                            <label className="block text-[9px] font-black text-fapclas-500 uppercase">Texto Botón</label>
                                                            <input 
                                                                type="text" 
                                                                value={slide.button_text} 
                                                                onChange={(e) => {
                                                                    const ns = [...data.settings];
                                                                    const cI = ns.findIndex(s => s.key === 'ecommerce_hero_slides');
                                                                    const nSl = JSON.parse(ns[cI].value);
                                                                    nSl[sIdx].button_text = e.target.value;
                                                                    ns[cI].value = JSON.stringify(nSl);
                                                                    setData('settings', ns);
                                                                }}
                                                                className="w-full text-[10px] p-2 bg-white border border-fapclas-200 rounded font-bold text-center"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <label className="block text-[9px] font-black text-fapclas-500 uppercase">Enlace (Link)</label>
                                                            <input 
                                                                type="text" 
                                                                value={slide.button_link} 
                                                                onChange={(e) => {
                                                                    const ns = [...data.settings];
                                                                    const cI = ns.findIndex(s => s.key === 'ecommerce_hero_slides');
                                                                    const nSl = JSON.parse(ns[cI].value);
                                                                    nSl[sIdx].button_link = e.target.value;
                                                                    ns[cI].value = JSON.stringify(nSl);
                                                                    setData('settings', ns);
                                                                }}
                                                                className="w-full text-[10px] p-2 bg-white border border-fapclas-200 rounded font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* SECCIÓN DE MANTENIMIENTO Y PERSONALIZACIÓN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                        
                        {/* BACKUP MANUAL */}
                        <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-[#fafaf6] border-b border-fapclas-200 flex items-center gap-3">
                                <Database className="w-5 h-5 text-fapclas-600" />
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">Seguridad y Backups</h3>
                            </div>
                            <div className="p-5 flex-grow space-y-4">
                                <p className="text-xs text-fapclas-500 leading-relaxed font-medium">
                                    El sistema realiza respaldos automáticos diarios. Use este botón para forzar un respaldo inmediato de la base de datos y archivos antes de realizar cambios críticos.
                                </p>
                                <button
                                    onClick={() => router.post(route('admin.backups.run'))}
                                    className="w-full py-2.5 bg-[#202B18] hover:bg-black text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all shadow-sm active:translate-y-px"
                                >
                                    <Database className="w-4 h-4" /> Ejecutar Respaldo Manual Ahora
                                </button>
                            </div>
                        </div>

                        {/* TEMATIZACIÓN GLOBAL */}
                        <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-[#fafaf6] border-b border-fapclas-200 flex items-center gap-3">
                                <Palette className="w-5 h-5 text-fapclas-600" />
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">Apariencia del Sistema</h3>
                            </div>
                            <div className="p-5 flex-grow space-y-4">
                                <p className="text-xs text-fapclas-500 leading-relaxed font-medium">
                                    Seleccione la paleta de colores institucional para su cuenta. Este cambio es persistente y mejora la experiencia visual.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'premium-olive', label: 'Olivo Premium', color: 'bg-[#28361d]' },
                                        { id: 'corporate-blue', label: 'Azul Corp', color: 'bg-[#1e40af]' },
                                        { id: 'dark-night', label: 'Modo Oscuro', color: 'bg-[#0f172a]' },
                                        { id: 'classic-light', label: 'Luz Clásica', color: 'bg-white border border-gray-200' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => router.post(route('user.theme.update'), { theme: t.id })}
                                            className={`flex items-center gap-2 p-2 rounded border transition-all text-[10px] font-bold uppercase tracking-tight ${
                                                auth.user.theme === t.id ? 'border-fapclas-500 bg-fapclas-50 shadow-sm' : 'border-gray-100 hover:border-fapclas-200'
                                            }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${t.color}`} /> {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ACCESO RÁPIDO A FILAMENT */}
                    <div className="bg-gradient-to-r from-[#1f2a17] to-[#28361d] p-5 rounded-lg shadow-md border border-fapclas-900 flex items-center justify-between mt-5">
                        <div className="flex items-center gap-4 text-white">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <ExternalLink className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wider">Acceso al Portal CMS</h4>
                                <p className="text-[10px] text-fapclas-100 font-medium opacity-80 uppercase tracking-widest mt-0.5">Gestión de contenido dinámico de la página principal (Filament)</p>
                            </div>
                        </div>
                        <a 
                            href="/admin" 
                            target="_blank"
                            className="px-6 py-2 bg-white hover:bg-fapclas-50 text-fapclas-900 text-xs font-black rounded uppercase tracking-widest shadow-lg transition-all active:scale-95"
                        >
                            Ir al Panel CMS
                        </a>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
