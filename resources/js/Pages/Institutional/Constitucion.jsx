import { Head } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

export default function Constitucion() {
    return (
        <>
            <Head title="Constitución - FAPCLAS R.L." />
            <div className="min-h-screen font-sans antialiased text-on-surface bg-surface selection:bg-primary/20 flex flex-col">
                <Header />
                <main className="flex-grow pt-32 pb-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h1 className="font-display text-5xl font-bold text-primary-dark mb-4">Nuestra Historia</h1>
                            <p className="text-xl text-gray-500">Construyendo el futuro de la clase policial con solidaridad financiera.</p>
                        </div>
                        <div className="bg-white rounded-3xl p-10 md:p-14 border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
                            <div className="prose prose-lg md:prose-xl max-w-none text-gray-600 font-sans leading-relaxed">
                                <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3">
                                    El <strong>Fondo de Ahorro y Préstamo de la Clase de Suboficiales, Sargentos, Clases y Policías (FAPCLAS R.L.)</strong> nació de la profunda necesidad institucional de contar con un soporte económico y crediticio propio, fundado indudablemente en los principios irrenunciables de la solidaridad, el ahorro estructurado y la ayuda mutua entre la fila policial.
                                </p>
                                
                                <p className="mt-6">
                                    Durante varios años ininterrumpidos de labor técnica, administrativa y social, hemos acompañado firmemente el progreso y otorgado tranquilidad financiera a miles de familias cuyos miembros arriesgan su propia vida cotidianamente por salvaguardar la seguridad de nuestra amada patria y a quienes no tienen voz en las financieras tradicionales.
                                </p>

                                <div className="my-10 border-l-4 border-primary pl-6 bg-surface p-6 rounded-r-2xl">
                                    <h3 className="font-display text-2xl font-bold text-primary-dark mb-2">Fundamento Legal</h3>
                                    <p className="text-base text-gray-600">
                                        Operamos bajo el amparo incuestionable de resoluciones institucionales aprobadas por el correspondiente Alto Mando Policial, en fiel estricto acatamiento de las directrices jurídicas sancionadas por nuestra Autoridad Reguladora y la normativa estatal plurinacional del sistema cooperativo.
                                    </p>
                                </div>

                                <h3 className="font-display text-3xl font-bold text-primary-dark mt-8 mb-6">Nuestros Valores</h3>
                                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="font-bold text-lg text-primary mb-2 flex items-center gap-2">
                                            <span className="w-3 h-3 bg-secondary rounded-full"></span> Transparencia
                                        </h4>
                                        <p className="text-sm text-gray-500">Demostramos cuentas y finanzas infaliblemente claras frente a cada uno de nuestros afiliados.</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="font-bold text-lg text-primary mb-2 flex items-center gap-2">
                                            <span className="w-3 h-3 bg-secondary rounded-full"></span> Solidaridad Mutual
                                        </h4>
                                        <p className="text-sm text-gray-500">El soporte cooperativo está predispuesto para acudir en auxilio económico de los policías y la fuerza activa operativa.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
