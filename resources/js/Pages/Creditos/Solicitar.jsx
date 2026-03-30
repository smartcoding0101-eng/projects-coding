import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import { Settings, PlusCircle, X, AlertCircle, Info } from 'lucide-react';

// ═══════════════════════════════════════════════════════
//  MODAL: Administrar Líneas de Crédito
// ═══════════════════════════════════════════════════════
function AdminLineasModal({ tipos, onClose }) {
    const [view, setView] = useState('list');
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        nombre: '', descripcion: '', tasa_interes: 0, tasa_mora: 0,
        plazo_min_meses: 1, plazo_max_meses: 60, monto_min: 0, monto_max: 100000, activo: true,
    });

    const openNew = () => {
        setForm({ nombre: '', descripcion: '', tasa_interes: 0, tasa_mora: 0, plazo_min_meses: 1, plazo_max_meses: 60, monto_min: 0, monto_max: 100000, activo: true });
        setEditing(null);
        setView('form');
    };

    const openEdit = (tipo) => {
        setForm({
            nombre: tipo.nombre, descripcion: tipo.descripcion || '',
            tasa_interes: tipo.tasa_interes, tasa_mora: tipo.tasa_mora,
            plazo_min_meses: tipo.plazo_min_meses, plazo_max_meses: tipo.plazo_max_meses,
            monto_min: tipo.monto_min, monto_max: tipo.monto_max, activo: tipo.activo,
        });
        setEditing(tipo);
        setView('form');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            router.put(route('tipos-credito.update', editing.id), form, { onSuccess: () => setView('list'), preserveScroll: true });
        } else {
            router.post(route('tipos-credito.store'), form, { onSuccess: () => setView('list'), preserveScroll: true });
        }
    };

    const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
    const fieldCls = "field-input";
    const lblCls = "block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-card-fap rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-brand">
                <div className="flex items-center justify-between px-6 py-4 bg-primary text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Settings className="h-5 w-5 text-white/70" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Administrar Líneas de Crédito</h2>
                            <p className="text-xs text-white/50 font-medium mt-0.5">Configuración de parámetros financieros para originación</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {view === 'list' ? (
                        <>
                            <div className="flex justify-between items-center mb-6 bg-white/[0.03] p-3 rounded-xl border border-brand">
                                <div className="text-xs font-bold text-brand-muted uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span> Catálogo Activo
                                </div>
                                <button onClick={openNew} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    <PlusCircle className="h-4 w-4" /> Nueva Línea de Crédito
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/[0.04] border-y border-brand">
                                        <tr>
                                            {['Línea de Crédito', 'Tasa', 'Plazo (Meses)', 'Monto (Bs.)', 'Acciones'].map((h, i) => (
                                                <th key={h} className={`py-3 px-4 text-[10px] font-black text-brand-muted uppercase tracking-widest ${i === 3 ? 'text-right' : i === 4 ? 'text-center' : ''}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                <tbody>
                                    {(tipos || []).map(tipo => (
                                        <tr key={tipo.id} className="border-b border-brand hover:bg-white/[0.03] transition-colors group relative">
                                            <td className="py-4 px-4">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors"></div>
                                                <span className="font-bold text-brand-main">{tipo.nombre}</span>
                                            </td>
                                            <td className="py-4 px-4 font-black font-mono text-brand-main">{parseFloat(tipo.tasa_interes).toFixed(2)}%</td>
                                            <td className="py-4 px-4 text-brand-muted font-medium text-xs">{tipo.plazo_min_meses} - {tipo.plazo_max_meses} M</td>
                                            <td className="py-4 px-4 text-right text-brand-main font-bold font-mono">
                                                {Number(tipo.monto_min).toLocaleString('es-BO')} – <span className="text-primary">{Number(tipo.monto_max).toLocaleString('es-BO')}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button onClick={() => openEdit(tipo)} className="p-2 text-brand-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Editar Parámetros">
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </>
                    ) : (
                            <div className="ring-1 ring-brand rounded-2xl overflow-hidden bg-white/[0.02] shadow-sm">
                            <div className="bg-white/[0.04] px-6 py-4 border-b border-brand flex items-center gap-3">
                                <div className="p-2 bg-card-fap rounded-md shadow-sm border border-brand">
                                    <Settings className="h-4 w-4 text-primary" />
                                </div>
                                <h3 className="text-base font-black text-brand-main tracking-tight">{editing ? 'Editar Línea de Crédito' : 'Nueva Línea de Crédito'}</h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className={lblCls}>Nombre de la Línea <span className="text-red-500">*</span></label>
                                    <input type="text" value={form.nombre} onChange={f('nombre')} className={fieldCls} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={lblCls}>Tasa de Interés (% Anual) <span className="text-red-500">*</span></label>
                                        <input type="number" step="0.01" value={form.tasa_interes} onChange={f('tasa_interes')} className={fieldCls} />
                                    </div>
                                    <div>
                                        <label className={lblCls}>Tasa de Mora (% Mensual) <span className="text-red-500">*</span></label>
                                        <input type="number" step="0.01" value={form.tasa_mora} onChange={f('tasa_mora')} className={fieldCls} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={lblCls}>Plazo Mínimo (Meses) <span className="text-red-500">*</span></label>
                                        <input type="number" value={form.plazo_min_meses} onChange={f('plazo_min_meses')} className={fieldCls} />
                                    </div>
                                    <div>
                                        <label className={lblCls}>Plazo Máximo (Meses) <span className="text-red-500">*</span></label>
                                        <input type="number" value={form.plazo_max_meses} onChange={f('plazo_max_meses')} className={fieldCls} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={lblCls}>Monto Mínimo (Bs.) <span className="text-red-500">*</span></label>
                                        <input type="number" step="0.01" value={form.monto_min} onChange={f('monto_min')} className={fieldCls} />
                                    </div>
                                    <div>
                                        <label className={lblCls}>Monto Máximo (Bs.) <span className="text-red-500">*</span></label>
                                        <input type="number" step="0.01" value={form.monto_max} onChange={f('monto_max')} className={fieldCls} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-brand mt-2">
                                    <button type="button" onClick={() => setView('list')} className="px-5 py-2.5 text-sm font-bold text-brand-muted bg-card-fap border border-brand rounded-lg shadow-sm hover:text-brand-main transition-colors">Cancelar</button>
                                    <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">Guardar Configuración</button>
                                </div>
                            </form>
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  SECCIÓN NUMERADA
// ═══════════════════════════════════════════════════════
function SectionHeader({ num, title, subtitle }) {
    return (
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-brand">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-white shadow-sm flex items-center justify-center font-black text-sm ring-2 ring-white/10">{num}</div>
            <div>
                <h3 className="text-lg font-black text-brand-main tracking-tight">{title}</h3>
                <p className="text-xs font-semibold text-brand-muted mt-0.5">{subtitle}</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  SIMULACIÓN SISTEMA FRANCÉS
// ═══════════════════════════════════════════════════════
function calcularSimulacion(monto, tasa_anual, plazo) {
    const p = parseFloat(monto);
    const n = parseInt(plazo);
    const i = parseFloat(tasa_anual) / 12 / 100;
    if (!p || !n || isNaN(i) || n <= 0) return null;
    if (i === 0) return { cuota: p / n, total: p, intereses: 0 };
    const cuota = (p * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    return { cuota, total: cuota * n, intereses: cuota * n - p };
}

// ═══════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function Solicitar({ auth, socios, tiposCredito, tipos_credito }) {
    const availableTipos = Array.isArray(tiposCredito) ? tiposCredito : (Array.isArray(tipos_credito) ? tipos_credito : []);
    const availableSocios = Array.isArray(socios) ? socios : [];
    const isAdmin = availableSocios.length > 0;

    const [socioSeleccionado, setSocioSeleccionado] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        tipo_credito_id: '',
        monto_solicitado: '',
        plazo_meses: '',
        metodo_descuento: 'Planilla',
    });

    const tipoSeleccionado = useMemo(
        () => availableTipos.find(t => t.id === Number(data.tipo_credito_id)) || null,
        [data.tipo_credito_id, availableTipos]
    );

    const simulacion = useMemo(
        () => tipoSeleccionado ? calcularSimulacion(data.monto_solicitado, tipoSeleccionado.tasa_interes, data.plazo_meses) : null,
        [data.monto_solicitado, data.plazo_meses, tipoSeleccionado]
    );

    const canSubmit = (isAdmin ? !!socioSeleccionado : true) && !!data.tipo_credito_id;
    const validation = [];
    if (isAdmin && !socioSeleccionado) validation.push('Selecciona un socio para continuar');
    if (!data.tipo_credito_id) validation.push('Selecciona una línea de crédito');

    const handleSubmit = (e) => { e.preventDefault(); post(route('creditos.store')); };
    const fmt = n => Number(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const inputCls = 'field-input font-bold';
    const lblCls = 'block text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1.5';

    // Opciones del select de socios
    const socioOpciones = availableSocios.map(s => ({ value: s.id, label: s.name, socio: s }));

    // Estilos de react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'var(--bg-main)' : 'var(--bg-card-fap)',
            borderColor: state.isFocused ? 'var(--brand-primary)' : 'var(--brand-border)',
            boxShadow: state.isFocused ? '0 0 0 3px var(--nav-active)' : 'none',
            '&:hover': { borderColor: 'var(--brand-primary)' },
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            minHeight: '44px',
            transition: 'all 0.2s ease',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? 'var(--brand-primary)' : state.isFocused ? 'rgba(var(--brand-primary-rgb),0.1)' : 'transparent',
            color: state.isSelected ? 'white' : 'var(--text-brand-main)',
            cursor: 'pointer',
            fontWeight: state.isSelected ? '700' : '500',
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
            border: '1px solid var(--brand-border)',
            backgroundColor: 'var(--bg-card-fap)',
            zIndex: 50,
            overflow: 'hidden',
        }),
        menuList: (base) => ({ ...base, padding: '4px' }),
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-2">
                        <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                            Originar Nuevo Crédito
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Solicitar Crédito" />

            {showAdminModal && <AdminLineasModal tipos={availableTipos} onClose={() => setShowAdminModal(false)} />}

            <div className="pb-24 bg-main min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* ── SECCIÓN 1: DATOS DEL SOCIO ── */}
                    <div className="bg-card-fap rounded-2xl shadow-sm border-t-4 border-t-primary border-x border-b border-brand p-7">
                        <SectionHeader num="1" title="Datos del Socio" subtitle="Selecciona el beneficiario del crédito" />

                        {isAdmin ? (
                            <>
                                <label className={lblCls}>Socio Beneficiario <span className="text-red-500">*</span></label>
                                <Select
                                    options={socioOpciones}
                                    onChange={(opt) => {
                                        if (opt) {
                                            setSocioSeleccionado(opt.socio);
                                            setData('user_id', opt.value);
                                        } else {
                                            setSocioSeleccionado(null);
                                            setData('user_id', '');
                                        }
                                    }}
                                    isClearable
                                    isSearchable
                                    placeholder="Buscar por CI, nombre o apellido..."
                                    noOptionsMessage={() => 'No se encontraron socios'}
                                    filterOption={(option, inputValue) => {
                                        if (!inputValue) return true;
                                        const s = option.data.socio;
                                        const q = inputValue.toLowerCase();
                                        return (
                                            (s.name || '').toLowerCase().includes(q) ||
                                            (s.ci || '').toLowerCase().includes(q) ||
                                            (s.grado || '').toLowerCase().includes(q) ||
                                            (s.destino || '').toLowerCase().includes(q)
                                        );
                                    }}
                                    formatOptionLabel={(opt) => (
                                        <div className="flex items-center justify-between gap-4 py-0.5">
                                            <span className="font-bold text-brand-main">{opt.socio.name}</span>
                                            <span className="flex items-center gap-3 text-xs text-brand-muted shrink-0">
                                                <span className="font-mono">CI: {opt.socio.ci}</span>
                                                <span className="text-white/10">|</span>
                                                <span>{opt.socio.grado}</span>
                                                <span className="text-white/10">|</span>
                                                <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">{opt.socio.destino}</span>
                                            </span>
                                        </div>
                                    )}
                                    styles={selectStyles}
                                />
                                <InputError message={errors.user_id} className="mt-2" />
                            </>
                        ) : (
                            <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-3 border border-primary/20">
                                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                    {(auth.user.name || 'U').charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-brand-main">{auth.user.name}</p>
                                    <p className="text-xs text-brand-muted">CI: {auth.user.ci} · {auth.user.grado}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── SECCIÓN 2: PARÁMETROS DEL CRÉDITO ── */}
                    <div className="bg-card-fap rounded-2xl shadow-sm border-t-4 border-t-primary border-x border-b border-brand p-7">
                        <SectionHeader num="2" title="Parámetros del Crédito" subtitle="Configura las condiciones financieras" />

                        <form onSubmit={handleSubmit} id="form-credito">
                            {/* Línea de Crédito */}
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-1">
                                    <label className={lblCls}>Línea de Crédito <span className="text-red-500">*</span></label>
                                    {isAdmin && (
                                        <button type="button" onClick={() => setShowAdminModal(true)}
                                            className="flex items-center gap-1.5 text-xs font-bold text-white bg-primary rounded-md px-3 py-1.5 shadow-sm hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50">
                                            <Settings className="h-3.5 w-3.5" /> Administrar
                                        </button>
                                    )}
                                </div>
                                <select value={data.tipo_credito_id} onChange={e => setData('tipo_credito_id', e.target.value)} className={inputCls}>
                                    <option value="">— Seleccionar tipo de crédito —</option>
                                    {availableTipos.map(t => (
                                        <option key={t.id} value={t.id} className="bg-card-fap text-brand-main font-bold">
                                            {t.nombre}  ({parseFloat(t.tasa_interes).toFixed(2)}%) · Bs.{Number(t.monto_min).toLocaleString('es-BO')} a {Number(t.monto_max).toLocaleString('es-BO')}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.tipo_credito_id} className="mt-2" />
                            </div>

                            {/* Modalidad de Pago */}
                            <div className="mb-5">
                                <label className={lblCls}>Modalidad de Pago</label>
                                <div className="flex items-center gap-6">
                                    {[{ value: 'Planilla', label: 'Descuento por Planilla' }, { value: 'Pago Directo', label: 'Pago Directo / QR' }].map(opt => (
                                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-brand-main">
                                            <input type="radio" name="metodo_descuento" value={opt.value}
                                                checked={data.metodo_descuento === opt.value}
                                                onChange={() => setData('metodo_descuento', opt.value)}
                                                className="accent-primary h-4 w-4" />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Monto y Plazo */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={lblCls}>
                                        Monto Solicitado (Bs.)
                                        {tipoSeleccionado && <span className="text-brand-muted normal-case font-normal ml-1">[{Number(tipoSeleccionado.monto_min).toFixed(0)} – {Number(tipoSeleccionado.monto_max).toFixed(0)}]</span>}
                                    </label>
                                    <input type="number" step="0.01" value={data.monto_solicitado}
                                        onChange={e => setData('monto_solicitado', e.target.value)}
                                        placeholder="0.00" className={inputCls} />
                                    <InputError message={errors.monto_solicitado} className="mt-1" />
                                </div>
                                <div>
                                    <label className={lblCls}>
                                        Plazo (Meses)
                                        {tipoSeleccionado && <span className="text-brand-muted normal-case font-normal ml-1">[{tipoSeleccionado.plazo_min_meses} – {tipoSeleccionado.plazo_max_meses}]</span>}
                                    </label>
                                    <input type="number" value={data.plazo_meses}
                                        onChange={e => setData('plazo_meses', e.target.value)}
                                        placeholder="Meses" className={inputCls} />
                                    <InputError message={errors.plazo_meses} className="mt-1" />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* ── SECCIÓN 3: PROYECCIÓN FINANCIERA ── */}
                    <div className="bg-card-fap rounded-2xl shadow-sm border-t-4 border-t-primary border-x border-b border-brand p-7">
                        <SectionHeader num="3" title="Proyección Financiera" subtitle="Simulación automática basada en sistema francés" />

                        {simulacion ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {[
                                    { label: 'Cuota Mensual', value: `Bs. ${fmt(simulacion.cuota)}`, green: false },
                                    { label: 'Total a Pagar', value: `Bs. ${fmt(simulacion.total)}`, green: false },
                                    { label: 'Intereses Totales', value: `Bs. ${fmt(simulacion.intereses)}`, green: true },
                                ].map(item => (
                                    <div key={item.label} className="relative bg-white/[0.03] rounded-2xl border border-brand shadow-sm p-6 overflow-hidden group hover:shadow-md transition-all">
                                        {item.green && <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>}
                                        {!item.green && <div className="absolute top-0 left-0 right-0 h-1 bg-white/10"></div>}
                                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">{item.label}</p>
                                        <p className={`text-2xl font-black font-mono tracking-tight ${item.green ? 'text-primary' : 'text-brand-main'}`}>{item.value}</p>
                                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                                    </div>
                                ))}
                                {tipoSeleccionado && data.plazo_meses && (
                                    <div className="sm:col-span-3 mt-2 bg-white/[0.03] rounded-xl px-5 py-4 border border-brand flex items-center justify-between text-sm shadow-inner group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-main rounded-lg shadow-sm border border-brand group-hover:rotate-12 transition-transform">
                                                <Info className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <span className="text-brand-muted font-medium">Tasa Configurada:</span> <strong className="text-brand-main font-black">{parseFloat(tipoSeleccionado.tasa_interes).toFixed(2)}% anual</strong>
                                                <span className="mx-3 text-white/10">|</span>
                                                <span className="text-brand-muted font-medium">Amortización:</span> <strong className="text-primary font-black">Sistema Francés</strong>
                                            </div>
                                        </div>
                                        <div className="bg-main px-4 py-1.5 rounded-full shadow-sm border border-brand font-black text-brand-main">
                                            {data.plazo_meses} Cuotas
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-brand bg-white/[0.01] rounded-2xl py-14 flex flex-col items-center gap-4 text-brand-muted">
                                <div className="p-4 bg-card-fap rounded-full shadow-sm border border-brand">
                                    <Info className="h-8 w-8 text-white/20" />
                                </div>
                                <p className="text-sm font-semibold tracking-wide">Completa los campos anteriores para activar la proyección financiera.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ── BARRA INFERIOR FIJA ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-primary text-white z-40 border-t border-white/10 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.5)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 overflow-x-auto flex-1">
                        {validation.map(msg => (
                            <div key={msg} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 rounded-md border border-yellow-400/20 text-xs font-semibold text-yellow-100 whitespace-nowrap">
                                <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" /> {msg}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <a href={route('creditos.index')} className="px-5 py-2 text-sm font-bold text-white/60 hover:text-white transition-all">Cancelar</a>
                        <button type="submit" form="form-credito" disabled={processing || !canSubmit}
                            className="px-6 py-2.5 text-sm font-black text-primary bg-white rounded-lg shadow-lg hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed">
                            {processing ? 'Procesando...' : 'Originar Crédito'}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
