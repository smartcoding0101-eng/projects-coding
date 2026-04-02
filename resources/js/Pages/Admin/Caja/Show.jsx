import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Wallet, ArrowLeftCircle, ArrowUpRight, ArrowDownRight, Unlock, Lock, Plus, X,
    DollarSign, Banknote, ChevronRight, ChevronDown, ChevronUp,
    AlertTriangle, CheckCircle2, BarChart3, Receipt, Landmark, Hash,
    CircleDollarSign, ShieldCheck, Clock, FileText, Filter
} from 'lucide-react';
import {
    Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* ──── DataCell (Reutilizable SAP-style) ──── */
function DataCell({ label, value, subtext, icon: Icon, accent }) {
    const accentColors = {
        blue: 'text-blue-500',
        green: 'text-emerald-500',
        red: 'text-red-500',
        primary: 'text-primary',
    };
    return (
        <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className={`w-3.5 h-3.5 ${accentColors[accent] || 'text-brand-muted'}`} />}
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{label}</p>
            </div>
            <p className={`font-black text-lg ${accentColors[accent] || 'text-brand-main'}`}>{value}</p>
            {subtext && <p className="text-[11px] text-brand-muted mt-0.5 font-medium">{subtext}</p>}
        </div>
    );
}

/* ──── Estado Badge SAP ──── */
function EstadoBadge({ estado }) {
    const cfg = {
        abierta: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', ring: 'ring-emerald-500/20', dot: 'bg-emerald-500', label: 'Abierta' },
        cerrada: { bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/20', dot: 'bg-red-500', label: 'Cerrada' },
    };
    const s = cfg[estado] || cfg.cerrada;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ring-1 ${s.bg} ${s.text} ${s.ring} shadow-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
}

export default function CajaShow({ auth, caja, movimientos, kpis, porCategoria, porMetodo, categorias, filters, denominaciones_bob, denominaciones_usd }) {
    const [showMovForm, setShowMovForm] = useState(false);
    const [showCierreModal, setShowCierreModal] = useState(false);
    const [showUsdCierre, setShowUsdCierre] = useState(false);

    // Form movimiento
    const movForm = useForm({
        tipo: 'ingreso',
        concepto: '',
        categoria: 'otro_ingreso',
        monto_bob: '',
        monto_usd: '',
        metodo_pago: 'efectivo',
        numero_comprobante: '',
        observaciones: '',
    });

    // Form cierre
    const cierreForm = useForm({
        observaciones_cierre: '',
        denominaciones_bob: denominaciones_bob.map(d => ({ denominacion: d, cantidad: 0 })),
        denominaciones_usd: denominaciones_usd.map(d => ({ denominacion: d, cantidad: 0 })),
    });

    const cierreTotalBob = cierreForm.data.denominaciones_bob.reduce((s, d) => s + d.denominacion * d.cantidad, 0);
    const cierreTotalUsd = cierreForm.data.denominaciones_usd.reduce((s, d) => s + d.denominacion * d.cantidad, 0);
    const diferenciaBob = Math.round((cierreTotalBob - kpis.saldo_esperado_bob) * 100) / 100;

    const handleMov = (e) => {
        e.preventDefault();
        movForm.post(route('admin.caja.movimiento', caja.id), { onSuccess: () => { movForm.reset(); setShowMovForm(false); } });
    };

    const handleCierre = (e) => {
        e.preventDefault();
        cierreForm.post(route('admin.caja.cerrar', caja.id));
    };

    const updateCierreBob = (idx, val) => {
        const u = [...cierreForm.data.denominaciones_bob];
        u[idx].cantidad = parseInt(val) || 0;
        cierreForm.setData('denominaciones_bob', u);
    };
    const updateCierreUsd = (idx, val) => {
        const u = [...cierreForm.data.denominaciones_usd];
        u[idx].cantidad = parseInt(val) || 0;
        cierreForm.setData('denominaciones_usd', u);
    };

    const categoriasIngreso = ['venta_ecommerce', 'pago_credito', 'aporte', 'retiro_banco', 'otro_ingreso'];
    const categoriasEgreso = ['desembolso', 'gasto_operativo', 'deposito_banco', 'otro_egreso'];
    const catActuales = movForm.data.tipo === 'ingreso' ? categoriasIngreso : categoriasEgreso;

    // Gráfico
    const doughnutData = {
        labels: porMetodo.map(p => ({ efectivo: 'Efectivo', qr_banco: 'QR / Banco', transferencia: 'Transferencia' }[p.metodo_pago] || p.metodo_pago)),
        datasets: [{
            data: porMetodo.map(p => parseFloat(p.total_bob)),
            backgroundColor: ['rgba(16,185,129,0.7)', 'rgba(59,130,246,0.7)', 'rgba(168,85,247,0.7)'],
            borderWidth: 0
        }]
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.caja.index')} className="text-brand-muted hover:text-brand-main transition-colors">
                            <ArrowLeftCircle className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2 text-sm">
                            <Link href={route('admin.caja.index')} className="text-brand-muted hover:text-primary font-semibold transition-colors">Caja General</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-brand" />
                            <span className="font-bold text-brand-main">Sesión #{caja.id}</span>
                        </div>
                    </div>
                    <EstadoBadge estado={caja.estado} />
                </div>
            }
        >
            <Head title={`Caja #${caja.id} | FAPCLAS`} />

            <div className="py-6 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* ══════════ TOOLBAR HEADER (SAP-style) ══════════ */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="h-0.5 bg-primary" />
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 pl-1">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Wallet className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-extrabold text-brand-main leading-tight">Expediente de Caja</h2>
                                    <p className="text-[11px] text-brand-muted font-medium mt-0.5">
                                        Cajero: {caja.cajero?.name || 'N/D'} · Apertura: {new Date(caja.fecha_apertura).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        {caja.fecha_cierre && ` · Cierre: ${new Date(caja.fecha_cierre).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {caja.estado === 'abierta' && (
                                    <>
                                        <button onClick={() => setShowMovForm(true)}
                                            className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-md shadow-sm hover:scale-105 active:scale-100 transition-all flex items-center gap-2">
                                            <Plus className="w-3.5 h-3.5" /> Movimiento
                                        </button>
                                        <button onClick={() => setShowCierreModal(true)}
                                            className="px-4 py-2 text-xs font-semibold text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5" /> Cerrar Caja
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ══════════ SUMMARY DATA (SAP DataCells) ══════════ */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="h-0.5 bg-primary" />
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand">
                            <DataCell icon={Landmark} label="Saldo Apertura" accent="blue"
                                value={`Bs ${kpis.saldo_inicial_bob.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                subtext={kpis.saldo_inicial_usd > 0 ? `$ ${kpis.saldo_inicial_usd.toLocaleString()}` : null} />
                            <DataCell icon={ArrowUpRight} label="Total Ingresos" accent="green"
                                value={`+Bs ${kpis.total_ingresos_bob.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                subtext={kpis.total_ingresos_usd > 0 ? `+$ ${kpis.total_ingresos_usd.toLocaleString()}` : null} />
                            <DataCell icon={ArrowDownRight} label="Total Egresos" accent="red"
                                value={`-Bs ${kpis.total_egresos_bob.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                subtext={kpis.total_egresos_usd > 0 ? `-$ ${kpis.total_egresos_usd.toLocaleString()}` : null} />
                            <div className="px-5 py-4 bg-primary/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <CircleDollarSign className="w-3.5 h-3.5 text-primary" />
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Saldo Esperado</p>
                                </div>
                                <p className="font-black text-xl text-brand-main">Bs {kpis.saldo_esperado_bob.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                {kpis.saldo_esperado_usd > 0 && <p className="text-[11px] text-brand-muted mt-0.5 font-medium">$ {kpis.saldo_esperado_usd.toLocaleString()}</p>}
                            </div>
                        </div>

                        {/* Observaciones de apertura */}
                        {caja.observaciones_apertura && (
                            <div className="px-5 py-3 border-t border-amber-500/30 bg-amber-500/10 flex items-start gap-2">
                                <FileText className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Obs. Apertura</p>
                                    <p className="text-xs text-brand-main">{caja.observaciones_apertura}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ══════════ CIERRE INFO (si cerrada) ══════════ */}
                    {caja.estado === 'cerrada' && kpis.saldo_final_bob !== null && (
                        <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                            <div className="h-0.5 bg-red-500" />
                            <div className="px-5 py-4 border-b border-brand flex items-center justify-between bg-card-fap/[0.04]">
                                <h3 className="text-sm font-extrabold text-brand-main flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-primary" /> Resultado del Arqueo de Cierre
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand">
                                <DataCell icon={Landmark} label="Conteo Final BOB" accent="blue"
                                    value={`Bs ${parseFloat(kpis.saldo_final_bob).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                                <DataCell icon={CircleDollarSign} label="Esperado BOB" accent="primary"
                                    value={`Bs ${kpis.saldo_esperado_bob.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                                {(() => {
                                    const diff = Math.round((parseFloat(kpis.saldo_final_bob) - kpis.saldo_esperado_bob) * 100) / 100;
                                    return (
                                        <DataCell
                                            icon={diff === 0 ? CheckCircle2 : AlertTriangle}
                                            label="Diferencia"
                                            accent={diff === 0 ? 'green' : diff > 0 ? 'blue' : 'red'}
                                            value={diff === 0 ? 'CUADRE PERFECTO ✓' : (diff > 0 ? `+Bs ${diff.toFixed(2)} (SOBRANTE)` : `Bs ${diff.toFixed(2)} (FALTANTE)`)}
                                        />
                                    );
                                })()}
                                {kpis.saldo_final_usd !== null && parseFloat(kpis.saldo_final_usd) > 0 && (
                                    <DataCell icon={DollarSign} label="Conteo Final USD" accent="blue"
                                        value={`$ ${parseFloat(kpis.saldo_final_usd).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                                )}
                            </div>
                            {caja.observaciones_cierre && (
                                <div className="px-5 py-3 border-t border-brand bg-red-500/5 flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Obs. Cierre</p>
                                        <p className="text-xs text-brand-main">{caja.observaciones_cierre}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══════════ MOVIMIENTOS TABLE + GRÁFICO ══════════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                        {/* Gráfico lateral */}
                        {porMetodo.length > 0 && (
                            <div className="lg:col-span-1 bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                                <div className="h-0.5 bg-primary" />
                                <div className="px-5 py-4 border-b border-brand bg-card-fap/[0.04]">
                                    <h3 className="text-sm font-extrabold text-brand-main flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-primary" /> Distribución
                                    </h3>
                                    <span className="text-[11px] text-brand-muted font-semibold">Por método de pago</span>
                                </div>
                                <div className="p-5">
                                    <div className="max-w-[180px] mx-auto">
                                        <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' }, padding: 12 } } } }} />
                                    </div>
                                </div>
                                {/* Desglose por categoría */}
                                {porCategoria.length > 0 && (
                                    <div className="px-5 pb-5 space-y-2">
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider border-t border-brand pt-4">Desglose por Categoría</p>
                                        {porCategoria.map((pc, i) => (
                                            <div key={i} className="flex items-center justify-between text-[11px]">
                                                <span className="text-brand-muted font-medium truncate max-w-[120px]">{categorias[pc.categoria] || pc.categoria}</span>
                                                <span className={`font-black ${pc.tipo === 'ingreso' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {pc.tipo === 'ingreso' ? '+' : '-'}Bs {parseFloat(pc.total_bob).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tabla de Movimientos */}
                        <div className={`${porMetodo.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col`}>
                            <div className="h-0.5 bg-primary" />
                            <div className="px-5 py-4 border-b border-brand flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-fap/[0.04]">
                                <h3 className="text-sm font-extrabold text-brand-main flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-primary" /> Movimientos de Caja
                                </h3>
                                
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                                        <select 
                                            value={filters.categoria || ''} 
                                            onChange={e => router.get(route('admin.caja.show', caja.id), { categoria: e.target.value }, { preserveState: true })}
                                            className="pl-9 pr-8 py-1.5 bg-main border-brand rounded-lg text-[11px] font-bold text-brand-main focus:ring-primary h-8"
                                        >
                                            <option value="">TODAS LAS CATEGORÍAS</option>
                                            {Object.entries(categorias).map(([k, v]) => (
                                                <option key={k} value={k}>{v.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <span className="text-[11px] text-brand-muted font-semibold">{movimientos.length} registro(s)</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto max-h-[450px]">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-brand bg-card-fap/[0.04]">
                                            <th className="text-center px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-12">Nº</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Hora</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Concepto</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Categoría</th>
                                            <th className="text-center px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Método</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Monto BOB</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Monto USD</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimientos.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-10 text-center">
                                                    <Wallet className="w-8 h-8 text-brand-muted mx-auto mb-3 opacity-20" />
                                                    <p className="text-sm font-medium text-brand-muted">Sin movimientos registrados aún.</p>
                                                    {caja.estado === 'abierta' && (
                                                        <p className="text-[11px] text-brand-muted mt-1">Presione «+ Movimiento» para agregar entradas y salidas.</p>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : movimientos.map((m, idx) => (
                                            <tr key={m.id} className={`border-b border-brand transition-colors group ${m.tipo === 'ingreso' ? 'hover:bg-emerald-500/5' : 'hover:bg-red-500/5'}`}>
                                                <td className="px-4 py-2 text-center text-xs font-semibold text-brand-muted">{idx + 1}</td>
                                                <td className="px-4 py-2 text-xs font-medium text-brand-main">
                                                    {new Date(m.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="text-xs font-semibold text-brand-main truncate max-w-[200px]">{m.concepto}</div>
                                                    {m.numero_comprobante && <div className="text-[9px] text-brand-muted font-medium">Comp: {m.numero_comprobante}</div>}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 bg-primary/10 text-primary ring-primary/20">
                                                        {categorias[m.categoria] || m.categoria}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${
                                                        m.metodo_pago === 'efectivo' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' :
                                                        m.metodo_pago === 'qr_banco' ? 'bg-blue-500/10 text-blue-500 ring-blue-500/20' :
                                                        'bg-purple-500/10 text-purple-500 ring-purple-500/20'
                                                    }`}>
                                                        {m.metodo_pago === 'qr_banco' ? 'QR/Banco' : m.metodo_pago}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {parseFloat(m.monto_bob) > 0 ? (
                                                        <span className={`text-sm font-bold ${m.tipo === 'ingreso' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {m.tipo === 'ingreso' ? '+' : '-'}Bs {parseFloat(m.monto_bob).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="text-brand-muted/20 text-xs">—</span>}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {parseFloat(m.monto_usd) > 0 ? (
                                                        <span className={`text-sm font-bold ${m.tipo === 'ingreso' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {m.tipo === 'ingreso' ? '+' : '-'}$ {parseFloat(m.monto_usd).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="text-brand-muted/20 text-xs">—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {movimientos.length > 0 && (
                                        <tfoot>
                                            <tr className="border-t-2 border-primary bg-card-fap/[0.04]">
                                                <td colSpan={5} className="px-4 py-3 text-right text-xs font-bold text-brand-main uppercase">Totales del Período</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="text-xs font-bold text-emerald-500">+Bs {kpis.total_ingresos_bob.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                    <div className="text-xs font-bold text-red-500">-Bs {kpis.total_egresos_bob.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {(kpis.total_ingresos_usd > 0 || kpis.total_egresos_usd > 0) ? (
                                                        <>
                                                            <div className="text-xs font-bold text-emerald-500">+$ {kpis.total_ingresos_usd.toLocaleString()}</div>
                                                            <div className="text-xs font-bold text-red-500">-$ {kpis.total_egresos_usd.toLocaleString()}</div>
                                                        </>
                                                    ) : <span className="text-brand-muted/20 text-xs">—</span>}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ══════════ MODAL: Registrar Movimiento (SAP-style) ══════════ */}
            {showMovForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card-fap rounded-2xl shadow-2xl max-w-lg w-full border border-brand overflow-hidden">
                        <div className="h-1 bg-primary" />
                        <div className="px-6 py-4 border-b border-brand flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-brand-main">Nuevo Movimiento de Caja</h4>
                                <p className="text-xs text-brand-muted mt-0.5">Sesión #{caja.id}</p>
                            </div>
                            <button onClick={() => setShowMovForm(false)} className="p-1.5 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleMov} className="p-6 space-y-4">
                            {/* Tipo selector */}
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${
                                    movForm.data.tipo === 'ingreso' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-brand text-brand-muted hover:border-white/20'
                                }`}>
                                    <input type="radio" className="sr-only" checked={movForm.data.tipo === 'ingreso'} onChange={() => { movForm.setData('tipo', 'ingreso'); movForm.setData('categoria', 'otro_ingreso'); }} />
                                    <ArrowUpRight className="w-4 h-4" /> Ingreso
                                </label>
                                <label className={`flex items-center justify-center gap-2 py-3 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${
                                    movForm.data.tipo === 'egreso' ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-brand text-brand-muted hover:border-white/20'
                                }`}>
                                    <input type="radio" className="sr-only" checked={movForm.data.tipo === 'egreso'} onChange={() => { movForm.setData('tipo', 'egreso'); movForm.setData('categoria', 'otro_egreso'); }} />
                                    <ArrowDownRight className="w-4 h-4" /> Egreso
                                </label>
                            </div>
                            {/* Concepto */}
                            <div>
                                <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Concepto *</label>
                                <input type="text" value={movForm.data.concepto} onChange={e => movForm.setData('concepto', e.target.value)}
                                    className="field-input font-bold" placeholder="Ej: Pago de servicios básicos" required />
                            </div>
                            {/* Categoría + Método */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Categoría *</label>
                                    <select value={movForm.data.categoria} onChange={e => movForm.setData('categoria', e.target.value)} className="field-input font-bold">
                                        {catActuales.map(c => <option key={c} value={c}>{categorias[c] || c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Método *</label>
                                    <select value={movForm.data.metodo_pago} onChange={e => movForm.setData('metodo_pago', e.target.value)} className="field-input font-bold">
                                        <option value="efectivo">Efectivo</option>
                                        <option value="qr_banco">QR / Banco</option>
                                        <option value="transferencia">Transferencia</option>
                                    </select>
                                </div>
                            </div>
                            {/* Montos */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Monto BOB</label>
                                    <input type="number" step="0.01" min="0" value={movForm.data.monto_bob} onChange={e => movForm.setData('monto_bob', e.target.value)}
                                        className="field-input font-bold" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Monto USD</label>
                                    <input type="number" step="0.01" min="0" value={movForm.data.monto_usd} onChange={e => movForm.setData('monto_usd', e.target.value)}
                                        className="field-input font-bold" placeholder="0.00" />
                                </div>
                            </div>
                            {/* Comprobante + Obs */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Nro Comprobante</label>
                                    <input type="text" value={movForm.data.numero_comprobante} onChange={e => movForm.setData('numero_comprobante', e.target.value)}
                                        className="field-input font-bold" placeholder="Opcional" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Observaciones</label>
                                    <input type="text" value={movForm.data.observaciones} onChange={e => movForm.setData('observaciones', e.target.value)}
                                        className="field-input font-bold" placeholder="Opcional" />
                                </div>
                            </div>
                            {/* Botones */}
                            <div className="flex justify-end gap-3 pt-1">
                                <button type="button" onClick={() => setShowMovForm(false)} className="px-5 py-2.5 border border-brand bg-card-fap/[0.04] rounded-lg text-sm font-semibold text-brand-muted hover:text-brand-main transition-colors">Cancelar</button>
                                <button type="submit" disabled={movForm.processing}
                                    className={`px-6 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50 ${
                                        movForm.data.tipo === 'ingreso' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}>
                                    {movForm.processing ? 'Procesando...' : 'Confirmar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Cerrar Caja ══════════ */}
            {showCierreModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card-fap rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-brand overflow-hidden">
                        <form onSubmit={handleCierre}>
                            <div className="h-1 bg-red-500" />
                            <div className="px-6 py-4 border-b border-brand flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-brand-main flex items-center gap-2"><Lock className="w-4 h-4 text-red-500" /> Cierre de Caja — Arqueo Final</h4>
                                    <p className="text-xs text-brand-muted mt-0.5">Cuente físicamente los billetes y monedas.</p>
                                </div>
                                <button type="button" onClick={() => setShowCierreModal(false)} className="p-1.5 text-brand-muted hover:text-red-500 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* BOB */}
                                <div>
                                    <h4 className="text-sm font-extrabold text-brand-main flex items-center gap-2 mb-4">
                                        <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">Bs</span>
                                        Conteo Bolivianos (BOB)
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {cierreForm.data.denominaciones_bob.map((d, idx) => (
                                            <div key={d.denominacion} className="bg-main border border-brand rounded-xl p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-black text-brand-main">{d.denominacion >= 1 ? `Bs ${d.denominacion}` : `${d.denominacion * 100} ctv`}</span>
                                                    <span className="text-[9px] font-bold text-emerald-600">= Bs {(d.denominacion * d.cantidad).toFixed(2)}</span>
                                                </div>
                                                <input type="number" min="0" value={d.cantidad} onChange={e => updateCierreBob(idx, e.target.value)}
                                                    className="w-full bg-card-fap border-brand rounded-lg text-xs font-bold text-center text-brand-main py-1.5" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-brand-muted">Esperado: <strong>Bs {kpis.saldo_esperado_bob.toLocaleString()}</strong></span>
                                        <span className="text-sm font-black text-emerald-700">Conteo: Bs {cierreTotalBob.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {diferenciaBob !== 0 && (
                                        <div className={`mt-2 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-black ${diferenciaBob > 0 ? 'bg-blue-500/10 text-blue-600' : 'bg-red-500/10 text-red-500'}`}>
                                            <AlertTriangle className="w-4 h-4" />
                                            {diferenciaBob > 0 ? `SOBRANTE: +Bs ${diferenciaBob.toFixed(2)}` : `FALTANTE: Bs ${diferenciaBob.toFixed(2)}`}
                                        </div>
                                    )}
                                    {diferenciaBob === 0 && cierreTotalBob > 0 && (
                                        <div className="mt-2 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-black bg-emerald-500/10 text-emerald-600">
                                            <CheckCircle2 className="w-4 h-4" /> CUADRE PERFECTO ✓
                                        </div>
                                    )}
                                </div>

                                {/* USD Toggle */}
                                <button type="button" onClick={() => setShowUsdCierre(!showUsdCierre)}
                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    <DollarSign className="w-4 h-4" />
                                    {showUsdCierre ? 'Ocultar Dólares' : 'Agregar Conteo en Dólares (USD)'}
                                    {showUsdCierre ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                {showUsdCierre && (
                                    <div>
                                        <h4 className="text-sm font-extrabold text-brand-main flex items-center gap-2 mb-4">
                                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">$</span>
                                            Conteo Dólares (USD)
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {cierreForm.data.denominaciones_usd.map((d, idx) => (
                                                <div key={d.denominacion} className="bg-main border border-blue-500/30 rounded-xl p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-black text-brand-main">{d.denominacion >= 1 ? `$ ${d.denominacion}` : `${(d.denominacion * 100).toFixed(0)} ¢`}</span>
                                                        <span className="text-[9px] font-bold text-blue-600">= $ {(d.denominacion * d.cantidad).toFixed(2)}</span>
                                                    </div>
                                                    <input type="number" min="0" value={d.cantidad} onChange={e => updateCierreUsd(idx, e.target.value)}
                                                        className="w-full bg-card-fap border-brand rounded-lg text-xs font-bold text-center text-brand-main py-1.5" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 text-right text-sm font-black text-blue-700">
                                            Conteo USD: $ {cierreTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">Observaciones de Cierre</label>
                                    <textarea value={cierreForm.data.observaciones_cierre} onChange={e => cierreForm.setData('observaciones_cierre', e.target.value)}
                                        rows={2} className="field-input resize-none" placeholder="Notas del cierre..." />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-brand flex items-center justify-end gap-3">
                                <button type="button" onClick={() => setShowCierreModal(false)} className="px-5 py-2.5 border border-brand bg-card-fap/[0.04] rounded-lg text-sm font-semibold text-brand-muted hover:text-brand-main transition-colors">Cancelar</button>
                                <button type="submit" disabled={cierreForm.processing}
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                                    {cierreForm.processing ? 'Cerrando...' : <><Lock className="w-3.5 h-3.5" /> Confirmar Cierre</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
