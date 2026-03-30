import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { ShieldCheck, Plus, Trash2, KeyRound, AlertCircle } from 'lucide-react';

export default function Index({ auth, roles, permissions }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin');

    const { data: newRoleData, setData: setNewRoleData, post: postNewRole, reset: resetNewRole, processing } = useForm({
        name: '',
        permissions: []
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        postNewRole(route('admin.roles.store'), {
            onSuccess: () => resetNewRole(),
            preserveScroll: true
        });
    };

    const updateRolePermissions = (roleId, activePermissions) => {
        router.put(route('admin.roles.update', roleId), {
            permissions: activePermissions
        }, { preserveScroll: true });
    };

    const deleteRole = (role) => {
        if (confirm(`¿Eliminar definitiva y permanentemente el rol ${role.name}?`)) {
            router.delete(route('admin.roles.destroy', role.id), { preserveScroll: true });
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#f8faf6] flex items-center justify-center p-6">
                <div className="bg-white border border-red-200 p-8 rounded-lg shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Acceso Denegado</h2>
                    <p className="text-sm text-gray-500 mt-2">Se requiere rol de SuperAdmin para gestionar la seguridad.</p>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Seguridad y Privilegios</h2>}
        >
            <Head title="Roles y Permisos" />

            <div className="py-8 bg-[#f8faf6] min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO Y FORMULARIO DE ALTA */}
                    <div className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#fafaf6] gap-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-fapclas-600" />
                            <div>
                                <h3 className="text-sm font-bold text-fapclas-900 uppercase tracking-wide">
                                    Control de Accesos (RBAC)
                                </h3>
                                <p className="text-[11px] text-fapclas-500 font-medium">
                                    Gestión de roles y asignación de permisos del sistema ERP.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                            <input
                                type="text"
                                className="field-input text-xs w-full md:w-64"
                                placeholder="Nuevo Nombre de Rol..."
                                value={newRoleData.name}
                                onChange={(e) => setNewRoleData('name', e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={processing || !newRoleData.name}
                                className="px-4 py-2 bg-fapclas-800 hover:bg-fapclas-900 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-sm active:translate-y-px disabled:opacity-50 whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" /> Crear Rol Seguro
                            </button>
                        </form>
                    </div>

                    {/* GRILLA ESTRUCTURAL DE ROLES */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {roles.map(role => {
                            const activePermNames = role.permissions.map(p => p.name);
                            const isSuperAdmin = role.name === 'SuperAdmin';
                            const isBase = role.name === 'Socio Base';

                            return (
                                <div key={role.id} className="bg-white border border-fapclas-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                                    {/* Cabecera del Rol */}
                                    <div className="flex justify-between items-center px-4 py-3 border-b border-fapclas-100 bg-[#fafaf6]">
                                        <div className="flex items-center gap-2">
                                            <KeyRound className="w-4 h-4 text-fapclas-500" />
                                            <h4 className="font-bold text-xs text-fapclas-900 uppercase tracking-wide">{role.name}</h4>
                                        </div>
                                        {!isSuperAdmin && !isBase && (
                                            <button
                                                onClick={() => deleteRole(role)}
                                                className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded border border-red-200 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Eliminar Rol
                                            </button>
                                        )}
                                        {(isSuperAdmin || isBase) && (
                                            <span className="text-[9px] font-bold px-2 py-0.5 bg-fapclas-200 text-fapclas-800 rounded uppercase tracking-widest">
                                                Sistema
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Lista de Permisos */}
                                    <div className="p-0 flex-1">
                                        {isSuperAdmin ? (
                                            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
                                                <ShieldCheck className="w-8 h-8 text-fapclas-300 mx-auto mb-2" />
                                                <p className="text-xs text-fapclas-600 font-bold uppercase tracking-wider">Acceso Total</p>
                                                <p className="text-[11px] text-gray-500 mt-1">Sus directivas no pueden ser revocadas.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-fapclas-50">
                                                {permissions.map(perm => {
                                                    const isChecked = activePermNames.includes(perm.name);
                                                    return (
                                                        <label key={perm.id} className="flex items-center space-x-3 p-3 hover:bg-fapclas-50/50 cursor-pointer transition-colors border-t-0 border-l-0">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-gray-300 text-fapclas-600 focus:ring-fapclas-500 w-4 h-4"
                                                                checked={isChecked}
                                                                onChange={() => {
                                                                    const newPerms = isChecked
                                                                        ? activePermNames.filter(p => p !== perm.name)
                                                                        : [...activePermNames, perm.name];
                                                                    updateRolePermissions(role.id, newPerms);
                                                                }}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className={`text-[11px] font-bold ${isChecked ? 'text-fapclas-900' : 'text-gray-500'}`}>
                                                                    {perm.name}
                                                                </span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
