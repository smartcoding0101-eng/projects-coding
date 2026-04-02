import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function ExportBar({ baseRoute }) {
    return (
        <div className="flex space-x-3">
            <a href={`${route(baseRoute)}?formato=pdf`} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors" target="_blank">📄 PDF</a>
            <a href={`${route(baseRoute)}?formato=csv`} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors">📊 CSV</a>
            <Link href={route('reportes.index')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg">← Volver</Link>
        </div>
    );
}

export default function Morosidad({ auth, fecha_generacion, resumen, cuotas }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Reporte de Morosidad</h2>}
        >
            <Head title="Morosidad" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-brand-muted">Generado: {fecha_generacion}</p>
                        <ExportBar baseRoute="reportes.morosidad" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-card-fap rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-brand-muted uppercase">Cuotas Atrasadas</p>
                            <p className="text-2xl font-bold text-red-600">{resumen.total_cuotas_atrasadas}</p>
                        </div>
                        <div className="bg-card-fap rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-brand-muted uppercase">Socios Afectados</p>
                            <p className="text-2xl font-bold text-orange-600">{resumen.socios_afectados}</p>
                        </div>
                        <div className="bg-card-fap rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-brand-muted uppercase">Capital Moroso</p>
                            <p className="text-2xl font-bold text-red-700">Bs. {Number(resumen.total_capital_moroso).toFixed(2)}</p>
                        </div>
                        <div className="bg-card-fap rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-brand-muted uppercase">Mora Acumulada</p>
                            <p className="text-2xl font-bold text-red-800">Bs. {Number(resumen.total_mora_acumulada).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-card-fap shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-red-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Crédito</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Socio</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Tipo</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Cuota</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Vencimiento</th>
                                        <th className="px-3 py-3 text-center text-xs font-medium text-red-700 uppercase">Días Mora</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-red-700 uppercase">Capital</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-red-700 uppercase">Mora</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-red-700 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {cuotas.length === 0 && (
                                        <tr><td colSpan={9} className="px-6 py-8 text-center text-brand-muted">✅ Sin morosidad registrada</td></tr>
                                    )}
                                    {cuotas.map((c, i) => (
                                        <tr key={i} className="hover:bg-red-50">
                                            <td className="px-3 py-3 text-sm">#{c.credito_id}</td>
                                            <td className="px-3 py-3 text-sm">
                                                <div className="font-medium">{c.socio}</div>
                                                <div className="text-xs text-brand-muted">{c.ci} · {c.grado}</div>
                                            </td>
                                            <td className="px-3 py-3 text-sm text-gray-600">{c.tipo_credito}</td>
                                            <td className="px-3 py-3 text-sm">{c.nro_cuota}</td>
                                            <td className="px-3 py-3 text-sm text-brand-muted">{c.fecha_vencimiento}</td>
                                            <td className="px-3 py-3 text-sm text-center">
                                                <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-full text-xs">{c.dias_mora}d</span>
                                            </td>
                                            <td className="px-3 py-3 text-sm text-right">Bs. {Number(c.capital).toFixed(2)}</td>
                                            <td className="px-3 py-3 text-sm text-right text-red-600 font-medium">Bs. {Number(c.mora).toFixed(2)}</td>
                                            <td className="px-3 py-3 text-sm text-right font-bold">Bs. {Number(c.total).toFixed(2)}</td>
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
