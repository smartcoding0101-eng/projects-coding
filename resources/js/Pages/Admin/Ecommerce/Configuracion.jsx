import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Settings, Save, QrCode, Users, ShieldCheck,
    Type, Tag, MapPin, AlertTriangle, Power,
    CheckCircle2, XCircle, FileText
} from 'lucide-react';

export default function Configuracion({ settings, auth }) {
    const initialSettings = {};
    settings.forEach(s => { initialSettings[s.key] = s.value; });

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        settings: initialSettings,
        qr_file: null
    });

    const handleChange = (key, value) => {
        setData('settings', { ...data.settings, [key]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.ecommerce.config.update'), { forceFormData: true, preserveScroll: true });
    };

    const qrUrl = settings.find(s => s.key === 'ecommerce_qr_pago')?.value;

    const ToggleSwitch = ({ settingKey, labelOn = "ACTIVO", labelOff = "INACTIVO" }) => {
        const isOn = data.settings[settingKey] === 'si';
        return (
            <div className="flex bg-fapclas-100 p-0.5 rounded border border-fapclas-200 display-inline-flex w-max">
                <button type="button" onClick={() => handleChange(settingKey, 'si')}
                    className={`px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wider transition-colors min-w-[80px] ${isOn ? 'bg-white text-fapclas-800 shadow-sm border border-fapclas-200' : 'text-fapclas-400 hover:text-fapclas-600'}`}>
                    {labelOn}
                </button>
                <button type="button" onClick={() => handleChange(settingKey, 'no')}
                    className={`px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wider transition-colors min-w-[80px] ${!isOn ? 'bg-red-50 text-red-700 shadow-sm border border-red-200' : 'text-fapclas-400 hover:text-red-500'}`}>
                    {labelOff}
                </button>
            </div>
        );
    };

    const SectionHeader = ({ icon: Icon, title, subtitle }) => (
        <div className="px-5 py-3 border-b border-fapclas-200 bg-[#fafaf6] flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-fapclas-600" />
                <div>
                    <h3 className="text-xs font-bold text-fapclas-900 uppercase tracking-wide">
                        {title}
                    </h3>
                    {subtitle && <p className="text-[10px] text-fapclas-500 font-medium">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    const SettingRow = ({ title, description, children, border = true }) => (
        <div className={`flex flex-col md:flex-row md:items-center justify-between py-4 ${border ? 'border-t border-fapclas-50' : ''} gap-4`}>
            <div className="flex-1 pr-4">
                <h4 className="font-bold text-fapclas-900 text-[11px] uppercase tracking-wider">{title}</h4>
                <p className="text-[10px] text-fapclas-500 mt-0.5">{description}</p>
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );

    return (
        <AuthenticatedLayout header={<h2 className="font-bold text-xl text-gray-900 leading-tight">Módulo E-commerce / Configuraciones</h2>}>
            <Head title="Parámetros Tienda B2C" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y TOOLBAR DE GUARDADO */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#fafaf6] gap-4 sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-fapclas-600" />
                            <div>
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                    Parámetros Centrales de la Tienda
                                </h3>
                                <p className="text-[11px] text-fapclas-500 font-medium">
                                    Ajustes de precios, interfaz, identidad y reglas de acceso al catálogo.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {recentlySuccessful && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 flex items-center gap-1 uppercase tracking-wider">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Grabado Correctamente
                                </span>
                            )}
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="px-5 py-2.5 bg-fapclas-800 hover:bg-fapclas-900 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors active:translate-y-px disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" /> {processing ? 'Procesando...' : 'Guardar Todos los Parámetros'}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        
                        <div className="space-y-5">
                            {/* 1. CONTROL DE PRECIOS */}
                            <div className="bg-white rounded-lg shadow-sm border border-fapclas-200 overflow-hidden">
                                <SectionHeader icon={Tag} title="Lógica de Precios" subtitle="Visibilidad de catálogos y tarifas" />
                                <div className="px-5 py-2">
                                    <SettingRow title="Exhibición Pública" description="¿Precios visibles para usuarios sin autenticación?" border={false}>
                                        <ToggleSwitch settingKey="ecommerce_mostrar_precios" />
                                    </SettingRow>
                                    <SettingRow title="Tarifa Venta Libre (QR)" description="Habilitar bloque de precio estándar para cobro por pasarela o QR.">
                                        <ToggleSwitch settingKey="ecommerce_mostrar_precio_venta" />
                                    </SettingRow>
                                    <SettingRow title="Tarifa Socia/Crédito" description="Habilitar bloque de precio diferido exclusivo para socios confirmados.">
                                        <ToggleSwitch settingKey="ecommerce_mostrar_precio_credito" />
                                    </SettingRow>
                                    <SettingRow title="Indicador de Stock" description="Mostrar cantidad de unidades en bodega al cliente final.">
                                        <ToggleSwitch settingKey="ecommerce_mostrar_stock" />
                                    </SettingRow>
                                </div>
                            </div>

                            {/* 2. POLÍTICAS DE ACCESO */}
                            <div className="bg-white rounded-lg shadow-sm border border-fapclas-200 overflow-hidden">
                                <SectionHeader icon={ShieldCheck} title="Accesos y Beneficios" subtitle="Control de público y descuentos de socios" />
                                <div className="px-5 py-2">
                                    <SettingRow title="Apertura al Público" description="¿Permitir compras a civiles no asociados?" border={false}>
                                        <ToggleSwitch settingKey="ecommerce_habilitar_invitados" labelOn="PERMITIDO" labelOff="DENEGADO" />
                                    </SettingRow>
                                    
                                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-fapclas-50">
                                        <div>
                                            <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Dcto. Global Socios (%)</label>
                                            <input 
                                                type="number" min="0" max="100" 
                                                value={data.settings.ecommerce_descuento_socios_global || 0}
                                                onChange={e => handleChange('ecommerce_descuento_socios_global', e.target.value)}
                                                className="field-input text-xs w-full text-right font-mono text-emerald-700" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Límite Crédito (Bs.)</label>
                                            <input 
                                                type="number" 
                                                value={data.settings.ecommerce_limite_credito_default || 0}
                                                onChange={e => handleChange('ecommerce_limite_credito_default', e.target.value)}
                                                className="field-input text-xs w-full text-right font-mono" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 3. MÉTODOS DE PAGO */}
                            <div className="bg-white rounded-lg shadow-sm border border-fapclas-200 overflow-hidden">
                                <SectionHeader icon={QrCode} title="Pasarelas / Cobro QR" subtitle="Configuración de la cuenta bancaria recaudadora" />
                                <div className="px-5 py-5">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-24 h-24 bg-fapclas-50 border border-dashed border-fapclas-300 rounded mx-auto sm:mx-0 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {qrUrl ? (
                                                <img src={`/storage/${qrUrl}`} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center px-2">SIN IMAGEN</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Matriz QR de Cobro</label>
                                            <input 
                                                type="file" 
                                                onChange={e => setData('qr_file', e.target.files[0])}
                                                className="block w-full text-xs text-gray-500
                                                    file:mr-4 file:py-1 file:px-3 file:border-0
                                                    file:text-[10px] file:font-bold file:uppercase file:tracking-wider
                                                    file:bg-fapclas-100 file:text-fapclas-700
                                                    hover:file:bg-fapclas-200 transition-colors cursor-pointer border border-fapclas-200 rounded p-1" 
                                                accept="image/*" 
                                            />
                                            <p className="text-[10px] text-fapclas-500 mt-2 leading-tight">Carga la imagen JPG/PNG del código QR de la cuenta recaudadora institucional.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* 4. IDENTIDAD DE LA TIENDA */}
                            <div className="bg-white rounded-lg shadow-sm border border-fapclas-200 overflow-hidden">
                                <SectionHeader icon={Type} title="Identidad de Portada / Hero" subtitle="Textos principales de la cabecera de la tienda" />
                                <div className="px-5 py-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Cintillo / Badge</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.ecommerce_badge_hero || ''} 
                                                onChange={e => handleChange('ecommerce_badge_hero', e.target.value)}
                                                className="field-input text-xs w-full" 
                                                placeholder="Ej: NUEVO CATÁLOGO" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Frase Subtítulo</label>
                                            <input 
                                                type="text" 
                                                value={data.settings.ecommerce_subtitulo_hero || ''} 
                                                onChange={e => handleChange('ecommerce_subtitulo_hero', e.target.value)}
                                                className="field-input text-xs w-full" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Título Jerarquía H1</label>
                                        <input 
                                            type="text" 
                                            value={data.settings.ecommerce_titulo_hero || ''} 
                                            onChange={e => handleChange('ecommerce_titulo_hero', e.target.value)}
                                            className="field-input text-xs font-bold w-full" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Cuerpo de Texto (Descripción)</label>
                                        <textarea 
                                            value={data.settings.ecommerce_descripcion_hero || ''} 
                                            onChange={e => handleChange('ecommerce_descripcion_hero', e.target.value)}
                                            rows={2} 
                                            className="field-input text-xs w-full" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 5. DIRECCIÓN DE RECOJO / CONTACTO */}
                            <div className="bg-white rounded-lg shadow-sm border border-fapclas-200 overflow-hidden">
                                <SectionHeader icon={MapPin} title="Logística / Datos de Recojo" subtitle="Información física de la agencia / almacén" />
                                <div className="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Dirección Oficial de Bodega</label>
                                        <input 
                                            type="text" 
                                            value={data.settings.ecommerce_direccion_tienda || ''} 
                                            onChange={e => handleChange('ecommerce_direccion_tienda', e.target.value)}
                                            className="field-input text-xs w-full" 
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Horario Laboral</label>
                                        <input 
                                            type="text" 
                                            value={data.settings.ecommerce_horario_atencion || ''} 
                                            onChange={e => handleChange('ecommerce_horario_atencion', e.target.value)}
                                            className="field-input text-xs w-full" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Línea Fija</label>
                                        <input 
                                            type="text" 
                                            value={data.settings.ecommerce_telefono_tienda || ''} 
                                            onChange={e => handleChange('ecommerce_telefono_tienda', e.target.value)}
                                            className="field-input text-xs font-mono w-full" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-1">Enlace WhatsApp</label>
                                        <input 
                                            type="text" 
                                            value={data.settings.ecommerce_whatsapp_tienda || ''} 
                                            onChange={e => handleChange('ecommerce_whatsapp_tienda', e.target.value)}
                                            className="field-input text-xs w-full text-emerald-700 font-mono" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 6. MODO MANTENIMIENTO */}
                            <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="px-5 py-3 border-b border-red-200 bg-red-100/50 flex items-center gap-3">
                                    <AlertTriangle className="w-4 h-4 text-red-700" />
                                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-wide">
                                        Operaciones Críticas
                                    </h3>
                                </div>
                                <div className="px-5 py-4">
                                    <SettingRow title="MODO MANTENIMIENTO (APAGADO DE TIENDA)" description="Al activar esto, el e-commerce será inaccesible al público." border={false}>
                                        <div className="flex bg-white p-0.5 rounded border border-red-200 display-inline-flex w-max">
                                            <button type="button" onClick={() => handleChange('ecommerce_modo_mantenimiento', 'si')}
                                                className={`px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wider transition-colors min-w-[80px] ${data.settings['ecommerce_modo_mantenimiento'] === 'si' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-400 hover:text-red-600'}`}>
                                                ESTADO OFFLINE
                                            </button>
                                            <button type="button" onClick={() => handleChange('ecommerce_modo_mantenimiento', 'no')}
                                                className={`px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wider transition-colors min-w-[80px] ${data.settings['ecommerce_modo_mantenimiento'] !== 'si' ? 'bg-fapclas-800 text-white shadow-sm' : 'text-gray-400 hover:text-fapclas-800'}`}>
                                                ESTADO ONLINE
                                            </button>
                                        </div>
                                    </SettingRow>
                                    <div className="mt-4 pt-4 border-t border-red-200/50">
                                        <label className="block text-[10px] font-bold text-red-800 uppercase tracking-wider mb-1">Nota Legal / Disclaimer</label>
                                        <textarea 
                                            value={data.settings.ecommerce_nota_legal || ''} 
                                            onChange={e => handleChange('ecommerce_nota_legal', e.target.value)}
                                            rows={2} 
                                            className="field-input text-[11px] w-full border-red-200 focus:border-red-500 focus:ring-red-500 bg-white" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
