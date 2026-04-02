import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Search, 
    DownloadCloud, 
    Wallet, 
    CalendarDays, 
    FileWarning, 
    Banknote, 
    Filter, 
    ChevronLeft,
    Activity,
    CreditCard,
    History as HistoryIcon,
    AlertTriangle,
    CheckCircle2,
    Clock,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StatCard({ label, value, color = 'text-primary', icon: Icon, sublabel }) {
    return (
        <div className="bg-card-fap rounded-2xl shadow-sm border border-brand p-5 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-brand/5 border border-brand/50 ${color.replace('text-', 'text- opacity-70')}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.15em]">{label}</p>
            </div>
            <p className={`text-2xl font-black tracking-tighter ${color} mb-1`}>{value}</p>
            {sublabel && <p className="text-[9px] font-bold text-brand-muted uppercase opacity-60">{sublabel}</p>}
        </div>
    );
}

export default function Historico({ auth, socios_catalogo, socio_seleccionado, metricas, historial_creditos, historial_pagos, filtros }) {
    const [socioId, setSocioId] = useState(filtros.socioId || '');
    const [fechaInicio, setFechaInicio] = useState(filtros.fechaInicio || '');
    const [fechaFin, setFechaFin] = useState(filtros.fechaFin || '');

    const [isDownloading, setIsDownloading] = useState(false);

    const aplicarFiltros = (e) => {
        e.preventDefault();
        router.get(route('reportes.historico'), {
            socio_id: socioId,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
        }, { preserveState: true });
    };

    const handleExport = async (formato) => {
        if (!socioId) return;
        setIsDownloading(true);
        try {
            const response = await window.axios({
                url: route('reportes.historico'),
                params: { socio_id: socioId, fecha_inicio: fechaInicio, fecha_fin: fechaFin, formato },
                method: 'GET',
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = formato === 'xlsx' ? 'csv' : 'pdf';
            link.setAttribute('download', `historico_credito_${socio_seleccionado?.ci || 'socio'}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exportando el historial.');
        } finally {
            setIsDownloading(false);
        }
    };

    const limpiarFiltros = () => {
        setSocioId('');
        setFechaInicio('');
        setFechaFin('');
        router.get(route('reportes.historico'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Histórico Crediticio Integral
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Central de Riesgos e Inteligencia Financiera
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <Link 
                            href={route('reportes.index')} 
                            className="bg-card-fap border border-brand text-brand-muted hover:text-brand-main text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center px-4 py-2 gap-2"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Volver
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Histórico de Riesgo | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Fila superior: Filtros y Datos del Socio */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Panel de Búsqueda */}
                        <div className="lg:col-span-4 bg-card-fap border border-brand p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                                <Filter className="w-16 h-16 text-brand-main" />
                            </div>
                            <h3 className="text-xs font-black text-brand-main mb-6 uppercase tracking-widest flex items-center gap-2 relative z-10">
                                <Search className="w-4 h-4 text-emerald-600" /> Explorador de Afiliados
                            </h3>
                            <form onSubmit={aplicarFiltros} className="space-y-5 relative z-10">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest leading-none">Seleccionar Socio</label>
                                    <div className="relative group/input">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted group-hover/input:text-primary transition-colors" />
                                        <select 
                                            value={socioId} 
                                            onChange={e => setSocioId(e.target.value)}
                                            className="w-full bg-main border-brand rounded-xl pl-9 text-[11px] font-black text-brand-main focus:ring-primary focus:border-primary transition-all appearance-none tracking-tight"
                                        >
                                            <option value="">-- Elige un Afiliado --</option>
                                            {socios_catalogo?.map(s => (
                                                <option key={s.id} value={s.id}>{s.name.toUpperCase()} ({s.ci || 'SIN CI'})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest leading-none">Desde</label>
                                        <div className="relative group/input">
                                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted group-hover/input:text-primary transition-colors" />
                                            <input 
                                                type="date" 
                                                value={fechaInicio} 
                                                onChange={e => setFechaInicio(e.target.value)}
                                                className="w-full bg-main border-brand rounded-xl pl-9 text-[10px] font-black text-brand-main focus:ring-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest leading-none">Hasta</label>
                                        <div className="relative group/input">
                                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted group-hover/input:text-primary transition-colors" />
                                            <input 
                                                type="date" 
                                                value={fechaFin} 
                                                onChange={e => setFechaFin(e.target.value)}
                                                className="w-full bg-main border-brand rounded-xl pl-9 text-[10px] font-black text-brand-main focus:ring-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex-1 bg-brand-main hover:bg-brand-hover text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                        <Activity className="w-3.5 h-3.5" /> Procesar Expediente
                                    </button>
                                    <button type="button" onClick={limpiarFiltros} className="px-5 bg-card-fap border border-brand text-brand-muted hover:text-brand-main text-[11px] font-black uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center">
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Perfil Resultante */}
                        <div className="lg:col-span-8 bg-card-fap border border-brand rounded-2xl shadow-sm flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                            {socio_seleccionado ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full p-8 flex flex-col md:flex-row items-center gap-8"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-24 h-24 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center shadow-inner group-hover:rotate-3 transition-transform">
                                            <ShieldCheck className="w-12 h-12 text-emerald-600" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-lg shadow-lg border-2 border-card-fap animate-bounce">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-2 leading-none">Expediente Centralizado</p>
                                        <h4 className="text-2xl font-black text-brand-main tracking-tighter uppercase leading-none mb-3">{socio_seleccionado.name}</h4>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                            <span className="text-[10px] font-black text-brand-main bg-brand/5 px-3 py-1 rounded-lg border border-brand/50 uppercase tracking-widest">CI: {socio_seleccionado.ci || 'N/D'}</span>
                                            <span className="text-[10px] font-black text-brand-main bg-brand/5 px-3 py-1 rounded-lg border border-brand/50 uppercase tracking-widest">Grado: {socio_seleccionado.grado || 'SOCIO'}</span>
                                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border shadow-sm tracking-[0.1em] ${
                                                metricas.cuotas_mora_historicas > 0 
                                                ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                                                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                            }`}>
                                                {metricas.cuotas_mora_historicas > 0 ? 'Riesgo Crítico' : 'Socio VIP - Sin Mora'}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Botonera de Exportación */}
                                    <div className="flex flex-col gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={() => handleExport('pdf')}
                                            disabled={isDownloading}
                                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:-translate-y-0.5"
                                        >
                                            <DownloadCloud className="w-4 h-4" /> Certificado PDF
                                        </button>
                                        <button 
                                            onClick={() => handleExport('xlsx')}
                                            disabled={isDownloading}
                                            className="px-6 py-3 bg-main border border-brand text-brand-muted hover:text-brand-main text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <DownloadCloud className="w-4 h-4" /> Resumen CSV
                                        </button>
                                        <AnimatePresence>
                                            {isDownloading && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center justify-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest animate-pulse"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Procesando Archivos...
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center p-12 opacity-40 group-hover:opacity-60 transition-opacity">
                                    <ShieldCheck className="w-16 h-16 text-brand-muted mx-auto mb-4 stroke-1" />
                                    <p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.3em]">Seleccione un Afiliado para Auditar</p>
                                    <p className="text-[9px] text-brand-muted mt-2 max-w-sm font-bold uppercase tracking-widest leading-relaxed">Se cargará el expediente crediticio institucional completo con calificación de riesgo automatizada.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {socio_seleccionado && (
                        <div className="space-y-6">
                            {/* Panel de Métricas Rápidas */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard 
                                    label="Créditos Solicitados" 
                                    value={metricas.creditos_totales} 
                                    icon={CreditCard} 
                                    color="text-blue-600"
                                    sublabel="Consolidado Institucional"
                                />
                                <StatCard 
                                    label="Capital Solicitado" 
                                    value={`Bs ${parseFloat(metricas.monto_total_aprobado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                                    icon={Banknote} 
                                    color="text-emerald-600"
                                    sublabel="Proyectos / Consumo"
                                />
                                <StatCard 
                                    label="Amortización Total" 
                                    value={`Bs ${parseFloat(metricas.capital_pagado_total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`} 
                                    icon={ShieldCheck} 
                                    color="text-blue-700"
                                    sublabel="Capital Retornado"
                                />
                                <StatCard 
                                    label="Eventos de Mora" 
                                    value={metricas.cuotas_mora_historicas} 
                                    icon={AlertTriangle} 
                                    color="text-red-600"
                                    sublabel="Alertas de Retraso"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                                {/* Tabla de Créditos Gestados */}
                                <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col relative h-[500px]">
                                    <div className="p-5 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase text-brand-main tracking-widest flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-primary" /> Expedientes de Créditos
                                        </h3>
                                        <span className="text-[10px] font-black text-brand-muted bg-brand/5 px-2.5 py-1 rounded-lg border border-brand/50 uppercase tracking-tighter">
                                            {historial_creditos.length} Operaciones
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                        <table className="w-full text-left">
                                            <thead className="bg-main text-brand-muted sticky top-0 font-black uppercase border-b border-brand z-10">
                                                <tr>
                                                    <th className="p-4 pl-6 text-[10px] tracking-wider">Crédito / Tipo</th>
                                                    <th className="p-4 text-[10px] tracking-wider text-right border-l border-brand">Aprobado</th>
                                                    <th className="p-4 pr-6 text-[10px] tracking-wider text-center border-l border-brand">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-brand/10">
                                                {historial_creditos.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="3" className="py-24 text-center opacity-40">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <Activity className="w-10 h-10" />
                                                                <p className="text-[10px] font-black uppercase tracking-widest">Sin registros de créditos</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : historial_creditos.map((c, index) => (
                                                    <motion.tr 
                                                        key={c.id} 
                                                        initial={{ opacity: 0, x: -5 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: index * 0.02 }}
                                                        className="hover:bg-brand/5 transition-colors group"
                                                    >
                                                        <td className="p-4 pl-6">
                                                            <div className="font-black text-[12px] text-brand-main mb-1 leading-none">SOLICITUD #{c.id.toString().padStart(6, '0')}</div>
                                                            <div className="text-[9px] text-brand-muted font-bold uppercase tracking-tight flex items-center gap-1.5 opacity-60">
                                                                <span className="bg-brand/10 px-1.5 py-0.5 rounded tracking-widest">{c.tipo_credito?.nombre || 'PRESTAMO'}</span>
                                                                <span className="italic mr-1">Tasa: {c.tasa_interes}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right border-l border-brand/50 font-black font-mono text-[11px] text-brand-main">
                                                            <div className="leading-none mb-1">Bs {parseFloat(c.monto_aprobado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</div>
                                                            {(c.saldo_capital <= 0 && c.estado === 'Pagado') && <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-tighter bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/20">TOTALMENTE LIQUIDADO</span>}
                                                        </td>
                                                        <td className="p-4 pr-6 text-center border-l border-brand/50">
                                                            <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                                                c.estado === 'Pagado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                                c.estado === 'Desembolsado' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                                c.estado === 'En Mora' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                                'bg-brand/10 text-brand-muted border-brand/50'
                                                            }`}>
                                                                {c.estado}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Tabla de Movimientos de Pagos y Mora */}
                                <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col relative h-[500px]">
                                    <div className="p-5 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase text-brand-main tracking-widest flex items-center gap-2">
                                            <HistoryIcon className="w-4 h-4 text-primary" /> Historial de Amortización
                                        </h3>
                                        <span className="text-[10px] font-black text-brand-muted bg-brand/5 px-2.5 py-1 rounded-lg border border-brand/50 uppercase tracking-tighter">
                                            {historial_pagos.length} Registros
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                        <table className="w-full text-left">
                                            <thead className="bg-main text-brand-muted sticky top-0 font-black uppercase border-b border-brand z-10">
                                                <tr>
                                                    <th className="p-4 pl-6 text-[10px] tracking-wider w-36">Vencimiento</th>
                                                    <th className="p-4 text-[10px] tracking-wider">Concepto Cuota</th>
                                                    <th className="p-4 text-[10px] tracking-wider text-right border-l border-brand">Monto Total</th>
                                                    <th className="p-4 pr-6 text-[10px] tracking-wider text-center border-l border-brand">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-brand/10">
                                                {historial_pagos.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="4" className="py-24 text-center opacity-40">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <Clock className="w-10 h-10" />
                                                                <p className="text-[10px] font-black uppercase tracking-widest">Sin Cronograma de Pagos</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : historial_pagos.map((p, index) => (
                                                    <motion.tr 
                                                        key={p.id} 
                                                        initial={{ opacity: 0, x: 5 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: index * 0.02 }}
                                                        className="hover:bg-brand/5 transition-colors group"
                                                    >
                                                        <td className="p-4 pl-6">
                                                            <div className="font-black text-[11px] text-brand-main leading-none mb-1 font-mono uppercase">{p.vencimiento}</div>
                                                            {p.fecha_pago && (
                                                                <div className="text-[8px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block tracking-tighter shadow-sm">
                                                                    ABONADO: {p.fecha_pago}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-black text-[12px] text-brand-main mb-1 leading-none uppercase truncate max-w-[140px] tracking-tight">{p.credito}</div>
                                                            <div className="text-[9px] text-brand-muted font-bold uppercase tracking-[0.1em] opacity-60">CUOTA NO. {p.cuota.toString().padStart(2, '0')}</div>
                                                        </td>
                                                        <td className="p-4 text-right border-l border-brand/50 font-black font-mono text-[11px] text-brand-main">
                                                            <div className="leading-none mb-1">Bs {parseFloat(p.total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</div>
                                                            {p.mora > 0 && <div className="text-[9px] text-red-600 font-extrabold uppercase tracking-tighter">+ Bs {parseFloat(p.mora).toLocaleString('es-BO', { minimumFractionDigits: 2 })} MORA</div>}
                                                        </td>
                                                        <td className="p-4 pr-6 text-center border-l border-brand/50">
                                                            <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                                                p.estado === 'Pagada' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                                p.estado === 'Retrasada' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                                'bg-brand/10 text-brand-muted border-brand/50'
                                                            }`}>
                                                                {p.estado}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
