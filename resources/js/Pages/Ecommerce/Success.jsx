import React from 'react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ShoppingBag, MapPin } from 'lucide-react';

export default function Success({ pedido }) {
    return (
        <StoreLayout>
            <Head title="Pedido Confirmado" />
            <div className="max-w-3xl mx-auto py-20 px-4">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 text-center border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#a1c286] via-[#28361d] to-[#4c6239]"></div>
                    
                    <CheckCircle className="w-24 h-24 mx-auto text-[#a1c286] mb-6" />
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">¡Gracias por tu compra!</h1>
                    <p className="text-lg text-gray-500 mb-8">
                        Tu pedido ha sido registrado con éxito bajo el número <br/>
                        <span className="inline-block mt-2 font-black text-2xl text-[#28361d] tracking-wider bg-[#618541]/10 px-4 py-2 rounded-lg">{pedido.numero_orden}</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10">
                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center uppercase tracking-wider"><ShoppingBag className="w-4 h-4 mr-2 text-[#618541]" /> Resumen</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between"><span>Cliente:</span> <span className="font-medium text-gray-900">{pedido.nombre_cliente}</span></div>
                                <div className="flex justify-between"><span>Total pagado:</span> <span className="font-bold text-gray-900">Bs. {pedido.total}</span></div>
                                <div className="flex justify-between"><span>Método:</span> <span className="font-medium text-gray-900">{pedido.tipo_pago === 'qr' ? 'Transferencia QR' : 'Crédito Asociado'}</span></div>
                                <div className="flex justify-between"><span>Estado:</span> <span className="font-medium text-amber-600">{pedido.estado_pago === 'pendiente_validacion' ? 'Pendiente ('+pedido.tipo_pago+')' : 'Pagado'}</span></div>
                            </div>
                        </div>

                        <div className="bg-[#618541]/5 border border-[#618541]/20 p-6 rounded-2xl relative overflow-hidden">
                            <MapPin className="absolute -bottom-4 -right-4 w-32 h-32 text-[#618541]/10" />
                            <h3 className="text-sm font-bold text-[#28361d] mb-4 flex items-center uppercase tracking-wider relative z-10"><MapPin className="w-4 h-4 mr-2 text-[#618541]" /> Recojo en Tienda</h3>
                            <p className="text-sm text-[#28361d] relative z-10 font-medium">
                                Tu pedido estará listo para recoger en nuestra tienda física principal. Por favor presenta tu C.I. y el número de orden.
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-500 mb-8">Tu pedido se procesará tan pronto se valide el pago.</p>
                    <Link href={route('beneficios.index')} className="bg-[#28361d] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1a2312] transition-colors">
                        Volver a la Tienda
                    </Link>
                </div>
            </div>
        </StoreLayout>
    );
}
