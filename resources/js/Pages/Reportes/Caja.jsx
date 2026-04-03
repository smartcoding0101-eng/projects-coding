import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    Wallet, 
    ChevronLeft, 
    TrendingUp, 
    TrendingDown, 
    CircleDollarSign,
    Calendar,
    Users,
    Search,
    FileSpreadsheet,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    History,
    DownloadCloud,
    CheckCircle,
    FilePieChart,
    Filter,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CajaGeneral({ auth, filtros, resumen, movimientos, grafico, cajeros }) {
    const [params, setParams] = useState({
        desde: filtros.desde || '',
        hasta: filtros.hasta || '',
        cajero_id: filtros.cajero_id || ''
    });

    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('reportes.caja'), params, { preserveState: true });
    };

    const handleDownload = (formato) => {
        setIsDownloading(true);
        
        const queryParams = new URLSearchParams({
            formato,
            ...params
        }).toString();

        window.location.href = `${route('reportes.caja')}?${queryParams}`;
        
        setTimeout(() => {
            setIsDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 5000); 
        }, 2000);
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { font: { weight: 'bold', size: 10 } } },
        },
        scales: {
            y: { grid: { color: 'rgba(156, 163, 175, 0.1)' } },
            x: { grid: { display: false } }
        }
    };

    const chartData = {
        labels: grafico.map(g => new Date(g.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })),
        datasets: [
            {
                label: 'Ingresos',
                data: grafico.map(g => g.total_ingreso),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderRadius: 4
            },
            {
                label: 'Egresos',
                data: grafico.map(g => g.total_egreso),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderRadius: 4
            }
        ]
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3 text-brand-main">
                        <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            <Wallet className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-sm tracking-tight">
                                Libro de Caja General
                            </span>
                            <span className="text-[11px] text-brand-muted font-bold tracking-wider uppercase">
                                Auditoría de Flujos Institucionales
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        {!downloadSuccess ? (
                            <div className="flex items-center bg-card-fap border border-brand rounded-xl overflow-hidden shadow-sm">
                                <button 
                                    onClick={() => handleDownload('pdf')}
                                    disabled={isDownloading}
                                    className="px-4 py-2 text-[10px] font-black text-brand-muted hover:text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 border-r border-brand disabled:opacity-50"
                                >
                                    <FileText className="w-3.5 h-3.5 text-red-500" /> PDF
                                </button>
                                <button 
                                    onClick={() => handleDownload('xlsx')}
                                    disabled={isDownloading}
                                    className="px-4 py-2 text-[10px] font-black text-brand-muted hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> EXCEL
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500 rounded-xl animate-in fade-in zoom-in duration-300">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Exportación Completa</span>
                            </div>
                        )}
                        <Link 
                            href={route('reportes.index')} 
                            className="bg-card-fap border border-brand text-brand-muted hover:text-brand-main text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center px-4 py-2 gap-2"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Volver
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Caja General | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Filtros Inteligentes */}
                    <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Filter className="w-16 h-16 text-brand-main" />
                        </div>
                        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end relative z-10">
                            <div>
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest">Periodo Desde</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted group-hover:text-primary transition-colors" />
                                    <input 
                                        type="date" 
                                        value={params.desde}
                                        onChange={e => setParams({...params, desde: e.target.value})}
                                        className="w-full bg-main border-brand rounded-xl pl-9 text-xs font-black text-brand-main focus:ring-primary focus:border-primary transition-all" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest">Periodo Hasta</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted group-hover:text-primary transition-colors" />
                                    <input 
                                        type="date" 
                                        value={params.hasta}
                                        onChange={e => setParams({...params, hasta: e.target.value})}
                                        className="w-full bg-main border-brand rounded-xl pl-9 text-xs font-black text-brand-main focus:ring-primary focus:border-primary transition-all" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-widest">Operador / Cajero</label>
                                <div className="relative group">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted group-hover:text-primary transition-colors" />
                                    <select 
                                        value={params.cajero_id}
                                        onChange={e => setParams({...params, cajero_id: e.target.value})}
                                        className="w-full bg-main border-brand rounded-xl pl-9 text-xs font-black text-brand-main focus:ring-primary focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="">TODOS LOS CAJEROS</option>
                                        {cajeros.map(c => (
                                            <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="bg-brand-main hover:bg-brand-hover text-white py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5">
                                <Search className="w-3.5 h-3.5" /> Filtrar Registros
                            </button>
                        </form>
                    </div>

                    {/* Fila de Balances */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <History className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="text-[9px] font-black bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-lg border border-blue-500/20 uppercase tracking-widest">Histórico</span>
                            </div>
                            <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest mb-1">Apertura Inicial</p>
                            <p className="text-2xl font-black text-brand-main tracking-tighter font-mono">Bs {resumen.saldo_inicial.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-500/20 uppercase tracking-widest">Entradas</span>
                            </div>
                            <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest mb-1">Total Ingresos</p>
                            <p className="text-2xl font-black text-emerald-600 tracking-tighter font-mono">Bs {resumen.total_ingresos.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                        </div>

                        <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                </div>
                                <span className="text-[9px] font-black bg-red-500/10 text-red-600 px-2 py-0.5 rounded-lg border border-red-500/20 uppercase tracking-widest">Salidas</span>
                            </div>
                            <p className="text-[10px] font-black uppercase text-brand-muted tracking-widest mb-1">Total Egresos</p>
                            <p className="text-2xl font-black text-red-600 tracking-tighter font-mono">Bs {resumen.total_egresos.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                        </div>

                        <div className="bg-brand-main p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
                                <CircleDollarSign className="w-32 h-32 text-white" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex items-center justify-between mb-4">
                                     <div className="p-2 bg-white/10 rounded-lg">
                                        <Wallet className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-[9px] font-black bg-white/20 text-white px-2.5 py-0.5 rounded-lg uppercase tracking-[0.2em] shadow-sm">Balance Final</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/70 tracking-widest mb-1 leading-none uppercase">Saldo Real en Bóveda</p>
                                    <p className="text-3xl font-black text-white tracking-tighter font-mono leading-tight">Bs {resumen.saldo_final.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico y Tabla Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Gráfico de Flujo */}
                        <div className="lg:col-span-1 bg-card-fap border border-brand p-6 rounded-2xl shadow-sm flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-xs font-black text-brand-main uppercase tracking-widest mb-8 flex items-center gap-2 relative z-10">
                                <FilePieChart className="w-4 h-4 text-primary" /> Tendencia de Efectivo
                            </h3>
                            <div className="flex-1 min-h-[320px] flex items-center relative z-10">
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        </div>

                        {/* Listado de Movimientos */}
                        <div className="lg:col-span-2 bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
                            <div className="p-5 border-b border-brand bg-card-fap/50 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase text-brand-main tracking-widest flex items-center gap-2">
                                    <History className="w-4 h-4 text-primary" /> Libro Diario Consolidado
                                </h3>
                                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
                                    <span className="flex items-center gap-2 text-emerald-600 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/20">
                                        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div> Ingresos
                                    </span>
                                    <span className="flex items-center gap-2 text-red-600 bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/20">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div> Egresos
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-x-auto max-h-[550px] scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                <table className="w-full text-left">
                                    <thead className="bg-card-fap text-brand-muted sticky top-0 font-black uppercase border-b border-brand z-10">
                                        <tr>
                                            <th className="p-4 pl-6 text-[10px] tracking-wider w-32">Fecha / ID</th>
                                            <th className="p-4 text-[10px] tracking-wider">Concepto Detallado</th>
                                            <th className="p-4 text-[10px] tracking-wider text-right border-l border-brand">Ingreso</th>
                                            <th className="p-4 text-[10px] tracking-wider text-right border-l border-brand">Egreso</th>
                                            <th className="p-4 pr-6 text-[10px] tracking-wider text-right border-l border-brand bg-brand/5">Saldo Progresivo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand/20">
                                        {movimientos.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-20 text-center text-brand-muted">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Search className="w-10 h-10 opacity-20" />
                                                        <p className="text-[11px] font-black uppercase tracking-widest">No se detectaron transacciones en este rango.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : movimientos.map((m, index) => (
                                            <motion.tr 
                                                key={m.id} 
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.01 }}
                                                className="hover:bg-brand/5 transition-colors group border-b border-brand/10 last:border-0"
                                            >
                                                <td className="p-4 pl-6">
                                                    <div className="font-black text-[11px] text-brand-main leading-none mb-1">{m.fecha}</div>
                                                    <div className="text-[9px] text-brand-muted font-mono tracking-tighter uppercase">FOLIO #{m.id.toString().padStart(6, '0')}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-black text-[12px] text-brand-main uppercase truncate max-w-[280px] leading-tight mb-1">{m.concepto}</div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[9px] bg-brand/10 text-brand-main px-2 py-0.5 rounded-lg uppercase font-black border border-brand/20 shadow-sm">{m.socio}</span>
                                                        <div className="flex items-center gap-1 opacity-50 text-brand-muted">
                                                            <Users className="w-3 h-3" />
                                                            <span className="text-[9px] font-bold uppercase tracking-tight">OP: {m.cajero}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right border-l border-brand/50">
                                                    {m.ingreso > 0 ? (
                                                        <span className="text-emerald-700 font-black font-mono text-[11px] flex items-center justify-end gap-1">
                                                            <ArrowUpRight className="w-3 h-3 opacity-50" /> {m.ingreso.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="opacity-10 text-[10px]">—</span>}
                                                </td>
                                                <td className="p-4 text-right border-l border-brand/50">
                                                    {m.egreso > 0 ? (
                                                        <span className="text-red-700 font-black font-mono text-[11px] flex items-center justify-end gap-1">
                                                            <ArrowDownRight className="w-3 h-3 opacity-50" /> {m.egreso.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="opacity-10 text-[10px]">—</span>}
                                                </td>
                                                <td className="p-4 pr-6 text-right font-black text-brand-main bg-brand/5 border-l border-brand/50 font-mono text-[12px] group-hover:bg-brand/10 transition-colors">
                                                    Bs {m.saldo.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
