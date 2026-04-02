import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, QrCode, Lock, CheckCircle2, ZoomIn, X } from 'lucide-react';

export default function PasarelaQR({ pedido, settings }) {
    const [simulando, setSimulando] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    
    const qrImage = settings?.ecommerce_qr_pago;
    const resolvedQrImage = qrImage ? (qrImage.startsWith('/') || qrImage.startsWith('http') ? qrImage : `/storage/${qrImage}`) : null;

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
        <>
            <div className="min-h-screen bg-brand/5 flex flex-col items-center justify-center p-4">
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
                    <div className="bg-card-fap p-8 rounded-b-3xl shadow-xl border border-brand/50">
                        <div className="text-center mb-8">
                            <div className="text-sm font-bold text-brand-muted uppercase tracking-widest mb-1">Monto a Pagar</div>
                            <div className="text-4xl font-black text-brand-main">Bs. {Number(pedido.total).toFixed(2)}</div>
                            <div className="text-xs text-brand-muted mt-2 font-mono">Ref: {pedido.numero_orden}</div>
                        </div>

                        <div className="mb-8 p-6 bg-brand/5 rounded-2xl border border-brand flex flex-col items-center justify-center relative">
                            {resolvedQrImage ? (
                                <div 
                                    className="relative group cursor-pointer" 
                                    onClick={() => setIsZoomed(true)}
                                    title="Haz clic para ampliar la imagen"
                                >
                                    <img src={resolvedQrImage} alt="QR de Pago" className="w-48 h-48 object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
                                    
                                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[2px]">
                                        <div className="bg-white/90 p-3 rounded-full shadow-lg border border-brand/20">
                                            <ZoomIn className="w-6 h-6 text-brand-main" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-48 h-48 bg-card-fap border-2 border-dashed border-brand rounded-xl flex items-center justify-center">
                                    <QrCode className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                            
                            {/* Escáner visual effect */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#618541]/50 shadow-[0_0_8px_2px_rgba(97,133,65,0.4)] animate-pulse"></div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-brand-main text-center mb-2">Instrucciones de Pago:</h3>
                            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside px-2">
                                <li>Abre tu aplicación bancaria de preferencia.</li>
                                <li>Selecciona la opción "Pagar o Cobrar con QR".</li>
                                <li>Escanea el código QR mostrado arriba.</li>
                                <li>Confirma que el monto sea exacto (<strong>Bs. {Number(pedido.total).toFixed(2)}</strong>).</li>
                            </ol>
                        </div>

                        {/* Simulación para propósitos de Desarrollo */}
                        <div className="mt-10 pt-6 border-t border-brand">
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

                    <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs text-brand-muted font-medium">
                        <Lock className="w-3 h-3" /> Transacción operada y encriptada por FAPCLAS Pay
                    </div>
                </div>
            </div>

            {/* Modal de Zoom QR */}
            {isZoomed && resolvedQrImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"
                    onClick={() => setIsZoomed(false)}
                >
                    <div 
                        className="relative max-w-sm w-full flex flex-col items-center animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setIsZoomed(false)}
                            className="absolute -top-14 right-0 md:-right-12 p-2.5 text-white hover:text-red-400 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 active:scale-95"
                            title="Cerrar Zoom"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="bg-white p-6 rounded-[2rem] shadow-[0_0_50px_rgba(40,54,29,0.3)] w-full overflow-hidden relative group">
                            <img 
                                src={resolvedQrImage} 
                                alt="QR de Pago Ampliado" 
                                className="w-full h-auto aspect-square object-contain mx-auto mix-blend-multiply relative z-10" 
                            />
                            
                            {/* Láser de Escaneo Estético en el Zoom */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-500/80 shadow-[0_0_20px_5px_rgba(34,197,94,0.4)] animate-pulse z-20"></div>
                        </div>
                        
                        <div className="mt-6 flex flex-col items-center">
                            <h3 className="text-white font-black text-xl tracking-wider uppercase mb-1 drop-shadow-md">Escanea para Pagar</h3>
                            <p className="text-white/80 text-sm font-medium tracking-wide">Bs. {Number(pedido.total).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
