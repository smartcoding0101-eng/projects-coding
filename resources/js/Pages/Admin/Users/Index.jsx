import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Users, PencilLine, UserMinus, UserPlus, AlertCircle, XCircle } from 'lucide-react';

export default function Index({ auth, users, roles, personasDisponibles }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin');

    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, reset, processing } = useForm({
        persona_id: '', name: '', email: '', password: '', roles: []
    });

    const handlePersonaChange = (personaId) => {
        const persona = personasDisponibles.find(p => p.id == personaId);
        if (persona) {
            setData({
                ...data,
                persona_id: personaId,
                name: `${persona.nombres} ${persona.apellidos}`,
                email: persona.email || `${persona.ci}@fapclas.com`
            });
        } else {
            setData({ ...data, persona_id: '', name: '', email: '' });
        }
    };

    const openEditForm = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '', 
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
            <div className="min-h-screen bg-main flex items-center justify-center p-6">
                <div className="bg-card-fap border border-red-500/50 p-8 rounded-lg shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-brand-main uppercase tracking-wide">Acceso Denegado</h2>
                    <p className="text-sm text-brand-muted mt-2">Solo un SuperAdmin puede acceder al Directorio Maestro.</p>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Directorio de Recursos Humanos</h2>}
        >
            <Head title="Directorio Corporativo" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden p-4 bg-card-fap flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="text-sm font-bold text-brand-main uppercase tracking-wide">
                                Gestión de Personal y Socios
                            </h3>
                            <p className="text-[11px] text-brand-muted font-medium">
                                Base de datos centralizada de identidades ERP FAPCLAS.
                            </p>
                        </div>
                    </div>

                    {/* FORMULARIO DE EDICIÓN/ALTA PLANO */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className={`px-4 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${editingUser ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-card-fap text-primary border-brand'}`}>
                            {editingUser ? <PencilLine className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {editingUser ? `Modificando Ficha # ${editingUser.id} - ${editingUser.name}` : 'Apertura de Nueva Ficha de Personal/Socio'}
                        </div>
                        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-card-fap">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Vincular Persona / Afiliado <span className="text-red-500">*</span></label>
                                <select 
                                    className="field-input text-xs pr-8 bg-amber-50/20 border-amber-200" 
                                    value={data.persona_id} 
                                    onChange={e => handlePersonaChange(e.target.value)}
                                    disabled={editingUser}
                                >
                                    <option value="">-- CUENTA SIN VÍNCULO (SOPORTE) --</option>
                                    {personasDisponibles.map(p => (
                                        <option key={p.id} value={p.id}>ID: {p.id} | {p.nombres} {p.apellidos} (CI: {p.ci})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Nombre de Usuario (Persona) <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    className="field-input text-xs bg-brand/5 text-brand-muted font-bold" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    readOnly={!!data.persona_id}
                                    required 
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Correo Electrónico de Identidad <span className="text-red-500">*</span></label>
                                <input 
                                    type="email" 
                                    className="field-input text-xs bg-brand/5 text-brand-muted" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    disabled={editingUser || !!data.persona_id} 
                                    required={!editingUser} 
                                />
                            </div>
                            {!editingUser && (
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">Contraseña Inicial ERP <span className="text-red-500">*</span></label>
                                    <input type="password" className="field-input text-xs" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                </div>
                            )}

                            {/* ROLES CHECKBOXES */}
                            <div className="col-span-1 md:col-span-4 p-3 bg-card-fap border border-brand rounded">
                                <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Asignación de Roles ERP</span>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {roles.map(r => (
                                        <label key={r.id} className="inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="w-3.5 h-3.5 rounded-sm border-brand text-primary focus:ring-brand" 
                                                checked={data.roles.includes(r.name)}
                                                onChange={() => handleToggleRole(r.name)}
                                            />
                                            <span className="ml-1.5 text-[11px] font-bold text-brand-main">{r.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-4 flex justify-between items-center pt-2 border-t border-brand">
                                <button 
                                    type="button" 
                                    onClick={() => { setEditingUser(null); reset(); }} 
                                    className="px-4 py-2 text-xs font-bold text-brand-muted hover:text-gray-700 bg-brand/10 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 border border-brand"
                                >
                                    <XCircle className="w-4 h-4" /> Cancelar
                                </button>
                                
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processing ? 'Procesando...' : 'Guardar registro'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* DATAGRID DE USUARIOS */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card-fap border-b border-brand">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-16">ID Per.</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Identidad Vinculada (ERP)</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider w-64">Roles ERP Asignados</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-brand-muted uppercase tracking-wider text-right w-48 border-l border-brand bg-card-fap">Comandos de Gestión</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-brand/10 transition-colors">
                                            <td className="px-4 py-2.5 whitespace-nowrap text-center font-mono text-[10px] text-primary font-bold">
                                                {user.persona_id || '---'}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-brand-main uppercase">
                                                        {user.persona ? `${user.persona.nombres} ${user.persona.apellidos}` : user.name}
                                                    </span>
                                                    <span className="text-[9px] text-brand-muted font-mono flex items-center gap-1">
                                                        <AlertCircle className="w-2.5 h-2.5 text-brand" /> {user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.map(r => (
                                                        <span key={r.id} className="px-1.5 py-0.5 text-[9px] font-bold bg-fapclas-100 text-primary border border-brand rounded tracking-widest uppercase">
                                                            {r.name}
                                                        </span>
                                                    ))}
                                                    {(!user.roles || user.roles.length === 0) && (
                                                        <span className="text-[9px] text-brand-muted italic">Sin Roles</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-medium text-xs whitespace-nowrap border-l border-brand bg-card-fap shadow-[inset_1px_0_0_rgba(0,0,0,0.02)] space-x-2">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button 
                                                        onClick={() => openEditForm(user)} 
                                                        className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1 font-bold border border-blue-100" 
                                                        title="Editar"
                                                    >
                                                        <PencilLine className="w-3.5 h-3.5" />
                                                        Editar
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteUser(user)} 
                                                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1 font-bold border border-red-100" 
                                                        title="Eliminar"
                                                    >
                                                        <UserMinus className="w-3.5 h-3.5" />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-brand-muted text-sm font-bold uppercase tracking-wide">
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
