import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    CalendarDays, 
    DownloadCloud, 
    ArrowLeft, 
    Users, 
    ReceiptText, 
    HandCoins,
    Search,
    FileSpreadsheet,
    FileText
} from 'lucide-react';

export default function Planilla({ auth, titulo, cooperativa, periodo, fecha_generacion, total_socios, total_cuotas, total_general, items }) {
    const [mes, setMes] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const cambiarMes = (e) => {
        e.preventDefault();
        if (mes) router.get(route('reportes.planilla'), { mes }, { preserveState: true });
    };

    const handleExport = async (formato) => {
        setIsDownloading(true);
        try {
            const response = await window.axios({
                url: route('reportes.planilla'),
                params: { mes, formato },
                method: 'GET',
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = formato === 'csv' ? 'csv' : 'pdf';
            link.setAttribute('download', `planilla_descuento_${mes || 'actual'}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error exportando la planilla.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 py-1">
                        <ReceiptText className="w-6 h-6 text-purple-600" />
                        <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                            Planilla de Descuentos (RRHH / Tesorería)
                        </h2>
                    </div>
                    <a href={route('reportes.index')} className="text-sm text-brand-muted hover:text-brand-main font-semibold transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </a>
                </div>
            }
        >
            <Head title="Exportación de Planillas | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Filtros y Resumen */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        
                        {/* Selector de Período */}
                        <div className="lg:col-span-1 bg-card-fap border border-brand p-5 rounded-2xl shadow-sm">
                            <h3 className="text-[10px] font-black uppercase text-brand-muted mb-4 tracking-wider flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-purple-500" /> Periodo de Consulta
                            </h3>
                            <form onSubmit={cambiarMes} className="space-y-4">
                                <input 
                                    type="month" 
                                    value={mes} 
                                    onChange={(e) => setMes(e.target.value)} 
                                    className="w-full bg-main text-brand-main border border-brand text-sm px-3 py-2 rounded-xl focus:ring-purple-500 font-bold" 
                                />
                                <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                                    <Search className="w-4 h-4" /> Actualizar Datos
                                </button>
                                
                                <div className="pt-4 border-t border-brand/50 flex flex-col gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => handleExport('pdf')}
                                        disabled={isDownloading}
                                        className="w-full py-2 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white text-[11px] font-bold rounded-xl border border-red-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" /> Descargar PDF
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleExport('csv')}
                                        disabled={isDownloading}
                                        className="w-full py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[11px] font-bold rounded-xl border border-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" /> Exportar CSV
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* KPIs */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-card-fap border border-brand p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <Users className="w-8 h-8 text-purple-500 mb-3" />
                                <p className="text-[10px] font-black uppercase text-brand-muted">Total Afiliados</p>
                                <p className="text-3xl font-black text-brand-main">{total_socios}</p>
                                <p className="text-[9px] text-brand-muted mt-1 font-bold">CON DESCUENTOS ESTE MES</p>
                            </div>

                            <div className="bg-card-fap border border-brand p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <ReceiptText className="w-8 h-8 text-blue-500 mb-3" />
                                <p className="text-[10px] font-black uppercase text-brand-muted">Total Cuotas</p>
                                <p className="text-3xl font-black text-brand-main">{total_cuotas}</p>
                                <p className="text-[9px] text-brand-muted mt-1 font-bold">REGISTROS IDENTIFICADOS</p>
                            </div>

                            <div className="bg-card-fap border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-6 rounded-2xl shadow-sm">
                                <HandCoins className="w-8 h-8 text-emerald-500 mb-3" />
                                <p className="text-[10px] font-black uppercase text-brand-muted">Monto Total Recaudar</p>
                                <p className="text-3xl font-black text-emerald-600">Bs {Number(total_general).toLocaleString()}</p>
                                <p className="text-[9px] text-emerald-600 font-bold mt-1 uppercase">Para transferencia inmediata</p>
                            </div>
                        </div>

                    </div>

                    {/* Tabla de Detalle */}
                    <div className="bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-brand bg-main flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase text-brand-main">Desglose de Planilla: {periodo}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px] text-left">
                                <thead className="bg-main text-brand-muted uppercase font-black border-b border-brand">
                                    <tr>
                                        <th className="p-4 w-1/4">Socio / CI</th>
                                        <th className="p-4">Credencial / Destino</th>
                                        <th className="p-4 text-center">Cuota</th>
                                        <th className="p-4 text-right">Capital + Int.</th>
                                        <th className="p-4 text-right text-red-500">Mora</th>
                                        <th className="p-4 text-right font-black">Total a Cubrir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand/50">
                                    {items.length === 0 ? (
                                        <tr><td colSpan={6} className="p-12 text-center text-brand-muted font-bold text-sm">No existen registros de descuento para el período seleccionado.</td></tr>
                                    ) : items.map((item, i) => (
                                        <tr key={i} className="hover:bg-brand/5 border-b border-brand/10 transition-colors">
                                            <td className="p-4">
                                                <div className="font-black text-brand-main uppercase">{item.socio_nombre}</div>
                                                <div className="text-[10px] text-brand-muted">CI: {item.socio_ci}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold">{item.socio_grado}</div>
                                                <div className="text-[10px] text-brand-muted">{item.socio_destino}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-brand/10 px-2 py-0.5 rounded text-[10px] font-bold">N° {item.nro_cuota}</span>
                                            </td>
                                            <td className="p-4 text-right text-brand-main">
                                                Bs {(Number(item.capital) + Number(item.interes)).toFixed(2)}
                                            </td>
                                            <td className={`p-4 text-right font-black ${Number(item.mora) > 0 ? 'text-red-500' : 'text-brand-muted'}`}>
                                                {Number(item.mora) > 0 ? `Bs ${Number(item.mora).toFixed(2)}` : '—'}
                                            </td>
                                            <td className="p-4 text-right font-black text-brand-main text-xs">
                                                Bs {Number(item.total_descontar).toLocaleString()}
                                            </td>
                                        </tr>
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
