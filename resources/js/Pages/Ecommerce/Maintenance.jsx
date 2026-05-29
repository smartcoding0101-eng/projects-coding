import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';

export default function Maintenance() {
    const { settings } = usePage().props;

    return (
        <StoreLayout>
            <Head title="Tienda en Mantenimiento" />

            <div className="flex items-center justify-center min-h-[60vh] bg-main text-brand-main px-4">
                <div className="max-w-2xl text-center space-y-6">
                    <div className="mb-8">
                        <svg className="w-24 h-24 mx-auto text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572-1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 001.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-brand-main">
                        Estamos en <span className="text-primary">Mantenimiento</span>
                    </h1>

                    <p className="text-lg md:text-xl text-brand-muted max-w-xl mx-auto leading-relaxed">
                        Nuestra tienda de beneficios está temporalmente fuera de línea porque estamos actualizando nuestro inventario y mejorando nuestros servicios para brindarte la mejor experiencia.
                    </p>

                    <div className="pt-8">
                        <Link
                            href="/"
                            className="inline-flex py-4 px-8 items-center justify-center font-bold tracking-tight rounded-2xl bg-primary text-white hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        >
                            Volver al Inicio
                        </Link>
                    </div>

                    <p className="text-sm text-brand-muted pt-8 opacity-75">
                        FAPCLAS R.L. siempre pensando en el bienestar de la familia policial aportante.
                    </p>
                </div>
            </div>
        </StoreLayout>
    );
}
