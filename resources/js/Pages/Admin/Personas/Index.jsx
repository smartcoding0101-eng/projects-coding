import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users, PencilLine, UserMinus, UserPlus, AlertCircle, XCircle, Eye, LayoutGrid, Briefcase, PlusCircle, ShieldCheck, X, History, TrendingUp, TrendingDown, Receipt, Printer, FileSpreadsheet, Search, Save } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Index({ personas, auth, roles }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPersona, setEditingPersona] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserModal, setShowUserModal] = useState(false);

    // Sistema de Permisos Granulares
    const userPermissions = auth.user.permissions || [];
    const isAdmin = auth.user.roles?.includes('SuperAdmin');
    const can = (permission) => isAdmin || userPermissions.includes(permission);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombres: '', apellidos: '', ci: '', ext_ci: 'LP', 
        fecha_nacimiento: '', genero: 'MASCULINO', estado_civil: '', 
        celular: '', email: '', direccion_domicilio: '',
        institucion: 'POLICIA NACIONAL', grado: '', escalafon: '', 
        destino: '', sueldo_neto: '', fecha_ingreso_inst: '',
        situacion_laboral: 'ACTIVO', especialidad: '', unidad_dependencia: '',
        tipo_afiliacion: 'SOCIO', contacto_emergencia_nom: '', 
        contacto_emergencia_tel: '', observaciones: '',
        grado_instruccion: '', profesion: '', conyuge_nombre: '', 
        conyuge_celular: '', numero_hijos: 0,
        garantia_tipo: 'NINGUNA', garantia_vehiculo_modelo: '', 
        garantia_vehiculo_placa: '', garantia_inmueble_folio: '', 
        garantia_inmueble_dir: '', garantia_monto_valorado: '',
        garantia_codigo: '', garantia_estado: 'VIGENTE', 
        garantia_detalle: '', garantia_fecha_constitucion: '', 
        garantia_ubicacion_docs: '',
    });

    const openCreateModal = () => {
        setEditingPersona(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (persona) => {
        setEditingPersona(persona);
        setData({
            ...persona,
            sueldo_neto: persona.sueldo_neto || '',
            garantia_monto_valorado: persona.garantia_monto_valorado || '',
            grado_instruccion: persona.grado_instruccion || '',
            profesion: persona.profesion || '',
            conyuge_nombre: persona.conyuge_nombre || '',
            conyuge_celular: persona.conyuge_celular || '',
            numero_hijos: persona.numero_hijos || 0,
            garantia_codigo: persona.garantia_codigo || '',
            garantia_estado: persona.garantia_estado || 'VIGENTE',
            garantia_detalle: persona.garantia_detalle || '',
            garantia_fecha_constitucion: persona.garantia_fecha_constitucion || '',
            garantia_ubicacion_docs: persona.garantia_ubicacion_docs || '',
        });
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingPersona) {
            put(route('admin.personas.update', editingPersona.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('admin.personas.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const deletePersona = (persona) => {
        if (confirm(`¿ELIMINACIÓN DEFINITIVA de ${persona.nombres} ${persona.apellidos}? Esta acción es irreversible.`)) {
            router.delete(route('admin.personas.destroy', persona.id));
        }
    };

    const [userForm, setUserForm] = useState({ password: '', roles: [] });
    const promoteToUser = (personaId) => {
        post(route('admin.personas.promote', personaId), {
            data: userForm,
            onSuccess: () => {
                setShowUserModal(false);
                setIsModalOpen(false);
            },
        });
    };

    const filteredPersonas = personas.data.filter(p => 
        (p.nombres + ' ' + p.apellidos).toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ci.includes(searchTerm)
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Directorio Maestro de Afiliados</h2>}
        >
            <Head title="Gestión de Personas ERP" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    <div className="bg-card-fap border border-brand/50 shadow-sm rounded-lg overflow-hidden p-4 bg-card-fap flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                    Base de Datos de Afiliados y Prospectos
                                </h3>
                                <p className="text-[11px] text-brand-muted font-medium">
                                    Registro integral de personal policial, civil y externo del sistema FAPCLAS.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-brand-muted" />
                                <input
                                    type="text"
                                    placeholder="Buscar por Nombre o CI..."
                                    className="field-input text-xs pl-8 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {can('crear personas') && (
                                <button
                                    onClick={openCreateModal}
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <UserPlus className="w-4 h-4" /> Nuevo Afiliado
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-card-fap border border-brand/50 shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand/50">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Identidad Personal</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Información Laboral</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Estado Financiero</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Estado ERP</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right w-32 border-l border-brand/10 bg-card-fap">Comandos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand">
                                    {filteredPersonas.map((persona) => (
                                        <tr key={persona.id} className="hover:bg-main/50 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-brand-main">{persona.nombres} {persona.apellidos}</span>
                                                    <span className="text-[10px] text-brand-muted font-mono mt-0.5">
                                                        CI: {persona.ci} {persona.ext_ci && `(${persona.ext_ci})`} | {persona.celular || 'S/N'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-700">{persona.grado || '—'}</span>
                                                    <span className="text-[10px] text-brand-muted">{persona.institucion} {persona.destino ? `| ${persona.destino}` : ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">Aportes:</span>
                                                        <span className="text-[11px] font-black text-brand-main font-mono">
                                                            {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(persona.cuenta_aportacion?.saldo_actual || 0)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${persona.deuda_total > 0 ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                                                        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-tight">Deuda:</span>
                                                        <span className={`text-[11px] font-black font-mono ${persona.deuda_total > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                                                            {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(persona.deuda_total || 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {persona.user ? (
                                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded tracking-widest uppercase">
                                                        ACCESO ACTIVO
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-brand/10 text-brand-muted border border-brand rounded tracking-widest uppercase">
                                                        SÓLO AFILIADO
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap border-l border-brand/10 bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.01)]">
                                                <div className="flex justify-end gap-1.5 focus:outline-none">
                                                    {can('editar personas') && (
                                                        <button 
                                                            onClick={() => openEditModal(persona)} 
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-100" 
                                                            title="Ver Ficha / Editar"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    {can('eliminar personas') && (
                                                        <button 
                                                            onClick={() => deletePersona(persona)} 
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-100" 
                                                            title="Eliminar"
                                                        >
                                                            <UserMinus className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPersonas.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-brand-muted text-xs font-bold uppercase tracking-wider">
                                                No se encontraron registros de afiliados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        
                        <motion.div 
                            initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-card-fap rounded-lg border border-brand/60 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                        >
                            <div className="px-6 py-4 border-b border-brand/40 bg-card-fap flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-bold text-brand-main uppercase tracking-widest">
                                        {editingPersona ? `Edición de Expediente # ${editingPersona.id}` : 'Apertura de Ficha de Afiliación'}
                                    </h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-brand-muted hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="flex-1 flex flex-col overflow-hidden bg-[#fdfdfa]">
                                <Tab.Group>
                                    <Tab.List className="flex border-b border-brand/30 bg-card-fap">
                                        {[
                                            { icon: LayoutGrid, label: 'Personales' },
                                            { icon: Briefcase, label: 'Laborales' },
                                            { icon: PlusCircle, label: 'Adicional' },
                                            { icon: ShieldCheck, label: 'Garantías' },
                                            { icon: History, label: 'Movimientos / Kardex' },
                                        ].map((item) => (
                                            <Tab
                                                key={item.label}
                                                className={({ selected }) =>
                                                    classNames(
                                                        'px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all border-r border-brand/10 focus:outline-none',
                                                        selected
                                                            ? 'bg-main text-primary border-b-2 border-b-primary -mb-px'
                                                            : 'text-brand-muted hover:text-gray-600 hover:bg-brand/5'
                                                    )
                                                }
                                            >
                                                <item.icon className="w-3.5 h-3.5" />
                                                {item.label}
                                            </Tab>
                                        ))}
                                    </Tab.List>

                                    <Tab.Panels className="flex-1 overflow-y-auto px-8 py-6">
                                        {/* TAB 1: PERSONALES */}
                                        <Tab.Panel className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 focus:outline-none">
                                            <div className="col-span-2 text-[10px] font-bold text-primary uppercase border-b border-brand/20 pb-1 mb-2">Identidad Básica</div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Nombres <span className="text-red-500">*</span></label>
                                                <input type="text" className="field-input text-xs h-9" value={data.nombres} onChange={e => setData('nombres', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Apellidos <span className="text-red-500">*</span></label>
                                                <input type="text" className="field-input text-xs h-9" value={data.apellidos} onChange={e => setData('apellidos', e.target.value)} required />
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Cédula Identidad <span className="text-red-500">*</span></label>
                                                    <input type="text" className="field-input text-xs h-9" value={data.ci} onChange={e => setData('ci', e.target.value)} required />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Ext.</label>
                                                    <select className="field-input text-xs h-9 pr-8" value={data.ext_ci} onChange={e => setData('ext_ci', e.target.value)}>
                                                        {['LP', 'SC', 'CB', 'OR', 'PT', 'CH', 'TJ', 'BN', 'PD'].map(ext => <option key={ext} value={ext}>{ext}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Fecha de Nacimiento</label>
                                                <input type="date" className="field-input text-xs h-9" value={data.fecha_nacimiento} onChange={e => setData('fecha_nacimiento', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Celular ERP (WhatsApp)</label>
                                                <input type="text" className="field-input text-xs h-9 font-mono" value={data.celular} onChange={e => setData('celular', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Email Notificación</label>
                                                <input type="email" className="field-input text-xs h-9" value={data.email} onChange={e => setData('email', e.target.value)} />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Ubicación Domiciliaria Exacta</label>
                                                <textarea className="field-input text-xs h-16 pt-2" value={data.direccion_domicilio} onChange={e => setData('direccion_domicilio', e.target.value)} />
                                            </div>
                                        </Tab.Panel>

                                        {/* TAB 2: LABORALES (REFINADA) */}
                                        <Tab.Panel className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 focus:outline-none">
                                            <div className="col-span-2 text-[10px] font-bold text-primary uppercase border-b border-brand/20 pb-1 mb-2 flex justify-between">
                                                <span>Estructura Laboral / Escalafón</span>
                                                <span className="text-brand-muted normal-case font-medium">Todos los campos son opcionales</span>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Tipo de Personal</label>
                                                <select className="field-input text-xs h-9 pr-8 font-bold" value={data.institucion} onChange={e => setData('institucion', e.target.value)}>
                                                    <option value="POLICIA NACIONAL">POLICÍA NACIONAL</option>
                                                    <option value="ADMINISTRATIVO">PERSONAL ADMINISTRATIVO</option>
                                                    <option value="CIVIL">PERSONAL CIVIL / EXTERNO</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Situación Actual</label>
                                                <select className="field-input text-xs h-9 pr-8" value={data.situacion_laboral} onChange={e => setData('situacion_laboral', e.target.value)}>
                                                    <option value="ACTIVO">SERVICIO ACTIVO</option>
                                                    <option value="PASIVO">SERVICIO PASIVO / JUBILADO</option>
                                                    <option value="DISPONIBILIDAD">DISPONIBILIDAD</option>
                                                    <option value="COMISION">EN COMISIÓN</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Grado / Cargo Actual</label>
                                                <input type="text" className="field-input text-xs h-9" placeholder="Ej: Sgto. 1ro. / Jefe de Depto." value={data.grado} onChange={e => setData('grado', e.target.value)} />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Nro. de Escalafón / Ítem / Matrícula</label>
                                                <input type="text" className="field-input text-xs h-9 font-mono" placeholder="Identificador único" value={data.escalafon} onChange={e => setData('escalafon', e.target.value)} />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Especialidad / Rama</label>
                                                <input type="text" className="field-input text-xs h-9" placeholder="Ej: Tránsito, Contabilidad..." value={data.especialidad} onChange={e => setData('especialidad', e.target.value)} />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Ingresos Netos (Bs.)</label>
                                                <input type="number" step="0.01" className="field-input text-xs h-9 font-bold text-primary" placeholder="Total líquido percibido" value={data.sueldo_neto} onChange={e => setData('sueldo_neto', e.target.value)} />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Unidad / Dependencia</label>
                                                <input type="text" className="field-input text-xs h-9" placeholder="Ej: FELCC, Div. RRHH" value={data.unidad_dependencia} onChange={e => setData('unidad_dependencia', e.target.value)} />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Fecha de Ingreso Institución</label>
                                                <input type="date" className="field-input text-xs h-9" value={data.fecha_ingreso_inst} onChange={e => setData('fecha_ingreso_inst', e.target.value)} />
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Destino Actual / Dirección Física</label>
                                                <input type="text" className="field-input text-xs h-9" value={data.destino} onChange={e => setData('destino', e.target.value)} />
                                            </div>
                                        </Tab.Panel>

                                        {/* TAB 3: ADICIONAL */}
                                        <Tab.Panel className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 focus:outline-none">
                                            <div className="col-span-2 text-[10px] font-bold text-primary uppercase border-b border-brand/20 pb-1 mb-2">Perfil Académico y Otros</div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Grado de Instrucción</label>
                                                <select className="field-input text-xs h-9" value={data.grado_instruccion} onChange={e => setData('grado_instruccion', e.target.value)}>
                                                    <option value="">SELECCIONAR...</option>
                                                    <option value="PRIMARIA">PRIMARIA</option>
                                                    <option value="SECUNDARIA">SECUNDARIA</option>
                                                    <option value="BACHILLER">BACHILLER</option>
                                                    <option value="TECNICO">TÉCNICO MEDIO/SUPERIOR</option>
                                                    <option value="LICENCIATURA">LICENCIATURA</option>
                                                    <option value="POSTGRADO">POSTGRADO (DIPLOMADO/MAESTRIA/PHD)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Profesión / Oficio</label>
                                                <input type="text" className="field-input text-xs h-9" value={data.profesion} onChange={e => setData('profesion', e.target.value)} />
                                            </div>

                                            <div className="col-span-2 text-[10px] font-bold text-primary uppercase border-b border-brand/20 pb-1 mt-2 mb-2">Entorno Familiar</div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Nombre del Cónyuge</label>
                                                <input type="text" className="field-input text-xs h-9" value={data.conyuge_nombre} onChange={e => setData('conyuge_nombre', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Celular del Cónyuge</label>
                                                <input type="text" className="field-input text-xs h-9" value={data.conyuge_celular} onChange={e => setData('conyuge_celular', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Número de Hijos</label>
                                                <input type="number" className="field-input text-xs h-9" value={data.numero_hijos} onChange={e => setData('numero_hijos', e.target.value)} />
                                            </div>

                                            <div className="col-span-2 text-[10px] font-bold text-primary uppercase border-b border-brand/20 pb-1 mt-2 mb-2">Contactos y Observaciones</div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Contacto de Emergencia</label>
                                                <input type="text" className="field-input text-xs h-9" placeholder="Nombre completo" value={data.contacto_emergencia_nom} onChange={e => setData('contacto_emergencia_nom', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Teléfono Emergencia</label>
                                                <input type="text" className="field-input text-xs h-9" value={data.contacto_emergencia_tel} onChange={e => setData('contacto_emergencia_tel', e.target.value)} />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Observaciones Técnicas del Expediente</label>
                                                <textarea className="field-input text-xs py-2 min-h-[60px]" value={data.observaciones} onChange={e => setData('observaciones', e.target.value)} placeholder="Notas adicionales sobre la afiliación..."></textarea>
                                            </div>
                                        </Tab.Panel>

                                        {/* TAB 4: GARANTIAS (REFINADAS) */}
                                        <Tab.Panel className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 focus:outline-none">
                                            <div className="col-span-3 text-[10px] font-bold text-primary uppercase border-b border-brand/20 pb-1 mb-2 flex justify-between">
                                                <span>Identificación del Bien en Custodia</span>
                                                <span className="text-secondary font-mono">{data.garantia_codigo || 'SIN CÓDIGO ASIGNADO'}</span>
                                            </div>
                                            
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5 font-bold">Bien sujeto a Garantía</label>
                                                <select className="field-input text-xs h-9 pr-8 bg-amber-50/30 border-amber-200" value={data.garantia_tipo} onChange={e => setData('garantia_tipo', e.target.value)}>
                                                    <option value="NINGUNA">NINGUNA</option>
                                                    <option value="INMUEBLE">BIEN INMUEBLE (CASA/LOTE)</option>
                                                    <option value="VEHICULO">VEHÍCULO / AUTOMOTOR</option>
                                                    <option value="PAPELETA">PAPELETA DE PAGO (PLANILLA)</option>
                                                    <option value="JOYAS">JOYAS / ORO / VALORES</option>
                                                    <option value="DPF">DPF (CERTIFICADO DE DEPÓSITO)</option>
                                                    <option value="MAQUINARIA">MAQUINARIA / EQUIPOS</option>
                                                    <option value="DOC_CUSTODIA">DOCUMENTOS EN CUSTODIA</option>
                                                    <option value="OTRO">OTROS BIENES</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Código Único Garantía</label>
                                                <input type="text" className="field-input text-xs h-9 font-mono bg-card-fap" placeholder="Ej: G-2024-001" value={data.garantia_codigo} onChange={e => setData('garantia_codigo', e.target.value)} />
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Estado Custodia / ERP</label>
                                                <select className="field-input text-xs h-9" value={data.garantia_estado} onChange={e => setData('garantia_estado', e.target.value)}>
                                                    <option value="VIGENTE">VIGENTE / EN PODER</option>
                                                    <option value="LIBERADA">LIBERADA / DEVUELTA</option>
                                                    <option value="EJECUTADA">EJECUTADA / JUDICIAL</option>
                                                    <option value="VENCIDA">VENCIDA</option>
                                                </select>
                                            </div>

                                            <div className="col-span-3">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Detalle Específico / Características Técnicas</label>
                                                <textarea className="field-input text-xs py-2 min-h-[60px]" placeholder="Describa marcas, nro de motor, serie, estado de conservación, etc." value={data.garantia_detalle} onChange={e => setData('garantia_detalle', e.target.value)}></textarea>
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Valor Comercial Est. (Bs.)</label>
                                                <input type="number" step="0.01" className="field-input text-xs h-9 font-bold text-secondary" placeholder="0.00" value={data.garantia_monto_valorado} onChange={e => setData('garantia_monto_valorado', e.target.value)} />
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Fecha Constitución</label>
                                                <input type="date" className="field-input text-xs h-9" value={data.garantia_fecha_constitucion} onChange={e => setData('garantia_fecha_constitucion', e.target.value)} />
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Folio / Nro. Documento</label>
                                                <input type="text" className="field-input text-xs h-9" placeholder="Nro de Título / Folio Real" value={data.garantia_inmueble_folio} onChange={e => setData('garantia_inmueble_folio', e.target.value)} />
                                            </div>

                                            <div className="col-span-3 md:col-span-2">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Ubicación Física de Documentos Sobres</label>
                                                <input type="text" className="field-input text-xs h-9" placeholder="Ej: Caja Fuerte B, Archivo Central XP-4" value={data.garantia_ubicacion_docs} onChange={e => setData('garantia_ubicacion_docs', e.target.value)} />
                                            </div>

                                            <div className="col-span-3 md:col-span-1">
                                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">Referencia Rápida / Placa</label>
                                                <input type="text" className="field-input text-xs h-9" placeholder="Placa o referencia" value={data.garantia_vehiculo_placa} onChange={e => setData('garantia_vehiculo_placa', e.target.value)} />
                                            </div>
                                        </Tab.Panel>

                                        {/* TAB 5: KARDEX / HISTORIAL TRANSACCIONAL */}
                                        <Tab.Panel className="focus:outline-none flex flex-col gap-4">
                                            <div className="bg-card-fap border border-brand/20 p-4 rounded flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Resumen de Cuenta Maestro</h4>
                                                    <p className="text-[9px] text-brand-muted font-medium">Historial consolidado de ahorros, créditos y beneficios.</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {can('exportar kardex pdf') && (
                                                        <a 
                                                            href={editingPersona ? route('admin.personas.kardex-pdf', editingPersona.id) : '#'} 
                                                            target="_blank"
                                                            className="flex items-center gap-1.5 px-3 py-1 bg-card-fap border border-brand/30 rounded shadow-sm text-[10px] font-bold text-gray-700 hover:bg-brand/5 hover:border-brand/60 transition-all uppercase tracking-tighter"
                                                        >
                                                            <Printer className="w-3 h-3 text-primary" /> Imprimir (PDF)
                                                        </a>
                                                    )}
                                                    {can('exportar kardex excel') && (
                                                        <a 
                                                            href={editingPersona ? route('admin.personas.kardex-excel', editingPersona.id) : '#'} 
                                                            className="flex items-center gap-1.5 px-3 py-1 bg-card-fap border border-emerald-300 rounded shadow-sm text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 transition-all uppercase tracking-tighter"
                                                        >
                                                            <FileSpreadsheet className="w-3 h-3 text-emerald-600" /> Exportar Excel
                                                        </a>
                                                    )}
                                                    <div className="px-3 py-1 bg-card-fap border border-brand/10 rounded shadow-sm text-right">
                                                        <span className="block text-[8px] font-bold text-brand-muted">SALDO TOTAL DISPONIBLE</span>
                                                        <span className="text-sm font-black text-blue-800 font-mono">
                                                            {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(editingPersona?.cuenta_aportacion?.saldo_actual || 0)} Bs.
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-brand/20 rounded shadow-inner bg-card-fap overflow-hidden max-h-[350px] overflow-y-auto">
                                                <table className="w-full text-[10px] text-left border-collapse">
                                                    <thead className="bg-[#fdfdfa] sticky top-0 border-b border-brand/10 shadow-sm z-10">
                                                        <tr>
                                                            <th className="px-3 py-2 font-bold text-brand-muted uppercase w-20">Fecha</th>
                                                            <th className="px-3 py-2 font-bold text-brand-muted uppercase">Concepto / Movimiento</th>
                                                            <th className="px-3 py-2 font-bold text-emerald-700 uppercase text-right w-24 bg-emerald-50/20">Ingreso</th>
                                                            <th className="px-3 py-2 font-bold text-rose-700 uppercase text-right w-24 bg-rose-50/20">Egreso</th>
                                                            <th className="px-3 py-2 font-bold text-primary uppercase text-right w-28 border-l border-brand/5">Saldo Acum.</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-brand font-medium">
                                                        {editingPersona?.kardex?.map((mov) => (
                                                            <tr key={mov.id} className="hover:bg-card-fap transition-colors">
                                                                <td className="px-3 py-2.5 text-brand-muted font-bold font-mono">{mov.fecha}</td>
                                                                <td className="px-3 py-2.5">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-secondary font-black uppercase tracking-tight">{mov.tipo_movimiento.replace('_', ' ')}</span>
                                                                        <span className="text-[9px] text-brand-muted italic line-clamp-1">{mov.concepto}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-2.5 text-right font-black text-emerald-600 bg-emerald-50/10">
                                                                    {mov.ingreso > 0 ? `+ ${new Intl.NumberFormat('es-BO').format(mov.ingreso)}` : '—'}
                                                                </td>
                                                                <td className="px-3 py-2.5 text-right font-black text-rose-600 bg-rose-50/10">
                                                                    {mov.egreso > 0 ? `- ${new Intl.NumberFormat('es-BO').format(mov.egreso)}` : '—'}
                                                                </td>
                                                                <td className="px-3 py-2.5 text-right font-black text-secondary border-l border-brand/5 bg-card-fap/20">
                                                                    {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(mov.saldo_acumulado)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {(!editingPersona?.kardex || editingPersona.kardex.length === 0) && (
                                                            <tr>
                                                                <td colSpan="5" className="px-6 py-12 text-center text-brand-muted uppercase tracking-widest font-black italic">
                                                                    Cero movimientos registrados para este expediente.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="text-[8px] text-brand-muted flex items-center gap-2">
                                                <Receipt className="w-2.5 h-2.5" /> Mostrando los últimos 50 registros sincronizados del servidor maestro.
                                            </div>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>

                                {/* ACCIONES FINALES MODAL */}
                                <div className="px-8 py-5 bg-card-fap border-t border-brand/40 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex gap-2 w-full md:w-auto">
                                        {editingPersona && !editingPersona.user && can('vincular cuentas usuario') && (
                                            <button 
                                                type="button" 
                                                onClick={() => setShowUserModal(true)}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" /> Alta de Usuario
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 md:flex-none px-6 py-2 text-xs font-bold text-brand-muted hover:bg-brand/10 rounded transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="flex-1 md:flex-none px-10 py-2.5 bg-primary hover:bg-primary-dark text-white rounded shadow-md text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" /> {processing ? 'Consolidando...' : 'Guardar Ficha'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* SEGURIDAD: DIÁLOGO DE ALTA ERP */}
            <AnimatePresence>
                {showUserModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-card-fap p-8 rounded-lg border border-brand shadow-2xl max-w-sm w-full">
                            <div className="flex items-center gap-3 mb-4 text-emerald-600">
                                <ShieldCheck className="w-8 h-8" />
                                <h4 className="text-sm font-black uppercase tracking-widest">Confirmación de Alta</h4>
                            </div>
                            <p className="text-[11px] text-brand-muted mb-6 font-medium leading-relaxed">
                                Se otorgará acceso al ecosistema ERP FAPCLAS para <strong>{editingPersona?.nombres}</strong>. Define una clave técnica inicial.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Clave de Acceso Inicial</label>
                                    <input 
                                        type="password" 
                                        className="field-input text-xs" 
                                        placeholder="Mínimo 8 dígitos"
                                        value={userForm.password}
                                        onChange={e => setUserForm({...userForm, password: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button onClick={() => setShowUserModal(false)} className="flex-1 p-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-widest border border-brand rounded">Abortar</button>
                                    <button 
                                        onClick={() => promoteToUser(editingPersona.id)}
                                        className="flex-2 p-2.5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg shadow-emerald-200"
                                    >
                                        Emitir Acceso
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
