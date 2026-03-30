import React, { useState } from 'react';
import { MessageCircle, X, Info, CreditCard, Truck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('inicio');

    const faqs = {
        pagos: [
            { q: '¿Cómo funciona el Crédito Asociado?', a: 'Si eres socio FAPCLAS registrado, puedes comprar a crédito y el monto se descontará de tu límite global pre-aprobado y figurará en tu papeleta.' },
            { q: '¿Cómo pago con QR?', a: 'Al elegir QR, confirmarás el pedido y serás llevado a la pasarela donde escanearás el código QR con tu app bancaria local. Posteriormente puedes simular la validación en el demo.' }
        ],
        envios: [
            { q: '¿Tienen envíos a domicilio?', a: 'Sí. Puedes seleccionar "Envío a Domicilio" durante el proceso de pago. El envío tiene un recargo base de Bs. 15.00 a nivel central.' },
            { q: '¿Puedo recoger en tienda?', a: 'Por supuesto. Selecciona "Recojo en Tienda" (sin costo adicional) y retira tu pedido en nuestra oficina central presentando tu CI.' }
        ]
    };

    return (
        <div className="fixed bottom-[5.5rem] right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-[#28361d] text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Asistente FAPCLAS</h3>
                                    <p className="text-[10px] text-white/70">Respuestas rápidas</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1 rounded transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 bg-gray-50 flex-1 h-80 overflow-y-auto">
                            {activeTab === 'inicio' && (
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm text-sm text-gray-700">
                                        ¡Hola! 👋 Soy tu asistente virtual. Selecciona una categoría para resolver tus dudas frecuentes sobre la tienda B2C y B2B.
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setActiveTab('pagos')} className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#618541] hover:bg-[#618541]/5 transition-colors group">
                                            <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-[#618541]" />
                                            <span className="text-xs font-bold text-gray-700">Pagos y Crédito</span>
                                        </button>
                                        <button onClick={() => setActiveTab('envios')} className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#618541] hover:bg-[#618541]/5 transition-colors group">
                                            <Truck className="w-6 h-6 text-gray-400 group-hover:text-[#618541]" />
                                            <span className="text-xs font-bold text-gray-700">Envíos y Entregas</span>
                                        </button>
                                    </div>
                                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-xs flex gap-3">
                                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <p>Para consultas sobre devoluciones o estado del pedido, por favor contáctate directamente con soporte al afiliado.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'inicio' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <button onClick={() => setActiveTab('inicio')} className="text-xs text-[#618541] font-bold hover:underline inline-flex items-center">
                                        &larr; Volver a categorías
                                    </button>
                                    
                                    <h4 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                                        {activeTab === 'pagos' ? <CreditCard className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                        {activeTab === 'pagos' ? 'Pagos y Crédito' : 'Envíos y Entregas'}
                                    </h4>

                                    <div className="space-y-3">
                                        {faqs[activeTab].map((item, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                                <div className="font-bold text-sm text-gray-800 mb-1 flex items-start gap-2">
                                                    <HelpCircle className="w-4 h-4 text-[#618541] flex-shrink-0 mt-0.5" />
                                                    {item.q}
                                                </div>
                                                <div className="text-xs text-gray-600 ml-6 leading-relaxed">
                                                    {item.a}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-gray-800 text-white' : 'bg-[#618541] text-white'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
}
