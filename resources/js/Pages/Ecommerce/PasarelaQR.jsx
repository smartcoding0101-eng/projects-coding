import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, QrCode, Lock, CheckCircle2 } from 'lucide-react';

export default function PasarelaQR({ pedido, settings }) {
    const [simulando, setSimulando] = useState(false);
    const qrImage = settings?.ecommerce_qr_pago;

    const simularPago = () => {
        setSimulando(true);
        // Simular retardo de red como si fuera un banco real
        setTimeout(() => {
            router.post(route('beneficios.webhook-qr'), {
                numero_orden: pedido.numero_orden
            }, {
                preserveState: true,
                onFinish: () => setSimulando(false)
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Head title={`Pago Seguro - ${pedido.numero_orden}`} />

            <div className="w-full max-w-md">
                {/* Header Pasarela */}
                <div className="bg-[#28361d] p-6 rounded-t-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -tr-10 opacity-10">
                        <ShieldCheck className="w-32 h-32 text-white" />
                    </div>
                    <Lock className="w-8 h-8 text-white/80 mx-auto mb-3" />
                    <h1 className="text-white font-black text-xl tracking-wide">FAPCLAS PAY</h1>
                    <p className="text-white/70 text-sm mt-1">Conexión Segura Cifrada</p>
                </div>

                {/* Body Pasarela */}
                <div className="bg-white p-8 rounded-b-3xl shadow-xl border border-gray-100/50">
                    <div className="text-center mb-8">
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Monto a Pagar</div>
                        <div className="text-4xl font-black text-gray-900">Bs. {Number(pedido.total).toFixed(2)}</div>
                        <div className="text-xs text-gray-400 mt-2 font-mono">Ref: {pedido.numero_orden}</div>
                    </div>

                    <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center relative">
                        {qrImage ? (
                            <img src={`/storage/${qrImage}`} alt="QR de Pago" className="w-48 h-48 object-contain mix-blend-multiply" />
                        ) : (
                            <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                                <QrCode className="w-16 h-16 text-gray-300" />
                            </div>
                        )}
                        
                        {/* Escáner visual effect */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#618541]/50 shadow-[0_0_8px_2px_rgba(97,133,65,0.4)] animate-pulse"></div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 text-center mb-2">Instrucciones de Pago:</h3>
                        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside px-2">
                            <li>Abre tu aplicación bancaria de preferencia.</li>
                            <li>Selecciona la opción "Pagar o Cobrar con QR".</li>
                            <li>Escanea el código QR mostrado arriba.</li>
                            <li>Confirma que el monto sea exacto (<strong>Bs. {Number(pedido.total).toFixed(2)}</strong>).</li>
                        </ol>
                    </div>

                    {/* Simulación para propósitos de Desarrollo */}
                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <div className="text-xs text-center text-orange-500 font-bold mb-3">
                            ⚠️ Entorno de Desarrollo (Simulación API Webhook)
                        </div>
                        <button 
                            onClick={simularPago}
                            disabled={simulando}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all ${simulando ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {simulando ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Validando Pago en API...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Simular Pago Recibido
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                    <Lock className="w-3 h-3" /> Transacción operada y encriptada por FAPCLAS Pay
                </div>
            </div>
        </div>
    );
}
