import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Settings, Save, AlertCircle, Database, Palette, ExternalLink, Trash2, Plus, MoveUp, MoveDown, Download, CalendarClock, X, CheckCircle, ImagePlus, UploadCloud } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Index({ auth, configuraciones }) {
    const { data, setData, post, processing } = useForm({
        settings: configuraciones.map(c => ({ id: c.id, key: c.key, value: c.value, description: c.description }))
    });

    const handleChange = (index, newValue) => {
        const newSettings = [...data.settings];
        newSettings[index].value = newValue;
        setData('settings', newSettings);
    };

    const [showToast, setShowToast] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.configuraciones.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            }
        });
    };

    const isAdmin = auth.user.roles?.includes('SuperAdmin');
    
    // Estados para el Modal de Backup
    const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
    const [manualBackupTitle, setManualBackupTitle] = useState('backup_' + new Date().toISOString().split('T')[0].replace(/-/g, '_'));
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const downloadManualBackup = () => {
        setIsDownloading(true);
        window.axios({
            url: route('admin.backups.download') + '?filename=' + encodeURIComponent(manualBackupTitle),
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', (manualBackupTitle || 'backup') + '.sql');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setIsDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 8000); // Reset card after 8s
        }).catch(error => {
            setIsDownloading(false);
            alert('Error generando SQL: Revisar permisos o variable PAT de mysqldump');
        });
    };
    
    // Función de actualización optimizada
    const moveSlide = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === heroSlides.length - 1)) return;
        const newSlides = [...heroSlides];
        const temp = newSlides[index];
        newSlides[index] = newSlides[index + direction];
        newSlides[index + direction] = temp;
        setHeroSlides(newSlides);
        updateHeroValue(newSlides);
    };

    // Subida asincrona de imágenes locales usando Axios
    const handleSlideImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Límite local 4MB
        if (file.size > 4 * 1024 * 1024) {
            alert('El archivo excede el límite permitido de 4MB.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            // Se sube silenciosamente
            const response = await window.axios.post(route('admin.configuraciones.media.upload'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Una vez subido se enlaza al modelo del carrusel actualizando su estado React
            updateHeroSlide(index, 'image', response.data.url);
        } catch (error) {
            alert('Error al procesar la imagen (¿Pesa más de 4MB o formato inválido?).');
        }
    };
    
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
            <div className="min-h-screen bg-main flex items-center justify-center p-6">
                <div className="bg-card-fap text-brand-main border border-red-500/50 p-8 rounded-lg shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-brand-main uppercase tracking-wide">Acceso Denegado</h2>
                    <p className="text-sm text-brand-muted mt-2">No tienes los privilegios de SuperAdmin necesarios para ver esta pantalla.</p>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Módulo de Administración</h2>}
        >
            <Head title="Ajustes Globales" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR */}
                    <div className="bg-card-fap text-brand-main border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row items-center justify-between p-4 bg-card-fap">
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                    Ajustes Globales del Sistema
                                </h3>
                                <p className="text-[11px] text-brand-muted font-medium">
                                    Configuración de parámetros (Key-Value) de la plataforma FAPCLAS R.L.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={submit}
                                disabled={processing || data.settings.length === 0}
                                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded flex items-center gap-2 transition-colors shadow-sm active:translate-y-px disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" /> {processing ? 'Guardando...' : 'Guardar Todos los Cambios'}
                            </button>
                        </div>
                    </div>

                    {/* SECCIÓN 1: ESTRUCTURA PDF DE EMISIÓN DE DOCUMENTO */}
                    <div className="bg-card-fap text-brand-main border border-brand shadow-sm rounded-lg overflow-hidden mb-8">
                        <div className="p-4 bg-card-fap border-b border-brand flex items-center justify-between">
                            <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide flex items-center gap-2">
                                Estructura PDF de Emisión de Documento
                            </h3>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-main border-b border-brand">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-1/3">Parámetro / Descripción</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-1/4">Key (Técnico)</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand">Valor Asignado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand">
                                {data.settings.map((setting, index) => {
                                    if (!['app_logo_pdf', 'app_terminos_recibo'].includes(setting.key)) return null;
                                    return (
                                        <tr key={setting.id} className="hover:bg-main transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-xs font-bold text-brand-main">{setting.description || setting.key}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-[10px] bg-main text-primary px-2 py-1 rounded border border-brand inline-block truncate max-w-[150px]" title={setting.key}>
                                                    {setting.key}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                {['ecommerce_qr_pago', 'app_logo_pdf'].includes(setting.key) ? (
                                                    <div className="flex items-center gap-2">
                                                        {setting.value && (
                                                            <div className="w-10 h-10 shrink-0 bg-main rounded border border-brand overflow-hidden flex items-center justify-center">
                                                                <img src={setting.value} alt="Preview" className="object-cover w-full h-full opacity-90" />
                                                            </div>
                                                        )}
                                                        <input
                                                            type="text"
                                                            value={setting.value || ''}
                                                            onChange={(e) => handleChange(index, e.target.value)}
                                                            className="flex-1 text-xs font-bold text-brand-main bg-card-fap border border-brand rounded focus:ring-brand focus:border-brand transition-shadow px-3 py-1.5 min-w-0"
                                                            placeholder="URL o subir local..."
                                                        />
                                                        <label className="cursor-pointer shrink-0 bg-primary hover:bg-primary-dark text-white py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors group shadow-sm">
                                                            <UploadCloud className="w-4 h-4 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Subir</span>
                                                            <input 
                                                                type="file" 
                                                                accept="image/jpeg,image/png,image/webp" 
                                                                className="hidden" 
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0];
                                                                    if (!file) return;
                                                                    if (file.size > 4 * 1024 * 1024) return alert('El archivo excede el límite permitido de 4MB.');
                                                                    const formData = new FormData();
                                                                    formData.append('image', file);
                                                                    try {
                                                                        const response = await window.axios.post(route('admin.configuraciones.media.upload'), formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                                        handleChange(index, response.data.url);
                                                                    } catch (error) { alert('Error al procesar la imagen.'); }
                                                                }} 
                                                            />
                                                        </label>
                                                    </div>
                                                ) : setting.key === 'app_terminos_recibo' || setting.description?.toLowerCase().includes('text') ? (
                                                    <textarea
                                                        value={setting.value || ''}
                                                        onChange={(e) => handleChange(index, e.target.value)}
                                                        className="w-full text-xs text-brand-main bg-card-fap border border-brand rounded focus:ring-brand focus:border-brand transition-shadow px-3 py-1.5 min-h-[80px]"
                                                        placeholder="Bloque de texto..."
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={setting.value || ''}
                                                        onChange={(e) => handleChange(index, e.target.value)}
                                                        className="w-full text-xs font-bold text-brand-main bg-card-fap border border-brand rounded focus:ring-brand focus:border-brand transition-shadow px-3 py-1.5"
                                                        placeholder="Valor..."
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* SECCIÓN 2: OTRAS CONFIGURACIONES GENERALES */}
                    <div className="bg-card-fap text-brand-main border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="p-4 bg-card-fap border-b border-brand flex items-center justify-between">
                            <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide flex items-center gap-2">
                                Parámetros Generales
                            </h3>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-main border-b border-brand">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-1/3">Parámetro / Descripción</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-1/4">Key (Técnico)</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand bg-card-fap">Valor Asignado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand">
                                {data.settings.filter(s => !['app_logo_pdf', 'app_terminos_recibo', 'ecommerce_hero_slides', 'backup_auto_enabled', 'backup_interval', 'backup_days', 'backup_time_start', 'backup_time_end', 'ecommerce_pago_exige_caja'].includes(s.key)).length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-brand-muted bg-main">
                                            <p className="text-sm font-bold uppercase tracking-wider">Sin Parámetros Generales</p>
                                        </td>
                                    </tr>
                                ) : (
                                    data.settings.map((setting, index) => {
                                        if (['app_logo_pdf', 'app_terminos_recibo', 'ecommerce_hero_slides', 'backup_auto_enabled', 'backup_interval', 'backup_days', 'backup_time_start', 'backup_time_end', 'ecommerce_pago_exige_caja'].includes(setting.key)) return null;
                                        return (
                                            <tr key={setting.id} className="hover:bg-main transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="text-xs font-bold text-brand-main">{setting.description || setting.key}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-mono text-[10px] bg-main text-primary px-2 py-1 rounded border border-brand inline-block truncate max-w-[150px]" title={setting.key}>
                                                        {setting.key}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    {['ecommerce_qr_pago', 'app_logo_pdf'].includes(setting.key) ? (
                                                        <div className="flex items-center gap-2">
                                                            {setting.value && (
                                                                <div className="w-10 h-10 shrink-0 bg-main rounded border border-brand overflow-hidden flex items-center justify-center">
                                                                    <img src={setting.value} alt="Preview" className="object-cover w-full h-full opacity-90" />
                                                                </div>
                                                            )}
                                                            <input
                                                                type="text"
                                                                value={setting.value || ''}
                                                                onChange={(e) => handleChange(index, e.target.value)}
                                                                className="flex-1 text-xs font-bold text-brand-main bg-card-fap border border-brand rounded focus:ring-brand focus:border-brand transition-shadow px-3 py-1.5 min-w-0"
                                                                placeholder="URL o subir local..."
                                                            />
                                                            <label className="cursor-pointer shrink-0 bg-primary hover:bg-primary-dark text-white py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors group shadow-sm">
                                                                <UploadCloud className="w-4 h-4 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Subir QR</span>
                                                                <input 
                                                                    type="file" 
                                                                    accept="image/jpeg,image/png,image/webp" 
                                                                    className="hidden" 
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0];
                                                                        if (!file) return;
                                                                        if (file.size > 4 * 1024 * 1024) return alert('El archivo excede el límite permitido de 4MB.');
                                                                        const formData = new FormData();
                                                                        formData.append('image', file);
                                                                        try {
                                                                            const response = await window.axios.post(route('admin.configuraciones.media.upload'), formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                                            handleChange(index, response.data.url);
                                                                        } catch (error) { alert('Error al procesar la imagen QR.'); }
                                                                    }} 
                                                                />
                                                            </label>
                                                        </div>
                                                    ) : ['1', '0', 'true', 'false', 'si', 'no', 'yes', 'no'].includes(String(setting.value).toLowerCase()) ? (
                                                        <select
                                                            value={String(setting.value).toLowerCase() === '1' || String(setting.value).toLowerCase() === 'true' || String(setting.value).toLowerCase() === 'si' || String(setting.value).toLowerCase() === 'yes' ? '1' : '0'}
                                                            onChange={(e) => handleChange(index, e.target.value)}
                                                            className="w-full text-xs font-bold text-brand-main bg-card-fap text-brand-main border border-brand rounded focus:ring-brand focus:border-brand transition-shadow px-3 py-1.5"
                                                        >
                                                            <option value="1">Sí</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={setting.value || ''}
                                                            onChange={(e) => handleChange(index, e.target.value)}
                                                            className="w-full text-xs font-bold text-brand-main bg-card-fap border border-brand rounded focus:ring-brand focus:border-brand transition-shadow px-3 py-1.5"
                                                            placeholder="Valor..."
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SECCIÓN 3: SEGURIDAD DE PAGOS ECOMMERCE (NUEVO) */}
                    <div className="bg-card-fap text-brand-main border border-brand shadow-sm rounded-lg overflow-hidden mt-8">
                        <div className="p-4 bg-card-fap border-b border-brand flex items-center justify-between">
                            <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-primary" /> Seguridad y Validación de Pagos Ecommerce
                            </h3>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-main border-b border-brand">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-1/3">Parámetro / Descripción</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-1/4">Key (Técnico)</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand bg-card-fap">Estado de la Opción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand">
                                {data.settings.map((setting, index) => {
                                    if (setting.key !== 'ecommerce_pago_exige_caja') return null;
                                    return (
                                        <tr key={setting.id} className="hover:bg-main transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-xs font-bold text-brand-main">{setting.description || setting.key}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-[10px] bg-main text-primary px-2 py-1 rounded border border-brand inline-block truncate max-w-[150px]" title={setting.key}>
                                                    {setting.key}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                <select
                                                    value={setting.value == '1' ? '1' : '0'}
                                                    onChange={(e) => handleChange(index, e.target.value)}
                                                    className={`w-full text-xs font-bold border border-brand rounded transition-shadow px-3 py-1.5 ${setting.value == '1' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
                                                >
                                                    <option value="1">HABILITAR (Exigir Caja Abierta)</option>
                                                    <option value="0">DESHABILITAR (Omitir validación de Caja)</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* SECCIÓN AVANZADA: CARRUSEL HERO IMPACTO (NUEVO) */}
                    <div className="bg-card-fap text-brand-main border border-brand shadow-sm rounded-lg overflow-hidden mt-8">
                        <div className="p-4 bg-card-fap border-b border-brand flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Palette className="w-5 h-5 text-primary" />
                                <div>
                                    <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                        Administración del Carrusel Hero (Para Beneficios)
                                    </h3>
                                    <p className="text-[10px] text-brand-muted font-medium font-mono">Gestión de impacto visual / Diapositivas 4K</p>
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
                                        <div className="py-12 border-2 border-dashed border-brand rounded-xl text-center">
                                            <Palette className="w-10 h-10 text-fapclas-200 mx-auto mb-3" />
                                            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">Sin diapositivas activas configuradas</p>
                                            <p className="text-[10px] text-brand-muted mt-1">Haga clic en el botón superior para añadir la primera.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {slides.map((slide, sIdx) => (
                                            <div key={sIdx} className="bg-main border border-brand rounded-xl p-4 flex flex-col relative group">
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
                                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg border border-red-500/50 transition-all shadow-sm"
                                                        title="Eliminar Slide"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex gap-4">
                                                        {/* Previsualizador Miniatura */}
                                                        {slide.image && (
                                                            <div className="w-16 h-16 shrink-0 bg-main rounded-md border border-brand overflow-hidden flex items-center justify-center">
                                                                <img src={slide.image} alt="Prev" className="object-cover w-full h-full opacity-90" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-bold text-brand-main mb-1 flex items-center justify-between">
                                                                URL / Archivo de Imagen (4K Recomendada)
                                                            </label>
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    type="text" 
                                                                    value={slide.image} 
                                                                    onChange={e => updateHeroSlide(sIdx, 'image', e.target.value)}
                                                                    className="flex-1 bg-main text-brand-main border border-brand py-1.5 px-3 rounded text-xs focus:ring-primary focus:border-primary placeholder-brand-muted" 
                                                                    placeholder="https://ejemplo.com/imagen.jpg o suba localmente"
                                                                />
                                                                <label className="cursor-pointer bg-card-fap border border-brand hover:bg-main text-brand-main py-1.5 px-3 rounded text-xs font-bold flex items-center gap-1.5 transition-colors group">
                                                                    <UploadCloud className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> Subir
                                                                    <input 
                                                                        type="file" 
                                                                        accept="image/jpeg,image/png,image/webp" 
                                                                        className="hidden" 
                                                                        onChange={(e) => handleSlideImageUpload(sIdx, e)} 
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 space-y-1">
                                                            <label className="block text-[9px] font-black text-brand-muted uppercase">Título (Impacto)</label>
                                                            <input 
                                                                type="text" 
                                                                value={slide.title} 
                                                                onChange={(e) => updateHeroSlide(sIdx, 'title', e.target.value)}
                                                                className="w-full text-[10px] p-2 bg-card-fap text-brand-main border border-brand rounded font-bold"
                                                            />
                                                        </div>
                                                        <div className="w-1/3 space-y-1">
                                                            <label className="block text-[9px] font-black text-brand-muted uppercase">Subtítulo</label>
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
                                                                className="w-full text-[10px] p-2 bg-card-fap text-brand-main border border-brand rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-[9px] font-black text-brand-muted uppercase">Descripción / Frase Gancho</label>
                                                        <textarea 
                                                            rows={2}
                                                            value={slide.description} 
                                                            onChange={(e) => updateHeroSlide(sIdx, 'description', e.target.value)}
                                                            className="w-full text-[10px] p-2 bg-card-fap text-brand-main border border-brand rounded placeholder:opacity-40"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1 space-y-1">
                                                            <label className="block text-[9px] font-black text-brand-muted uppercase">Texto Botón</label>
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
                                                                className="w-full text-[10px] p-2 bg-card-fap text-brand-main border border-brand rounded font-bold text-center"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <label className="block text-[9px] font-black text-brand-muted uppercase">Enlace (Link)</label>
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
                                                                className="w-full text-[10px] p-2 bg-card-fap text-brand-main border border-brand rounded font-mono"
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
                        
                        {/* MODULO DE BACKUPS */}
                        <div className="bg-card-fap text-brand-main border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-card-fap border-b border-brand flex items-center gap-3">
                                <Database className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">Seguridad y Backups</h3>
                            </div>
                            <div className="p-5 flex-grow space-y-4">
                                <p className="text-xs text-brand-muted leading-relaxed font-medium">
                                    Configure los respaldos automáticos o extraiga una copia puntual (manual) con un título personalizado.
                                </p>
                                <button
                                    onClick={() => setIsBackupModalOpen(true)}
                                    className="w-full py-2.5 bg-[#202B18] border border-brand hover:border-primary-dark text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                >
                                    <CalendarClock className="w-4 h-4" /> Configurar Backups
                                </button>
                            </div>
                        </div>

                        {/* MODAL CONFIGURACION BACKUPS */}
                        <Modal show={isBackupModalOpen} onClose={() => setIsBackupModalOpen(false)} maxWidth="2xl">
                            <div className="p-6 bg-card-fap text-brand-main shadow-xl" style={{ border: '1px solid var(--brand-border)' }}>
                                <div className="flex justify-between items-center border-b border-brand pb-3 mb-5">
                                    <h2 className="text-lg font-bold uppercase tracking-widest text-brand-main flex items-center gap-2">
                                        <Database className="w-5 h-5 text-primary" /> Planificación de Backups
                                    </h2>
                                    <button onClick={() => setIsBackupModalOpen(false)} className="text-brand-muted hover:text-red-500 transition-colors"><X className="w-5 h-5"/></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* SECCIÓN MANUAL */}
                                    <div className="bg-main border border-brand rounded-lg p-4 relative overflow-hidden">
                                        <h3 className="text-sm font-black text-brand-main mb-2 uppercase tracking-wide flex items-center gap-2"><Download className="w-4 h-4 text-primary"/> Backup Manual (.SQL)</h3>
                                        
                                        {!downloadSuccess ? (
                                            <>
                                                <p className="text-[10px] text-brand-muted mb-4 font-medium leading-relaxed">
                                                    Genera y descarga instantáneamente una copia de la base de datos eligiendo el nombre del archivo.
                                                </p>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-[10px] font-black uppercase text-brand-muted mb-1">Título del Archivo</label>
                                                        <input 
                                                            type="text" 
                                                            value={manualBackupTitle} 
                                                            onChange={e => setManualBackupTitle(e.target.value)} 
                                                            disabled={isDownloading}
                                                            className="w-full bg-card-fap text-brand-main border border-brand rounded text-xs px-3 py-2 focus:ring-primary focus:border-primary disabled:opacity-50" 
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={downloadManualBackup} 
                                                        disabled={isDownloading}
                                                        className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-wait shadow-md active:scale-95"
                                                    >
                                                        {isDownloading ? (
                                                            <><svg className="animate-spin h-3.5 w-3.5 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Comprimiendo .SQL...</>
                                                        ) : (
                                                            <><Download className="w-3.5 h-3.5"/> Descargar Archivo</>
                                                        )}
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-5 text-center px-4 bg-emerald-500/10 border border-emerald-500 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <CheckCircle className="w-10 h-10 text-emerald-500 mb-2 drop-shadow-sm" />
                                                <h4 className="text-emerald-600 font-extrabold text-xs uppercase tracking-wider mb-1">¡Descarga Completada!</h4>
                                                <p className="text-[10px] font-medium text-emerald-700/80 leading-tight">
                                                    El volcado {manualBackupTitle}.sql se ha exportado y enviado a tu navegador correctamente.
                                                </p>
                                                <button onClick={() => setDownloadSuccess(false)} className="mt-3 text-[9px] font-bold text-emerald-600 uppercase tracking-widest hover:underline decoration-1 underline-offset-2">Hacer otro</button>
                                            </div>
                                        )}
                                    </div>

                                    {/* SECCIÓN AUTOMATIZADA AVANZADA */}
                                    <div className="bg-main border border-brand rounded-lg p-4 flex flex-col h-full">
                                        <h3 className="text-sm font-black text-brand-main mb-2 uppercase tracking-wide flex items-center gap-2"><CalendarClock className="w-4 h-4 text-primary"/> Programación (Servidor)</h3>
                                        <p className="text-[10px] text-brand-muted mb-4 font-medium leading-relaxed">
                                            Una vez configurado, presione "Guardar Todos los Cambios" en la pantalla principal.
                                        </p>
                                        <div className="space-y-4 flex-grow">
                                            {(() => {
                                                const enabledIdx = data.settings.findIndex(s => s.key === 'backup_auto_enabled');
                                                const intIdx = data.settings.findIndex(s => s.key === 'backup_interval');
                                                const daysIdx = data.settings.findIndex(s => s.key === 'backup_days');
                                                const startIdx = data.settings.findIndex(s => s.key === 'backup_time_start');
                                                const endIdx = data.settings.findIndex(s => s.key === 'backup_time_end');
                                                
                                                if (enabledIdx === -1 || startIdx === -1) return <div className="text-[10px] text-red-500 font-bold p-2 bg-red-50 rounded">Iniciando... pulse F5 si el error persiste.</div>;

                                                const activeDays = data.settings[daysIdx]?.value ? data.settings[daysIdx].value.split(',') : [];

                                                const toggleDay = (dayValue) => {
                                                    let dArr = [...activeDays];
                                                    if (dArr.includes(dayValue)) dArr = dArr.filter(d => d !== dayValue);
                                                    else dArr.push(dayValue);
                                                    handleChange(daysIdx, dArr.join(','));
                                                };

                                                const weekDays = [
                                                    { v: '1', l: 'L' }, { v: '2', l: 'M' }, { v: '3', l: 'X' },
                                                    { v: '4', l: 'J' }, { v: '5', l: 'V' }, { v: '6', l: 'S' }, { v: '0', l: 'D' }
                                                ];

                                                return (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between border-b border-brand pb-2">
                                                            <label className="text-[10px] font-black uppercase text-brand-muted">Activación del Cron</label>
                                                            <select value={String(data.settings[enabledIdx].value).toLowerCase()} onChange={e => handleChange(enabledIdx, e.target.value)} className="bg-card-fap text-brand-main border border-brand py-1 text-[10px] rounded font-bold uppercase transition-shadow focus:ring-primary focus:border-primary">
                                                                <option value="1">✅ Activo</option>
                                                                <option value="0">❌ Pausado</option>
                                                            </select>
                                                        </div>

                                                        <div className="border-b border-brand pb-3">
                                                            <label className="text-[10px] font-black uppercase text-brand-muted block mb-2">Días Autorizados</label>
                                                            <div className="flex gap-1 justify-between">
                                                                {weekDays.map(day => (
                                                                    <button
                                                                        key={day.v}
                                                                        type="button"
                                                                        onClick={() => toggleDay(day.v)}
                                                                        className={`w-7 h-7 rounded-sm flex items-center justify-center text-[10px] font-black transition-all ${activeDays.includes(day.v) ? 'bg-primary text-white shadow-md' : 'bg-card-fap text-brand-muted border border-brand hover:bg-main'}`}
                                                                    >
                                                                        {day.l}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 border-b border-brand pb-2">
                                                            <div className="flex-1">
                                                                <label className="block text-[9px] font-black uppercase text-brand-muted mb-1">Hora Inicio</label>
                                                                <input type="time" value={data.settings[startIdx]?.value || '08:00'} onChange={e => handleChange(startIdx, e.target.value)} className="w-full bg-card-fap text-brand-main border border-brand text-[10px] py-1 px-2 focus:ring-primary rounded font-bold"/>
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="block text-[9px] font-black uppercase text-brand-muted mb-1">Hora Cierre</label>
                                                                <input type="time" value={data.settings[endIdx]?.value || '18:00'} onChange={e => handleChange(endIdx, e.target.value)} className="w-full bg-card-fap text-brand-main border border-brand text-[10px] py-1 px-2 focus:ring-primary rounded font-bold"/>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-black uppercase text-brand-muted">Repetición</label>
                                                            <select value={data.settings[intIdx]?.value || 'daily'} onChange={e => handleChange(intIdx, e.target.value)} className="bg-card-fap text-brand-main border border-brand py-1 text-[10px] rounded font-bold uppercase focus:ring-primary">
                                                                <option value="daily">1 VEZ AL DÍA (En H. Inicio)</option>
                                                                <option value="hourly">CADA HORA (Del Rango)</option>
                                                                <option value="everyTwoHours">CADA 2 HORAS (Del Rango)</option>
                                                                <option value="everyFourHours">CADA 4 HORAS (Del Rango)</option>
                                                                <option value="everySixHours">CADA 6 HORAS (Del Rango)</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button onClick={() => setIsBackupModalOpen(false)} className="px-5 py-2 border border-brand text-brand-main hover:bg-main text-xs font-bold rounded transition-colors uppercase tracking-wider">
                                        Hecho
                                    </button>
                                </div>
                            </div>
                        </Modal>

                        {/* TEMATIZACIÓN GLOBAL */}
                        <div className="bg-card-fap text-brand-main border border-brand shadow-sm rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-card-fap border-b border-brand flex items-center gap-3">
                                <Palette className="w-5 h-5 text-primary" />
                                <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">Apariencia del Sistema</h3>
                            </div>
                            <div className="p-5 flex-grow space-y-4">
                                <p className="text-xs text-brand-muted leading-relaxed font-medium">
                                    Seleccione la paleta de colores institucional para su cuenta. Este cambio es persistente y mejora la experiencia visual.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'premium-olive', label: 'Olivo Premium', color: 'bg-[#28361d]' },
                                        { id: 'corporate-blue', label: 'Azul Corp', color: 'bg-[#1e40af]' },
                                        { id: 'dark-night', label: 'Modo Oscuro', color: 'bg-[#0f172a]' },
                                        { id: 'classic-light', label: 'Luz Clásica', color: 'bg-card-fap text-brand-main border border-brand' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => router.post(route('user.theme.update'), { theme: t.id })}
                                            className={`flex items-center gap-2 p-2 rounded border transition-all text-[10px] font-bold uppercase tracking-tight ${
                                                auth.user.theme === t.id ? 'border-brand bg-main shadow-sm' : 'border-brand hover:border-brand'
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
                    <div className="bg-gradient-to-r from-[#1f2a17] to-[#28361d] p-5 rounded-lg shadow-md border border-brand flex items-center justify-between mt-5">
                        <div className="flex items-center gap-4 text-white">
                            <div className="p-2 bg-card-fap text-brand-main/10 rounded-lg">
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
                            className="px-6 py-2 bg-card-fap text-brand-main hover:bg-main text-brand-main text-xs font-black rounded uppercase tracking-widest shadow-lg transition-all active:scale-95"
                        >
                            Ir al Panel CMS
                        </a>
                    </div>

                </div>
            </div>

            {/* TOAST DE CAMBIOS REALIZADOS */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-emerald-600 border border-emerald-500 rounded-xl shadow-2xl p-4 flex items-center gap-4">
                        <CheckCircle className="w-7 h-7 text-white drop-shadow-md" />
                        <div>
                            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider drop-shadow-sm">Cambios Realizados</h4>
                            <p className="text-emerald-100 text-[11px] font-bold mt-0.5 uppercase tracking-widest">Las configuraciones se actualizaron con éxito.</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-5 text-emerald-200 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
