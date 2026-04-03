import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Download, UserCircle, Briefcase, FileText, Filter, Calendar, Search, TrendingUp, TrendingDown, Scale, Hash, X, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KpiCard = ({ icon: Icon, label, value, color, prefix = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.35 }}
        className="bg-card-fap border border-brand rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow"
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">{label}</p>
            <p className="text-lg font-black text-brand-main tabular-nums truncate">
                {prefix}{typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
            </p>
        </div>
    </motion.div>
);

const etiquetasTipo = {
    aporte: { label: 'Aporte', color: 'bg-blue-50 text-blue-700 ring-blue-200' },
    venta_ecommerce: { label: 'Venta E-Commerce', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
    desembolso_credito: { label: 'Desembolso', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
    pago_cuota: { label: 'Pago Cuota', color: 'bg-violet-50 text-violet-700 ring-violet-200' },
    mora: { label: 'Mora', color: 'bg-red-50 text-red-700 ring-red-200' },
    interes_ganado: { label: 'Interés', color: 'bg-cyan-50 text-cyan-700 ring-cyan-200' },
    ajuste: { label: 'Ajuste', color: 'bg-gray-50 text-gray-700 ring-gray-200' },
};

export default function Index({ auth, asientos, totales, filtros, tiposTransaccion, socios }) {
    const [showFilters, setShowFilters] = useState(
        !!(filtros?.fecha_inicio || filtros?.fecha_fin || filtros?.socio_id || filtros?.tipo)
    );
    const [form, setForm] = useState({
        fecha_inicio: filtros?.fecha_inicio || '',
        fecha_fin: filtros?.fecha_fin || '',
        socio_id: filtros?.socio_id || '',
        tipo: filtros?.tipo || '',
    });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const notifyExport = (type) => {
        setNotification({
            title: `Exportación de ${type} Iniciada`,
            message: `Tu archivo se está descargando satisfactoriamente.`,
            type: 'success'
        });
    };

    const handleFilter = (e) => {
        e?.preventDefault();
        router.get(route('libro-diario.index'), Object.fromEntries(
            Object.entries(form).filter(([_, v]) => v !== '')
        ), { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        const cleared = { fecha_inicio: '', fecha_fin: '', socio_id: '', tipo: '' };
        setForm(cleared);
        router.get(route('libro-diario.index'), {}, { preserveState: true, replace: true });
    };

    const hasFilters = Object.values(form).some(v => v !== '');

    // Totales de la página visible
    const paginaDebe = asientos.data.reduce((s, a) => s + Number(a.ingreso || 0), 0);
    const paginaHaber = asientos.data.reduce((s, a) => s + Number(a.egreso || 0), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    {/* Alerta de Éxito Centrada */}
                    <AnimatePresence>
                        {notification && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: -20, x: '-50%' }}
                                className="fixed top-8 left-1/2 z-[100] w-full max-w-md px-4"
                            >
                                <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.2)] rounded-2xl p-5 flex items-center gap-5 backdrop-blur-xl">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <CheckCircle2 className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-800 dark:text-white mb-1">{notification.title}</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setNotification(null)} 
                                        className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg border border-primary/20">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col border-r border-brand/50 pr-4 mr-1">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Libro Diario Mayor
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Registro Central Contable
                            </span>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 bg-card-fap border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 ${
                                showFilters ? 'border-primary text-primary bg-primary/5' : 'border-brand text-brand-main hover:border-primary/30 hover:text-primary'
                            }`}
                        >
                            <Filter className="w-3.5 h-3.5" /> Filtros
                            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                        </button>
                        <a
                            href={route('libro-diario.pdf', Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== '')))}
                            target="_blank"
                            onClick={() => notifyExport('PDF')}
                            className="px-4 py-2 bg-card-fap text-red-600 border border-red-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 group"
                        >
                            <Download className="w-3.5 h-3.5 group-hover:animate-bounce" /> PDF
                        </a>
                        <a
                            href={route('libro-diario.excel', Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== '')))}
                            onClick={() => notifyExport('Excel')}
                            className="px-4 py-2 bg-card-fap text-emerald-600 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 group"
                        >
                            <Download className="w-3.5 h-3.5 group-hover:animate-bounce" /> Excel
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Libro Diario | Fapclas" />

            <div className="py-6 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

                    {/* ══════════ KPIs ══════════ */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard icon={TrendingUp} label="Total Debe (Ingresos)" value={totales.debe} prefix="Bs " color="bg-emerald-50 text-emerald-600 border border-emerald-200" delay={0} />
                        <KpiCard icon={TrendingDown} label="Total Haber (Egresos)" value={totales.haber} prefix="Bs " color="bg-red-50 text-red-500 border border-red-200" delay={0.05} />
                        <KpiCard icon={Scale} label="Balance Neto" value={totales.balance} prefix="Bs " color={`${totales.balance >= 0 ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`} delay={0.1} />
                        <KpiCard icon={Hash} label="Asientos Registrados" value={totales.asientos} prefix="" color="bg-violet-50 text-violet-600 border border-violet-200" delay={0.15} />
                    </div>

                    {/* ══════════ FILTROS ══════════ */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleFilter}
                                className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden"
                            >
                                <div className="px-5 py-3 border-b border-brand flex items-center justify-between bg-card-fap/[0.02]">
                                    <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-main flex items-center gap-2">
                                        <Filter className="w-3.5 h-3.5 text-primary" /> Panel de Filtros
                                    </h3>
                                    {hasFilters && (
                                        <button type="button" onClick={clearFilters} className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                                            <X className="w-3 h-3" /> Limpiar
                                        </button>
                                    )}
                                </div>
                                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                    {/* Fecha Inicio */}
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Fecha Desde</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                                            <input
                                                type="date"
                                                value={form.fecha_inicio}
                                                onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                                                className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-brand-main bg-card-fap border border-brand rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    {/* Fecha Fin */}
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Fecha Hasta</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                                            <input
                                                type="date"
                                                value={form.fecha_fin}
                                                onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
                                                className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-brand-main bg-card-fap border border-brand rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    {/* Socio */}
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Socio</label>
                                        <div className="relative">
                                            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                                            <select
                                                value={form.socio_id}
                                                onChange={e => setForm({ ...form, socio_id: e.target.value })}
                                                className="w-full pl-9 pr-8 py-2 text-xs font-semibold text-brand-main bg-card-fap border border-brand rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-colors appearance-none"
                                            >
                                                <option value="">Todos los socios</option>
                                                {socios?.map(s => (
                                                    <option key={s.id} value={s.id}>{s.grado} {s.name} — CI: {s.ci}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Tipo */}
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Tipo Transacción</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                                            <select
                                                value={form.tipo}
                                                onChange={e => setForm({ ...form, tipo: e.target.value })}
                                                className="w-full pl-9 pr-8 py-2 text-xs font-semibold text-brand-main bg-card-fap border border-brand rounded-xl focus:ring-1 focus:ring-primary focus:border-primary transition-colors appearance-none"
                                            >
                                                <option value="">Todos los tipos</option>
                                                {Object.entries(tiposTransaccion || {}).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Botón aplicar */}
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-primary text-white border border-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Search className="w-3.5 h-3.5" /> Consultar
                                        </button>
                                    </div>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* ══════════ GRILLA DE DETALLE CONTABLE ══════════ */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-5 py-3.5 border-b border-brand flex items-center justify-between bg-card-fap/[0.02]">
                            <h3 className="text-[11px] font-black uppercase tracking-wider text-brand-main flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-primary" /> Asientos Contables Registrados
                            </h3>
                            <span className="text-[11px] text-brand-muted font-semibold whitespace-nowrap">
                                {asientos.total || 0} registros
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-brand bg-card-fap/[0.04]">
                                        <th className="px-4 pl-6 py-3 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider w-28">Fecha</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider w-48">Referencia de Socio</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider">Concepto / Transacción</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-brand-main uppercase tracking-wider w-36 border-l border-brand">Debe (Ingreso)</th>
                                        <th className="px-4 pr-6 py-3 text-right text-[10px] font-bold text-brand-main uppercase tracking-wider w-36">Haber (Egreso)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asientos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center bg-card-fap">
                                                <div className="flex flex-col items-center gap-3 text-brand-muted">
                                                    <FileText className="w-10 h-10 text-brand-muted opacity-30" />
                                                    <p className="text-sm font-semibold">Libro sin registros</p>
                                                    <p className="text-[11px]">No hay asientos contables para los filtros seleccionados.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        asientos.data.map((asiento, idx) => {
                                            const tipoInfo = etiquetasTipo[asiento.tipo_transaccion] || { label: asiento.tipo_transaccion, color: 'bg-gray-50 text-gray-600 ring-gray-200' };
                                            const ci = asiento.user?.persona?.ci || asiento.user?.ci || null;

                                            return (
                                                <motion.tr 
                                                    key={asiento.id} 
                                                    initial={{ opacity: 0, x: -4 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.02 }}
                                                    className="border-b border-brand hover:bg-card-fap/[0.03] transition-colors group bg-card-fap"
                                                >
                                                    <td className="px-4 pl-6 py-3 whitespace-nowrap">
                                                        <div className="text-xs text-brand-main font-semibold">{asiento.fecha}</div>
                                                        <div className="text-[9px] font-mono font-bold text-brand-muted mt-0.5">#{String(asiento.id).padStart(6, '0')}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {asiento.user ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-brand/5 flex items-center justify-center text-primary border border-brand/50 shrink-0">
                                                                    <UserCircle className="w-4 h-4" />
                                                                </div>
                                                                <div className="truncate w-32 md:w-full">
                                                                    <div className="text-[11px] font-bold text-brand-main truncate" title={asiento.user.name}>{asiento.user.name}</div>
                                                                    <div className="text-[10px] text-brand-muted font-mono font-medium mt-0.5">
                                                                        {ci ? `CI: ${ci}` : 'S/CI'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[11px] font-bold text-brand-muted flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-primary/70" /> Cuenta Institucional</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-xs text-brand-main font-semibold truncate max-w-sm mb-1" title={asiento.concepto}>{asiento.concepto}</div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ring-1 ${tipoInfo.color}`}>
                                                                {tipoInfo.label}
                                                            </span>
                                                            {asiento.cajero && (
                                                                <span className="text-[9px] text-brand-muted font-medium" title={`Registrado por: ${asiento.cajero.name}`}>
                                                                    por {asiento.cajero.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right border-l border-brand">
                                                        {Number(asiento.ingreso) > 0 ? (
                                                            <span className="text-xs font-black text-emerald-600 tabular-nums">
                                                                +Bs {Number(asiento.ingreso).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        ) : <span className="text-brand-muted/20 text-xs font-bold">—</span>}
                                                    </td>
                                                    <td className="px-4 pr-6 py-3 text-right">
                                                        {Number(asiento.egreso) > 0 ? (
                                                            <span className="text-xs font-black text-red-500 tabular-nums">
                                                                -Bs {Number(asiento.egreso).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        ) : <span className="text-brand-muted/20 text-xs font-bold">—</span>}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </tbody>

                                {/* ══════════ FILA DE TOTALES ══════════ */}
                                {asientos.data.length > 0 && (
                                    <tfoot>
                                        <tr className="border-t-2 border-brand bg-brand/[0.03]">
                                            <td colSpan="3" className="px-4 pl-6 py-3">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-brand-main">
                                                    Totales de Página ({asientos.data.length} asientos)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right border-l border-brand">
                                                <span className="text-xs font-black text-emerald-600 tabular-nums">
                                                    Bs {paginaDebe.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-4 pr-6 py-3 text-right">
                                                <span className="text-xs font-black text-red-500 tabular-nums">
                                                    Bs {paginaHaber.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="bg-primary/[0.04] border-t border-primary/20">
                                            <td colSpan="3" className="px-4 pl-6 py-3">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                                                    Totales Generales ({totales.asientos} asientos)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right border-l border-brand">
                                                <span className="text-sm font-black text-emerald-700 tabular-nums">
                                                    Bs {totales.debe.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-4 pr-6 py-3 text-right">
                                                <span className="text-sm font-black text-red-600 tabular-nums">
                                                    Bs {totales.haber.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        {/* Paginación */}
                        {asientos.links && asientos.links.length > 3 && (
                            <div className="px-5 py-3 border-t border-brand bg-card-fap/[0.02] flex items-center justify-between">
                                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                                    Mostrando pág. {asientos.current_page} de {asientos.last_page} ({asientos.total} asientos)
                                </p>
                                <div className="flex gap-1.5">
                                    {asientos.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1.5 text-[11px] font-black uppercase rounded border transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-white border-primary shadow-sm'
                                                    : link.url
                                                        ? 'bg-card-fap text-brand-main border-brand hover:bg-primary/5 hover:text-primary'
                                                        : 'bg-card-fap text-brand-muted/30 border-brand/50 cursor-not-allowed hidden md:block'
                                            }`}
                                            preserveState
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
