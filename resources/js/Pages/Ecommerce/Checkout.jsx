import React from 'react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { ArrowLeft, ShoppingBag, CreditCard, QrCode, Trash2, ShieldCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout({ auth, settings }) {
    const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const [showConfirmRechazar, setShowConfirmRechazar] = React.useState(false);
    const isSocio = auth?.user?.roles?.includes('Socio');

    const { data, setData, post, processing, errors } = useForm({
        cliente: {
            nombre: auth?.user ? auth.user.name : '',
            ci: '',
            telefono: '',
            observaciones: ''
        },
        carrito: cart.map(item => ({ id: item.id, cantidad: item.cantidad })),
        tipo_pago: 'qr',
        logistica: {
            tipo_entrega: 'recojo_tienda',
            direccion_envio: ''
        }
    });

    const costoEnvio = data.logistica.tipo_entrega === 'envio_domicilio' ? 15.00 : 0.00;
    const finalTotal = cartTotal + costoEnvio;

    const qrImage = settings?.ecommerce_qr_pago;

    const submit = (e) => {
        e.preventDefault();
        const currentCart = cart.map(item => ({ id: item.id, cantidad: item.cantidad }));
        
        router.post(route('beneficios.process'), {
            ...data,
            carrito: currentCart
        }, {
            forceFormData: true,
            onSuccess: () => clearCart(),
        });
    };

    if (cart.length === 0) {
        return (
            <StoreLayout>
                <Head title="Carrito Vacío" />
                <div className="max-w-3xl mx-auto py-20 px-4 text-center">
                    <ShoppingBag className="w-24 h-24 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
                    <p className="text-gray-500 mb-8">Agrega productos del catálogo para continuar con tu compra.</p>
                    <Link href={route('beneficios.index')} className="bg-[#28361d] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1a2312] transition-colors">
                        Volver a la Tienda
                    </Link>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout>
            <Head title="Checkout" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href={route('beneficios.index')} className="inline-flex items-center text-gray-500 hover:text-[#618541] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Seguir Comprando
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Resumen del Carrito */}
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2 text-[#618541]" /> Resumen de tu pedido
                            </h3>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-50 rounded-xl bg-gray-50/50">
                                        <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {item.imagen_path ? (
                                                <img src={`/storage/${item.imagen_path}`} alt={item.nombre} className="w-full h-full object-contain" />
                                            ) : (
                                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.nombre}</h4>
                                            <div className="text-[#618541] font-bold text-sm mb-2">Bs. {item.precio_final} c/u</div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-gray-200 rounded bg-white">
                                                    <button type="button" onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">-</button>
                                                    <div className="w-8 text-center text-sm font-bold">{item.cantidad}</div>
                                                    <button type="button" onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">+</button>
                                                </div>
                                                <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Formulario de Checkout */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full lg:w-[400px] xl:w-[480px]"
                    >
                        <form onSubmit={submit} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sticky top-6">
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-100">Datos de Pago</h3>
                            
                            {errors.checkout && (
                                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {errors.checkout}
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <input type="text" value={data.cliente.nombre} onChange={e => setData('cliente', {...data.cliente, nombre: e.target.value})} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#618541] focus:ring-[#618541]" required />
                                    {errors['cliente.nombre'] && <div className="text-red-500 text-xs mt-1">{errors['cliente.nombre']}</div>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">C.I.</label>
                                        <input type="text" value={data.cliente.ci} onChange={e => setData('cliente', {...data.cliente, ci: e.target.value})} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#618541] focus:ring-[#618541]" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                                        <input type="text" value={data.cliente.telefono} onChange={e => setData('cliente', {...data.cliente, telefono: e.target.value})} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#618541] focus:ring-[#618541]" required />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Método de Pago</h4>
                                <div className="space-y-3">
                                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${data.tipo_pago === 'qr' ? 'border-[#618541] bg-[#618541]/5 ring-1 ring-[#618541]' : 'border-gray-200 hover:border-[#618541]/40'}`}>
                                        <input type="radio" name="tipo_pago" value="qr" checked={data.tipo_pago === 'qr'} onChange={e => setData('tipo_pago', e.target.value)} className="mt-1 text-[#618541] focus:ring-[#618541]" />
                                        <div className="ml-3">
                                            <span className="block text-sm font-bold text-gray-900 flex items-center"><QrCode className="w-4 h-4 mr-2" /> Transferencia QR</span>
                                            <span className="block text-xs text-gray-500 mt-1">Sube el comprobante de tu banco tras escanear.</span>
                                        </div>
                                    </label>

                                    {isSocio && (
                                        <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${data.tipo_pago === 'credito_asociado' ? 'border-[#618541] bg-[#618541]/5 ring-1 ring-[#618541]' : 'border-gray-200 hover:border-[#618541]/40'}`}>
                                            <input type="radio" name="tipo_pago" value="credito_asociado" checked={data.tipo_pago === 'credito_asociado'} onChange={e => setData('tipo_pago', e.target.value)} className="mt-1 text-[#618541] focus:ring-[#618541]" />
                                            <div className="ml-3">
                                                <span className="block text-sm font-bold text-gray-900 flex items-center"><CreditCard className="w-4 h-4 mr-2" /> Crédito Asociado</span>
                                                <span className="block text-xs text-[#618541] mt-1 font-medium">Se descontará de tu límite global autorizado.</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                                {errors.tipo_pago && <div className="text-red-500 text-xs mt-1">{errors.tipo_pago}</div>}
                            </div>

                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Método de Entrega</h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <label className={`block text-center p-4 border rounded-xl cursor-pointer transition-all ${data.logistica.tipo_entrega === 'recojo_tienda' ? 'border-[#618541] bg-[#618541]/5 ring-1 ring-[#618541]' : 'border-gray-200 hover:border-[#618541]/40'}`}>
                                        <input type="radio" className="hidden" name="tipo_entrega" value="recojo_tienda" checked={data.logistica.tipo_entrega === 'recojo_tienda'} onChange={e => setData('logistica', { ...data.logistica, tipo_entrega: e.target.value, direccion_envio: '' })} />
                                        <div className="font-bold text-gray-900 text-sm">Recojo en Tienda</div>
                                        <div className="text-xs text-gray-500 mt-1">Gratis</div>
                                    </label>
                                    <label className={`block text-center p-4 border rounded-xl cursor-pointer transition-all ${data.logistica.tipo_entrega === 'envio_domicilio' ? 'border-[#618541] bg-[#618541]/5 ring-1 ring-[#618541]' : 'border-gray-200 hover:border-[#618541]/40'}`}>
                                        <input type="radio" className="hidden" name="tipo_entrega" value="envio_domicilio" checked={data.logistica.tipo_entrega === 'envio_domicilio'} onChange={e => setData('logistica', { ...data.logistica, tipo_entrega: e.target.value })} />
                                        <div className="font-bold text-gray-900 text-sm">Envío a Domicilio</div>
                                        <div className="text-xs text-[#618541] mt-1 font-bold">+ Bs. 15.00</div>
                                    </label>
                                </div>

                                {data.logistica.tipo_entrega === 'envio_domicilio' && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa *</label>
                                        <textarea
                                            value={data.logistica.direccion_envio}
                                            onChange={e => setData('logistica', { ...data.logistica, direccion_envio: e.target.value })}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#618541] focus:ring-[#618541] max-h-32"
                                            rows="2"
                                            placeholder="Ej. Av. Blanco Galindo Km 4, Calle B #123"
                                            required
                                        ></textarea>
                                        {errors['logistica.direccion_envio'] && <div className="text-red-500 text-xs mt-1">{errors['logistica.direccion_envio']}</div>}
                                    </div>
                                )}
                            </div>

                            {data.tipo_pago === 'qr' && (
                                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                                    <QrCode className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <div className="text-sm text-gray-700 font-bold mb-1">Pasarela QR Segura</div>
                                    <div className="text-xs text-gray-500">Serás redirigido para escanear y confirmar tu pago al hacer clic en Confirmar Pedido.</div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 mb-6 space-y-3">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Subtotal Productos</span>
                                    <span>Bs. {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Costo de Envío</span>
                                    <span>Bs. {costoEnvio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-[#618541]/10 p-4 rounded-xl mt-2">
                                    <span className="text-lg font-bold text-gray-700">Total a Pagar</span>
                                    <span className="text-3xl font-black text-[#28361d]">Bs. {finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button type="submit" disabled={processing} className="w-full flex items-center justify-center gap-2 bg-[#28361d] hover:bg-[#1a2312] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md disabled:opacity-50 mb-3">
                                {processing ? 'Procesando...' : <><ShieldCheck className="w-5 h-5" /> Confirmar Pedido</>}
                            </button>

                            <button 
                                type="button" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowConfirmRechazar(true);
                                }}
                                disabled={processing} 
                                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold transition-all border border-red-200 disabled:opacity-50"
                            >
                                <Trash2 className="w-5 h-5" /> Rechazar Pedido
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4">Tus datos están protegidos.</p>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Modal de Confirmación Moderno - RECHAZAR PEDIDO */}
            <AnimatePresence>
                {showConfirmRechazar && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-6 text-red-600">
                                <div className="p-4 bg-red-50 rounded-2xl">
                                    <XCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Rechazar Pedido</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                                ¿Estás seguro de que deseas rechazar este pedido? Se vaciará tu carrito por completo y serás redirigido al catálogo.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => {
                                        clearCart();
                                        router.get(route('beneficios.index'));
                                    }} 
                                    className="w-full bg-red-600 text-white py-4 rounded-xl font-black hover:bg-red-700 transition-all shadow-lg active:scale-95"
                                >
                                    Sí, Vaciar Carrito
                                </button>
                                <button 
                                    onClick={() => setShowConfirmRechazar(false)} 
                                    className="w-full bg-gray-50 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                                >
                                    Volver al Checkout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </StoreLayout>
    );
}

