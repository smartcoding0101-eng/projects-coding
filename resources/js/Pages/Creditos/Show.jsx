import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    ArrowLeftCircle, 
    Download, 
    Trash2, 
    CheckCircle2,
    Calendar,
    Wallet,
    Info,
    Check,
    XCircle,
    ChevronRight,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';

export default function Show({ auth, credito, planPagos }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');
    
    // Cálculos resumen
    const pagadoCapital = planPagos.filter(p => p.estado === 'Pagado').reduce((sum, p) => sum + Number(p.amortizacion_capital), 0);
    const pagadoInteres = planPagos.filter(p => p.estado === 'Pagado').reduce((sum, p) => sum + Number(p.interes), 0);
    const cuotasPagadas = planPagos.filter(p => p.estado === 'Pagado').length;
    const progreso = credito.monto_aprobado > 0 ? ((pagadoCapital / credito.monto_aprobado) * 100).toFixed(1) : 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-4">
                        <Link href={route('creditos.index')} className="text-brand-muted hover:text-brand-main transition-colors">
                            <ArrowLeftCircle className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2 text-sm">
                            <Link href={route('creditos.index')} className="text-brand-muted hover:text-primary font-semibold transition-colors">Créditos</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-brand" />
                            <span className="font-bold text-brand-main">Operación #{credito.id}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusTag estado={credito.estado} />
                    </div>
                </div>
            }
        >
            <Head title={`Crédito #${credito.id} | Fapclas`} />

            <div className="py-6 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* ══════════ TOOLBAR HEADER ══════════ */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="h-0.5 bg-primary" />
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 pl-1">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-extrabold text-brand-main leading-tight">Expediente de Crédito</h2>
                                    <p className="text-[11px] text-brand-muted font-medium mt-0.5">
                                        {credito.user?.name} · CI: {credito.user?.ci} · Originado el {new Date(credito.created_at).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                            {credito.estado === 'Solicitado' && isAdmin && (
                                <EvaluarResolucionBtn credito={credito} />
                            )}
                                <a 
                                    href={`/creditos/${credito.id}/exportar`} 
                                    target="_blank"
                                    className="px-4 py-2 text-xs font-semibold text-brand-muted border border-brand rounded-md hover:bg-card-fap/5 flex items-center gap-2 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" /> XLS
                                </a>
                                {credito.estado !== 'Solicitado' && (
                                    <a 
                                        href={route('creditos.pdf', credito.id)} 
                                        target="_blank"
                                        className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-md shadow-sm hover:scale-105 active:scale-100 transition-all flex items-center gap-2"
                                    >
                                        <Download className="w-3.5 h-3.5" /> PDF
                                    </a>
                                )}
                            {isAdmin && credito.estado !== 'Pagado' && (
                                <AnularCreditoBtn credito={credito} />
                            )}
                            </div>
                        </div>
                    </div>

                    {/* ══════════ SUMMARY DATA ══════════ */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="h-0.5 bg-primary" />
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand">
                            <DataCell label="Línea de Crédito" value={credito.tipo_credito?.nombre || 'General'} />
                            <DataCell label="Monto Aprobado" value={`Bs. ${Number(credito.monto_aprobado).toLocaleString('es-BO', {minimumFractionDigits:2})}`} highlight />
                            <DataCell label="Progreso (Capital)" value={`${progreso}%`} subtext={`${cuotasPagadas} de ${credito.plazo_meses} cuotas`} progress={Number(progreso)} />
                            <DataCell label="Tasa y Modalidad" value={`${credito.tasa_interes}% anual`} subtext={`Dcto: ${credito.metodo_descuento}`} />
                        </div>
                        {credito.observaciones && (
                            <div className="px-5 py-3 border-t border-amber-500/30 bg-amber-500/10 flex items-start gap-2">
                                <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Obs. Resolutiva</p>
                                    <p className="text-xs text-brand-main">{credito.observaciones}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ══════════ PLAN DE PAGOS (TABLE) ══════════ */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="h-0.5 bg-primary" />
                        <div className="px-5 py-4 border-b border-brand flex items-center justify-between bg-card-fap/[0.04]">
                            <h3 className="text-sm font-extrabold text-brand-main flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> Plan de Amortización Mensual
                            </h3>
                            <span className="text-[11px] text-brand-muted font-semibold">{planPagos.length} periodos proyectados</span>
                        </div>
                        
                        {planPagos.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-brand bg-card-fap/[0.04]">
                                            <th className="text-center px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-16">Nº</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Vencimiento</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Saldo Inicial</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Capital</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Interés</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider bg-card-fap/[0.02]">Cuota Base</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">Mora</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-main uppercase tracking-wider bg-card-fap/[0.05]">Total a Pagar</th>
                                            <th className="text-center px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Estado</th>
                                            {isAdmin && <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-24">Cobro</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {planPagos.map((cuota, index) => {
                                            const isMora = cuota.estado === 'Mora' || cuota.monto_mora > 0;
                                            const totalPagar = Number(cuota.cuota_total) + Number(cuota.monto_mora || 0);
                                            return (
                                                <tr key={cuota.id} className={`border-b border-brand transition-colors group ${ cuota.estado === 'Pagado' ? 'bg-primary/5 opacity-75' : 'hover:bg-primary/5' }`}>
                                                    <td className="px-4 py-2 text-center text-xs font-semibold text-brand-muted">{cuota.nro_cuota}</td>
                                                    <td className="px-4 py-2 text-xs font-medium text-brand-main">{new Date(cuota.fecha_vencimiento).toLocaleDateString()}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-brand-muted bg-transparent">
                                                        {Number(cuota.saldo_inicial).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-xs font-medium text-brand-muted">
                                                        {Number(cuota.amortizacion_capital).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-xs font-medium text-brand-muted">
                                                        {Number(cuota.interes).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-xs font-semibold text-brand-main bg-primary/5">
                                                        {Number(cuota.cuota_total).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                                    </td>
                                                    <td className={`px-4 py-2 text-right text-xs font-bold ${isMora ? 'text-red-500' : 'text-brand-muted/20'}`}>
                                                        {isMora ? Number(cuota.monto_mora).toLocaleString('es-BO', {minimumFractionDigits: 2}) : '0.00'}
                                                    </td>
                                                    <td className={`px-4 py-2 text-right text-sm font-bold bg-primary/10 ${isMora ? 'text-red-500' : 'text-brand-main'}`}>
                                                        {totalPagar.toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <TagEstadoCuota estado={cuota.estado} />
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-4 py-2 text-right">
                                                            {cuota.estado !== 'Pagado' ? (
                                                                <BotonPagar cuota={cuota} credito={credito} plan={planPagos} index={index} />
                                                            ) : (
                                                                <span className="text-[10px] text-primary font-bold uppercase transition-colors" title={`Pagado el ${new Date(cuota.fecha_pago).toLocaleDateString()}`}>
                                                                    ✓ Pagado
                                                                </span>
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-primary bg-card-fap/[0.04]">
                                            <td colSpan="3" className="px-4 py-3 text-right text-xs font-bold text-brand-main uppercase">Totales Proyectados</td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-brand-main font-mono">
                                                {Number(credito.monto_aprobado).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-brand-main font-mono">
                                                {planPagos.reduce((sum, p) => sum + Number(p.interes), 0).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-brand-main bg-card-fap/[0.02] font-mono">
                                                {planPagos.reduce((sum, p) => sum + Number(p.cuota_total), 0).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-red-600 font-mono">
                                                {planPagos.reduce((sum, p) => sum + Number(p.monto_mora || 0), 0).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-black text-brand-main bg-card-fap/[0.06] font-mono">
                                                {planPagos.reduce((sum, p) => sum + Number(p.cuota_total) + Number(p.monto_mora || 0), 0).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                                            </td>
                                            <td colSpan={isAdmin ? 2 : 1}></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <Wallet className="w-8 h-8 text-brand-muted mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium text-brand-muted">
                                    {credito.estado === 'Solicitado' 
                                        ? 'El plan de amortización se generará al aprobar la solicitud.' 
                                        : 'Plan de pagos no disponible.'}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* ──── Components ──── */

function DataCell({ label, value, highlight, subtext, progress }) {
    return (
        <div className={`px-5 py-4 ${highlight ? 'bg-primary/5 transition-colors' : ''}`}>
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">{label}</p>
            <p className={`font-black ${highlight ? 'text-xl text-brand-main' : 'text-base text-brand-main'}`}>{value}</p>
            {subtext && <p className="text-[11px] text-brand-muted mt-1 font-medium">{subtext}</p>}
            {typeof progress === 'number' && (
                <div className="mt-2 h-1 w-full bg-brand/30 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
            )}
        </div>
    );
}

function StatusTag({ estado }) {
    const cfg = {
        'Solicitado':   { bg: 'bg-amber-500/10',  text: 'text-amber-500',   ring: 'ring-amber-500/20',   dot: 'bg-amber-500' },
        'Desembolsado': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', ring: 'ring-emerald-500/20',  dot: 'bg-emerald-500' },
        'En Mora':      { bg: 'bg-red-500/10',     text: 'text-red-500',     ring: 'ring-red-500/20',      dot: 'bg-red-500' },
        'Pagado':       { bg: 'bg-primary/10',     text: 'text-primary',     ring: 'ring-primary/20',      dot: 'bg-primary' },
        'Rechazado':    { bg: 'bg-card-fap/10',      text: 'text-brand-muted', ring: 'ring-white/20',       dot: 'bg-card-fap/30' },
    };
    const s = cfg[estado] || cfg['Rechazado'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ring-1 ${s.bg} ${s.text} ${s.ring} shadow-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {estado}
        </span>
    );
}

function TagEstadoCuota({ estado }) {
    const cfg = {
        'Pagado':   'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
        'Mora':     'bg-red-500/10 text-red-500 ring-red-500/20',
        'Pendiente':'bg-primary/10 text-primary ring-primary/20',
    };
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${cfg[estado] || cfg['Pendiente']}`}>
            {estado}
        </span>
    );
}

/* ──── Acciones Modals ──── */

function EvaluarResolucionBtn({ credito }) {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Evaluar Op.
            </button>
            <AnimatePresence>{show && <EvaluarModal credito={credito} onClose={() => setShow(false)} />}</AnimatePresence>
        </>
    );
}

function EvaluarModal({ credito, onClose }) {
    const { data, setData, post, processing } = useForm({ estado: 'Aprobado', monto_aprobado: credito.monto_aprobado, observaciones: '' });
    const submit = (e) => { e.preventDefault(); post(route('creditos.evaluar', credito.id), { onSuccess: () => onClose() }); };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card-fap rounded-2xl shadow-2xl max-w-lg w-full border border-brand overflow-hidden">
                <div className="h-1 bg-primary" />
                <div className="px-6 py-4 border-b border-brand flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-brand-main">Resolución de Crédito</h4>
                        <p className="text-xs text-brand-muted mt-0.5">Op. #{credito.id}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"><XCircle className="w-5 h-5" /></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <label className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${data.estado === 'Aprobado' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-brand text-brand-muted hover:border-white/20'}`}>
                            <input type="radio" className="sr-only" checked={data.estado === 'Aprobado'} onChange={() => setData('estado', 'Aprobado')} />
                            <CheckCircle2 className="w-4 h-4" /> Aprobar
                        </label>
                        <label className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${data.estado === 'Rechazado' ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-brand text-brand-muted hover:border-white/20'}`}>
                            <input type="radio" className="sr-only" checked={data.estado === 'Rechazado'} onChange={() => setData('estado', 'Rechazado')} />
                            <XCircle className="w-4 h-4" /> Rechazar
                        </label>
                    </div>
                    {data.estado === 'Aprobado' && (
                        <div>
                            <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Monto Aprobado Final (Bs.)</label>
                            <input type="number" className="field-input font-bold"
                                value={data.monto_aprobado} onChange={e => setData('monto_aprobado', e.target.value)} />
                        </div>
                    )}
                    <div>
                        <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Notas de Resolución</label>
                        <textarea className="field-input resize-none"
                            rows="2" value={data.observaciones} onChange={e => setData('observaciones', e.target.value)} />
                    </div>
                    <div className="flex justify-end gap-3 pt-1">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-brand bg-card-fap/[0.04] rounded-lg text-sm font-semibold text-brand-muted hover:text-brand-main transition-colors">Cancelar</button>
                        <button type="submit" disabled={processing}
                            className={`px-6 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50 ${data.estado === 'Aprobado' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            {processing ? 'Procesando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function BotonPagar({ cuota, credito, plan, index }) {
    const [show, setShow] = useState(false);
    let puedePagar = true;
    if (index > 0) {
        const cuotaAnterior = plan[index - 1];
        if (cuotaAnterior.estado !== 'Pagado') puedePagar = false;
    }
    if (!puedePagar) {
        return <span className="text-[10px] text-brand-muted font-semibold" title="Debe cancelar cuotas anteriores primero">Pendiente previo</span>;
    }
    return (
        <>
            <button onClick={() => setShow(true)}
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all hover:scale-105 active:scale-100 bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm">
                Cobrar
            </button>
            <AnimatePresence>{show && <PagarModal cuota={cuota} credito={credito} onClose={() => setShow(false)} />}</AnimatePresence>
        </>
    );
}

function PagarModal({ cuota, credito, onClose }) {
    const { data, setData, post, processing } = useForm({ metodo_pago: 'Efectivo' });
    const totalPagar = Number(cuota.cuota_total) + Number(cuota.monto_mora || 0);
    const submit = (e) => { e.preventDefault(); post(route('creditos.registrar-pago', { credito: credito.id, cuota: cuota.id }), { onSuccess: () => onClose() }); };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card-fap rounded-2xl shadow-2xl max-w-md w-full border border-brand overflow-hidden">
                <div className="h-1 bg-emerald-500" />
                <div className="px-6 py-4 border-b border-brand flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-brand-main">Recibo de Ingreso</h4>
                        <p className="text-xs text-brand-muted mt-0.5">Amortización #{cuota.nro_cuota} · Op. {credito.id}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"><XCircle className="w-5 h-5" /></button>
                </div>
                <div className="px-6 py-6 border-b border-brand text-center bg-emerald-500/5">
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Monto a Recaudar</p>
                    <p className="text-3xl font-black text-brand-main">Bs. {totalPagar.toLocaleString('es-BO', {minimumFractionDigits: 2})}</p>
                    {cuota.monto_mora > 0 && <p className="text-[11px] text-red-500 font-bold mt-1.5">Incluye Bs. {Number(cuota.monto_mora).toLocaleString()} por mora</p>}
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">Medio de Captación</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Planilla', 'QR', 'Efectivo'].map(m => (
                                <button key={m} type="button" onClick={() => setData('metodo_pago', m)}
                                    className={`py-2.5 text-xs font-bold rounded-lg border-2 transition-all ${ data.metodo_pago === m ? 'bg-primary/10 border-primary text-brand-main' : 'bg-transparent border-brand text-brand-muted hover:border-white/20' }`}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-brand bg-card-fap/[0.04] rounded-xl text-sm font-semibold text-brand-muted hover:text-brand-main transition-colors">Cancelar</button>
                        <button type="submit" disabled={processing} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all">Procesar Ingreso</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function AnularCreditoBtn({ credito }) {
    const [show, setShow] = useState(false);
    return (
        <>
            <button onClick={() => setShow(true)} className="px-3 py-2 text-xs font-semibold border text-red-500 border-red-500/20 hover:bg-red-500/10 rounded-md transition-colors flex gap-2"><Trash2 className="w-3.5 h-3.5" /> Anular</button>
            <AnimatePresence>
                {show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card-fap border border-brand rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
                            <Trash2 className="w-8 h-8 text-red-500 mx-auto mb-3" />
                            <h4 className="font-bold text-brand-main mb-2">Revertir Operación #{credito.id}</h4>
                            <p className="text-sm text-brand-muted mb-6">Esta acción anulará el préstamo de Bs. {Number(credito.monto_aprobado).toLocaleString()} y borrará su plan. Es definitivo.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShow(false)} className="flex-1 py-2 text-sm border border-brand bg-card-fap/[0.04] font-semibold text-brand-muted rounded-md transition-colors">Cancelar</button>
                                <button onClick={() => { router.delete(route('creditos.destroy', credito.id)); setShow(false); }} className="flex-1 py-2 text-sm font-bold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Anular</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
