import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    BarChart3, 
    DownloadCloud, 
    FileWarning, 
    Wallet, 
    ShieldCheck,
    CalendarDays,
    CheckCircle,
    ArrowRight,
    Search,
    TrendingUp,
    Layers,
    Activity,
    ShieldAlert,
    Clock,
    FileText,
    Boxes,
    CreditCard,
    ChevronRight,
    LayoutGrid,
    Target,
    Zap,
    Filter,
    ListFilter,
    FileSpreadsheet,
    FileJson
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ReportListItem({ 
    title, 
    description, 
    icon: Icon, 
    colorClass, 
    href, 
    onDownloadXLSX, 
    onDownloadPDF, 
    isDownloading, 
    success,
    category 
}) {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="group bg-card-fap border-b border-brand/50 last:border-0 hover:bg-brand/5 transition-all flex items-center px-6 py-5 gap-6 relative overflow-hidden"
        >
            <div className={`p-3 rounded-xl bg-brand/5 border border-brand/40 text-brand-muted group-hover:${colorClass} transition-colors shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-[13px] font-black text-brand-main tracking-tight group-hover:text-primary transition-colors truncate">{title}</h4>
                    <span className="text-[9px] font-black text-brand-muted/40 uppercase tracking-widest border border-brand/30 px-2 py-0.5 rounded-md bg-brand/5 group-hover:bg-main group-hover:text-brand-muted transition-colors">{category}</span>
                </div>
                <p className="text-[11px] font-medium text-brand-muted truncate opacity-70 group-hover:opacity-100 transition-opacity">
                    {description}
                </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            <CheckCircle className="w-3.5 h-3.5" /> Listo
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-2">
                             {href ? (
                                <Link 
                                    href={href}
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95"
                                >
                                    Abrir <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => onDownloadXLSX('xlsx')}
                                        disabled={isDownloading}
                                        title="Descargar Excel"
                                        className="p-2.5 bg-card-fap border border-brand hover:border-emerald-500/50 text-brand-muted hover:text-emerald-600 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-30"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                    </button>
                                    {onDownloadPDF && (
                                        <button 
                                            onClick={() => onDownloadPDF('pdf')}
                                            disabled={isDownloading}
                                            title="Descargar PDF"
                                            className="p-2.5 bg-card-fap border border-brand hover:border-red-500/50 text-brand-muted hover:text-red-600 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-30"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </AnimatePresence>
                {isDownloading && (
                    <div className="w-8 h-8 rounded-full border-2 border-brand/20 border-t-primary animate-spin" />
                )}
            </div>
        </motion.div>
    );
}

export default function Index({ auth }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Estados para persistencia de descargas
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const menuItems = [
        { id: 'all', name: 'General', icon: LayoutGrid },
        { id: 'finance', name: 'Finanzas', icon: Wallet },
        { id: 'audit', name: 'Auditoría', icon: ShieldCheck },
        { id: 'ops', name: 'Operativo', icon: Activity },
        { id: 'sales', name: 'Ventas BI', icon: Boxes },
    ];

    const reportsMeta = [
        { id: 'historico', title: 'Buro de Riesgo Socio', category: 'audit', label: 'Auditoría', description: 'Investigación histórica de créditos y comportamientos.', icon: ShieldCheck, color: 'text-emerald-600', href: route('reportes.historico') },
        { id: 'cartera', title: 'Cartera de Préstamos', category: 'finance', label: 'Finanzas', description: 'Consolidado de capital, intereses y previsiones.', icon: Wallet, color: 'text-blue-600', downloadable: true, slug: 'cartera' },
        { id: 'morosidad', title: 'Listado de Morosidad', category: 'audit', label: 'Auditoría', description: 'Detección crítica de incumplimientos técnicos.', icon: FileWarning, color: 'text-red-500', downloadable: true, slug: 'morosidad' },
        { id: 'recaudacion', title: 'BI Recaudación de Cartera', category: 'finance', label: 'Finanzas', description: 'Triangulación de desembolsos vs ingreso de capital.', icon: TrendingUp, color: 'text-blue-500', href: route('reportes.recaudacion') },
        { id: 'ecommerce', title: 'Ventas Ecommerce & QR', category: 'sales', label: 'Ventas BI', description: 'Métricas analíticas de canal digital y cobros QR.', icon: Zap, color: 'text-orange-500', href: route('reportes.ecommerce') },
        { id: 'planilla', title: 'Carga de Descuento Planilla', category: 'ops', label: 'Operativo', description: 'Generación de archivos para banca masiva.', icon: CalendarDays, color: 'text-purple-600', href: route('reportes.planilla') },
        { id: 'caja', title: 'Libro de Caja General', category: 'ops', label: 'Operativo', description: 'Reporte diario de arqueo y movimientos físicos.', icon: Layers, color: 'text-emerald-500', href: route('reportes.caja') },
        { id: 'triangulacion', title: 'Conciliación Almacén/Caja', category: 'ops', label: 'Operativo', description: 'Control de stock físico contra depósitos.', icon: FileText, color: 'text-amber-600', href: route('reportes.conciliacion-ecommerce') },
        { id: 'estado_cuenta', title: 'Estado de Cuenta Global', category: 'finance', label: 'Finanzas', description: 'Situación patrimonial del socio ante la cooperativa.', icon: CreditCard, color: 'text-blue-700', href: route('reportes.estado-cuenta') },
    ];

    const filteredReports = useMemo(() => {
        return reportsMeta.filter(r => {
            const matchesTab = activeTab === 'all' || r.category === activeTab;
            const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                r.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    const handleGenericDownload = async (target, formato) => {
        setIsDownloading(true);
        try {
            const response = await window.axios({
                url: route(`reportes.${target}`, { formato }),
                method: 'GET',
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = formato === 'xlsx' ? 'xlsx' : 'pdf';
            link.setAttribute('download', `${target}_${new Date().getTime()}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setIsDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000); 
        } catch (error) {
            setIsDownloading(false);
            alert('Error en la descarga.');
        }
    };

    if (!isAdmin) return <AuthenticatedLayout user={auth.user}><div className="py-32 text-center text-brand-muted font-black uppercase text-[10px] tracking-widest bg-main min-h-screen">Acceso Denegado</div></AuthenticatedLayout>;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-brand-main text-sm tracking-tight">Centro Analítico de Reportes</span>
                            <span className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Inteligencia de Datos FAPCLAS</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Reportes | Hub Analítico" />

            <div className="min-h-screen bg-main py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    
                    {/* ══════════ SUB MENU (TOP TABS) ══════════ */}
                    <div className="bg-card-fap border border-brand/80 rounded-2xl shadow-sm p-1.5 flex flex-wrap items-center gap-1 mb-8 overflow-x-auto no-scrollbar">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-wider ${
                                        isActive 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'text-brand-muted hover:bg-brand/5 hover:text-brand-main'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'opacity-40'}`} />
                                    {item.name}
                                </button>
                            );
                        })}
                        <div className="ml-auto flex items-center gap-3 pl-4 border-l border-brand/50">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    placeholder="BUSCAR INFORME..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-brand/5 border-none rounded-xl pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-main placeholder-brand-muted focus:ring-1 focus:ring-primary/50 w-48"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ══════════ LISTA ANALÍTICA DE REPORTES ══════════ */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-3xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-brand/5 border-b border-brand flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-brand-main uppercase tracking-[0.2em] flex items-center gap-2">
                                <ListFilter className="w-3.5 h-3.5 text-primary" /> Inventario de Reportes Disponibles
                            </h3>
                            <span className="text-[10px] font-bold text-brand-muted uppercase bg-card-fap border border-brand px-2.5 py-1 rounded-lg">
                                {filteredReports.length} Resultados
                            </span>
                        </div>

                        <div className="divide-y divide-brand/30">
                            <AnimatePresence mode="popLayout">
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <ReportListItem 
                                            key={report.id}
                                            {...report}
                                            category={report.label}
                                            colorClass={report.color}
                                            onDownloadXLSX={(f) => handleGenericDownload(report.slug, f)}
                                            onDownloadPDF={(f) => handleGenericDownload(report.slug, f)}
                                            isDownloading={isDownloading}
                                            success={downloadSuccess}
                                        />
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <Layers className="w-10 h-10 text-brand-muted/20 mx-auto mb-4" />
                                        <p className="text-[11px] font-black text-brand-muted uppercase tracking-widest">No se encontraron reportes que coincidan</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Legend / Security Footer */}
                    <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Acceso Auditado</span>
                        </div>
                        <div className="w-1 h-1 bg-brand-muted rounded-full" />
                        <div className="flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5" />
                           <span className="text-[9px] font-black uppercase tracking-widest">Core FAPCLAS v3.5</span>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
