import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    AlertTriangle, 
    DownloadCloud, 
    ChevronLeft, 
    FileWarning, 
    TrendingDown, 
    Users, 
    BadgeDollarSign,
    Calendar,
    FileText,
    Search,
    Filter,
    X,
    CheckCircle2,
    Loader2,
    CalendarClock,
    UserSearch,
    FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StatCard({ label, value, color = 'text-primary', prefix = '', icon: Icon }) {
    return (
        <div className="bg-card-fap rounded-2xl shadow-sm border border-brand p-5 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-brand/5 border border-brand/50 ${color.replace('text-', 'text- opacity-70')}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.15em]">{label}</p>
            </div>
            <p className={`text-2xl font-black tracking-tighter ${color}`}>{prefix}{value}</p>
        </div>
    );
}

export default function Morosidad({ auth, fecha_generacion, resumen, cuotas, tipos_credito, filtros }) {
    const { data, setData, get, processing } = useForm({
        min_dias: filtros?.min_dias || '',
        max_dias: filtros?.max_dias || '',
        tipo_id: filtros?.tipo_id || '',
        search: filtros?.search || '',
    });

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportStatus, setExportStatus] = useState('idle');

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        get(route('reportes.morosidad'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleQuickRange = (min, max) => {
        setData(prev => ({ ...prev, min_dias: min, max_dias: max }));
        // El auto-submit es opcional, pero aquí lo haremos manual para evitar parpadeos excesivos
    };

    const handleExport = (formato) => {
        setExportStatus('processing');
        setShowExportModal(true);

        const queryParams = new URLSearchParams({
            formato,
            ...data
        }).toString();

        window.location.href = `${route('reportes.morosidad')}?${queryParams}`;

        setTimeout(() => {
            setExportStatus('success');
            setTimeout(() => {
                setShowExportModal(false);
                setExportStatus('idle');
            }, 2500);
        }, 1500);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                            <FileWarning className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Morosidad Corporativa
                            </span>
                            <span className="text-[11px] text-red-600 font-bold tracking-wider uppercase">
                                Reporte Crítico de Incumplimiento
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/50 flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> Corte al: {fecha_generacion}
                        </p>
                        <Link 
                            href={route('reportes.index')} 
                            className="px-4 py-2 bg-card-fap border border-brand text-brand-muted hover:text-brand-main text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-sm"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Volver
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Morosidad | FAPCLAS" />

            {/* Modal de Confirmación de Exportación */}
            <AnimatePresence>
                {showExportModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-main/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card-fap border border-brand p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6"
                        >
                            <div className="relative mx-auto w-20 h-20">
                                {exportStatus === 'processing' ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ scale: 0.5 }} 
                                        animate={{ scale: 1 }} 
                                        className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 rounded-full border border-emerald-500/20"
                                    >
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </motion.div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-brand-main uppercase tracking-tight">
                                    {exportStatus === 'processing' ? 'Generando Reporte' : 'Descarga Iniciada'}
                                </h3>
                                <p className="text-[11px] text-brand-muted font-bold tracking-wider leading-relaxed uppercase opacity-70">
                                    {exportStatus === 'processing' 
                                        ? 'Analizando registros de mora exigible. El documento estará listo en breve.' 
                                        : 'El reporte de morosidad segmentado ha sido generado exitosamente.'}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* PANEL DE FILTROS AVANZADOS */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        
                        {/* Buscador de Socio */}
                        <div className="lg:col-span-4 self-stretch">
                            <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest flex items-center gap-2">
                                    <UserSearch className="w-3 h-3 text-red-500" /> Buscar Socio Moroso
                                </label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                                    <input 
                                        type="text" 
                                        placeholder="CI O NOMBRE COMPLETO..."
                                        value={data.search}
                                        onChange={e => setData('search', e.target.value)}
                                        className="w-full bg-main border-brand rounded-xl pl-9 text-[11px] font-black text-brand-main focus:ring-red-500 focus:border-red-500 transition-all uppercase placeholder:opacity-50"
                                    />
                                    {data.search && (
                                        <button onClick={() => setData('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tipo de Crédito y Rango */}
                        <div className="lg:col-span-4 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-brand-muted block tracking-widest">Cartera de Producto</label>
                                <select 
                                    value={data.tipo_id} 
                                    onChange={e => setData('tipo_id', e.target.value)}
                                    className="w-full bg-main border-brand rounded-xl text-[11px] font-black text-brand-main focus:ring-red-500 focus:border-red-500 transition-all uppercase"
                                >
                                    <option value="">— TODOS LOS CRÉDITOS —</option>
                                    {tipos_credito.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-brand-muted block tracking-tighter">Días Min.</label>
                                    <input 
                                        type="number" 
                                        value={data.min_dias}
                                        onChange={e => setData('min_dias', e.target.value)}
                                        className="w-full bg-main border-brand rounded-xl text-[11px] font-black text-brand-main py-1.5"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-brand-muted block tracking-tighter">Días Max.</label>
                                    <input 
                                        type="number" 
                                        value={data.max_dias}
                                        onChange={e => setData('max_dias', e.target.value)}
                                        className="w-full bg-main border-brand rounded-xl text-[11px] font-black text-brand-main py-1.5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción y Tramos Rápidos */}
                        <div className="lg:col-span-4 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest text-center px-2 py-0.5 bg-brand/5 border border-brand/50 rounded-lg">Segmentación por Riesgo</span>
                                <div className="flex gap-1">
                                    {[
                                        { l: '30D', min: 1, max: 30, color: 'hover:bg-amber-500' },
                                        { l: '60D', min: 31, max: 60, color: 'hover:bg-orange-500' },
                                        { l: '90D', min: 61, max: 90, color: 'hover:bg-red-500' },
                                        { l: '90+', min: 91, max: 9999, color: 'hover:bg-red-700' }
                                    ].map(r => (
                                        <button 
                                            key={r.l}
                                            onClick={() => handleQuickRange(r.min, r.max)}
                                            className={`flex-1 text-[9px] font-black py-1.5 rounded-lg border border-brand bg-card-fap transition-all ${r.color} hover:text-white active:scale-95`}
                                        >
                                            {r.l}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => setData(prev => ({ ...prev, min_dias: '', max_dias: '' }))}
                                        className="px-2 text-[9px] font-black py-1.5 rounded-lg border border-brand bg-card-fap hover:bg-slate-700 hover:text-white"
                                    >
                                        VER TODO
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleFilter}
                                    disabled={processing}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-3.5 h-3.5" />} 
                                    Analizar
                                </button>
                                <div className="flex gap-1 shrink-0">
                                    <button onClick={() => handleExport('xlsx')} className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all active:scale-95 group" title="Exportar Excel">
                                        <FileSpreadsheet className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                    <button onClick={() => handleExport('pdf')} className="p-3 bg-red-800 hover:bg-black text-white rounded-xl shadow-md transition-all active:scale-95 group" title="Exportar PDF">
                                        <FileText className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Cuotas Atrasadas" value={resumen.total_cuotas_atrasadas} color="text-red-600" icon={AlertTriangle} />
                        <StatCard label="Socios Afectados" value={resumen.socios_afectados} color="text-orange-600" icon={Users} />
                        <StatCard label="Capital Moroso" value={Number(resumen.total_capital_moroso).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-red-700" icon={BadgeDollarSign} />
                        <StatCard label="Mora Acumulada" value={Number(resumen.total_mora_acumulada).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-red-800" icon={TrendingDown} />
                    </div>

                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-brand bg-red-500/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-brand-main uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" /> Detalle de Mora Exigible 
                                {data.min_dias && <span className="text-[10px] text-red-500 bg-white border border-red-200 px-2 rounded-full hidden md:inline ml-2">Tramo: {data.min_dias}-{data.max_dias === 9999 ? '+' : data.max_dias} DÍAS</span>}
                            </h3>
                            <span className="text-[10px] font-bold text-red-700 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                                {cuotas.length} Cuotas Listadas
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 pl-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-24">Crédito</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Socio / Titular</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Tipo Operación</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand">Nro C.</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand w-32">Vencimiento</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand w-24">Días Mora</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Capital</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Interés/Mora</th>
                                        <th className="px-4 pr-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand bg-red-500/5 font-black">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuotas.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-20 text-center bg-card-fap relative overflow-hidden">
                                                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                                                    <CheckCircle2 className="w-64 h-64 text-emerald-500" />
                                                </div>
                                                <div className="relative z-10">
                                                    <p className="text-[14px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-3">
                                                        <CheckCircle2 className="w-5 h-5" /> Cartera en Cumplimiento Total
                                                    </p>
                                                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-wider opacity-60">No se registran cuotas retrasadas bajo los criterios de filtrado seleccionados.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {cuotas.map((c, i) => (
                                        <motion.tr 
                                            key={i} 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-red-500/5 transition-colors border-b border-brand/50 last:border-0"
                                        >
                                            <td className="px-4 pl-6 py-4 text-[11px] font-black text-brand-muted font-mono bg-brand/5 border-r border-brand/50">#{c.credito_id}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-brand-main uppercase truncate max-w-[200px] hover:text-red-600 cursor-default transition-colors">{c.socio}</span>
                                                    <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tight flex items-center gap-2">
                                                        <BadgeDollarSign className="w-3 h-3 text-red-500/50" /> {c.ci} · {c.grado}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-[11px] font-bold text-brand-muted uppercase tracking-tight">{c.tipo_credito}</td>
                                            <td className="px-4 py-4 text-[11px] text-center font-black font-mono border-l border-brand/50">{c.nro_cuota}</td>
                                            <td className="px-4 py-4 text-[11px] text-center font-bold text-brand-muted border-l border-brand/50">{c.fecha_vencimiento}</td>
                                            <td className="px-4 py-4 text-center border-l border-brand/50">
                                                <span className={`px-2.5 py-1 font-black rounded-lg text-[10px] uppercase tracking-tighter shadow-sm border ${
                                                    c.dias_mora > 90 ? 'bg-red-700 text-white border-red-800' :
                                                    c.dias_mora > 60 ? 'bg-red-500 text-white border-red-600' :
                                                    c.dias_mora > 30 ? 'bg-orange-500 text-white border-orange-600' :
                                                    'bg-amber-500 text-white border-amber-600'
                                                }`}>
                                                    {c.dias_mora} Días
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[11px] text-right font-black font-mono border-l border-brand/50">Bs. {Number(c.capital).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-4 text-[11px] text-right font-black font-mono text-red-600 border-l border-brand/50 tracking-tighter">Bs. {Number(c.mora).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 pr-6 py-4 text-[13px] text-right font-black font-mono text-red-700 bg-red-500/5 border-l border-brand/50 tracking-tighter">
                                                Bs. {Number(c.total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

