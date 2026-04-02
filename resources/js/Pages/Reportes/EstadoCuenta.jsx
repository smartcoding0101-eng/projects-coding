import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    Target
} from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function EstadoCuenta({ auth, fecha_generacion, socio, resumen, creditos, movimientos, socios }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');
    const [socioId, setSocioId] = useState('');

    const cambiarSocio = () => {
        if (socioId) router.get(route('reportes.estado-cuenta'), { socio_id: socioId }, { preserveState: true });
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
                            <a 
                                href={`${route('reportes.estado-cuenta')}?formato=pdf${socio ? '&socio_id=' + (socio.id) : ''}`} 
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2" 
                                target="_blank"
                            >
                                <DownloadCloud className="w-3.5 h-3.5" /> Descargar PDF
                            </a>
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
            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Selector de socio para admin */}
                    {isAdmin && socios.length > 0 && (
                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-end gap-4 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Search className="w-12 h-12 text-brand-main" />
                            </div>
                            <div className="flex-1 relative z-10">
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest">Consultar Registro de Socio</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted group-hover:text-primary transition-colors" />
                                    <select 
                                        value={socioId} 
                                        onChange={(e) => setSocioId(e.target.value)} 
                                        className="w-full bg-main border-brand rounded-xl pl-9 text-xs font-black text-brand-main focus:ring-primary focus:border-primary transition-all appearance-none uppercase"
                                    >
                                        <option value="">— Mi Cuenta Personal —</option>
                                        {socios.map(s => <option key={s.id} value={s.id}>{s.name} {s.ci ? `(${s.ci})` : ''}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button 
                                onClick={cambiarSocio} 
                                className="bg-brand-main hover:bg-brand-hover text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
                            >
                                <Search className="w-3.5 h-3.5" /> Consultar Perfil
                            </button>
                        </div>
                    )}

                    {/* Info del socio */}
                    <div className="bg-card-fap border border-brand rounded-2xl p-6 shadow-sm relative overflow-hidden">
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
                    </div>

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
                                            <th className="px-4 pl-6 py-3.5 text-[10px] text-brand-muted tracking-wider w-16">ID</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider">Tipo Operación</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand">Aprobado</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand">Saldo Cap.</th>
                                            <th className="px-4 py-3.5 text-[10px] text-brand-muted tracking-wider text-center border-l border-brand">Estado</th>
                                            <th className="px-4 pr-6 py-3.5 text-[10px] text-brand-muted tracking-wider text-right border-l border-brand">C. Pagadas/Pend.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand/20">
                                        {creditos.map((c, index) => (
                                            <motion.tr 
                                                key={c.id} 
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-brand/5 transition-colors border-b border-brand/10 last:border-0"
                                            >
                                                <td className="px-4 pl-6 py-3 text-[11px] font-black text-brand-muted font-mono">{c.id}</td>
                                                <td className="px-4 py-3 text-[11px] font-black text-brand-main uppercase tracking-tight">{c.tipo}</td>
                                                <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/50">Bs. {Number(c.monto_aprobado).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-3 text-[12px] text-right font-black font-mono border-l border-brand/50 text-red-600 bg-red-500/5">Bs. {Number(c.saldo_capital).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                                                <td className="px-4 py-3 text-center border-l border-brand/50">
                                                    <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest border shadow-sm ${
                                                        c.estado === 'En Mora' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                        c.estado === 'Pagado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                        'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                    }`}>{c.estado}</span>
                                                </td>
                                                <td className="px-4 pr-6 py-3 text-[11px] text-right font-black font-mono text-brand-muted border-l border-brand/50">{c.cuotas_pagadas} / {c.cuotas_pendientes}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Movimientos */}
                    {movimientos.length > 0 && (
                        <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-brand bg-card-fap/5 flex items-center justify-between">
                                <h3 className="text-xs font-black text-brand-main uppercase tracking-widest flex items-center gap-2">
                                    <History className="w-4 h-4 text-primary" /> Historial de Transacciones
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
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-card-fap border-b border-brand font-black uppercase sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-4 pl-6 py-3.5 text-[10px] text-brand-muted tracking-wider w-28">Fecha</th>
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
                                                initial={{ opacity: 0, y: 5 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="hover:bg-brand/5 transition-colors group"
                                            >
                                                <td className="px-4 pl-6 py-3 text-[11px] font-black text-brand-main font-mono">{m.fecha}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-[10px] font-black bg-brand/5 text-brand-muted px-2 py-1 rounded-lg border border-brand/50 uppercase tracking-tighter">{m.tipo}</span>
                                                </td>
                                                <td className="px-4 py-3 text-[11px] font-bold text-brand-main uppercase tracking-tight max-w-xs truncate">{m.concepto}</td>
                                                <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/50 text-emerald-600">
                                                    {Number(m.ingreso) > 0 ? `Bs. ${Number(m.ingreso).toLocaleString('es-BO', { minimumFractionDigits: 2 })}` : <span className="opacity-10">—</span>}
                                                </td>
                                                <td className="px-4 py-3 text-[11px] text-right font-black font-mono border-l border-brand/50 text-red-600">
                                                    {Number(m.egreso) > 0 ? `Bs. ${Number(m.egreso).toLocaleString('es-BO', { minimumFractionDigits: 2 })}` : <span className="opacity-10">—</span>}
                                                </td>
                                                <td className="px-4 pr-6 py-3 text-[12px] text-right font-black font-mono border-l border-brand/50 bg-brand/5 group-hover:bg-brand/10 transition-colors">
                                                    Bs. {Number(m.saldo).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
