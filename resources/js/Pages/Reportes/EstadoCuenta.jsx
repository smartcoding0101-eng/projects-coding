import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    User, 
    ChevronLeft, 
    FileText, 
    DownloadCloud, 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle, 
    CreditCard, 
    History,
    Search,
    BadgeCheck,
    Calendar,
    Target,
    Filter,
    FileSpreadsheet,
    CheckCircle2,
    Loader2
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

export default function EstadoCuenta({ auth, fecha_generacion, socio, resumen, creditos, movimientos, socios, filtros }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');
    
    const { data, setData, get, processing } = useForm({
        socio_id: filtros?.socio_id || '',
        desde: filtros?.desde || '',
        hasta: filtros?.hasta || '',
    });

    const [showExportModal, setShowExportModal] = useState(false);
    const [exportStatus, setExportStatus] = useState('idle'); // idle, processing, success

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        get(route('reportes.estado-cuenta'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = (formato) => {
        setExportStatus('processing');
        setShowExportModal(true);

        const queryParams = new URLSearchParams({
            formato,
            socio_id: data.socio_id || socio?.id || '',
            desde: data.desde,
            hasta: data.hasta
        }).toString();

        window.location.href = `${route('reportes.estado-cuenta')}?${queryParams}`;

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
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight transition-colors">
                                Estado de Cuenta
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Resumen de Obligaciones y Patrimonio
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full border border-brand/50 flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> Generado: {fecha_generacion}
                        </p>
                        <div className="flex items-center gap-2">
                            <Link 
                                href={route('reportes.index')} 
                                className="bg-card-fap border border-brand text-brand-muted hover:text-brand-main text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center px-4 py-2 gap-2"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" /> Volver
                            </Link>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Estado de Cuenta | FAPCLAS" />
            
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
                                    {exportStatus === 'processing' ? 'Generando Reporte' : 'Exportación Exitosa'}
                                </h3>
                                <p className="text-[11px] text-brand-muted font-bold tracking-wider leading-relaxed uppercase opacity-70">
                                    {exportStatus === 'processing' 
                                        ? 'Estamos procesando los registros del socio. El archivo se descargará automáticamente en unos segundos.' 
                                        : 'El documento ha sido generado con éxito. Revisa tu carpeta de descargas.'}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* BARRA DE FILTROS DINÁMICA */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        
                        {/* Selector de Socio (Si es Admin) */}
                        <div className={`${isAdmin ? 'lg:col-span-12' : 'hidden'}`}>
                            <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-end gap-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                    <Search className="w-12 h-12 text-brand-main" />
                                </div>
                                <div className="flex-1 relative z-10">
                                    <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest">Consultar Registro de Socio</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
                                        <select 
                                            value={data.socio_id} 
                                            onChange={(e) => {
                                                setData('socio_id', e.target.value);
                                                // trigger get after change is common for better UX
                                            }} 
                                            className="w-full bg-main border-brand rounded-xl pl-9 text-xs font-black text-brand-main focus:ring-primary focus:border-primary transition-all appearance-none uppercase"
                                        >
                                            <option value="">— Mi Cuenta Personal —</option>
                                            {socios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleFilter}
                                    disabled={processing}
                                    className="bg-brand-main hover:bg-brand-hover text-white px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    <Search className="w-3.5 h-3.5" /> {processing ? 'Buscando...' : 'Consultar'}
                                </button>
                            </div>
                        </div>

                        {/* Filtros de Fecha */}
                        <div className="lg:col-span-8 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-end gap-4">
                            <div className="flex-1 w-full space-y-1.5 text-left">
                                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                                    <Filter className="w-3 h-3 text-primary" /> Rango de Consulta (Kardex)
                                </span>
                                <div className="grid grid-cols-2 gap-3">
                                    <input 
                                        type="date"
                                        value={data.desde}
                                        onChange={e => setData('desde', e.target.value)}
                                        className="bg-main border-brand rounded-xl text-[11px] font-black uppercase px-3 py-2 text-brand-main w-full"
                                    />
                                    <input 
                                        type="date"
                                        value={data.hasta}
                                        onChange={e => setData('hasta', e.target.value)}
                                        className="bg-main border-brand rounded-xl text-[11px] font-black uppercase px-3 py-2 text-brand-main w-full"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleFilter}
                                className="bg-card-fap border-2 border-brand text-brand-main px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand/5 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                            >
                                Filtrar Historial
                            </button>
                        </div>

                        {/* Botones de Exportación */}
                        <div className="lg:col-span-4 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex gap-3 h-full items-center">
                            <button 
                                onClick={() => handleExport('pdf')}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.1em] py-3 rounded-xl transition-all shadow-md flex flex-col items-center gap-1 active:scale-95 group"
                            >
                                <DownloadCloud className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                <span>Exportar PDF</span>
                            </button>
                            <button 
                                onClick={() => handleExport('xlsx')}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.1em] py-3 rounded-xl transition-all shadow-md flex flex-col items-center gap-1 active:scale-95 group"
                            >
                                <FileSpreadsheet className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                <span>Exportar Excel</span>
                            </button>
                        </div>
                    </div>

                    {/* Info del socio */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card-fap border border-brand rounded-2xl p-6 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <BadgeCheck className="w-10 h-10 text-emerald-500/20" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1 leading-none">Nombre Completo</span>
                                <p className="text-[13px] font-black text-brand-main uppercase truncate tracking-tight">{socio.nombre}</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1 leading-none">Cédula Identidad</span>
                                <p className="text-[13px] font-black text-brand-main font-mono tracking-tight">{socio.ci}</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1 leading-none">Grado Institucional</span>
                                <p className="text-[13px] font-black text-brand-main uppercase tracking-tight">{socio.grado}</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1 leading-none">Destino / Unidad</span>
                                <p className="text-[13px] font-black text-brand-main uppercase truncate tracking-tight">{socio.destino}</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1 leading-none">Escalafón</span>
                                <p className="text-[13px] font-black text-brand-main uppercase tracking-tight">{socio.escalafon}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Saldo Kardex" value={Number(resumen.saldo_kardex).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " icon={Wallet} color="text-primary" />
                        <StatCard label="Créditos Activos" value={resumen.creditos_activos} icon={Target} color="text-blue-600" />
                        <StatCard label="Deuda Total" value={Number(resumen.deuda_total).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " icon={AlertCircle} color="text-red-600" />
                        <StatCard label="Total Pagado" value={Number(resumen.total_pagado).toLocaleString('es-BO', { minimumFractionDigits: 2 })} prefix="Bs. " icon={TrendingUp} color="text-emerald-600" />
                    </div>

                    {/* Créditos */}
                    {creditos.length > 0 && (
                        <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                <h3 className="text-xs font-black text-brand-main uppercase tracking-widest flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" /> Detalle de Préstamos Vigentes
                                </h3>
                                <span className="text-[10px] font-bold text-brand-muted bg-brand/5 px-2.5 py-1 rounded-lg border border-brand/50 uppercase">
                                    {creditos.length} Operaciones
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-card-fap border-b border-brand font-black uppercase">
                                        <tr>
                                            <th className="px-4 pl-6 py-3.5 text-[10px] text-brand-muted tracking-wider w-16 text-center">ID</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider">Tipo Operación</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand">Aprobado</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand">Saldo Cap.</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-center border-l border-brand">Estado</th>
                                            <th className="px-4 pr-6 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand w-28">Cuotas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand/20">
                                        {creditos.map((c, index) => (
                                            <motion.tr 
                                                key={c.id} 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-brand/5 transition-colors border-b border-brand/10 last:border-0"
                                            >
                                                <td className="px-4 pl-6 py-3 text-[11px] font-black text-brand-muted font-mono text-center bg-brand/5 border-r border-brand/50"># {c.id}</td>
                                                <td className="px-4 py-3 text-[11px] font-black text-brand-main uppercase tracking-tight">{c.tipo}</td>
                                                <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/20">Bs. {Number(c.monto_aprobado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-3 text-[12px] text-right font-black font-mono border-l border-brand/20 text-red-600 bg-red-500/5">Bs. {Number(c.saldo_capital).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-3 text-center border-l border-brand/20">
                                                    <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest border shadow-sm ${
                                                        c.estado === 'En Mora' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                        c.estado === 'Pagado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                        'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                    }`}>{c.estado}</span>
                                                </td>
                                                <td className="px-4 pr-6 py-3 text-[11px] text-right font-black font-mono text-brand-muted border-l border-brand/20">
                                                    <span className="text-emerald-600">{c.cuotas_pagadas}</span> / <span className="opacity-50">{c.cuotas_pagadas + c.cuotas_pendientes}</span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Movimientos */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-brand bg-card-fap/5 flex items-center justify-between">
                            <h3 className="text-xs font-black text-brand-main uppercase tracking-widest flex items-center gap-2">
                                <History className="w-4 h-4 text-primary" /> Historial de Transacciones {data.desde && `(${data.desde} al ${data.hasta})`}
                            </h3>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
                                <span className="flex items-center gap-2 text-emerald-600 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-600"></div> Ingresos
                                </span>
                                <span className="flex items-center gap-2 text-red-600 bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/20">
                                    <div className="w-2 h-2 rounded-full bg-red-600"></div> Egresos
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                            {movimientos.length > 0 ? (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-card-fap border-b border-brand font-black uppercase sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-4 pl-6 py-3.5 text-[10px] text-brand-muted tracking-wider w-28 text-center">Fecha</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider">Categoría</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider">Descripción del Movimiento</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand">Ingreso</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand">Egreso</th>
                                            <th className="px-4 pr-6 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand bg-brand/5">Saldo Liq.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand/10">
                                        {movimientos.map((m, i) => (
                                            <motion.tr 
                                                key={i} 
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                className="hover:bg-brand/5 transition-colors group"
                                            >
                                                <td className="px-4 pl-6 py-3 text-[11px] font-black text-brand-main font-mono text-center border-r border-brand/10">{m.fecha}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-[10px] font-black bg-brand/5 text-brand-muted px-2 py-1 rounded-lg border border-brand/50 uppercase tracking-tighter">{m.tipo}</span>
                                                </td>
                                                <td className="px-4 py-3 text-[11px] font-bold text-brand-main uppercase tracking-tight max-w-xs truncate">{m.concepto}</td>
                                                <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/10 text-emerald-600 bg-emerald-500/[0.02]">
                                                    {Number(m.ingreso) > 0 ? `Bs. ${Number(m.ingreso).toLocaleString('es-BO', { minimumFractionDigits: 2 })}` : <span className="opacity-10">—</span>}
                                                </td>
                                                <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/10 text-red-600 bg-red-500/[0.02]">
                                                    {Number(m.egreso) > 0 ? `Bs. ${Number(m.egreso).toLocaleString('es-BO', { minimumFractionDigits: 2 })}` : <span className="opacity-10">—</span>}
                                                </td>
                                                <td className="px-4 pr-6 py-3 text-[12px] text-right font-black font-mono border-l border-brand/10 bg-brand/5 group-hover:bg-brand/10 transition-colors">
                                                    Bs. {Number(m.saldo).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="bg-brand/5 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-brand/50">
                                        <AlertCircle className="w-8 h-8 text-brand-muted" />
                                    </div>
                                    <h4 className="text-xs font-black text-brand-main uppercase tracking-widest">Sin registros encontrados</h4>
                                    <p className="text-[10px] text-brand-muted font-bold uppercase tracking-tight mt-1">Ajusta el rango de fechas para ampliar la consulta del Kardex.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

