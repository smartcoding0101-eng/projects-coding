import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Download, UserCircle, Briefcase, FileText, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Index({ auth, asientos }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
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
                        <button className="px-5 py-2.5 bg-card-fap text-primary border border-brand rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:border-primary/30 transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 group">
                            <Download className="w-3.5 h-3.5 group-hover:animate-bounce" /> Exportar a PDF
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Libro Diario | Fapclas" />

            <div className="py-6 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ══════════ GRILLA DE DETALLE CONTABLE (SAP FIORI) ══════════ */}
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
                                        <th className="px-4 pl-6 py-3 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider w-32">Fecha (ID)</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider w-48">Referencia de Socio</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-brand-main uppercase tracking-wider">Concepto de la Transacción</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-brand-main uppercase tracking-wider w-36 border-l border-brand">Debe (Ingreso)</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-brand-main uppercase tracking-wider w-36">Haber (Egreso)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asientos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center bg-card-fap">
                                                <div className="flex flex-col items-center gap-3 text-brand-muted">
                                                    <FileText className="w-10 h-10 text-brand-muted opacity-30" />
                                                    <p className="text-sm font-semibold">Libro sin registros</p>
                                                    <p className="text-[11px]">No hay asientos contables en este período.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        asientos.data.map((asiento, idx) => (
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
                                                            <div className="w-6 h-6 rounded-full bg-brand/5 flex items-center justify-center text-primary border border-brand/50 shrink-0">
                                                                <UserCircle className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="truncate w-32 md:w-full">
                                                                <div className="text-[11px] font-bold text-brand-main truncate" title={asiento.user.name}>{asiento.user.name}</div>
                                                                <div className="text-[10px] text-brand-muted font-mono font-medium mt-0.5">CI: {asiento.user.ci}</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-brand-muted flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-primary/70" /> Cuenta Institucional</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs text-brand-main font-semibold truncate max-w-sm mb-1" title={asiento.concepto}>{asiento.concepto}</div>
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ring-1 bg-brand/5 text-brand-muted ring-brand/20">
                                                        {asiento.tipo_transaccion}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right border-l border-brand">
                                                    {Number(asiento.ingreso) > 0 ? (
                                                        <span className="text-xs font-black text-emerald-600 tabular-nums">
                                                            +Bs {Number(asiento.ingreso).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="text-brand-muted/20 text-xs font-bold">—</span>}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(asiento.egreso) > 0 ? (
                                                        <span className="text-xs font-black text-red-500 tabular-nums">
                                                            -Bs {Number(asiento.egreso).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="text-brand-muted/20 text-xs font-bold">—</span>}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
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
