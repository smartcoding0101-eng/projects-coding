import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Wallet, TrendingUp, Users, ShieldCheck,
    ArrowRightLeft, CheckCircle2, ShoppingBag, Banknote
} from 'lucide-react';

export default function Dashboard({ auth, metrics, actividadReciente }) {
    const isAdmin = metrics.tipo === 'admin';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Inicio (Cockpit)</h2>}
        >
            <Head title="Inicio" />

            <div className="py-8 min-h-screen bg-main">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ══════════ ENCABEZADO ESTRUCTURAL (Sin tarjetas flotantes) ══════════ */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-brand flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                {isAdmin ? <ShieldCheck className="w-5 h-5 text-primary" /> : <Wallet className="w-5 h-5 text-primary" />}
                                <div>
                                    <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                        Resumen Ejecutivo FAPCLAS R.L. — {auth.user.name}
                                    </h3>
                                    <p className="text-[11px] text-brand-muted font-medium">
                                        {isAdmin ? 'Métricas globales e historial de movimientos.' : 'Estado de cuenta personal.'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 bg-primary text-white rounded">
                                {isAdmin ? 'PERFIL ADMINISTRADOR' : 'SOCIO ACTIVO'}
                            </span>
                        </div>
                        
                        {/* KPI Bar Lineal */}
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-brand">
                            {isAdmin ? (
                                <>
                                    <KpiItem title="Capital Ahorrado" value={`Bs. ${Number(metrics.totalCapital).toLocaleString()}`} />
                                    <KpiItem title="Monto Prestado" value={`Bs. ${Number(metrics.montoPrestado).toLocaleString()}`} />
                                    <KpiItem title="Préstamos Activos" value={metrics.prestamosActivos} />
                                    <KpiItem title="Socios Afiliados" value={metrics.usuariosActivos} />
                                </>
                            ) : (
                                <>
                                    <KpiItem title="Mi Saldo Aportes" value={`Bs. ${Number(metrics.miSaldo).toLocaleString()}`} />
                                    <KpiItem title="Mis Préstamos" value={metrics.misPrestamos} />
                                    <KpiItem title="Mis Convenios" value={metrics.misConvenios} />
                                    <div className="p-4 flex flex-col justify-center">
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Próxima Acción</p>
                                        <Link href={route('creditos.index')} className="text-sm font-bold text-primary hover:underline decoration-primary/30">
                                            Ver mi Plan de Pagos
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ══════════ GRILLA DE DATOS (Actividad Reciente) ══════════ */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-brand flex items-center justify-between bg-white/[0.02]">
                            <h3 className="text-xs font-bold text-brand-main uppercase tracking-wider flex items-center gap-2">
                                <ArrowRightLeft className="w-4 h-4 text-primary" />
                                {isAdmin ? 'Historial de Transacciones' : 'Mis Últimos Movimientos'}
                            </h3>
                            <Link href={route('libro-diario.index')} className="text-[10px] font-bold text-white bg-primary hover:opacity-90 px-2 py-1 rounded transition-colors">
                                Ver Libro Diario completo
                            </Link>
                        </div>
                        
                        {actividadReciente && actividadReciente.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-card-fap border-b border-brand">
                                        <tr>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Fecha</th>
                                            {isAdmin && <th className="text-left px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Socio Relevante</th>}
                                            <th className="text-left px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Concepto de Transacción</th>
                                            <th className="text-right px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Importe (Bs.)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y border-brand">
                                        {actividadReciente.map((mov) => (
                                            <tr key={mov.id} className="hover:bg-primary/5 transition-colors">
                                                <td className="px-4 py-3 text-xs text-brand-muted whitespace-nowrap font-medium">
                                                    {new Date(mov.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-brand-main text-xs">{mov.user?.name || 'Sistema'}</div>
                                                    </td>
                                                )}
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-brand-main text-xs">{mov.concepto}</div>
                                                    <div className="text-[10px] text-brand-muted uppercase mt-0.5">{mov.tipo_transaccion}</div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                                    <span className={`text-xs font-bold ${mov.monto > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                                                        {mov.monto > 0 ? '+' : ''}{Number(mov.monto).toLocaleString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center border-t border-brand">
                                <CheckCircle2 className="w-8 h-8 text-brand-muted mx-auto mb-3" />
                                <p className="text-sm text-brand-muted font-bold uppercase tracking-wider">Sin movimientos registrados</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function KpiItem({ title, value }) {
    return (
        <div className="p-4 border-brand">
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">{title}</p>
            <p className="text-xl font-bold text-brand-main">{value}</p>
        </div>
    );
}
