import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Search, CreditCard, Filter, XCircle } from 'lucide-react';

const tipoBadgeColor = {
    'aporte': 'bg-brand/10 text-emerald-700 border-emerald-200',
    'retiro': 'bg-brand/10 text-red-700 border-red-500/50',
    'desembolso_credito': 'bg-brand/10 text-blue-700 border-blue-200',
    'pago_cuota': 'bg-brand/10 text-purple-700 border-purple-200',
    'interes_ganado': 'bg-brand/10 text-teal-700 border-teal-200',
    'compra_convenio': 'bg-brand/10 text-pink-700 border-pink-200',
    'ajuste': 'bg-brand/10 text-gray-700 border-brand',
    'mora': 'bg-brand/10 text-red-800 border-red-300 font-bold',
};

export default function Index({ auth, movimientos, resumen, socio, socios, filtros, tiposMovimiento }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');

    const [filters, setFilters] = useState({
        tipo: filtros.tipo || '',
        fecha_desde: filtros.fecha_desde || '',
        fecha_hasta: filtros.fecha_hasta || '',
        socio_id: filtros.socio_id || '',
    });

    const applyFilters = () => {
        const params = {};
        if (filters.tipo) params.tipo = filters.tipo;
        if (filters.fecha_desde) params.fecha_desde = filters.fecha_desde;
        if (filters.fecha_hasta) params.fecha_hasta = filters.fecha_hasta;
        if (filters.socio_id) params.socio_id = filters.socio_id;
        router.get(route('kardex.index'), params, { preserveState: true });
    };

    const clearFilters = () => {
        setFilters({ tipo: '', fecha_desde: '', fecha_hasta: '', socio_id: '' });
        router.get(route('kardex.index'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Módulo de Kardex</h2>}
        >
            <Head title="Kardex" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ══════════ ENCABEZADO Y KPI BAR ══════════ */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="px-5 py-4 border-b border-brand bg-card-fap flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <div>
                                    <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                        Libreta Kardex de Movimientos
                                    </h3>
                                    <p className="text-[11px] text-brand-muted font-medium">
                                        Historial detallado de operaciones financieras para <strong className="text-brand-main">{socio.name}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Datos del Socio Compactos */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-8 px-5 py-3 border-b border-brand bg-card-fap">
                            <SocioData label="Rótulo / Nombre" value={socio.name} highlight />
                            <SocioData label="C.I." value={socio.ci || '—'} />
                            <SocioData label="Grado" value={socio.grado || '—'} />
                            <SocioData label="Destino" value={socio.destino || '—'} />
                            <SocioData label="Escalafón" value={socio.escalafon || '—'} />
                        </div>

                        {/* KPI Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-brand">
                            <KpiItem label="Total Ingresos" value={`Bs. ${Number(resumen.total_ingresos).toFixed(2)}`} color="text-emerald-700" />
                            <KpiItem label="Total Egresos" value={`Bs. ${Number(resumen.total_egresos).toFixed(2)}`} color="text-red-600" />
                            <KpiItem label="Saldo Actual Cta." value={`Bs. ${Number(resumen.saldo_actual).toFixed(2)}`} color="text-brand-main" highlight />
                            <KpiItem label="Movimientos Auditados" value={resumen.total_movimientos} color="text-primary" />
                        </div>
                    </div>

                    {/* ══════════ TOOLBAR: Filtros ══════════ */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg p-3 flex flex-col md:flex-row items-end gap-3">
                        {isAdmin && socios.length > 0 && (
                            <div className="w-full md:w-64">
                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Buscar Socio</label>
                                <select
                                    className="field-input text-xs"
                                    value={filters.socio_id}
                                    onChange={(e) => setFilters({ ...filters, socio_id: e.target.value })}
                                >
                                    <option value="">Mi Kardex</option>
                                    {socios.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} {s.ci ? `(${s.ci})` : ''}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="w-full md:w-48">
                            <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Tipo Movimiento</label>
                            <select
                                className="field-input text-xs"
                                value={filters.tipo}
                                onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                            >
                                <option value="">Todos</option>
                                {Object.entries(tiposMovimiento).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-40">
                            <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Desde Fecha</label>
                            <input
                                type="date"
                                className="field-input text-xs"
                                value={filters.fecha_desde}
                                onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Hasta Fecha</label>
                            <input
                                type="date"
                                className="field-input text-xs"
                                value={filters.fecha_hasta}
                                onChange={(e) => setFilters({ ...filters, fecha_hasta: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded flex items-center gap-1.5 hover:bg-primary-dark transition-colors h-[38px] shadow-sm active:translate-y-px"
                            >
                                <Search className="w-3.5 h-3.5" /> Filtrar
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 bg-card-fap border border-brand text-brand-muted hover:text-primary hover:bg-brand/10 text-xs font-bold rounded flex items-center gap-1.5 transition-colors h-[38px] active:translate-y-px"
                                title="Limpiar Filtros"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* ══════════ GRILLA DE DETALLE KARDEX ══════════ */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-brand-muted uppercase tracking-wider w-24">Fecha</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-brand-muted uppercase tracking-wider w-36">Tipo</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-brand-muted uppercase tracking-wider">Concepto</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-brand-muted uppercase tracking-wider w-32 border-l border-brand">Ingreso (Bs)</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-brand-muted uppercase tracking-wider w-32">Egreso (Bs)</th>
                                        <th className="px-4 py-3 text-right text-[10px] font-bold text-brand-muted uppercase tracking-wider w-36 bg-card-fap border-l border-brand shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">Saldo Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand">
                                    {movimientos.data?.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-brand-muted bg-brand/10">
                                                <Filter className="w-8 h-8 mx-auto mb-3 text-fapclas-300 opacity-50" />
                                                <p className="text-sm font-bold uppercase tracking-wider">No se encontraron movimientos</p>
                                                <p className="text-[11px] mt-1">Intente cambiar los parámetros del filtro.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        movimientos.data?.map((mov) => (
                                            <tr key={mov.id} className="hover:bg-brand/10 transition-colors">
                                                <td className="px-4 py-2.5 text-xs text-brand-muted font-medium whitespace-nowrap">
                                                    {mov.fecha}
                                                </td>
                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${tipoBadgeColor[mov.tipo_movimiento] || 'bg-brand/10 text-primary border-brand'}`}>
                                                        {tiposMovimiento[mov.tipo_movimiento] || mov.tipo_movimiento}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-brand-main font-medium truncate max-w-[250px]">
                                                    {mov.concepto}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-right font-bold text-emerald-700 border-l border-brand">
                                                    {Number(mov.ingreso) > 0 ? Number(mov.ingreso).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-right font-bold text-red-600">
                                                    {Number(mov.egreso) > 0 ? Number(mov.egreso).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                                                </td>
                                                <td className="px-4 py-2.5 text-xs text-right font-bold text-fapclas-950 bg-card-fap border-l border-brand shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    {Number(mov.saldo_acumulado).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación Lineal */}
                        {movimientos.links && movimientos.links.length > 3 && (
                            <div className="px-4 py-3 border-t border-brand bg-card-fap flex items-center justify-between">
                                <p className="text-[11px] text-brand-muted font-semibold uppercase tracking-wider">
                                    Mostrando {movimientos.from} – {movimientos.to} de {movimientos.total} registros
                                </p>
                                <div className="flex gap-1">
                                    {movimientos.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-2.5 py-1 text-xs font-bold rounded border ${
                                                link.active
                                                    ? 'bg-primary text-white border-brand'
                                                    : link.url
                                                        ? 'bg-card-fap text-primary border-brand hover:bg-brand/10'
                                                        : 'bg-card-fap text-fapclas-300 border-brand cursor-not-allowed hidden md:block'
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

function SocioData({ label, value, highlight }) {
    return (
        <div className="flex flex-col">
            <span className="text-[9px] font-bold text-brand-muted uppercase tracking-wide">{label}</span>
            <span className={`text-xs ${highlight ? 'font-bold text-brand-main' : 'font-medium text-primary'}`}>{value}</span>
        </div>
    );
}

function KpiItem({ label, value, color, highlight }) {
    return (
        <div className={`p-4 ${highlight ? 'bg-card-fap shadow-[inset_0_-2px_0_rgba(72,107,44,0.1)]' : ''}`}>
            <p className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`text-lg md:text-xl font-extrabold ${color}`}>{value}</p>
        </div>
    );
}
