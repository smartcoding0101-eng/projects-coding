import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart3, 
    DownloadCloud, 
    FileWarning, 
    Wallet, 
    ShieldCheck,
    CalendarDays
} from 'lucide-react';

export default function Index({ auth }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');

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

                        {/* Reporte 1: Cartera de Créditos */}
                        <div className="group bg-card-fap border border-brand rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            
                            <div>
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                                    <Wallet className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Cartera General</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Extrae el patrón completo de créditos vigentes, finalizados y en mora. Incluye detalle de socios, montos originales y saldos actuales de capital.
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-auto">
                                <a 
                                    href={route('reportes.cartera', { formato: 'xlsx' })}
                                    target="_blank"
                                    className="w-full relative px-4 py-2.5 text-xs font-bold text-center text-white bg-primary rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <DownloadCloud className="w-4 h-4" /> Exportar a Excel (XLSX)
                                </a>
                                <a 
                                    href={route('reportes.cartera', { formato: 'pdf' })}
                                    target="_blank"
                                    className="w-full relative px-4 py-2 text-xs font-semibold text-center text-brand-muted bg-brand/5 border border-brand/10 hover:border-brand/30 hover:bg-brand/10 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Descargar Resumen PDF
                                </a>
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
                                <a 
                                    href={route('reportes.morosidad', { formato: 'xlsx' })}
                                    target="_blank"
                                    className="w-full relative px-4 py-2.5 text-xs font-bold text-center text-white bg-red-600 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <DownloadCloud className="w-4 h-4" /> Exportar a Excel (XLSX)
                                </a>
                                <a 
                                    href={route('reportes.morosidad', { formato: 'pdf' })}
                                    target="_blank"
                                    className="w-full relative px-4 py-2 text-xs font-semibold text-center text-red-600 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Descargar Resumen PDF
                                </a>
                            </div>
                        </div>

                        {/* Reporte 3: Planilla Tesorería (Próximamente / Fase Contable) */}
                        <div className="group bg-card-fap border border-brand/50 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between opacity-70 grayscale">
                            <div>
                                <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center mb-5">
                                    <CalendarDays className="w-5 h-5 text-brand" />
                                </div>
                                <h4 className="text-lg font-black text-brand-main mb-2">Descuentos de Planilla</h4>
                                <p className="text-xs text-brand-muted leading-relaxed mb-6">
                                    Exportación masiva de descuentos (Préstamos + Aportaciones) consolidada para enviar a Tesorería Policial al cierre de mes.
                                </p>
                            </div>
                            
                            <div className="mt-auto">
                                <div className="w-full px-4 py-2.5 text-xs font-bold text-center text-brand-muted bg-brand/5 border flex items-center justify-center gap-2 rounded-xl">
                                    En desarrollo (Fase Contable)
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
