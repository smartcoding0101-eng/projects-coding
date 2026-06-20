import React from 'react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import { ArrowLeft, ShoppingBag, CreditCard, QrCode, Trash2, ShieldCheck, XCircle, Banknote, ArrowLeftRight } from 'lucide-react';
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

    const isEnvioActivo = settings?.ecommerce_envio_domicilio_activo !== 'no' && settings?.ecommerce_envio_domicilio_activo !== 'false' && settings?.ecommerce_envio_domicilio_activo !== '0';
    const precioEnvio = parseFloat(settings?.ecommerce_envio_domicilio_precio || '15.00');
    const costoEnvio = (data.logistica.tipo_entrega === 'envio_domicilio' && isEnvioActivo) ? precioEnvio : 0.00;
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
                    <h2 className="text-2xl font-bold text-brand-main mb-4">Tu carrito está vacío</h2>
                    <p className="text-brand-muted mb-8">Agrega productos del catálogo para continuar con tu compra.</p>
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
                <Link href={route('beneficios.index')} className="inline-flex items-center text-brand-muted hover:text-[#F7BD16] mb-8 transition-colors">
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
                        <div className="bg-card-fap rounded-2xl shadow-sm border border-brand p-6 mb-6">
                            <h3 className="text-lg font-bold text-brand-main mb-6 flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2 text-[#F7BD16]" /> Resumen de tu pedido
                            </h3>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-50 rounded-xl bg-brand/5/50">
                                        <div className="w-20 h-20 bg-card-fap rounded-lg border border-brand flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {item.imagen_path ? (
                                                <img src={`/storage/${item.imagen_path}`} alt={item.nombre} className="w-full h-full object-contain" />
                                            ) : (
                                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-brand-main text-sm line-clamp-1">{item.nombre}</h4>
                                            <div className="text-[#F7BD16] font-bold text-sm mb-2">Bs. {item.precio_final} c/u</div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-brand rounded bg-card-fap">
                                                    <button type="button" onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="px-2 py-1 text-brand-muted hover:bg-brand/5">-</button>
                                                    <div className="w-8 text-center text-sm font-bold">{item.cantidad}</div>
                                                    <button type="button" onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="px-2 py-1 text-brand-muted hover:bg-brand/5">+</button>
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
                        <form onSubmit={submit} className="bg-card-fap rounded-2xl shadow-lg shadow-gray-200/50 border border-brand p-6 sticky top-6">
                            <h3 className="text-xl font-extrabold text-brand-main mb-6 pb-4 border-b border-brand">Datos de Pago</h3>

                            {errors.checkout && (
                                <div className="mb-6 bg-red-50 border border-red-500/50 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {errors.checkout}
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <input type="text" value={data.cliente.nombre} onChange={e => setData('cliente', { ...data.cliente, nombre: e.target.value })} className="w-full rounded-lg border-brand shadow-sm focus:border-[#F7BD16] focus:ring-[#F7BD16]" required />
                                    {errors['cliente.nombre'] && <div className="text-red-500 text-xs mt-1">{errors['cliente.nombre']}</div>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">C.I.</label>
                                        <input type="text" value={data.cliente.ci} onChange={e => setData('cliente', { ...data.cliente, ci: e.target.value })} className="w-full rounded-lg border-brand shadow-sm focus:border-[#F7BD16] focus:ring-[#F7BD16]" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                                        <input type="text" value={data.cliente.telefono} onChange={e => setData('cliente', { ...data.cliente, telefono: e.target.value })} className="w-full rounded-lg border-brand shadow-sm focus:border-[#F7BD16] focus:ring-[#F7BD16]" required />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-brand-main mb-3 uppercase tracking-wider">Método de Pago</h4>
                                <div className="space-y-3">
                                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${data.tipo_pago === 'qr' ? 'border-[#F7BD16] bg-[#F7BD16]/5 ring-1 ring-[#F7BD16]' : 'border-brand hover:border-[#F7BD16]/40'}`}>
                                        <input type="radio" name="tipo_pago" value="qr" checked={data.tipo_pago === 'qr'} onChange={e => setData('tipo_pago', e.target.value)} className="mt-1 text-[#F7BD16] focus:ring-[#F7BD16]" />
                                        <div className="ml-3">
                                            <span className="block text-sm font-bold text-brand-main flex items-center"><QrCode className="w-4 h-4 mr-2" /> Transferencia QR</span>
                                            <span className="block text-xs text-brand-muted mt-1">Escanea el QR y confirma tu pago en la siguiente pantalla.</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${data.tipo_pago === 'efectivo' ? 'border-[#F7BD16] bg-[#F7BD16]/5 ring-1 ring-[#F7BD16]' : 'border-brand hover:border-[#F7BD16]/40'}`}>
                                        <input type="radio" name="tipo_pago" value="efectivo" checked={data.tipo_pago === 'efectivo'} onChange={e => setData('tipo_pago', e.target.value)} className="mt-1 text-[#F7BD16] focus:ring-[#F7BD16]" />
                                        <div className="ml-3">
                                            <span className="block text-sm font-bold text-brand-main flex items-center"><Banknote className="w-4 h-4 mr-2" /> Efectivo en Tienda</span>
                                            <span className="block text-xs text-brand-muted mt-1">Paga en efectivo al recoger tu pedido en tienda.</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${data.tipo_pago === 'transferencia' ? 'border-[#F7BD16] bg-[#F7BD16]/5 ring-1 ring-[#F7BD16]' : 'border-brand hover:border-[#F7BD16]/40'}`}>
                                        <input type="radio" name="tipo_pago" value="transferencia" checked={data.tipo_pago === 'transferencia'} onChange={e => setData('tipo_pago', e.target.value)} className="mt-1 text-[#F7BD16] focus:ring-[#F7BD16]" />
                                        <div className="ml-3">
                                            <span className="block text-sm font-bold text-brand-main flex items-center"><ArrowLeftRight className="w-4 h-4 mr-2" /> Transferencia Bancaria</span>
                                            <span className="block text-xs text-brand-muted mt-1">Realiza una transferencia directa y presenta el comprobante.</span>
                                        </div>
                                    </label>

                                    {isSocio && (
                                        <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${data.tipo_pago === 'credito_asociado' ? 'border-[#F7BD16] bg-[#F7BD16]/5 ring-1 ring-[#F7BD16]' : 'border-brand hover:border-[#F7BD16]/40'}`}>
                                            <input type="radio" name="tipo_pago" value="credito_asociado" checked={data.tipo_pago === 'credito_asociado'} onChange={e => setData('tipo_pago', e.target.value)} className="mt-1 text-[#F7BD16] focus:ring-[#F7BD16]" />
                                            <div className="ml-3">
                                                <span className="block text-sm font-bold text-brand-main flex items-center"><CreditCard className="w-4 h-4 mr-2" /> Crédito Asociado</span>
                                                <span className="block text-xs text-[#F7BD16] mt-1 font-medium">Se descontará de tu límite global autorizado.</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                                {errors.tipo_pago && <div className="text-red-500 text-xs mt-1">{errors.tipo_pago}</div>}
                            </div>

                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-brand-main mb-3 uppercase tracking-wider">Método de Entrega</h4>
                                <div className={`grid ${isEnvioActivo ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-4`}>
                                    <label className={`block text-center p-4 border rounded-xl cursor-pointer transition-all ${data.logistica.tipo_entrega === 'recojo_tienda' ? 'border-[#F7BD16] bg-[#F7BD16]/5 ring-1 ring-[#F7BD16]' : 'border-brand hover:border-[#F7BD16]/40'}`}>
                                        <input type="radio" className="hidden" name="tipo_entrega" value="recojo_tienda" checked={data.logistica.tipo_entrega === 'recojo_tienda'} onChange={e => setData('logistica', { ...data.logistica, tipo_entrega: e.target.value, direccion_envio: '' })} />
                                        <div className="font-bold text-brand-main text-sm">Recojo en Tienda</div>
                                        <div className="text-xs text-brand-muted mt-1">Gratis</div>
                                    </label>
                                    {isEnvioActivo && (
                                        <label className={`block text-center p-4 border rounded-xl cursor-pointer transition-all ${data.logistica.tipo_entrega === 'envio_domicilio' ? 'border-[#F7BD16] bg-[#F7BD16]/5 ring-1 ring-[#F7BD16]' : 'border-brand hover:border-[#F7BD16]/40'}`}>
                                            <input type="radio" className="hidden" name="tipo_entrega" value="envio_domicilio" checked={data.logistica.tipo_entrega === 'envio_domicilio'} onChange={e => setData('logistica', { ...data.logistica, tipo_entrega: e.target.value })} />
                                            <div className="font-bold text-brand-main text-sm">Envío a Domicilio</div>
                                            <div className="text-xs text-[#F7BD16] mt-1 font-bold">+ Bs. {precioEnvio.toFixed(2)}</div>
                                        </label>
                                    )}
                                </div>

                                {data.logistica.tipo_entrega === 'envio_domicilio' && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa *</label>
                                        <textarea
                                            value={data.logistica.direccion_envio}
                                            onChange={e => setData('logistica', { ...data.logistica, direccion_envio: e.target.value })}
                                            className="w-full rounded-lg border-brand shadow-sm focus:border-[#F7BD16] focus:ring-[#F7BD16] max-h-32"
                                            rows="2"
                                            placeholder="Ej. Av. Blanco Galindo Km 4, Calle B #123"
                                            required
                                        ></textarea>
                                        {errors['logistica.direccion_envio'] && <div className="text-red-500 text-xs mt-1">{errors['logistica.direccion_envio']}</div>}
                                    </div>
                                )}
                            </div>

                            {data.tipo_pago === 'qr' && (
                                <div className="mb-6 p-4 bg-brand/5 border border-brand rounded-xl text-center">
                                    <QrCode className="w-8 h-8 mx-auto text-brand-muted mb-2" />
                                    <div className="text-sm text-gray-700 font-bold mb-1">Pasarela QR Segura</div>
                                    <div className="text-xs text-brand-muted">Serás redirigido para escanear y confirmar tu pago al hacer clic en Confirmar Pedido.</div>
                                </div>
                            )}
                            {(data.tipo_pago === 'efectivo' || data.tipo_pago === 'transferencia') && (
                                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                                    <Banknote className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                                    <div className="text-sm text-amber-800 font-bold mb-1">Pago presencial</div>
                                    <div className="text-xs text-amber-700">Tu pedido quedará pendiente de validación. Preséntate en tienda con tu C.I. y el número de orden para completar el pago.</div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-brand mb-6 space-y-3">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Subtotal Productos</span>
                                    <span>Bs. {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Costo de Envío</span>
                                    <span>Bs. {costoEnvio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-[#F7BD16]/10 p-4 rounded-xl mt-2">
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
                                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-bold transition-all border border-red-500/50 disabled:opacity-50"
                            >
                                <Trash2 className="w-5 h-5" /> Rechazar Pedido
                            </button>

                            {settings?.ecommerce_nota_legal && (
                                <div className="mt-6 p-4 bg-brand/5 border border-brand/50 rounded-xl text-center">
                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                        <ShieldCheck className="w-3.5 h-3.5 inline-block mr-1 mb-0.5 opacity-60" />
                                        {settings.ecommerce_nota_legal}
                                    </p>
                                </div>
                            )}

                            <p className="text-center text-xs text-brand-muted mt-4">Tus datos están protegidos.</p>
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
                            className="bg-card-fap rounded-3xl shadow-2xl max-w-md w-full p-8 border border-brand"
                        >
                            <div className="flex items-center gap-4 mb-6 text-red-600">
                                <div className="p-4 bg-red-50 rounded-2xl">
                                    <XCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-main">Rechazar Pedido</h3>
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
                                    className="w-full bg-brand/5 text-gray-600 py-3 rounded-xl font-bold hover:bg-brand/10 transition-all"
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

