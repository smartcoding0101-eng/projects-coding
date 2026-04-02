import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Wallet, Plus, Lock, Unlock, ArrowLeft, Eye, ChevronDown, ChevronUp,
    DollarSign, Banknote, Coins, Clock, CheckCircle2, AlertTriangle
} from 'lucide-react';

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

    const estadoBadge = (estado) => {
        if (estado === 'abierta') return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-600 rounded-full border border-emerald-500/30">
                <Unlock className="w-3 h-3" /> Abierta
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase bg-red-500/15 text-red-500 rounded-full border border-red-500/30">
                <Lock className="w-3 h-3" /> Cerrada
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-emerald-600" />
                        <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                            Módulo de Caja General
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Caja General | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Banner + Acción */}
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card-fap border border-brand p-5 rounded-2xl shadow-sm">
                        <div>
                            <h3 className="text-base font-extrabold text-brand-main mb-1">Control de Flujo de Efectivo Institucional</h3>
                            <p className="text-xs text-brand-muted max-w-2xl leading-relaxed">
                                Gestione apertura y cierre de caja con corte de denominaciones en Bolivianos (BOB) y Dólares (USD).
                                Registre ingresos y egresos por diferentes conceptos y métodos de pago.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            {cajaAbierta ? (
                                <a
                                    href={route('admin.caja.show', cajaAbierta.id)}
                                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" /> Ver Mi Caja Abierta
                                </a>
                            ) : (
                                <button
                                    onClick={() => setShowAbrirModal(true)}
                                    className="px-5 py-2.5 bg-brand-main text-white rounded-xl text-xs font-bold hover:bg-brand-hover transition-all shadow-md flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Abrir Nueva Caja
                                </button>
                            )}
                        </div>
                    </div>

                    {/* KPIs Globales rápidos */}
                    {cajaAbierta && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <Unlock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-emerald-700">CAJA ACTIVA — Sesión #{cajaAbierta.id}</p>
                                <p className="text-xs text-brand-muted">
                                    Abierta el {new Date(cajaAbierta.fecha_apertura).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    &nbsp;| Saldo Inicial: <strong>Bs {parseFloat(cajaAbierta.saldo_inicial_bob).toLocaleString()}</strong>
                                    {parseFloat(cajaAbierta.saldo_inicial_usd) > 0 && ` / $ ${parseFloat(cajaAbierta.saldo_inicial_usd).toLocaleString()}`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Historial de Cajas */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-brand bg-main">
                            <h3 className="text-xs font-black uppercase text-brand-main flex items-center gap-2">
                                <Clock className="w-4 h-4 text-brand-muted" /> Historial de Sesiones de Caja
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px] text-left">
                                <thead className="bg-main text-brand-muted font-black uppercase border-b border-brand">
                                    <tr>
                                        <th className="p-3">#</th>
                                        <th className="p-3">Cajero</th>
                                        <th className="p-3">Apertura</th>
                                        <th className="p-3">Cierre</th>
                                        <th className="p-3 text-right">Inicio BOB</th>
                                        <th className="p-3 text-right">Ingresos</th>
                                        <th className="p-3 text-right">Egresos</th>
                                        <th className="p-3 text-center">Movs</th>
                                        <th className="p-3 text-center">Estado</th>
                                        <th className="p-3 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand/30">
                                    {cajas.data.length === 0 ? (
                                        <tr><td colSpan={10} className="p-12 text-center text-brand-muted font-bold">No hay sesiones de caja registradas.</td></tr>
                                    ) : cajas.data.map(c => (
                                        <tr key={c.id} className="hover:bg-brand/5 transition-colors">
                                            <td className="p-3 font-black text-brand-main">{c.id}</td>
                                            <td className="p-3 font-bold text-brand-main">{c.cajero?.name || '—'}</td>
                                            <td className="p-3 text-brand-muted">{new Date(c.fecha_apertura).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                                            <td className="p-3 text-brand-muted">{c.fecha_cierre ? new Date(c.fecha_cierre).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                                            <td className="p-3 text-right font-bold">Bs {parseFloat(c.saldo_inicial_bob).toLocaleString()}</td>
                                            <td className="p-3 text-right text-emerald-600 font-bold">+Bs {parseFloat(c.total_ingresos_bob).toLocaleString()}</td>
                                            <td className="p-3 text-right text-red-500 font-bold">-Bs {parseFloat(c.total_egresos_bob).toLocaleString()}</td>
                                            <td className="p-3 text-center font-bold">{c.num_movimientos}</td>
                                            <td className="p-3 text-center">{estadoBadge(c.estado)}</td>
                                            <td className="p-3 text-center">
                                                <a href={route('admin.caja.show', c.id)} className="text-primary hover:underline font-bold text-[10px]">Ver Detalle</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══════ MODAL ABRIR CAJA ═══════ */}
                    {showAbrirModal && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAbrirModal(false)}>
                            <div className="bg-card-fap border border-brand rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                <form onSubmit={handleAbrir}>
                                    <div className="p-6 border-b border-brand">
                                        <h3 className="text-lg font-black text-brand-main flex items-center gap-2">
                                            <Banknote className="w-5 h-5 text-emerald-600" /> Apertura de Caja — Conteo Inicial
                                        </h3>
                                        <p className="text-xs text-brand-muted mt-1">Ingrese la cantidad de billetes y monedas.</p>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Denominaciones BOB */}
                                        <div>
                                            <h4 className="text-sm font-black text-brand-main flex items-center gap-2 mb-4">
                                                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">Bs</span>
                                                Bolivianos (BOB)
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {data.denominaciones_bob.map((d, idx) => (
                                                    <div key={d.denominacion} className="bg-main border border-brand rounded-xl p-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-black text-brand-main">
                                                                {d.denominacion >= 1 ? `Bs ${d.denominacion}` : `${d.denominacion * 100} ctv`}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-emerald-600">
                                                                = Bs {(d.denominacion * d.cantidad).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={d.cantidad}
                                                            onChange={e => updateDenBob(idx, e.target.value)}
                                                            className="w-full bg-card-fap border-brand rounded-lg text-xs font-bold text-center text-brand-main py-1.5"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 text-right text-sm font-black text-emerald-700">
                                                Total BOB: <span className="text-lg">Bs {totalBob.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </div>

                                        {/* Toggle USD */}
                                        <button
                                            type="button"
                                            onClick={() => setShowUsd(!showUsd)}
                                            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <DollarSign className="w-4 h-4" />
                                            {showUsd ? 'Ocultar Dólares (USD)' : 'Agregar Conteo en Dólares (USD)'}
                                            {showUsd ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                        </button>

                                        {/* Denominaciones USD */}
                                        {showUsd && (
                                            <div>
                                                <h4 className="text-sm font-black text-brand-main flex items-center gap-2 mb-4">
                                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">$</span>
                                                    Dólares Americanos (USD)
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {data.denominaciones_usd.map((d, idx) => (
                                                        <div key={d.denominacion} className="bg-main border border-blue-500/30 rounded-xl p-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-black text-brand-main">
                                                                    {d.denominacion >= 1 ? `$ ${d.denominacion}` : `${(d.denominacion * 100).toFixed(0)} ¢`}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-blue-600">
                                                                    = $ {(d.denominacion * d.cantidad).toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={d.cantidad}
                                                                onChange={e => updateDenUsd(idx, e.target.value)}
                                                                className="w-full bg-card-fap border-brand rounded-lg text-xs font-bold text-center text-brand-main py-1.5"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 text-right text-sm font-black text-blue-700">
                                                    Total USD: <span className="text-lg">$ {totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Observaciones */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-wider">Observaciones de Apertura</label>
                                            <textarea
                                                value={data.observaciones_apertura}
                                                onChange={e => setData('observaciones_apertura', e.target.value)}
                                                rows={2}
                                                className="w-full bg-main border-brand rounded-xl text-xs text-brand-main"
                                                placeholder="Notas opcionales..."
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-brand flex items-center justify-between">
                                        <button type="button" onClick={() => setShowAbrirModal(false)} className="text-xs font-bold text-brand-muted hover:text-brand-main transition-colors">
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {processing ? (
                                                <><span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> Procesando...</>
                                            ) : (
                                                <><Unlock className="w-4 h-4" /> Abrir Caja con Bs {totalBob.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
