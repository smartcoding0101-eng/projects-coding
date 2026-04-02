import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Pickaxe, ArrowLeft } from 'lucide-react';

export default function Construccion({ auth, titulo }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3 py-1">
                    <Pickaxe className="w-6 h-6 text-brand-muted" />
                    <h2 className="font-semibold text-xl text-brand-main leading-tight tracking-tight">
                        {titulo || 'En Construcción'}
                    </h2>
                </div>
            }
        >
            <Head title={`${titulo} | FAPCLAS`} />

            <div className="py-24 min-h-[80vh] bg-main flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="w-24 h-24 bg-brand/10 border border-brand rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-12 hover:rotate-0 transition-transform">
                        <Pickaxe className="w-10 h-10 text-brand-muted" />
                    </div>
                    <h3 className="text-3xl font-black text-brand-main tracking-tight uppercase mb-4">Módulo en Desarrollo</h3>
                    <p className="text-brand-muted font-medium max-w-lg mx-auto mb-8 leading-relaxed">
                        Este reporte estadístico forma parte de las próximas ramificaciones del ecosistema analítico. Nuestros ingenieros están trabajando en su consolidación.
                    </p>
                    <a 
                        href={route('reportes.index')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand/10 hover:bg-brand/20 text-brand-main font-bold text-sm uppercase rounded-xl transition-colors border border-brand shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver a Reportes
                    </a>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
