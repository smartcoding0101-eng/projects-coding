import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Wallet, 
    ArrowLeft, 
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
    FilePieChart
} from 'lucide-react';
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

    const handleDownload = async (formato) => {
        setIsDownloading(true);
        try {
            const response = await window.axios({
                url: route('reportes.caja', { ...params, formato }),
                method: 'GET',
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = formato === 'xlsx' ? 'xlsx' : 'pdf';
            const filename = `libro_caja_${new Date().getTime()}.${extension}`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            setIsDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 5000); 
        } catch (error) {
            setIsDownloading(false);
            console.error('Error generando reporte de Caja:', error);
            alert('Error generando el reporte de Caja.');
        }
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 py-1">
                        <Wallet className="w-6 h-6 text-emerald-600" />
                        <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                            Reporte de Caja General (Libro de Caja)
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {!downloadSuccess ? (
                            <div className="flex items-center bg-card-fap border border-brand rounded-xl overflow-hidden shadow-sm">
                                <button 
                                    onClick={() => handleDownload('pdf')}
                                    disabled={isDownloading}
                                    className="px-4 py-2 text-[11px] font-black text-brand-muted hover:text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 border-r border-brand disabled:opacity-50"
                                >
                                    <FileText className="w-3.5 h-3.5 text-red-500" /> PDF
                                </button>
                                <button 
                                    onClick={() => handleDownload('xlsx')}
                                    disabled={isDownloading}
                                    className="px-4 py-2 text-[11px] font-black text-brand-muted hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> EXCEL (XLSX)
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500 rounded-xl animate-in fade-in zoom-in duration-300">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">¡Documento Listo!</span>
                            </div>
                        )}
                        <a href={route('reportes.index')} className="text-sm text-brand-muted hover:text-brand-main font-semibold transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Caja General | FAPCLAS" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Filtros Inteligentes */}
                    <div className="bg-card-fap border border-brand p-5 rounded-2xl shadow-sm">
                        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-wider">Fecha Inicio</label>
                                <input 
                                    type="date" 
                                    value={params.desde}
                                    onChange={e => setParams({...params, desde: e.target.value})}
                                    className="w-full bg-main border-brand rounded-xl text-xs font-bold text-brand-main" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-wider">Fecha Fin</label>
                                <input 
                                    type="date" 
                                    value={params.hasta}
                                    onChange={e => setParams({...params, hasta: e.target.value})}
                                    className="w-full bg-main border-brand rounded-xl text-xs font-bold text-brand-main" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-brand-muted mb-2 block tracking-wider">Filtrar por Cajero</label>
                                <select 
                                    value={params.cajero_id}
                                    onChange={e => setParams({...params, cajero_id: e.target.value})}
                                    className="w-full bg-main border-brand rounded-xl text-xs font-bold text-brand-main"
                                >
                                    <option value="">Todos los Cajeros</option>
                                    {cajeros.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="bg-brand-main hover:bg-brand-hover text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2">
                                <Search className="w-4 h-4" /> Actualizar Libro
                            </button>
                        </form>
                    </div>

                    {/* Fila de Balances */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-card-fap border-l-4 border-l-blue-500 p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <History className="w-5 h-5 text-blue-500" />
                                <span className="text-[9px] font-black bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full">HISTÓRICO</span>
                            </div>
                            <p className="text-[10px] font-black uppercase text-brand-muted">Saldo de Apertura</p>
                            <p className="text-2xl font-black text-brand-main">Bs {resumen.saldo_inicial.toLocaleString()}</p>
                        </div>

                        <div className="bg-card-fap border-l-4 border-l-emerald-500 p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">ENTRADAS</span>
                            </div>
                            <p className="text-[10px] font-black uppercase text-brand-muted">Total Ingresos</p>
                            <p className="text-2xl font-black text-emerald-600">+ Bs {resumen.total_ingresos.toLocaleString()}</p>
                        </div>

                        <div className="bg-card-fap border-l-4 border-l-red-500 p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingDown className="w-5 h-5 text-red-500" />
                                <span className="text-[9px] font-black bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full">SALIDAS</span>
                            </div>
                            <p className="text-[10px] font-black uppercase text-brand-muted">Total Egresos</p>
                            <p className="text-2xl font-black text-red-600">- Bs {resumen.total_egresos.toLocaleString()}</p>
                        </div>

                        <div className="bg-brand-main p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <CircleDollarSign className="w-24 h-24 text-white" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase text-white/70">Saldo Final en Caja</p>
                                <p className="text-3xl font-black text-white">Bs {resumen.saldo_final.toLocaleString()}</p>
                                <p className="text-[9pt] text-white/90 mt-1 font-bold italic underline">BALANCE CALCULADO</p>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico y Tabla Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Gráfico de Flujo */}
                        <div className="lg:col-span-1 bg-card-fap border border-brand p-6 rounded-2xl shadow-sm flex flex-col">
                            <h3 className="text-sm font-black text-brand-main mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" /> Flujo Diario de Efectivo
                            </h3>
                            <div className="flex-1 min-h-[300px] flex items-center">
                                <Bar options={chartOptions} data={chartData} />
                            </div>
                        </div>

                        {/* Listado de Movimientos */}
                        <div className="lg:col-span-2 bg-card-fap border border-brand rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-brand bg-main flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase text-brand-main">Libro Diario de Caja</h3>
                                <div className="flex gap-2 text-[10px]">
                                    <span className="flex items-center gap-1 text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-600"></div> Ingresos</span>
                                    <span className="flex items-center gap-1 text-red-600"><div className="w-2 h-2 rounded-full bg-red-600"></div> Egresos</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent">
                                <table className="w-full text-[11px] text-left">
                                    <thead className="bg-main text-brand-muted sticky top-0 font-black uppercase border-b border-brand z-10">
                                        <tr>
                                            <th className="p-3">Fecha / ID</th>
                                            <th className="p-3">Concepto / Socio</th>
                                            <th className="p-3 text-right">Ingreso</th>
                                            <th className="p-3 text-right">Egreso</th>
                                            <th className="p-3 text-right bg-brand/5">Saldo Institucional</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand/50">
                                        {movimientos.length === 0 ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-brand-muted font-bold">No se encontraron movimientos en este período / filtro.</td></tr>
                                        ) : movimientos.map((m, i) => (
                                            <tr key={m.id} className="hover:bg-brand/5 transition-colors border-b border-brand/20">
                                                <td className="p-3">
                                                    <div className="font-bold text-brand-main">{m.fecha}</div>
                                                    <div className="text-[10px] text-brand-muted">#{m.id}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-bold text-brand-main uppercase truncate max-w-[200px]">{m.concepto}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[9px] bg-brand/10 text-brand-muted px-1.5 py-0.5 rounded uppercase font-black">{m.socio}</span>
                                                        <span className="text-[9px] text-brand-muted opacity-60 italic">| Cajero: {m.cajero}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right">
                                                    {m.ingreso > 0 ? (
                                                        <span className="text-emerald-600 font-black flex items-center justify-end gap-1">
                                                            <ArrowUpRight className="w-3 h-3" /> {m.ingreso.toLocaleString()}
                                                        </span>
                                                    ) : '—'}
                                                </td>
                                                <td className="p-3 text-right">
                                                    {m.egreso > 0 ? (
                                                        <span className="text-red-500 font-black flex items-center justify-end gap-1">
                                                            <ArrowDownRight className="w-3 h-3" /> {m.egreso.toLocaleString()}
                                                        </span>
                                                    ) : '—'}
                                                </td>
                                                <td className="p-3 text-right font-black text-brand-main bg-brand/5">
                                                    Bs {m.saldo.toLocaleString()}
                                                </td>
                                            </tr>
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
