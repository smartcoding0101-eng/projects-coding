import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle, Package, User, CreditCard, QrCode, ClipboardList, MessageCircle, FileText, AlertTriangle, Download } from 'lucide-react';

export default function Show({ pedido, auth, urls }) {
    const { post, processing } = useForm();
    const [showConfirmAprobar, setShowConfirmAprobar] = useState(false);
    const [showConfirmRechazar, setShowConfirmRechazar] = useState(false);
    const [showConfirmEntregar, setShowConfirmEntregar] = useState(false);

    const handleValidar = () => {
        post(route('admin.pedidos.validar', pedido.id), {
            onSuccess: () => setShowConfirmAprobar(false),
            preserveScroll: true
        });
    };

    const handleRechazar = () => {
        post(route('admin.pedidos.rechazar', pedido.id), {
            onSuccess: () => setShowConfirmRechazar(false),
            preserveScroll: true
        });
    };

    const handleEntregar = () => {
        post(route('admin.pedidos.entregar', pedido.id), {
            onSuccess: () => setShowConfirmEntregar(false),
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Auditoría de Orden {pedido.numero_orden}</h2>}>
            <Head title={`Auditoría: ${pedido.numero_orden}`} />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* Navegación Top */}
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.pedidos.index')} className="px-3 py-1.5 bg-card-fap border border-brand text-primary hover:bg-brand/10 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 rounded transition-colors shadow-sm">
                            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Registro
                        </Link>
                    </div>

                    {/* Alerta de Validación (Compacta) */}
                    {pedido.estado_pago === 'pendiente_validacion' && (
                        <div className="bg-amber-50 border border-amber-300 flex flex-col md:flex-row items-center justify-between p-3 rounded shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-amber-500 rounded text-white shadow-inner">
                                    <QrCode className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-amber-900 font-bold text-xs uppercase tracking-wider">Requiere Validación de Pagos</h3>
                                    <p className="text-amber-700 text-[10px] font-medium">Validación contable pendiente para afectar el Kardex Físico y preparar la entrega.</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3 md:mt-0">
                                <button onClick={() => setShowConfirmAprobar(true)} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase rounded shadow-sm border border-transparent active:translate-y-px transition-colors flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> Confirmar Ingreso
                                </button>
                                <button onClick={() => setShowConfirmRechazar(true)} className="px-4 py-1.5 bg-card-fap hover:bg-red-50 text-red-600 border border-red-300 text-[11px] font-bold uppercase rounded shadow-sm active:translate-y-px transition-colors flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5" /> Denegar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        
                        {/* LADO IZQUIERDO: DETALLES Y CLIENTE */}
                        <div className="lg:col-span-8 flex flex-col gap-5">
                            
                            {/* Panel Cliente */}
                            <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                                <div className="px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center bg-card-fap text-primary border-brand">
                                    <User className="w-4 h-4 mr-2" /> Datos Registrados de Facturación / Cliente
                                </div>
                                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-card-fap">
                                    <div className="col-span-2">
                                        <span className="block text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-0.5">Razón Social</span>
                                        <span className="text-[11px] font-bold text-brand-main block bg-brand/5 border border-brand px-2 py-1 rounded truncate uppercase">{pedido.nombre_cliente}</span>
                                    </div>
                                    <div className="col-span-1">
                                        <span className="block text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-0.5">R.U.C / C.I.</span>
                                        <span className="text-[11px] font-mono font-bold text-brand-main block bg-brand/5 border border-brand px-2 py-1 rounded">{pedido.ci_cliente || 'N/A'}</span>
                                    </div>
                                    <div className="col-span-1">
                                        <span className="block text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-0.5">Clasificación</span>
                                        <span className={`text-[11px] font-bold block px-2 py-1 rounded uppercase tracking-wider text-center border ${pedido.user_id ? 'bg-brand/10 text-primary border-brand' : 'bg-brand/5 text-gray-600 border-brand'}`}>
                                            {pedido.user_id ? 'Socio' : 'B2C'}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-0.5">Contacto Telefónico</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[11px] font-mono font-bold text-brand-main block bg-brand/5 border border-brand px-2 py-1 rounded flex-1">{pedido.telefono_contacto || 'No provisto'}</span>
                                            {pedido.telefono_contacto && (
                                                <a 
                                                    href={`https://wa.me/591${pedido.telefono_contacto.replace(/\D/g,'')}`} 
                                                    target="_blank" 
                                                    className="p-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded border border-emerald-200 transition-colors shadow-sm focus:outline-none"
                                                    title="Contacto WA"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {pedido.observaciones && (
                                        <div className="col-span-4 mt-1">
                                            <span className="block text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-0.5">Glosa / Observaciones del Cliente</span>
                                            <div className="p-2 border border-amber-200 bg-amber-50/50 rounded text-[11px] text-gray-700 italic border-l-4 border-l-amber-400">
                                                {pedido.observaciones}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Panel Items de Orden */}
                            <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                                <div className="px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center justify-between bg-card-fap text-primary border-brand">
                                    <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Detalle Estructural de la Orden</span>
                                    <div className="flex items-center gap-2">
                                        <a href={urls.pdf} target="_blank" className="px-2 py-1 bg-card-fap border border-brand rounded shadow-sm text-[9px] text-primary font-bold flex items-center gap-1 disabled:opacity-50 hover:bg-brand/10">
                                            <FileText className="w-3 h-3" /> NOTA VENTA PDF
                                        </a>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-card-fap border-b border-brand">
                                            <tr>
                                                <th className="px-4 py-2 text-[9px] font-bold text-brand-muted uppercase tracking-wider w-12 text-center">ITEM</th>
                                                <th className="px-4 py-2 text-[9px] font-bold text-brand-muted uppercase tracking-wider w-1/2">Descripción Material</th>
                                                <th className="px-4 py-2 text-[9px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand text-right w-20">Cant.</th>
                                                <th className="px-4 py-2 text-[9px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand text-right w-24">P. Unitario</th>
                                                <th className="px-4 py-2 text-[9px] font-bold text-brand-muted uppercase tracking-wider border-l border-brand text-right w-28 bg-card-fap">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-fapclas-50">
                                            {pedido.detalles.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-brand/10">
                                                    <td className="px-4 py-2 text-[10px] text-center text-brand-muted font-mono border-r border-brand">{String(idx + 1).padStart(2, '0')}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="text-[11px] font-bold text-brand-main uppercase truncate" title={item.producto.nombre}>{item.producto.nombre}</div>
                                                        <div className="text-[9px] font-mono text-brand-muted">REF: {item.producto.codigo_sku}</div>
                                                    </td>
                                                    <td className="px-4 py-2 text-right border-l border-brand bg-card-fap">
                                                        <span className="text-[11px] font-bold font-mono text-primary">{item.cantidad}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right border-l border-brand bg-card-fap">
                                                        <span className="text-[10px] text-gray-600 font-mono">{Number(item.precio_unitario).toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                        <span className="text-[11px] font-black text-brand-main font-mono">{Number(item.subtotal).toFixed(2)}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border-t-2 border-brand bg-card-fap">
                                                <td colSpan="4" className="px-4 py-3 text-right text-[10px] font-bold text-primary uppercase tracking-widest border-r border-brand">
                                                    Monto Transacción Total (Bs):
                                                </td>
                                                <td className="px-4 py-3 text-right bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
                                                    <span className="text-sm font-black text-emerald-700 font-mono">{Number(pedido.total).toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* LADO DERECHO: ACCIONES Y STATUS */}
                        <div className="lg:col-span-4 flex flex-col gap-5">
                            
                            {/* Verificación Cuentas (Pago) */}
                            <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                                <div className="px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center bg-card-fap text-primary border-brand gap-2">
                                    {pedido.tipo_pago === 'qr' ? <QrCode className="w-4 h-4"/> : <CreditCard className="w-4 h-4"/>}
                                    Panel de Caja y Medios
                                </div>
                                <div className="p-4 bg-card-fap flex flex-col gap-4">
                                    <div className="flex items-center justify-between border-b border-brand pb-3">
                                        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Estado Contable</span>
                                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded border tracking-widest ${
                                            pedido.estado_pago === 'pagado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                            pedido.estado_pago === 'pendiente_validacion' ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-[0_0_3px_rgba(245,158,11,0.3)] animate-pulse' : 'bg-red-50 text-red-700 border-red-500/50'
                                        }`}>
                                            {pedido.estado_pago === 'pendiente_validacion' ? 'EN_REVISIÓN' : pedido.estado_pago}
                                        </span>
                                    </div>

                                    {pedido.comprobante_qr_path && (
                                        <div className="flex flex-col gap-1.5 border border-brand rounded p-1.5 bg-brand/5">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">Documento Respaldo (QR)</span>
                                                <a href={`/storage/${pedido.comprobante_qr_path}`} target="_blank" className="text-[9px] font-bold text-primary hover:underline flex items-center gap-1"><FileText className="w-3 h-3"/> Pop-out</a>
                                            </div>
                                            <a href={`/storage/${pedido.comprobante_qr_path}`} target="_blank" className="block relative group overflow-hidden border border-brand rounded shadow-sm bg-card-fap">
                                                <img src={`/storage/${pedido.comprobante_qr_path}`} className="w-full h-32 object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Comprobante QR" />
                                            </a>
                                        </div>
                                    )}

                                    {pedido.estado_pago === 'pagado' && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded p-3 flex flex-col gap-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5"/>
                                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide leading-tight">Transacción Validada, Kardex Afectado.</span>
                                            </div>
                                            <a href={urls.wa_pago} target="_blank" className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm">
                                                <MessageCircle className="w-3.5 h-3.5"/> Emitir Recibo WA
                                            </a>
                                            <a href={urls.pdf} target="_blank" className="bg-card-fap hover:bg-brand/10 text-primary border border-brand py-1.5 rounded flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm">
                                                <Download className="w-3.5 h-3.5"/> Descargar Comprobante PDF
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gestión Logística (Pick & Delivery) */}
                            <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                                <div className="px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center bg-card-fap text-primary border-brand gap-2">
                                    <Package className="w-4 h-4"/> Operaciones de Almacén
                                </div>
                                <div className="p-4 bg-card-fap flex flex-col gap-4">
                                    <div className="flex flex-col gap-1 bg-brand/5 border border-brand rounded p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Tipo Logística</span>
                                            <span className="text-[10px] font-bold font-mono text-brand-main bg-card-fap border border-brand px-1.5 py-0.5 rounded shadow-sm">PICK_UP_LOCAL</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-brand pt-2">
                                            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Fase Actual</span>
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border tracking-widest ${pedido.estado_entrega === 'entregado' ? 'bg-primary text-white border-brand' : 'bg-gray-200 text-gray-700 border-brand'}`}>
                                                {pedido.estado_entrega}
                                            </span>
                                        </div>
                                    </div>

                                    {pedido.estado_pago === 'pagado' && pedido.estado_entrega === 'por_recoger' && (
                                        <button onClick={() => setShowConfirmEntregar(true)} disabled={processing} className="w-full bg-primary hover:bg-primary-dark border border-brand text-white py-3 rounded text-[11px] font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider shadow-sm active:translate-y-px">
                                            <Package className="w-4 h-4"/> Registrar Entrega Física
                                        </button>
                                    )}

                                    {pedido.estado_entrega === 'entregado' && (
                                        <div className="bg-brand/10 border border-brand rounded p-3 flex flex-col gap-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-primary mt-0.5"/>
                                                <span className="text-[10px] font-bold text-brand-main uppercase tracking-wide leading-tight">Ciclo de pedido cerrado exitosamente.</span>
                                            </div>
                                            <a href={urls.wa_entrega} target="_blank" className="bg-primary hover:bg-black text-white py-1.5 rounded flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm">
                                                <MessageCircle className="w-3.5 h-3.5"/> Emitir Constancia WA
                                            </a>
                                            <a href={urls.pdf} target="_blank" className="bg-card-fap hover:bg-brand/10 text-primary border border-brand py-1.5 rounded flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm">
                                                <Download className="w-3.5 h-3.5"/> Descargar Comprobante PDF
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALES TÉCNICOS SAP */}
            {/* Modal APROBAR PAGO */}
            {showConfirmAprobar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
                    <div className="bg-card-fap border-2 border-emerald-500 rounded shadow-xl max-w-sm w-full overflow-hidden flex flex-col">
                        <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-emerald-800">
                            <CheckCircle className="w-5 h-5"/>
                            <h3 className="text-xs font-bold uppercase tracking-widest">Ejecutar Asiento Ingreso</h3>
                        </div>
                        <div className="p-5 bg-card-fap text-center">
                            <p className="text-[11px] text-gray-700 font-medium">Al certificar que los fondos fueron acreditados, el sistema registrará el ingreso en el Libro Diario y la Caja Activa. El stock se mantendrá reservado hasta la entrega física.</p>
                        </div>
                        <div className="p-3 bg-brand/5 border-t border-brand flex justify-end gap-2">
                            <button onClick={() => setShowConfirmAprobar(false)} className="px-4 py-1.5 text-[10px] font-bold uppercase border border-brand bg-card-fap text-gray-600 rounded hover:bg-brand/10">Cancelar</button>
                            <button onClick={handleValidar} disabled={processing} className="px-4 py-1.5 text-[10px] font-bold uppercase border border-transparent bg-emerald-600 text-white rounded shadow-sm hover:bg-emerald-700">Validar Ingreso (Caja)</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal RECHAZAR PAGO */}
            {showConfirmRechazar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
                    <div className="bg-card-fap border-2 border-red-500 rounded shadow-xl max-w-sm w-full overflow-hidden flex flex-col">
                        <div className="px-4 py-3 bg-red-50 border-b border-red-500/50 flex items-center gap-2 text-red-800">
                            <AlertTriangle className="w-5 h-5"/>
                            <h3 className="text-xs font-bold uppercase tracking-widest">Denegar Documento Pago</h3>
                        </div>
                        <div className="p-5 bg-card-fap text-center">
                            <p className="text-[11px] text-gray-700 font-medium">El documento será rechazado. No se afecta almacén. Se habilita al cliente a cargar uno nuevo o anular la orden.</p>
                        </div>
                        <div className="p-3 bg-brand/5 border-t border-brand flex justify-end gap-2">
                            <button onClick={() => setShowConfirmRechazar(false)} className="px-4 py-1.5 text-[10px] font-bold uppercase border border-brand bg-card-fap text-gray-600 rounded hover:bg-brand/10">Cancelar</button>
                            <button onClick={handleRechazar} disabled={processing} className="px-4 py-1.5 text-[10px] font-bold uppercase border border-transparent bg-red-600 text-white rounded shadow-sm hover:bg-red-700">Rechazar Operación</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal ENTREGAR FISICO */}
            {showConfirmEntregar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
                    <div className="bg-card-fap border-2 border-brand rounded shadow-xl max-w-sm w-full overflow-hidden flex flex-col">
                        <div className="px-4 py-3 bg-primary border-b border-brand flex items-center gap-2 text-white">
                            <Package className="w-5 h-5"/>
                            <h3 className="text-xs font-bold uppercase tracking-widest">Confirmar Despacho Local</h3>
                        </div>
                        <div className="p-5 bg-card-fap text-center">
                            <p className="text-[11px] text-gray-700 font-medium">Certifica la entrega de mercancía. El sistema realizará el descuento oficial del Inventario y generará los asientos de salida en el Kardex de Productos.</p>
                        </div>
                        <div className="p-3 bg-brand/5 border-t border-brand flex justify-end gap-2">
                            <button onClick={() => setShowConfirmEntregar(false)} className="px-4 py-1.5 text-[10px] font-bold uppercase border border-brand bg-card-fap text-gray-600 rounded hover:bg-brand/10">Posponer</button>
                            <button onClick={handleEntregar} disabled={processing} className="px-4 py-1.5 text-[10px] font-bold uppercase border border-transparent bg-emerald-600 text-white rounded shadow-sm hover:bg-emerald-700">Descontar Stock y Entregar</button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
