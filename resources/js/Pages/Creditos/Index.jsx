import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    TrendingUp, Clock, AlertCircle, PieChart, Wallet,
    CheckCircle2, PlusCircle, UserPlus, Eye, Search,
    XCircle, Trash2, ChevronDown, ShieldCheck, Filter,
    ArrowUpRight, Banknote, Activity,
} from 'lucide-react';

// ── Paleta corporativa (Ahora manejada por CSS Variables en app.css) ──

// ═══════════════════════════════════════════════════════
//  STATUS TAG — Premium con ring
// ═══════════════════════════════════════════════════════
function StatusTag({ estado }) {
    const cfg = {
        'Solicitado':   { bg: 'bg-amber-500/10',   text: 'text-amber-500',  ring: 'ring-amber-500/20',  dot: 'bg-amber-400' },
        'Desembolsado': { bg: 'bg-emerald-500/10',  text: 'text-emerald-500',ring: 'ring-emerald-500/20', dot: 'bg-emerald-500' },
        'En Mora':      { bg: 'bg-red-500/10',      text: 'text-red-500',    ring: 'ring-red-500/20',    dot: 'bg-red-500' },
        'Pagado':       { bg: 'bg-primary/10',  text: 'text-primary', ring: 'ring-primary/20',  dot: 'bg-primary' },
        'Rechazado':    { bg: 'bg-brand-muted/10',     text: 'text-brand-muted',   ring: 'ring-brand-muted/20',   dot: 'bg-brand-muted' },
    };
    const s = cfg[estado] || cfg['Rechazado'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${s.bg} ${s.text} ${s.ring}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {estado}
        </span>
    );
}

// ═══════════════════════════════════════════════════════
//  KPI CARD — ERP style con icono en contenedor
// ═══════════════════════════════════════════════════════
function KpiCard({ label, value, icon, iconBg, trend, warn }) {
    return (
        <div className={`relative overflow-hidden bg-card-fap border rounded-xl p-5 flex items-center gap-4 transition-shadow hover:shadow-md ${warn ? 'border-red-500/30' : 'border-brand'}`}>
            {/* Accent stripe */}
            <div className={`absolute top-0 left-0 h-0.5 w-full ${warn ? 'bg-red-500' : 'bg-primary'}`} />
            <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${iconBg || 'bg-white/5'}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider truncate">{label}</p>
                <p className={`text-xl font-black mt-0.5 ${warn ? 'text-red-500' : 'text-brand-main'}`}>{value}</p>
            </div>
            {trend && <ArrowUpRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  EVALUAR SOLICITUD
// ═══════════════════════════════════════════════════════
function EvaluarSolicitudBtn({ credito }) {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}
                className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                title="Evaluar solicitud">
                <ShieldCheck className="w-4 h-4" />
            </button>
            <AnimatePresence>
                {show && <EvaluarModal credito={credito} onClose={() => setShow(false)} />}
            </AnimatePresence>
        </>
    );
}

function EvaluarModal({ credito, onClose }) {
    const { data, setData, post, processing } = useForm({
        estado: 'Aprobado', monto_aprobado: credito.monto_aprobado, observaciones: '',
    });
    const submit = (e) => { e.preventDefault(); post(route('creditos.evaluar', credito.id), { onSuccess: onClose }); };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card-fap rounded-2xl shadow-2xl max-w-lg w-full border border-brand overflow-hidden">
                {/* Header */}
                <div className="h-1 bg-primary" />
                <div className="px-6 py-4 border-b border-brand flex items-center justify-between bg-card-fap">
                    <div>
                        <h4 className="font-bold text-brand-main">Evaluación de Solicitud</h4>
                        <p className="text-xs text-brand-muted mt-0.5">Crédito #{credito.id} — {credito.user?.name}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { val: 'Aprobado', label: 'Aprobar', Icon: CheckCircle2, cls: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
                            { val: 'Rechazado', label: 'Rechazar', Icon: XCircle, cls: 'border-red-500 bg-red-50 text-red-700' },
                        ].map(({ val, label, Icon, cls }) => (
                            <label key={val} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer font-bold text-sm transition-all ${data.estado === val ? cls : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                <input type="radio" name="eval" value={val} checked={data.estado === val} onChange={() => setData('estado', val)} className="sr-only" />
                                <Icon className="w-4 h-4" /> {label}
                            </label>
                        ))}
                    </div>
                    {data.estado === 'Aprobado' && (
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Monto Final Aprobado (Bs.)</label>
                            <input type="number"
                                className="field-input font-bold"
                                value={data.monto_aprobado} onChange={e => setData('monto_aprobado', e.target.value)} />
                        </div>
                    )}
                    <div>
                        <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Observaciones</label>
                        <textarea className="field-input resize-none bg-main"
                            rows="2" placeholder="Observaciones resolutivas..." value={data.observaciones} onChange={e => setData('observaciones', e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-3 pt-1">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
                        <button type="submit" disabled={processing}
                            className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 ${data.estado === 'Aprobado' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            {processing ? 'Procesando...' : 'Confirmar Resolución'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  ELIMINAR CRÉDITO
// ═══════════════════════════════════════════════════════
function EliminarCreditoBtn({ credito }) {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}
                className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Eliminar">
                <Trash2 className="w-4 h-4" />
            </button>
            <AnimatePresence>
                {show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card-fap rounded-2xl shadow-2xl max-w-sm w-full border border-red-500/20 p-6 text-center">
                            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-7 h-7 text-red-500" />
                            </div>
                            <h4 className="font-bold text-brand-main mb-1">¿Eliminar Crédito #{credito.id}?</h4>
                            <p className="text-sm text-brand-muted mb-6">
                                {credito.user?.name && <>{credito.user.name} · </>}
                                Bs. {Number(credito.monto_aprobado).toLocaleString()} · Esta acción es irreversible.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShow(false)} className="flex-1 py-2.5 text-sm font-semibold border border-brand rounded-xl hover:bg-main text-brand-main">Cancelar</button>
                                <button onClick={() => { router.delete(route('creditos.destroy', credito.id)); setShow(false); }}
                                    className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm">
                                    Eliminar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

// ═══════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function Index({ auth, creditos }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    const totalDesembolsado = creditos
        .filter(c => ['Desembolsado', 'En Mora', 'Pagado'].includes(c.estado))
        .reduce((sum, c) => sum + Number(c.monto_aprobado), 0);
    const pendientesEvaluacion = creditos.filter(c => c.estado === 'Solicitado').length;
    const activosMora = creditos.filter(c => c.estado === 'En Mora').length;
    const totalActivos = creditos.filter(c => c.estado === 'Desembolsado').length;

    const filteredCreditos = creditos.filter(c => {
        const matchSearch = !searchTerm ||
            c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toString().includes(searchTerm) ||
            c.user?.ci?.includes(searchTerm);
        const matchEstado = !filterEstado || c.estado === filterEstado;
        return matchSearch && matchEstado;
    });

    const kpisAdmin = [
        { label: 'Cartera Desembolsada', value: `Bs. ${totalDesembolsado.toLocaleString('es-BO')}`, icon: <Banknote className="w-5 h-5 text-emerald-500" />, iconBg: 'bg-emerald-500/10', trend: true },
        { label: 'Pendientes Evaluación', value: pendientesEvaluacion, icon: <Clock className="w-5 h-5 text-amber-500" />, iconBg: 'bg-amber-500/10', warn: pendientesEvaluacion > 0 },
        { label: 'En Mora', value: activosMora, icon: <AlertCircle className="w-5 h-5 text-red-500" />, iconBg: 'bg-red-500/10', warn: activosMora > 0 },
        { label: 'Créditos Activos', value: totalActivos, icon: <Activity className="w-5 h-5 text-primary" />, iconBg: 'bg-primary/10' },
    ];
    const kpisSocio = [
        { label: 'Deuda Total', value: `Bs. ${totalDesembolsado.toLocaleString('es-BO')}`, icon: <Wallet className="w-5 h-5 text-primary" />, iconBg: 'bg-primary/10' },
        { label: 'Activos', value: totalActivos, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, iconBg: 'bg-emerald-500/10' },
        { label: 'Pendientes', value: pendientesEvaluacion, icon: <Clock className="w-5 h-5 text-amber-500" />, iconBg: 'bg-amber-500/10', warn: pendientesEvaluacion > 0 },
        { label: 'En Mora', value: activosMora, icon: <AlertCircle className="w-5 h-5 text-red-500" />, iconBg: 'bg-red-500/10', warn: activosMora > 0 },
    ];
    const kpis = isAdmin ? kpisAdmin : kpisSocio;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                {isAdmin ? 'Gestión de Cartera Crediticia' : 'Mis Créditos'}
                            </span>
                            <span className="h-4 w-px bg-white/20" />
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full ring-1 ring-primary/20">
                                <PieChart className="w-3 h-3" />
                                {creditos.length} registros
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Créditos | Fapclas" />

            <div className="py-6 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* ─── KPIs ─── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
                    </div>

                    {/* ─── TABLA PRINCIPAL ─── */}
                    <div className="bg-card-fap rounded-2xl border border-brand shadow-sm overflow-hidden">

                        {/* Toolbar */}
                        <div className="px-5 py-3.5 border-b border-brand flex items-center justify-between gap-4 bg-white/[0.02]">
                            <div className="flex items-center gap-2.5 flex-1">
                                {/* Search */}
                                    <div className="relative flex-1 max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                                        <input
                                            type="text"
                                            placeholder={isAdmin ? 'Buscar socio, CI o # crédito...' : 'Buscar # crédito...'}
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-brand rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none bg-main text-brand-main transition-colors placeholder:text-brand-muted"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                {/* Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                    <select
                                        className="appearance-none pl-8 pr-7 py-2 text-sm border border-brand rounded-lg bg-main focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-brand-main font-bold cursor-pointer transition-all"
                                        value={filterEstado}
                                        onChange={e => setFilterEstado(e.target.value)}
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="Solicitado">Solicitado</option>
                                        <option value="Desembolsado">Desembolsado</option>
                                        <option value="En Mora">En Mora</option>
                                        <option value="Pagado">Pagado</option>
                                        <option value="Rechazado">Rechazado</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap">
                                    {filteredCreditos.length} resultado{filteredCreditos.length !== 1 ? 's' : ''}
                                </span>
                                <Link
                                    href={route('creditos.create')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white bg-primary rounded-lg shadow-sm hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isAdmin ? <><UserPlus className="w-3.5 h-3.5" /> Originar Nuevo Crédito</> : <><PlusCircle className="w-3.5 h-3.5" /> Solicitar Nuevo Crédito</>}
                                </Link>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-brand bg-white/[0.04]">
                                        {[
                                            { label: '#', cls: 'w-14 text-left' },
                                            { label: 'Fecha', cls: 'text-left' },
                                            ...(isAdmin ? [{ label: 'Socio', cls: 'text-left' }, { label: 'C.I.', cls: 'text-left' }] : []),
                                            { label: 'Línea de Crédito', cls: 'text-left' },
                                            { label: 'Monto (Bs.)', cls: 'text-right' },
                                            { label: 'Plazo', cls: 'text-center w-16' },
                                            { label: 'Tasa', cls: 'text-center w-16' },
                                            { label: 'Estado', cls: 'text-center' },
                                            { label: 'Acciones', cls: 'text-right w-28' },
                                        ].map(h => (
                                            <th key={h.label} className={`px-4 py-3 text-[10px] font-bold text-brand-main uppercase tracking-wider ${h.cls}`}>
                                                {h.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCreditos.map((credito, idx) => (
                                        <motion.tr
                                            key={credito.id}
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="border-b border-brand hover:bg-white/[0.03] transition-colors group relative bg-card-fap"
                                        >
                                            {/* ID con acento lateral en hover */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-0.5 h-5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <span className="font-mono font-bold text-brand-main text-xs"># {credito.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-brand-muted text-xs font-medium">
                                                {new Date(credito.created_at).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            {isAdmin && <td className="px-4 py-3 font-semibold text-brand-main">{credito.user?.name || '—'}</td>}
                                            {isAdmin && <td className="px-4 py-3 text-brand-muted font-mono text-xs">{credito.user?.ci || '—'}</td>}
                                            <td className="px-4 py-3 text-brand-main font-medium">{credito.tipo_credito?.nombre || 'General'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-black text-brand-main tabular-nums">
                                                    {Number(credito.monto_aprobado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-brand-muted text-xs font-semibold">{credito.plazo_meses}m</td>
                                            <td className="px-4 py-3 text-center text-brand-muted text-xs font-semibold">{credito.tasa_interes}%</td>
                                            <td className="px-4 py-3 text-center"><StatusTag estado={credito.estado} /></td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {isAdmin && credito.estado === 'Solicitado' && <EvaluarSolicitudBtn credito={credito} />}
                                                    <Link
                                                        href={route('creditos.show', credito.id)}
                                                        className="p-1.5 text-gray-400 hover:text-[#28361d] hover:bg-[#f2f6ee] rounded-lg transition-colors"
                                                        title="Ver expediente"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    {isAdmin && <EliminarCreditoBtn credito={credito} />}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {filteredCreditos.length === 0 && (
                                        <tr>
                                            <td colSpan={isAdmin ? 10 : 8} className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-gray-400">
                                                    <Search className="w-10 h-10 text-gray-200" />
                                                    <p className="text-sm font-semibold">No se encontraron créditos</p>
                                                    <p className="text-xs">Ajusta los filtros o el término de búsqueda</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-brand flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {filteredCreditos.length} de {creditos.length} registros · Datos sincronizados
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
