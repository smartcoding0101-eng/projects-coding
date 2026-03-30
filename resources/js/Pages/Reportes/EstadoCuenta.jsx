import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function EstadoCuenta({ auth, fecha_generacion, socio, resumen, creditos, movimientos, socios }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin') || auth.user.roles?.includes('Oficial Crédito');
    const [socioId, setSocioId] = useState('');

    const cambiarSocio = () => {
        if (socioId) router.get(route('reportes.estado-cuenta'), { socio_id: socioId }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Estado de Cuenta</h2>}
        >
            <Head title="Estado de Cuenta" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-500">Generado: {fecha_generacion}</p>
                        <div className="flex space-x-3">
                            <a href={`${route('reportes.estado-cuenta')}?formato=pdf${socio ? '&socio_id=' + (auth.user.id) : ''}`} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg" target="_blank">📄 PDF</a>
                            <Link href={route('reportes.index')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg">← Volver</Link>
                        </div>
                    </div>

                    {/* Selector de socio para admin */}
                    {isAdmin && socios.length > 0 && (
                        <div className="bg-white shadow-sm rounded-lg p-4 flex items-end space-x-3">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Seleccionar Socio</label>
                                <select value={socioId} onChange={(e) => setSocioId(e.target.value)} className="w-full text-sm border-gray-300 rounded-md">
                                    <option value="">— Mi cuenta —</option>
                                    {socios.map(s => <option key={s.id} value={s.id}>{s.name} {s.ci ? `(${s.ci})` : ''}</option>)}
                                </select>
                            </div>
                            <button onClick={cambiarSocio} className="px-4 py-2 bg-fapclas-600 hover:bg-fapclas-700 text-white text-sm font-bold rounded-md">Ver</button>
                        </div>
                    )}

                    {/* Info del socio */}
                    <div className="bg-white shadow-sm rounded-lg p-5">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div><span className="text-gray-500">Nombre:</span><p className="font-bold">{socio.nombre}</p></div>
                            <div><span className="text-gray-500">CI:</span><p className="font-bold">{socio.ci}</p></div>
                            <div><span className="text-gray-500">Grado:</span><p className="font-bold">{socio.grado}</p></div>
                            <div><span className="text-gray-500">Destino:</span><p className="font-bold">{socio.destino}</p></div>
                            <div><span className="text-gray-500">Escalafón:</span><p className="font-bold">{socio.escalafon}</p></div>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-gray-500 uppercase">Saldo Kardex</p>
                            <p className="text-2xl font-bold text-fapclas-700">Bs. {Number(resumen.saldo_kardex).toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-gray-500 uppercase">Créditos Activos</p>
                            <p className="text-2xl font-bold text-blue-600">{resumen.creditos_activos}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-gray-500 uppercase">Deuda Total</p>
                            <p className="text-2xl font-bold text-red-600">Bs. {Number(resumen.deuda_total).toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border p-5">
                            <p className="text-xs text-gray-500 uppercase">Total Pagado</p>
                            <p className="text-2xl font-bold text-green-600">Bs. {Number(resumen.total_pagado).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Créditos */}
                    {creditos.length > 0 && (
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <div className="p-5 border-b"><h3 className="font-bold text-gray-700">Créditos</h3></div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagadas/Pendientes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {creditos.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">{c.id}</td>
                                            <td className="px-4 py-3 text-sm">{c.tipo}</td>
                                            <td className="px-4 py-3 text-sm text-right">Bs. {Number(c.monto_aprobado).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-sm text-right font-bold">Bs. {Number(c.saldo_capital).toFixed(2)}</td>
                                            <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${c.estado === 'En Mora' ? 'bg-red-100 text-red-800' : c.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{c.estado}</span></td>
                                            <td className="px-4 py-3 text-sm">{c.cuotas_pagadas} / {c.cuotas_pendientes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Movimientos */}
                    {movimientos.length > 0 && (
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <div className="p-5 border-b"><h3 className="font-bold text-gray-700">Últimos Movimientos</h3></div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ingreso</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Egreso</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {movimientos.map((m, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">{m.fecha}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{m.tipo}</td>
                                            <td className="px-4 py-3 text-sm max-w-xs truncate">{m.concepto}</td>
                                            <td className="px-4 py-3 text-sm text-right text-green-700">{Number(m.ingreso) > 0 ? `Bs. ${Number(m.ingreso).toFixed(2)}` : '—'}</td>
                                            <td className="px-4 py-3 text-sm text-right text-red-600">{Number(m.egreso) > 0 ? `Bs. ${Number(m.egreso).toFixed(2)}` : '—'}</td>
                                            <td className="px-4 py-3 text-sm text-right font-bold">Bs. {Number(m.saldo).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
