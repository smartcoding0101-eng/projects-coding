import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, beneficios }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Beneficios Exclusivos FAPCLAS</h2>}
        >
            <Head title="Beneficios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {beneficios.length === 0 && (
                            <div className="col-span-3 text-center text-brand-muted py-10 bg-card-fap rounded shadow">
                                Pronto añadiremos más beneficios y convenios para ti.
                            </div>
                        )}

                        {beneficios.map((beneficio) => (
                            <div key={beneficio.id} className="bg-card-fap overflow-hidden shadow-lg rounded-xl transition-transform hover:scale-105">
                                {/* Imagen Placeholder */}
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-brand-muted font-bold text-2xl">{beneficio.nombre}</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-brand-main mb-2">{beneficio.nombre}</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {beneficio.descripcion || 'Accede a este servicio rápidamente pagando vía QR.'}
                                    </p>
                                    
                                    <div className="border-t pt-4">
                                        <Link 
                                            href={route('tienda.pasarela', beneficio.id)} 
                                            className="w-full block text-center bg-fapclas-600 hover:bg-fapclas-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                        >
                                            Generar Pago QR
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
