import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Download, UserCircle, Briefcase, FileText } from 'lucide-react';

export default function Index({ auth, asientos }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Módulo de Finanzas</h2>}
        >
            <Head title="Libro Diario" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ══════════ ENCABEZADO Y TOOLBAR ══════════ */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row items-center justify-between p-4 bg-[#fafaf6]">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-fapclas-600" />
                            <div>
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                    Libro Diario Mayor
                                </h3>
                                <p className="text-[11px] text-fapclas-500 font-medium">
                                    Registro Central de Asientos Contables FAPCLAS
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button className="px-4 py-2 bg-fapclas-800 hover:bg-fapclas-900 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors shadow-sm active:translate-y-px">
                                <Download className="w-4 h-4" /> Exportar a PDF
                            </button>
                        </div>
                    </div>

                    {/* ══════════ GRILLA DE DETALLE CONTABLE ══════════ */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-[#fafaf6] border-b border-fapclas-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-32">Fecha (ID)</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-48">Referencia de Socio</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-fapclas-500 uppercase tracking-wider">Concepto de la Transacción</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-36 border-l border-fapclas-100 bg-[#fdfdfc]">Debe (Ingreso)</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-36 bg-[#fdfdfc]">Haber (Egreso)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fapclas-100">
                                    {asientos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-fapclas-400 bg-fapclas-50/30">
                                                <FileText className="w-8 h-8 mx-auto mb-3 text-fapclas-300 opacity-50" />
                                                <p className="text-sm font-bold uppercase tracking-wider">Libro sin registros</p>
                                                <p className="text-[11px] mt-1">No hay asientos contables en este período.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        asientos.data.map((asiento) => (
                                            <tr key={asiento.id} className="hover:bg-fapclas-50/60 transition-colors">
                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                    <div className="text-xs text-fapclas-500 font-medium">{asiento.fecha}</div>
                                                    <div className="text-[9px] text-fapclas-300 font-mono mt-0.5">#{String(asiento.id).padStart(6, '0')}</div>
                                                </td>
                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                    {asiento.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-fapclas-100 flex items-center justify-center text-fapclas-600 border border-fapclas-200 shrink-0">
                                                                <UserCircle className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="truncate w-32 md:w-full">
                                                                <div className="text-[11px] font-bold text-fapclas-900 truncate" title={asiento.user.name}>{asiento.user.name}</div>
                                                                <div className="text-[10px] text-fapclas-500 font-mono mt-0.5">CI:{asiento.user.ci}</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-fapclas-400 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Cuenta Institucional</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <div className="text-xs text-fapclas-900 font-bold truncate max-w-sm" title={asiento.concepto}>{asiento.concepto}</div>
                                                    <div className="text-[9px] font-bold text-fapclas-400 uppercase tracking-widest mt-1 bg-fapclas-50 px-1.5 py-0.5 rounded inline-block">
                                                        {asiento.tipo_transaccion}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-right font-bold text-emerald-700 font-mono tracking-tight bg-[#fdfdfc] border-l border-fapclas-100 shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    {Number(asiento.ingreso) > 0 ? Number(asiento.ingreso).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-right font-bold text-red-600 font-mono tracking-tight bg-[#fdfdfc]">
                                                    {Number(asiento.egreso) > 0 ? Number(asiento.egreso).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación Lineal */}
                        {asientos.links && asientos.links.length > 3 && (
                            <div className="px-4 py-3 border-t border-fapclas-100 bg-[#fafaf6] flex items-center justify-between">
                                <p className="text-[11px] text-fapclas-500 font-semibold uppercase tracking-wider">
                                    Mostrando pág. {asientos.current_page} de {asientos.last_page} ({asientos.total} asientos)
                                </p>
                                <div className="flex gap-1">
                                    {asientos.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-2.5 py-1 text-xs font-bold rounded border ${
                                                link.active
                                                    ? 'bg-fapclas-800 text-white border-fapclas-800'
                                                    : link.url
                                                        ? 'bg-white text-fapclas-600 border-fapclas-200 hover:bg-fapclas-50'
                                                        : 'bg-[#fafaf6] text-fapclas-300 border-fapclas-100 cursor-not-allowed hidden md:block'
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
