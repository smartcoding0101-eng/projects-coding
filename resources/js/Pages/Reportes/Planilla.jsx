import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Planilla({ auth, titulo, cooperativa, periodo, fecha_generacion, total_socios, total_cuotas, total_general, items }) {
    const [mes, setMes] = useState('');

    const cambiarMes = () => {
        if (mes) router.get(route('reportes.planilla'), { mes }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Planilla de Descuento Policial</h2>}
        >
            <Head title="Planilla de Descuento" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center space-x-3">
                            <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} className="text-sm border-gray-300 rounded-md" />
                            <button onClick={cambiarMes} className="px-3 py-2 bg-fapclas-600 hover:bg-fapclas-700 text-white text-sm font-bold rounded-md">Consultar</button>
                        </div>
                        <div className="flex space-x-3">
                            <a href={`${route('reportes.planilla')}?formato=pdf&mes=${mes}`} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg" target="_blank">📄 PDF</a>
                            <a href={`${route('reportes.planilla')}?formato=csv&mes=${mes}`} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg">📊 CSV</a>
                            <Link href={route('reportes.index')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg">← Volver</Link>
                        </div>
                    </div>

                    {/* Período y KPIs */}
                    <div className="bg-white shadow-sm rounded-lg p-5">
                        <h3 className="text-lg font-bold text-fapclas-800 uppercase">{periodo}</h3>
                        <p className="text-sm text-gray-500">{fecha_generacion}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border p-5 text-center">
                            <p className="text-xs text-gray-500 uppercase">Socios</p>
                            <p className="text-2xl font-bold text-fapclas-700">{total_socios}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-5 text-center">
                            <p className="text-xs text-gray-500 uppercase">Cuotas</p>
                            <p className="text-2xl font-bold text-blue-600">{total_cuotas}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-5 text-center">
                            <p className="text-xs text-gray-500 uppercase">Total a Descontar</p>
                            <p className="text-2xl font-bold text-red-600">Bs. {Number(total_general).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Socio</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">CI</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grado</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuota</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Interés</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Mora</th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.length === 0 && (
                                        <tr><td colSpan={10} className="px-6 py-8 text-center text-gray-400">Sin descuentos para este período</td></tr>
                                    )}
                                    {items.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-3 py-3 text-sm font-medium">{item.socio_nombre}</td>
                                            <td className="px-3 py-3 text-sm">{item.socio_ci}</td>
                                            <td className="px-3 py-3 text-sm">{item.socio_grado}</td>
                                            <td className="px-3 py-3 text-sm">{item.socio_destino}</td>
                                            <td className="px-3 py-3 text-sm text-gray-600">{item.tipo_credito}</td>
                                            <td className="px-3 py-3 text-sm">{item.nro_cuota}</td>
                                            <td className="px-3 py-3 text-sm text-right">Bs. {Number(item.capital).toFixed(2)}</td>
                                            <td className="px-3 py-3 text-sm text-right">Bs. {Number(item.interes).toFixed(2)}</td>
                                            <td className="px-3 py-3 text-sm text-right text-red-600">{Number(item.mora) > 0 ? `Bs. ${Number(item.mora).toFixed(2)}` : '—'}</td>
                                            <td className="px-3 py-3 text-sm text-right font-bold">Bs. {Number(item.total_descontar).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                {items.length > 0 && (
                                    <tfoot className="bg-fapclas-50">
                                        <tr>
                                            <td colSpan={9} className="px-3 py-3 text-right font-bold text-fapclas-800">TOTAL GENERAL</td>
                                            <td className="px-3 py-3 text-right font-bold text-fapclas-800 text-lg">Bs. {Number(total_general).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
