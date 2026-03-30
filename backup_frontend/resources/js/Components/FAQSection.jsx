import { useState } from 'react';

export default function FAQSection() {
    const faqs = [
        {
            question: "¿Cuáles son los requisitos fundamentales para un Préstamo Policial?",
            answer: "Los requisitos básicos incluyen la última papeleta de pago original, fotocopia de Cédula de Identidad, y no estar sobre-endeudado según los límites de la ASFI. Para líneas 'Vivienda Social', aplican requerimientos adicionales del Estado."
        },
        {
            question: "¿Cómo funciona el débito / descuento automático por planilla?",
            answer: "FAPCLAS R.L. opera bajo convenio institucional. Tus cuotas o aportes mensuales se debitan directamente de la nómina para evitarte filas, protegiendo así tu historial crediticio sin retrasos accidentales."
        },
        {
            question: "¿Puedo acceder a mis DPFs (Depósitos a Plazo) antes de tiempo?",
            answer: "Un DPF está blindado contractualmente para proteger tu altísima tasa de interés (hasta 7.00%). Sin embargo, existen provisiones de 'cancelación anticipada' bajo penalidad de rendimiento calculada. Consúltalo directamente con Operaciones."
        },
        {
            question: "¿Es seguro mi dinero en la Cooperativa FAPCLAS?",
            answer: "Absolutamente sí. Estamos doblemente regulados: Supervisados por ASFI (Autoridad de Supervisión del Sistema Financiero) y respaldados institucionalmente por AFCOOP, brindando la máxima solidez patrimonial de Bolivia."
        }
    ];

    const [openIndex, setOpenIndex] = useState(0);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="py-24 bg-surface relative" id="faqs">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-16">
                    <span className="uppercase font-bold text-xs tracking-widest text-primary block mb-3">Atención Inmediata</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-6">Preguntas Frecuentes</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Aclaremos tus dudas operativas antes de que tomes una decisión. Transparencia de clase mundial.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`group rounded-3xl overflow-hidden transition-all duration-300 border ${isOpen ? 'bg-white border-primary/20 shadow-xl shadow-primary/5' : 'bg-transparent border-gray-200 hover:border-gray-300'}`}
                            >
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex justify-between items-center focus:outline-none"
                                >
                                    <h3 className={`font-display font-semibold sm:text-lg pr-4 transition-colors ${isOpen ? 'text-primary-dark' : 'text-gray-700 group-hover:text-primary'}`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${isOpen ? 'bg-primary border-primary text-white rotate-180' : 'bg-transparent border-gray-300 text-gray-400 group-hover:border-primary group-hover:text-primary'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </button>
                                
                                <div 
                                    className={`px-6 md:px-8 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-6 lg:pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base border-t border-gray-100 pt-5">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
