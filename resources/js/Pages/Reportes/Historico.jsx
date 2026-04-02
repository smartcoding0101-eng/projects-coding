import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Search, DownloadCloud, Wallet, CalendarDays, FileWarning, Banknote } from 'lucide-react';

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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 py-1">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                            Histórico de Crédito (Central de Riesgos)
                        </h2>
                    </div>
                    <a href={route('reportes.index')} className="text-sm text-brand-muted hover:text-brand-main font-semibold transition-colors">Volver a Reportes</a>
                </div>
            }
        >
            <Head title="Histórico de Riesgo | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Fila superior: Filtros y Datos del Socio */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Panel de Búsqueda */}
                        <div className="lg:col-span-1 bg-card-fap border border-brand p-5 rounded-xl shadow-sm">
                            <h3 className="text-sm font-black text-brand-main mb-4 uppercase tracking-wide flex items-center gap-2">
                                <Search className="w-4 h-4 text-emerald-600" /> Explorador de Afiliados
                            </h3>
                            <form onSubmit={aplicarFiltros} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-brand-muted mb-1">Seleccionar Socio</label>
                                    <select 
                                        value={socioId} 
                                        onChange={e => setSocioId(e.target.value)}
                                        className="w-full bg-main text-brand-main border border-brand text-xs py-2 px-3 rounded-md focus:ring-emerald-500 focus:border-emerald-500 font-bold"
                                    >
                                        <option value="">-- Elige un Afiliado --</option>
                                        {socios_catalogo?.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.ci || 'Sin CI'}) - {s.grado || 'Socio'}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-brand-muted mb-1">Rango Inicio</label>
                                        <input 
                                            type="date" 
                                            value={fechaInicio} 
                                            onChange={e => setFechaInicio(e.target.value)}
                                            className="w-full bg-main text-brand-main border border-brand text-[11px] py-1.5 px-2 rounded-md focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-brand-muted mb-1">Rango Fin</label>
                                        <input 
                                            type="date" 
                                            value={fechaFin} 
                                            onChange={e => setFechaFin(e.target.value)}
                                            className="w-full bg-main text-brand-main border border-brand text-[11px] py-1.5 px-2 rounded-md focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-md transition-colors shadow-sm">
                                        Procesar Histórico
                                    </button>
                                    <button type="button" onClick={limpiarFiltros} className="px-3 bg-brand/10 hover:bg-brand/20 text-brand-main text-xs font-bold py-2 rounded-md transition-colors">
                                        Limpiar
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Perfil Resultante */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900/10 to-transparent border border-emerald-500/20 rounded-xl p-5 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
                            {socio_seleccionado ? (
                                <div className="w-full flex items-center gap-6">
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center shadow-inner flex-shrink-0">
                                        <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-black text-brand-main tracking-tight uppercase">{socio_seleccionado.name}</h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs font-bold text-brand-muted bg-main px-2 py-0.5 rounded border border-brand">CI: {socio_seleccionado.ci || 'N/D'}</span>
                                            <span className="text-xs font-bold text-brand-muted bg-main px-2 py-0.5 rounded border border-brand">Grado: {socio_seleccionado.grado || 'Socio'}</span>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${metricas.cuotas_mora_historicas > 0 ? 'bg-red-500/10 text-red-600 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'}`}>
                                                {metricas.cuotas_mora_historicas > 0 ? 'Riesgo Advertido' : 'Excelente Pagador'}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Botonera de Exportación */}
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => handleExport('pdf')}
                                            disabled={isDownloading}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            <DownloadCloud className="w-4 h-4" /> Certificado PDF
                                        </button>
                                        <button 
                                            onClick={() => handleExport('xlsx')}
                                            disabled={isDownloading}
                                            className="px-4 py-2 bg-white dark:bg-main border border-brand text-brand-main text-[11px] font-bold rounded-lg hover:bg-brand/5 flex items-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            <DownloadCloud className="w-4 h-4" /> Exportar CSV
                                        </button>
                                        {isDownloading && (
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 animate-pulse px-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Generando...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <ShieldCheck className="w-10 h-10 text-brand-muted/30 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-brand-muted uppercase tracking-wider">Esperando Selección...</p>
                                    <p className="text-xs text-brand-muted/70 mt-1 max-w-sm">Utiliza el explorador de afiliados para cargar su expediente crediticio completo, historial de deudas y perfil de riesgo.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {socio_seleccionado && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Panel de Métricas Rápidas */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-card-fap border border-brand p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-brand-muted">Créditos Totales</p>
                                        <p className="text-xl font-black text-brand-main">{metricas.creditos_totales}</p>
                                    </div>
                                </div>
                                <div className="bg-card-fap border border-brand p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                        <Banknote className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-brand-muted">Capital Aprobado Histórico</p>
                                        <p className="text-xl font-black text-brand-main">Bs {parseFloat(metricas.monto_total_aprobado).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="bg-card-fap border border-brand p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-brand-muted">Capital Amortizado (Pagado)</p>
                                        <p className="text-xl font-black text-brand-main">Bs {parseFloat(metricas.capital_pagado_total).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="bg-card-fap border border-red-500/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                                        <FileWarning className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-red-600">Eventos de Mora (Histórico)</p>
                                        <p className="text-xl font-black text-red-600">{metricas.cuotas_mora_historicas} retrazos</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Tabla de Créditos Gestados */}
                                <div className="bg-card-fap border border-brand rounded-xl shadow-sm overflow-hidden flex flex-col h-[400px]">
                                    <div className="p-4 border-b border-brand bg-main flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase text-brand-main">Historial de Créditos Solicitados</h3>
                                        <span className="text-[10px] font-bold text-brand-muted">{historial_creditos.length} expedientes</span>
                                    </div>
                                    <div className="flex-1 overflow-auto p-0">
                                        <table className="w-full text-left text-xs text-brand-main">
                                            <thead className="text-[10px] uppercase bg-main text-brand-muted sticky top-0 border-b border-brand">
                                                <tr>
                                                    <th className="py-2.5 px-4">Crédito / Tipo</th>
                                                    <th className="py-2.5 px-4 text-right">Bs Aprobado</th>
                                                    <th className="py-2.5 px-4 text-center">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-brand/50">
                                                {historial_creditos.length === 0 ? (
                                                    <tr><td colSpan="3" className="py-8 text-center text-brand-muted font-medium">No se encontraron créditos en el periodo.</td></tr>
                                                ) : historial_creditos.map(c => (
                                                    <tr key={c.id} className="hover:bg-main/50 transition-colors">
                                                        <td className="py-3 px-4">
                                                            <div className="font-bold">Solicitud #{c.id}</div>
                                                            <div className="text-[10px] text-brand-muted">{c.tipo_credito?.nombre || 'General'} (Tasa: {c.tasa_interes}%)</div>
                                                        </td>
                                                        <td className="py-3 px-4 text-right font-black">
                                                            {(c.saldo_capital <= 0 && c.estado === 'Pagado') ? <span className="text-emerald-600 text-[10px] font-bold block">Liquidado</span> : null}
                                                            Bs {parseFloat(c.monto_aprobado).toFixed(2)}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                                                c.estado === 'Pagado' ? 'bg-emerald-500/10 text-emerald-600' :
                                                                c.estado === 'Desembolsado' ? 'bg-blue-500/10 text-blue-600' :
                                                                c.estado === 'En Mora' ? 'bg-red-500/10 text-red-600' :
                                                                'bg-brand/10 text-brand-muted'
                                                            }`}>
                                                                {c.estado}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Tabla de Movimientos de Pagos y Mora */}
                                <div className="bg-card-fap border border-brand rounded-xl shadow-sm overflow-hidden flex flex-col h-[400px]">
                                    <div className="p-4 border-b border-brand bg-main flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase text-brand-main">Historial de Amortización (Cuotas)</h3>
                                        <span className="text-[10px] font-bold text-brand-muted">{historial_pagos.length} registros</span>
                                    </div>
                                    <div className="flex-1 overflow-auto p-0">
                                        <table className="w-full text-left text-xs text-brand-main">
                                            <thead className="text-[10px] uppercase bg-main text-brand-muted sticky top-0 border-b border-brand">
                                                <tr>
                                                    <th className="py-2.5 px-4 w-[25%]">Vencimiento</th>
                                                    <th className="py-2.5 px-4">Concepto</th>
                                                    <th className="py-2.5 px-4 text-right">Monto</th>
                                                    <th className="py-2.5 px-4 text-center">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-brand/50">
                                                {historial_pagos.length === 0 ? (
                                                    <tr><td colSpan="4" className="py-8 text-center text-brand-muted font-medium">No se encontraron cobros/pagos en el periodo.</td></tr>
                                                ) : historial_pagos.map(p => (
                                                    <tr key={p.id} className="hover:bg-main/50 transition-colors">
                                                        <td className="py-3 px-4 whitespace-nowrap">
                                                            <div className="font-bold">{p.vencimiento}</div>
                                                            {p.fecha_pago && <div className="text-[9px] text-emerald-600 font-bold uppercase">Pagado el {p.fecha_pago}</div>}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="font-bold">{p.credito}</div>
                                                            <div className="text-[10px] text-brand-muted">Cuota Nro. {p.cuota}</div>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <span className="font-black text-brand-main block">Bs {parseFloat(p.total).toFixed(2)}</span>
                                                            {p.mora > 0 && <span className="text-[9px] text-red-500 font-bold block">+ Bs {parseFloat(p.mora).toFixed(2)} mora</span>}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                                                p.estado === 'Pagada' ? 'bg-emerald-500/10 text-emerald-600' :
                                                                p.estado === 'Retrasada' ? 'bg-red-500/10 text-red-600' :
                                                                'bg-brand/10 text-brand-muted'
                                                            }`}>
                                                                {p.estado}
                                                            </span>
                                                        </td>
                                                    </tr>
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
