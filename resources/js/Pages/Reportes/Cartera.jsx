import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Wallet, 
    DownloadCloud, 
    ChevronLeft, 
    FileText, 
    PieChart, 
    TrendingUp, 
    AlertCircle, 
    CheckCircle2,
    Calendar,
    BadgeDollarSign,
    Search,
    Filter,
    X,
    Loader2,
    FileSpreadsheet,
    CalendarDays,
    UserSearch
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

export default function Cartera({ auth, fecha_generacion, resumen, creditos, tipos_credito, filtros }) {
    const { data, setData, get, processing } = useForm({
        search: filtros?.search || '',
        tipo_id: filtros?.tipo_id || '',
        estado: filtros?.estado || '',
        desde: filtros?.desde || '',
        hasta: filtros?.hasta || '',
    });

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportStatus, setExportStatus] = useState('idle');

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        get(route('reportes.cartera'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = (formato) => {
        setExportStatus('processing');
        setShowExportModal(true);

        const queryParams = new URLSearchParams({
            formato,
            ...data
        }).toString();

        window.location.href = `${route('reportes.cartera')}?${queryParams}`;

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
                        <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                            <PieChart className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Cartera de Créditos
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Análisis de Colocación y Riesgo
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/50 flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> Generado: {fecha_generacion}
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
            <Head title="Cartera de Créditos" />

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
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
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
                                        ? 'Analizando la cartera de colocación activa. El documento estará listo en breve.' 
                                        : 'El reporte de cartera filtrado ha sido generado exitosamente.'}
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
                        <div className="lg:col-span-3 self-stretch">
                            <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest flex items-center gap-2">
                                    <UserSearch className="w-3 h-3 text-primary" /> Identificar Socio
                                </label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                                    <input 
                                        type="text" 
                                        placeholder="CI O NOMBRE..."
                                        value={data.search}
                                        onChange={e => setData('search', e.target.value)}
                                        className="w-full bg-main border-brand rounded-xl pl-9 text-[11px] font-black text-brand-main focus:ring-primary focus:border-primary transition-all uppercase placeholder:opacity-50"
                                    />
                                    {data.search && (
                                        <button onClick={() => setData('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Producto y Estado */}
                        <div className="lg:col-span-4 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-brand-muted block tracking-widest">Producto</label>
                                    <select 
                                        value={data.tipo_id} 
                                        onChange={e => setData('tipo_id', e.target.value)}
                                        className="w-full bg-main border-brand rounded-xl text-[10px] font-black text-brand-main focus:ring-primary focus:border-primary transition-all uppercase"
                                    >
                                        <option value="">— TODOS —</option>
                                        {tipos_credito?.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-brand-muted block tracking-widest">Estado</label>
                                    <select 
                                        value={data.estado} 
                                        onChange={e => setData('estado', e.target.value)}
                                        className="w-full bg-main border-brand rounded-xl text-[10px] font-black text-brand-main focus:ring-primary focus:border-primary transition-all uppercase"
                                    >
                                        <option value="">— TODOS —</option>
                                        <option value="Desembolsado">Vigentes</option>
                                        <option value="En Mora">En Mora</option>
                                        <option value="Pagado">Pagados</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Rango de Fechas */}
                        <div className="lg:col-span-3 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col gap-3">
                             <label className="text-[10px] font-black uppercase text-brand-muted block tracking-widest flex items-center gap-2">
                                <CalendarDays className="w-3 h-3 text-primary" /> Periodo Desembolso
                             </label>
                             <div className="grid grid-cols-2 gap-2">
                                <input 
                                    type="date" 
                                    value={data.desde}
                                    onChange={e => setData('desde', e.target.value)}
                                    className="w-full bg-main border-brand rounded-xl text-[10px] font-black text-brand-main focus:ring-primary py-1.5"
                                />
                                <input 
                                    type="date" 
                                    value={data.hasta}
                                    onChange={e => setData('hasta', e.target.value)}
                                    className="w-full bg-main border-brand rounded-xl text-[10px] font-black text-brand-main focus:ring-primary py-1.5"
                                />
                             </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="lg:col-span-2 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-2">
                            <button 
                                onClick={handleFilter}
                                disabled={processing}
                                className="w-full bg-primary hover:bg-primary-dark text-white text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                            >
                                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-3.5 h-3.5" />} 
                                Filtrar
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleExport('xlsx')} className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center" title="Excel">
                                    <FileSpreadsheet className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleExport('pdf')} className="py-2 bg-red-700 hover:bg-black text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center" title="PDF">
                                    <FileText className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                        <StatCard label="Total Créditos" value={resumen.total_creditos} icon={FileText} />
                        <StatCard label="Vigentes" value={resumen.vigentes} color="text-blue-600" icon={CheckCircle2} />
                        <StatCard label="En Mora" value={resumen.en_mora} color="text-red-600" icon={AlertCircle} />
                        <StatCard label="Pagados" value={resumen.pagados} color="text-emerald-600" icon={TrendingUp} />
                        <StatCard label="Otorgado" value={Number(resumen.monto_total_otorgado).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-brand-main" icon={BadgeDollarSign} />
                        <StatCard label="Sald. Vigente" value={Number(resumen.monto_vigente).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-blue-700" icon={Wallet} />
                        <StatCard label="Sald. Mora" value={Number(resumen.monto_mora).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " color="text-red-700" icon={AlertCircle} />
                    </div>

                    <div className="bg-card-fap border border-brand shadow-sm rounded-2xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-brand-main uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Detalle de Colocación
                            </h3>
                            <span className="text-[10px] font-bold text-brand-muted bg-brand/5 px-2.5 py-1 rounded-lg border border-brand/50">
                                {creditos.length} Registros Encontrados
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 pl-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-16">ID</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Socio / Titular</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Documento</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Tipo Operación</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Aprobado</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">Saldo Cap.</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand">Tasa</th>
                                        <th className="px-4 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-center border-l border-brand">Estado</th>
                                        <th className="px-4 pr-6 py-3.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right border-l border-brand">F. Desembolso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {creditos.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-20 text-center">
                                                <p className="text-[11px] font-black text-brand-muted uppercase tracking-[0.2em]">No se encontraron créditos con los criterios seleccionados</p>
                                            </td>
                                        </tr>
                                    )}
                                    {creditos.map((c, index) => (
                                        <motion.tr 
                                            key={c.id} 
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.01 }}
                                            className="hover:bg-brand/5 transition-colors border-b border-brand/50 last:border-0"
                                        >
                                            <td className="px-4 pl-6 py-3 text-[11px] font-black text-brand-muted font-mono">{c.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-brand-main uppercase truncate max-w-[200px]">{c.socio}</span>
                                                    <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tight">{c.grado}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[11px] font-bold text-brand-muted font-mono">{c.ci}</td>
                                            <td className="px-4 py-3 text-[11px] font-bold text-brand-main uppercase tracking-tight">{c.tipo}</td>
                                            <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/50">Bs. {Number(c.monto_aprobado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-[12px] text-right font-black font-mono border-l border-brand/50 bg-card-fap/[0.02]">Bs. {Number(c.saldo_capital).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-[11px] text-center font-black text-brand-muted border-l border-brand/50">{c.tasa}%</td>
                                            <td className="px-4 py-3 text-center border-l border-brand/50">
                                                <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest border shadow-sm ${
                                                    c.estado === 'En Mora' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                    c.estado === 'Pagado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                    'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                }`}>{c.estado}</span>
                                            </td>
                                            <td className="px-4 pr-6 py-3 text-[11px] text-right font-bold text-brand-muted border-l border-brand/50">{c.fecha_desembolso}</td>
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

