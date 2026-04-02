import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart3, 
    DownloadCloud, 
    FileWarning, 
    Wallet, 
    ShieldCheck,
    CalendarDays,
    CheckCircle
} from 'lucide-react';

export default function Index({ auth }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');

    const [isDownloadingCartera, setIsDownloadingCartera] = useState(false);
    const [carteraDownloadSuccess, setCarteraDownloadSuccess] = useState(false);

    const [isDownloadingMorosidad, setIsDownloadingMorosidad] = useState(false);
    const [morosidadDownloadSuccess, setMorosidadDownloadSuccess] = useState(false);

    const handleCarteraDownload = async (formato) => {
        setIsDownloadingCartera(true);
        try {
            const response = await window.axios({
                url: route('reportes.cartera', { formato }),
                method: 'GET',
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = formato === 'xlsx' ? 'xlsx' : 'pdf';
            const filename = `cartera_general_${new Date().getTime()}.${extension}`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setIsDownloadingCartera(false);
            setCarteraDownloadSuccess(true);
            setTimeout(() => setCarteraDownloadSuccess(false), 5000); 
        } catch (error) {
            setIsDownloadingCartera(false);
            console.error('Error generando reporte de Cartera:', error);
            alert('Error generando el reporte de Cartera General.');
        }
    };

    const handleMorosidadDownload = async (formato) => {
        setIsDownloadingMorosidad(true);
        try {
            const response = await window.axios({
                url: route('reportes.morosidad', { formato }),
                method: 'GET',
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = formato === 'xlsx' ? 'xlsx' : 'pdf';
            const filename = `morosidad_corporativa_${new Date().getTime()}.${extension}`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setIsDownloadingMorosidad(false);
            setMorosidadDownloadSuccess(true);
            setTimeout(() => setMorosidadDownloadSuccess(false), 5000); 
        } catch (error) {
            setIsDownloadingMorosidad(false);
            console.error('Error generando reporte de Morosidad:', error);
            alert('Error generando el reporte de Morosidad Corporativa.');
        }
    };

    if (!isAdmin) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="p-8 text-center text-red-500 font-bold">Sin privilegios.</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3 py-1">
                    <BarChart3 className="w-6 h-6 text-brand-main" />
                    <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                        Centro de Control y Reportes
                    </h2>
                </div>
            }
        >
            <Head title="Reportes Gerenciales | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Banner Intro */}
                    <div className="bg-card-fap border border-brand py-5 px-6 rounded-2xl shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-brand-main mb-1">Inteligencia de Negocios Corporativa</h3>
                            <p className="text-sm text-brand-muted max-w-3xl leading-relaxed">
                                Extrae la información analítica de la cooperativa en tiempo real. 
                                Todos los documentos generados contienen cierres perimetrales exactos al momento de la descarga.
                            </p>
                        </div>
                    </div>

                    {/* Malla de Reportes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Reporte 0: Histórico de Crédito (Central de Riesgos) */}
                        <div className="group bg-card-fap border border-emerald-500/30 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            
                            <div>
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-colors">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Histórico de Crédito</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Explorador interactivo. Actúa como Buro Central de Riesgos detallando movimientos, pagos, atrasos y nivel crediticio por Socio.
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-auto">
                                <a 
                                    href={route('reportes.historico')}
                                    className="w-full relative px-4 py-2.5 text-xs font-bold text-center text-white bg-emerald-600 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    Abrir Buro de Riesgo
                                </a>
                            </div>
                        </div>

                        {/* Reporte 1: Cartera de Créditos */}
                        <div className="group bg-card-fap border border-brand rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            
                            <div>
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                                    <Wallet className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Cartera General</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Extrae el patrón completo de créditos vigentes, finalizados y en mora. Incluye detalle de socios, montos y saldos actuales de capital.
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-auto">
                                {!carteraDownloadSuccess ? (
                                    <>
                                        <button 
                                            onClick={() => handleCarteraDownload('xlsx')}
                                            disabled={isDownloadingCartera}
                                            className="w-full relative px-4 py-2.5 text-xs font-bold text-center text-white bg-primary rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {isDownloadingCartera ? (
                                                <><span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> Procesando...</>
                                            ) : (
                                                <><DownloadCloud className="w-4 h-4" /> Exportar a Excel (XLSX)</>
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => handleCarteraDownload('pdf')}
                                            disabled={isDownloadingCartera}
                                            className="w-full relative px-4 py-2 text-xs font-semibold text-center text-brand-muted bg-brand/5 border border-brand/10 hover:border-brand/30 hover:bg-brand/10 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            Descargar Resumen PDF
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-3 text-center px-4 bg-emerald-500/10 border border-emerald-500 rounded-xl animate-in fade-in zoom-in duration-300">
                                        <CheckCircle className="w-6 h-6 text-emerald-500 mb-1 drop-shadow" />
                                        <h4 className="text-emerald-600 font-extrabold text-[11px] uppercase tracking-wider">¡Descarga Completada!</h4>
                                        <p className="text-[9px] font-medium text-emerald-700/80 leading-tight">
                                            El archivo de Cartera está en tu equipo.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reporte 2: Morosidad y Riesgo */}
                        <div className="group bg-card-fap border border-red-500/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            
                            <div>
                                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-red-500 transition-colors">
                                    <FileWarning className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Morosidad Corporativa</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Listado filtrado estrictamente por créditos en incumplimiento. Incluye cálculo de Mora, días de retraso, y monto total exigible inmediato.
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-auto">
                                {!morosidadDownloadSuccess ? (
                                    <>
                                        <button 
                                            onClick={() => handleMorosidadDownload('xlsx')}
                                            disabled={isDownloadingMorosidad}
                                            className="w-full relative px-4 py-2.5 text-xs font-bold text-center text-white bg-red-600 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {isDownloadingMorosidad ? (
                                                <><span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> Procesando...</>
                                            ) : (
                                                <><DownloadCloud className="w-4 h-4" /> Exportar a Excel (XLSX)</>
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => handleMorosidadDownload('pdf')}
                                            disabled={isDownloadingMorosidad}
                                            className="w-full relative px-4 py-2 text-xs font-semibold text-center text-red-600 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            Descargar Resumen PDF
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-3 text-center px-4 bg-emerald-500/10 border border-emerald-500 rounded-xl animate-in fade-in zoom-in duration-300">
                                        <CheckCircle className="w-6 h-6 text-emerald-500 mb-1 drop-shadow" />
                                        <h4 className="text-emerald-600 font-extrabold text-[11px] uppercase tracking-wider">¡Descarga Completada!</h4>
                                        <p className="text-[9px] font-medium text-emerald-700/80 leading-tight">
                                            El archivo de Mora está en tu equipo.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reporte Propuesta A: Recaudación */}
                        <div className="group bg-card-fap border border-blue-500/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            <div>
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-blue-500 transition-colors">
                                    <BarChart3 className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Recaudación Global</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Muestra comparativa entre Desembolso Total (Colocación) vs Recupero Total de cuotas por rango de tiempo.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <a 
                                    href={route('reportes.recaudacion')}
                                    className="w-full relative px-4 py-2 text-xs font-bold text-center text-blue-600 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Ver Análisis de Liquidez
                                </a>
                            </div>
                        </div>

                        {/* Reporte Propuesta B: E-Commerce */}
                        <div className="group bg-card-fap border border-brand/50 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-5">
                                    <CalendarDays className="w-5 h-5 text-orange-500" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Rendimiento Comercial</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Métricas de ventas en Tienda Virtual, QR cobrados, Top Productos e Ingresos en línea.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <a 
                                    href={route('reportes.ecommerce')}
                                    className="w-full px-4 py-2 text-xs font-bold text-center text-orange-600 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 rounded-xl flex items-center justify-center gap-2 transition-all"
                                >
                                    Ver Análisis de Ventas
                                </a>
                            </div>
                        </div>

                        {/* Reporte Propuesta C: Planilla de Descuentos */}
                        <div className="group bg-card-fap border border-purple-500/30 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            <div>
                                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-purple-500 transition-colors">
                                    <CalendarDays className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Descuentos de Planilla</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Exportación mensual obligatoria para Tesorería listando total de descuentos por aportaciones, comercio y deudas.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <a 
                                    href={route('reportes.planilla')}
                                    className="w-full px-4 py-2.5 text-xs font-bold text-center text-white bg-purple-600 rounded-xl hover:translate-y-[-2px] transition-transform shadow-md hover:shadow-purple-500/30 flex items-center justify-center gap-2"
                                >
                                    Generar Planilla (Fase Actual)
                                </a>
                            </div>
                        </div>

                        {/* Reporte Propuesta D: Caja General */}
                        <div className="group bg-card-fap border border-emerald-500/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            <div>
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-colors">
                                    <Wallet className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Caja General (Libro)</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Visualización cronológica de Ingresos, Egresos y Saldos Reales. Filtrable por Cajero y rango de fechas.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <a 
                                    href={route('reportes.caja')}
                                    className="w-full px-4 py-2.5 text-xs font-bold text-center text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                    Ver Libro de Caja
                                </a>
                            </div>
                        </div>

                        {/* Reporte Propuesta E: Triangulación (NUEVO) */}
                        <div className="group bg-card-fap border border-amber-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            <div>
                                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-amber-500 transition-colors">
                                    <BarChart3 className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Triangulación Ecommerce</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Tablero de Conciliación: Pagados vs Entregados. Vital para auditar stock comprometido vs dinero físico en caja.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <a 
                                    href={route('reportes.conciliacion-ecommerce')}
                                    className="w-full px-4 py-2.5 text-xs font-bold text-center text-amber-700 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                    Auditar Entregas Pendientes
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
