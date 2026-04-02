import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Wallet, Plus, Lock, Unlock, ArrowLeft, Eye, ChevronDown, ChevronUp,
    DollarSign, Banknote, Coins, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, Activity, Percent
} from 'lucide-react';

// ═══════════════════════════════════════════════════════
//  KPI CARD — ERP Fiori Style
// ═══════════════════════════════════════════════════════
function KpiCard({ label, value, icon, iconColorClass = 'text-primary', borderColorClass = 'border-t-primary', subtext }) {
    return (
        <div className={`bg-card-fap border border-brand border-t-4 ${borderColorClass} rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">{label}</p>
                    <h3 className="text-2xl font-black text-brand-main tabular-nums tracking-tight">{value}</h3>
                    {subtext && <p className="text-[11px] font-semibold text-brand-muted mt-1">{subtext}</p>}
                </div>
                <div className={`p-2.5 rounded-lg bg-brand/5 border border-brand/10 group-hover:scale-110 transition-transform ${iconColorClass}`}>
                    {icon}
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] transform group-hover:scale-150 group-hover:-rotate-12 transition-transform duration-500">
                {icon}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
//  STATUS TAG
// ═══════════════════════════════════════════════════════
function StatusTag({ estado }) {
    if (estado === 'abierta') {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 rounded-full border border-emerald-500/30 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Abierta
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 rounded-full border border-red-500/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Cerrada
        </span>
    );
}

// ═══════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function CajaIndex({ auth, cajas, cajaAbierta, denominaciones_bob, denominaciones_usd }) {
    const [showAbrirModal, setShowAbrirModal] = useState(false);
    const [showUsd, setShowUsd] = useState(false);

    // Form de apertura
    const { data, setData, post, processing, errors } = useForm({
        observaciones_apertura: '',
        denominaciones_bob: denominaciones_bob.map(d => ({ denominacion: d, cantidad: 0 })),
        denominaciones_usd: denominaciones_usd.map(d => ({ denominacion: d, cantidad: 0 })),
    });

    const totalBob = data.denominaciones_bob.reduce((sum, d) => sum + (d.denominacion * d.cantidad), 0);
    const totalUsd = data.denominaciones_usd.reduce((sum, d) => sum + (d.denominacion * d.cantidad), 0);

    const updateDenBob = (idx, cantidad) => {
        const updated = [...data.denominaciones_bob];
        updated[idx].cantidad = parseInt(cantidad) || 0;
        setData('denominaciones_bob', updated);
    };

    const updateDenUsd = (idx, cantidad) => {
        const updated = [...data.denominaciones_usd];
        updated[idx].cantidad = parseInt(cantidad) || 0;
        setData('denominaciones_usd', updated);
    };

    const handleAbrir = (e) => {
        e.preventDefault();
        post(route('admin.caja.abrir'));
    };

    const kpis = [
        {
            label: 'Estado del Sistema',
            value: cajaAbierta ? 'Operativa' : 'Suspendida',
            icon: cajaAbierta ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />,
            borderColorClass: cajaAbierta ? 'border-t-emerald-500' : 'border-t-red-500',
            iconColorClass: cajaAbierta ? 'text-emerald-500' : 'text-red-500',
            subtext: cajaAbierta ? `Sesión Activa #${cajaAbierta.id}` : 'Ninguna sesión activa'
        },
        {
            label: 'Saldo Inicial (Caja Abierta)',
            value: cajaAbierta ? `Bs. ${parseFloat(cajaAbierta.saldo_inicial_bob).toLocaleString('es-BO', {minimumFractionDigits:2})}` : 'Bs. 0.00',
            icon: <Wallet className="w-6 h-6" />,
            borderColorClass: 'border-t-primary',
            iconColorClass: 'text-primary'
        },
        {
            label: 'Sesiones Totales',
            value: cajas.total || cajas.data?.length || 0,
            icon: <Activity className="w-6 h-6" />,
            borderColorClass: 'border-t-blue-500',
            iconColorClass: 'text-blue-500'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            <Wallet className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Control de Caja General
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Central Contable ERP
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Caja General | Fapclas" />

            <div className="py-6 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ─── KPIs ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
                    </div>

                    {/* ─── ACCIÓN PRINCIPAL AL MEDIO LADO DERECHO ─── */}
                    <div className="flex justify-end">
                        {cajaAbierta ? (
                            <a
                                href={route('admin.caja.show', cajaAbierta.id)}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl flex items-center gap-3 hover:-translate-y-1 active:scale-95"
                            >
                                <Eye className="w-4 h-4" /> Ver Mi Sesión Activa
                            </a>
                        ) : (
                            <button
                                onClick={() => setShowAbrirModal(true)}
                                className="px-8 py-3 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl flex items-center gap-3 hover:-translate-y-1 active:scale-95"
                            >
                                <Plus className="w-4 h-4" /> Abrir Nueva Caja
                            </button>
                        )}
                    </div>

                    {/* ─── TABLA HISTORIAL FIORI ─── */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-brand flex items-center justify-between bg-card-fap/[0.02]">
                            <h3 className="text-[11px] font-black uppercase tracking-wider text-brand-main flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-primary" /> Historial de Sesiones de Caja
                            </h3>
                            <span className="text-[11px] text-brand-muted font-semibold whitespace-nowrap">
                                {cajas.data?.length || 0} registros
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-brand bg-card-fap/[0.04]">
                                        {[
                                            { label: 'Sesión', cls: 'w-16 text-left pl-6' },
                                            { label: 'Cajero / Operador', cls: 'text-left' },
                                            { label: 'Apertura', cls: 'text-left' },
                                            { label: 'Cierre', cls: 'text-left' },
                                            { label: 'Inicio BOB', cls: 'text-right' },
                                            { label: 'Ingresos', cls: 'text-right text-emerald-600' },
                                            { label: 'Egresos', cls: 'text-right text-red-500' },
                                            { label: 'Estado', cls: 'text-center' },
                                            { label: 'Acción', cls: 'text-center w-24' },
                                        ].map((h, i) => (
                                            <th key={i} className={`px-4 py-3 text-[10px] font-bold text-brand-main uppercase tracking-wider ${h.cls}`}>
                                                {h.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(cajas.data || []).length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-brand-muted">
                                                    <AlertTriangle className="w-10 h-10 text-gray-200" />
                                                    <p className="text-sm font-semibold">No se encontraron sesiones de caja</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : cajas.data.map((c, idx) => (
                                        <motion.tr 
                                            key={c.id} 
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="border-b border-brand hover:bg-card-fap/[0.03] transition-colors group bg-card-fap"
                                        >
                                            <td className="px-4 py-3 pl-6">
                                                <span className="font-mono font-bold text-brand-main text-xs">#{c.id}</span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-brand-main text-xs">{c.cajero?.name || '—'}</td>
                                            <td className="px-4 py-3 text-brand-muted text-xs font-medium">
                                                {new Date(c.fecha_apertura).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-4 py-3 text-brand-muted text-xs font-medium">
                                                {c.fecha_cierre ? new Date(c.fecha_cierre).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-black text-brand-main tabular-nums text-xs">
                                                    {parseFloat(c.saldo_inicial_bob).toLocaleString('es-BO', {minimumFractionDigits:2})}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-black text-emerald-600 tabular-nums text-xs">
                                                    +{parseFloat(c.total_ingresos_bob).toLocaleString('es-BO', {minimumFractionDigits:2})}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-black text-red-500 tabular-nums text-xs">
                                                    -{parseFloat(c.total_egresos_bob).toLocaleString('es-BO', {minimumFractionDigits:2})}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center"><StatusTag estado={c.estado} /></td>
                                            <td className="px-4 py-3 text-center">
                                                <a href={route('admin.caja.show', c.id)} className="p-1.5 inline-flex text-brand-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Ver Detalles">
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Footer (Paginación) -> En un futuro se podría añadir aquí */}
                    </div>

                    {/* ═══════ MODAL ABRIR CAJA (PREMIUM) ═══════ */}
                    {showAbrirModal && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                className="bg-card-fap border border-brand rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="h-1 bg-primary" />
                                <form onSubmit={handleAbrir}>
                                    <div className="p-6 border-b border-brand flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-black text-brand-main flex items-center gap-2">
                                                <Banknote className="w-5 h-5 text-emerald-600" /> Apertura de Caja — Arqueo Inicial
                                            </h3>
                                            <p className="text-xs text-brand-muted mt-1 font-medium">Ingrese la cantidad exacta de billetes y monedas disponibles en ventanilla.</p>
                                        </div>
                                        <button type="button" onClick={() => setShowAbrirModal(false)} className="p-1.5 text-brand-muted hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-6 bg-main">
                                        {/* Denominaciones BOB */}
                                        <div className="bg-card-fap p-5 rounded-2xl border border-brand shadow-sm">
                                            <h4 className="text-sm font-black text-brand-main flex items-center gap-2 mb-4">
                                                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-sm">Bs</span>
                                                Corte de Caja en Bolivianos (BOB)
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {data.denominaciones_bob.map((d, idx) => (
                                                    <div key={d.denominacion} className="bg-main border border-brand rounded-xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors focus-within:border-emerald-500">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-black text-brand-main">
                                                                {d.denominacion >= 1 ? `Bs ${d.denominacion}` : `${d.denominacion * 100} ctv`}
                                                            </span>
                                                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                                                                = Bs {(d.denominacion * d.cantidad).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={d.cantidad}
                                                            onChange={e => updateDenBob(idx, e.target.value)}
                                                            className="w-full bg-card-fap border-brand rounded-lg text-xs font-black text-center text-brand-main py-1.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-brand flex justify-end items-baseline gap-3">
                                                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Acumulado BOB:</span>
                                                <span className="text-xl font-black text-emerald-600">Bs {totalBob.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>

                                        {/* Toggle USD */}
                                        <button
                                            type="button"
                                            onClick={() => setShowUsd(!showUsd)}
                                            className="ml-2 flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                                        >
                                            <DollarSign className="w-4 h-4" />
                                            {showUsd ? 'Ocultar Corte Dólares (USD)' : 'Agregar Corte Dólares (USD)'}
                                            {showUsd ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                        </button>

                                        {/* Denominaciones USD */}
                                        {showUsd && (
                                            <div className="bg-card-fap p-5 rounded-2xl border border-blue-500/30 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                                <h4 className="text-sm font-black text-brand-main flex items-center gap-2 mb-4 relative z-10">
                                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-sm">$</span>
                                                    Corte de Caja en Dólares (USD)
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                                                    {data.denominaciones_usd.map((d, idx) => (
                                                        <div key={d.denominacion} className="bg-main border border-brand/60 rounded-xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus-within:border-blue-500 transition-colors">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-black text-brand-main">
                                                                    {d.denominacion >= 1 ? `$ ${d.denominacion}` : `${(d.denominacion * 100).toFixed(0)} ¢`}
                                                                </span>
                                                                <span className="text-[9px] font-black text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded-sm">
                                                                    = $ {(d.denominacion * d.cantidad).toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={d.cantidad}
                                                                onChange={e => updateDenUsd(idx, e.target.value)}
                                                                className="w-full bg-card-fap border-brand/60 rounded-lg text-xs font-black text-center text-brand-main py-1.5 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-blue-500/20 flex justify-end items-baseline gap-3 relative z-10">
                                                    <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Acumulado USD:</span>
                                                    <span className="text-xl font-black text-blue-600">$ {totalUsd.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Observaciones */}
                                        <div className="bg-card-fap p-5 rounded-2xl border border-brand shadow-sm">
                                            <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-wider">Observaciones Operativas</label>
                                            <textarea
                                                value={data.observaciones_apertura}
                                                onChange={e => setData('observaciones_apertura', e.target.value)}
                                                rows={2}
                                                className="w-full bg-main border-brand rounded-xl text-xs text-brand-main font-medium focus:border-primary focus:ring-primary transition-colors"
                                                placeholder="Ej: Saldo de apertura proveniente de Bóveda Central..."
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-brand flex items-center justify-end gap-3 bg-card-fap rounded-b-2xl">
                                        <button type="button" onClick={() => setShowAbrirModal(false)} className="px-6 py-2.5 bg-main border border-brand text-xs font-bold text-brand-muted rounded-xl hover:text-brand-main transition-colors">
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {processing ? (
                                                <><span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> Iniciando...</>
                                            ) : (
                                                <><Unlock className="w-4 h-4" /> Archivar & Iniciar Sesión</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
