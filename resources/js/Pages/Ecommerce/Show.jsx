import React, { useState } from 'react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import { motion } from 'framer-motion';

export default function Show({ producto, auth, settings, relacionados }) {
    const { addToCart, cartCount } = useCart();
    const [cantidad, setCantidad] = useState(1);
    const isSocio = auth?.user?.roles?.includes('Socio');

    const precioReal = isSocio && producto.precio_asociado > 0 ? producto.precio_asociado : producto.precio_general;

    const handleAddToCart = () => {
        addToCart({ ...producto, precio_final: precioReal }, cantidad);
    };

    return (
        <StoreLayout>
            <Head title={producto.nombre} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href={route('beneficios.index')} className="inline-flex items-center text-brand-muted hover:text-[#618541] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Catálogo
                </Link>
                
                <div className="bg-card-fap rounded-3xl shadow-sm border border-brand overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Img Section */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-brand/5 flex items-center justify-center p-12 relative overflow-hidden group"
                        >
                            {producto.imagen_path ? (
                                <img src={`/storage/${producto.imagen_path}`} alt={producto.nombre} className="w-full max-w-md object-contain mix-blend-multiply transition-transform duration-100 group-hover:scale-110" />
                            ) : (
                                <div className="text-gray-300 w-full aspect-square flex items-center justify-center transition-transform duration-100 group-hover:scale-110">
                                    <ShoppingCart className="w-32 h-32 opacity-20" />
                                </div>
                            )}
                            {isSocio && producto.precio_asociado < producto.precio_general && (
                                <div className="absolute top-6 left-6 bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                    Descuento Socio
                                </div>
                            )}
                        </motion.div>

                        {/* Info Section */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="p-8 lg:p-12 flex flex-col justify-center"
                        >
                            <div className="text-sm font-bold tracking-widest text-[#618541] uppercase mb-2">
                                {producto.categoria?.nombre} • SKU: {producto.codigo_sku}
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-brand-main mb-4">{producto.nombre}</h1>
                            
                            <div className="prose prose-sm text-gray-600 mb-8">
                                <p>{producto.descripcion || 'Sin descripción detallada.'}</p>
                            </div>

                            <div className="mb-8">
                                <div className="text-sm text-brand-muted mb-1">Precio Unitario</div>
                                <div className="flex items-end gap-4">
                                    <span className="text-4xl font-black text-brand-main">Bs. {precioReal}</span>
                                    {isSocio && producto.precio_asociado < producto.precio_general && (
                                        <span className="text-lg text-brand-muted line-through mb-1">Bs. {producto.precio_general}</span>
                                    )}
                                </div>
                            </div>
                            
                            {producto.stock_actual > 0 ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm font-bold text-gray-700">Cantidad:</div>
                                        <div className="flex items-center border border-brand rounded-lg overflow-hidden bg-card-fap">
                                            <button 
                                                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                                className="px-4 py-2 text-brand-muted hover:bg-brand/5 transition-colors"
                                            >-</button>
                                            <div className="w-12 text-center font-bold text-brand-main">{cantidad}</div>
                                            <button 
                                                onClick={() => setCantidad(Math.min(producto.stock_actual, cantidad + 1))}
                                                className="px-4 py-2 text-brand-muted hover:bg-brand/5 transition-colors"
                                            >+</button>
                                        </div>
                                        <div className="text-xs text-green-600 font-medium">
                                            {producto.stock_actual} disponibles
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-brand">
                                        <button 
                                            onClick={handleAddToCart}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#28361d] hover:bg-[#1a2312] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Añadir al Carrito
                                        </button>
                                        {cartCount > 0 && (
                                            <Link href={route('beneficios.checkout')} className="flex-1 flex items-center justify-center gap-2 bg-[#618541]/10 hover:bg-[#618541]/20 text-[#28361d] border border-[#618541]/30 px-8 py-4 rounded-xl font-bold transition-colors">
                                                Ir a Pagar ({cartCount})
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl flex items-center gap-4">
                                    <ShieldCheck className="w-8 h-8 opacity-50" />
                                    <div>
                                        <h4 className="font-bold text-lg">Producto Agotado</h4>
                                        <p className="text-sm opacity-80">Por el momento este artículo no tiene existencias.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Productos Relacionados */}
                {relacionados && relacionados.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-brand-main">Quizás también te interese</h2>
                            <Link href={route('beneficios.index', { categoria: producto.categoria?.slug })} className="text-sm font-bold text-[#618541] hover:text-[#28361d] transition-colors">
                                Ver más de esta categoría &rarr;
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relacionados.map(rel => {
                                const relPrecio = isSocio && rel.precio_asociado > 0 ? rel.precio_asociado : rel.precio_general;
                                return (
                                    <div key={rel.id} className="bg-card-fap rounded-2xl shadow-sm border border-brand overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                        <Link href={route('beneficios.show', rel.id)}>
                                            <div className="aspect-[4/3] bg-brand/5 relative overflow-hidden p-6 flex items-center justify-center">
                                                {rel.imagen_path ? (
                                                    <img src={`/storage/${rel.imagen_path}`} alt={rel.nombre} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <ShoppingCart className="w-12 h-12 text-gray-300" />
                                                )}
                                                {isSocio && rel.precio_asociado < rel.precio_general && (
                                                    <div className="absolute top-2 right-2 bg-[#618541] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                        PRECIO SOCIO
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="p-4 border-t border-gray-50">
                                            <Link href={route('beneficios.show', rel.id)}>
                                                <h3 className="font-bold text-brand-main text-sm mb-1 line-clamp-1 hover:text-[#618541] transition-colors">
                                                    {rel.nombre}
                                                </h3>
                                            </Link>
                                            <div className="text-sm font-black text-brand-main">Bs. {relPrecio}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
