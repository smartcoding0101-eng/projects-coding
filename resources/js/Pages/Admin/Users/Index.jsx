import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Users, PencilLine, UserMinus, UserPlus, AlertCircle, XCircle } from 'lucide-react';

export default function Index({ auth, users, roles }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin');

    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, reset, processing } = useForm({
        name: '', email: '', password: '', ci: '', escalafon: '', grado: '', destino: '', roles: []
    });

    const openEditForm = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '', 
            ci: user.ci || '',
            escalafon: user.escalafon || '',
            grado: user.grado || '',
            destino: user.destino || '',
            roles: user.roles.map(r => r.name)
        });
    };

    const handleToggleRole = (roleName) => {
        const currentRoles = data.roles;
        if (currentRoles.includes(roleName)) {
            setData('roles', currentRoles.filter(r => r !== roleName));
        } else {
            setData('roles', [...currentRoles, roleName]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                onSuccess: () => { setEditingUser(null); reset(); },
                preserveScroll: true
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => reset(),
                preserveScroll: true
            });
        }
    };

    const deleteUser = (user) => {
        if (confirm(`¿ELIMINACIÓN DEFINITIVA de ${user.name}? Esta acción purgará al usuario del sistema.`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#f8faf6] flex items-center justify-center p-6">
                <div className="bg-white border border-red-200 p-8 rounded-lg shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Acceso Denegado</h2>
                    <p className="text-sm text-gray-500 mt-2">Solo un SuperAdmin puede acceder al Directorio Maestro.</p>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Directorio de Recursos Humanos</h2>}
        >
            <Head title="Directorio Corporativo" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden p-4 bg-[#fafaf6] flex items-center gap-3">
                        <Users className="w-5 h-5 text-fapclas-600" />
                        <div>
                            <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                Gestión de Personal y Socios
                            </h3>
                            <p className="text-[11px] text-fapclas-500 font-medium">
                                Base de datos centralizada de identidades ERP FAPCLAS.
                            </p>
                        </div>
                    </div>

                    {/* FORMULARIO DE EDICIÓN/ALTA PLANO */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden">
                        <div className={`px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${editingUser ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-[#fafaf6] text-fapclas-600 border-fapclas-200'}`}>
                            {editingUser ? <PencilLine className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {editingUser ? `Modificando Ficha # ${editingUser.id} - ${editingUser.name}` : 'Apertura de Nueva Ficha de Personal/Socio'}
                        </div>
                        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white">
                            <div>
                                <label className="block text-[10px] font-bold text-fapclas-400 uppercase tracking-wider mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                                <input type="text" className="field-input text-xs" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-fapclas-400 uppercase tracking-wider mb-1">Correo Electrónico <span className="text-red-500">*</span></label>
                                <input type="email" className="field-input text-xs" value={data.email} onChange={e => setData('email', e.target.value)} disabled={editingUser} required={!editingUser} />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="block text-[10px] font-bold text-fapclas-400 uppercase tracking-wider mb-1">Contraseña Inicial <span className="text-red-500">*</span></label>
                                    <input type="password" className="field-input text-xs" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-bold text-fapclas-400 uppercase tracking-wider mb-1">C.I.</label>
                                <input type="text" className="field-input text-xs" value={data.ci} onChange={e => setData('ci', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-fapclas-400 uppercase tracking-wider mb-1">Grado Jerárquico</label>
                                <input type="text" className="field-input text-xs" placeholder="Ej: Cnl." value={data.grado} onChange={e => setData('grado', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-fapclas-400 uppercase tracking-wider mb-1">Destino</label>
                                <input type="text" className="field-input text-xs" value={data.destino} onChange={e => setData('destino', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-fapclas-400 uppercase tracking-wider mb-1">Escalafón / Ítem</label>
                                <input type="text" className="field-input text-xs" value={data.escalafon} onChange={e => setData('escalafon', e.target.value)} />
                            </div>

                            {/* ROLES CHECKBOXES */}
                            <div className="col-span-1 md:col-span-4 p-3 bg-[#fafaf6] border border-fapclas-100 rounded">
                                <span className="block text-[10px] font-bold text-fapclas-600 uppercase tracking-wider mb-2">Asignación de Roles ERP</span>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {roles.map(r => (
                                        <label key={r.id} className="inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="w-3.5 h-3.5 rounded-sm border-gray-300 text-fapclas-600 focus:ring-fapclas-500" 
                                                checked={data.roles.includes(r.name)}
                                                onChange={() => handleToggleRole(r.name)}
                                            />
                                            <span className="ml-1.5 text-[11px] font-bold text-fapclas-800">{r.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-4 flex justify-between items-center pt-2 border-t border-fapclas-50">
                                {editingUser ? (
                                    <button type="button" onClick={() => { setEditingUser(null); reset(); }} className="px-3 py-1.5 text-xs font-bold text-fapclas-500 hover:text-fapclas-700 flex items-center gap-1">
                                        <XCircle className="w-4 h-4" /> Cancelar Edición
                                    </button>
                                ) : <div />}
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-fapclas-800 hover:bg-fapclas-900 text-white text-xs font-bold rounded shadow-sm active:translate-y-px disabled:opacity-50">
                                    {editingUser ? 'Guardar Ficha Modificada' : 'Dar de Alta Registro'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* DATAGRID DE USUARIOS */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#fafaf6] border-b border-fapclas-200">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider">Identidad Personal</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider">Grado / Destino Institucional</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider w-64">Roles ERP Asignados</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-fapclas-500 uppercase tracking-wider text-right w-28 border-l border-fapclas-100 bg-[#fdfdfc]">Comandos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-fapclas-100">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-fapclas-50/40 transition-colors">
                                            <td className="px-4 py-2.5 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-fapclas-900">{user.name}</span>
                                                    <span className="text-[10px] text-fapclas-500 font-mono mt-0.5">{user.email} {user.ci ? `| CI: ${user.ci}` : ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-700">{user.grado || '—'}</span>
                                                    <span className="text-[10px] text-gray-500">{user.destino || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.map(r => (
                                                        <span key={r.id} className="px-1.5 py-0.5 text-[9px] font-bold bg-fapclas-100 text-fapclas-700 border border-fapclas-200 rounded tracking-widest uppercase">
                                                            {r.name}
                                                        </span>
                                                    ))}
                                                    {(!user.roles || user.roles.length === 0) && (
                                                        <span className="text-[9px] text-gray-400 italic">Sin Roles</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-medium text-xs whitespace-nowrap border-l border-fapclas-100 bg-[#fdfdfc] shadow-[inset_1px_0_0_rgba(0,0,0,0.02)] space-x-2">
                                                <button onClick={() => openEditForm(user)} className="text-fapclas-600 hover:text-fapclas-900 font-bold" title="Editar">
                                                    <PencilLine className="w-4 h-4 inline" />
                                                </button>
                                                {!user.roles.some(r => r.name === 'SuperAdmin') && (
                                                    <button onClick={() => deleteUser(user)} className="text-red-500 hover:text-red-700 font-bold" title="Expulsar">
                                                        <UserMinus className="w-4 h-4 inline" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-400 text-sm font-bold uppercase tracking-wide">
                                                No hay registros en la base de datos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
