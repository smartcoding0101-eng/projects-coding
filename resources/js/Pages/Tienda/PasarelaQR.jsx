import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PasarelaQR({ auth, beneficio, monto }) {
    const { data, setData, post, processing, errors } = useForm({
        beneficio_id: beneficio.id,
        monto_total: monto,
        codigo_transaccion_qr: '',
        whatsapp: auth.user.whatsapp || ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tienda.pagar'));
    };

    // Simulador de QR Generator Oficial
    const qrPlaceholderUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FAPCLAS-${beneficio.id}-BS${monto}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Checkout: {beneficio.nombre}</h2>}
        >
            <Head title="Pagar QR" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card-fap overflow-hidden shadow-xl sm:rounded-lg flex flex-col md:flex-row">
                        
                        {/* QR Section */}
                        <div className="w-full md:w-1/2 bg-brand/5 p-8 flex flex-col items-center justify-center border-r border-brand">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Escanea el QR para pagar</h3>
                            <div className="bg-card-fap p-4 rounded-xl shadow-inner border border-brand">
                                <img src={qrPlaceholderUrl} alt="QR de Pago FAPCLAS" className="w-48 h-48" />
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-sm font-semibold text-gray-600">Total a Pagar:</p>
                                <p className="text-3xl font-black text-primary">Bs. {monto}</p>
                            </div>
                            <p className="text-xs text-brand-muted mt-4 text-center">
                                El monto será abonado directamente a la cuenta corporativa de FAPCLAS R.L.
                            </p>
                        </div>

                        {/* Formulario de Verificación */}
                        <div className="w-full md:w-1/2 p-8 border-t md:border-t-0 border-brand">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">Verificar Transacción</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Una vez que realices el pago desde la app de tu banco, ingresa el <strong>Número de Transacción / Comprobante</strong> para que el administrador libere tu servicio.
                            </p>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="monto_total" value="Monto Exacto (Bs.)" />
                                    <TextInput
                                        id="monto_total"
                                        type="number"
                                        className="mt-1 block w-full bg-brand/10"
                                        value={data.monto_total}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="codigo_transaccion_qr" value="No. de Comprobante" />
                                    <TextInput
                                        id="codigo_transaccion_qr"
                                        type="text"
                                        className="mt-1 block w-full border-green-500 focus:border-green-600 focus:ring-green-600 font-mono"
                                        value={data.codigo_transaccion_qr}
                                        onChange={(e) => setData('codigo_transaccion_qr', e.target.value)}
                                        placeholder="Ej: 9982736612"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.codigo_transaccion_qr} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="whatsapp" value="Tu número de WhatsApp (para notificaciones)" />
                                    <div className="flex gap-2 mt-1">
                                        <div className="bg-brand/10 flex items-center px-4 rounded-xl border border-brand text-brand-muted font-bold">
                                            +591
                                        </div>
                                        <TextInput
                                            id="whatsapp"
                                            type="tel"
                                            className="block w-full"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            placeholder="76543210"
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-brand-muted mt-1">Ej: 8 dígitos. Se usará para enviarte la confirmación del pedido.</p>
                                    <InputError message={errors.whatsapp} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-4 border-t border-brand">
                                    <Link href={route('tienda.index')} className="text-sm text-brand-muted hover:text-brand-main transition">
                                        ← Volver
                                    </Link>
                                    <PrimaryButton disabled={processing} className="bg-green-600 hover:bg-green-700">
                                        Notificar Pago Realizado
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
