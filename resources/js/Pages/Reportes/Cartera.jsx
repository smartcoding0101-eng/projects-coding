import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function StatCard({ label, value, color = 'text-brand-main', prefix = '' }) {
    return (
        <div className="bg-card-fap rounded-lg shadow-sm border border-brand p-5">
            <p className="text-xs font-medium text-brand-muted uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{prefix}{value}</p>
        </div>
    );
}

function ExportBar({ baseRoute, extraParams = '' }) {
    return (
        <div className="flex space-x-3">
            <a href={`${route(baseRoute)}?formato=pdf${extraParams}`} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors" target="_blank">
                📄 Exportar PDF
            </a>
            <a href={`${route(baseRoute)}?formato=csv${extraParams}`} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors">
                📊 Exportar CSV
            </a>
            <Link href={route('reportes.index')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors">
                ← Volver
            </Link>
        </div>
    );
}

export default function Cartera({ auth, fecha_generacion, resumen, creditos }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Reporte de Cartera de Créditos</h2>}
        >
            <Head title="Cartera de Créditos" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-brand-muted">Generado: {fecha_generacion}</p>
                        <ExportBar baseRoute="reportes.cartera" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        <StatCard label="Total Créditos" value={resumen.total_creditos} />
                        <StatCard label="Vigentes" value={resumen.vigentes} color="text-blue-600" />
                        <StatCard label="En Mora" value={resumen.en_mora} color="text-red-600" />
                        <StatCard label="Pagados" value={resumen.pagados} color="text-green-600" />
                        <StatCard label="Monto Otorgado" value={Number(resumen.monto_total_otorgado).toFixed(2)} prefix="Bs. " color="text-brand-main" />
                        <StatCard label="Saldo Vigente" value={Number(resumen.monto_vigente).toFixed(2)} prefix="Bs. " color="text-blue-700" />
                        <StatCard label="Saldo Mora" value={Number(resumen.monto_mora).toFixed(2)} prefix="Bs. " color="text-red-700" />
                    </div>

                    <div className="bg-card-fap shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-brand/5">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Socio</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">CI</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Tipo</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-brand-muted uppercase">Monto</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-brand-muted uppercase">Saldo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Tasa</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Estado</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-brand-muted uppercase">Desembolso</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card-fap divide-y divide-gray-200">
                                    {creditos.map((c) => (
                                        <tr key={c.id} className="hover:bg-brand/5">
                                            <td className="px-4 py-3 text-sm">{c.id}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{c.socio}</td>
                                            <td className="px-4 py-3 text-sm text-brand-muted">{c.ci}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{c.tipo}</td>
                                            <td className="px-4 py-3 text-sm text-right">Bs. {Number(c.monto_aprobado).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-right font-bold">Bs. {Number(c.saldo_capital).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm">{c.tasa}%</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                    c.estado === 'En Mora' ? 'bg-red-100 text-red-800' :
                                                    c.estado === 'Pagado' ? 'bg-green-100 text-green-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>{c.estado}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-brand-muted">{c.fecha_desembolso}</td>
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
