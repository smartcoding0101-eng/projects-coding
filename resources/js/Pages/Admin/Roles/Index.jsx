import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { ShieldCheck, Plus, Trash2, KeyRound, AlertCircle, Settings, Pencil, Search, ShieldAlert, X, Save } from 'lucide-react';

export default function Index({ auth, roles }) {
    const isAdmin = auth.user.roles?.includes('SuperAdmin');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingRole, setEditingRole] = useState(null);
    const [newRoleName, setNewRoleName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    const { data: editData, setData: setEditData, put: updateRole, reset: resetEdit, processing: updating } = useForm({ name: '' });

    function crearRol(e) {
        if (e) e.preventDefault();
        if (!newRoleName.trim() || creating) return;
        setCreating(true);
        setCreateError('');
        router.post('/admin/roles', { name: newRoleName.trim(), permissions: [] }, {
            preserveScroll: true,
            onSuccess: () => { setNewRoleName(''); setCreating(false); },
            onError: (errors) => { setCreateError(errors.name || 'Error en validación'); setCreating(false); },
            onFinish: () => { setCreating(false); },
        });
    }

    function editarRol(e) {
        e.preventDefault();
        updateRole('/admin/roles/' + editingRole.id, {
            onSuccess: () => { setEditingRole(null); resetEdit(); },
            preserveScroll: true,
        });
    }

    function eliminarRol(role) {
        if (confirm(`¿ELIMINACIÓN IRREVERSIBLE del rol "${role.name}"?\nLos usuarios vinculados perderán estos privilegios.`)) {
            router.delete('/admin/roles/' + role.id, { preserveScroll: true });
        }
    }

    const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const isSystem = (name) => ['SuperAdmin', 'Socio Base'].includes(name);

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-main">
                <div className="bg-card-fap border border-red-500/50 p-8 rounded-lg shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-brand-main uppercase tracking-wide">Acceso Denegado</h2>
                    <p className="text-sm text-brand-muted mt-2">Se requiere máxima jerarquía para auditar o modificar el Catálogo de Roles.</p>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Directorio Maestro de Roles</h2>}
        >
            <Head title="Gestión de Seguridad y Roles" />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                    
                    {/* ENCABEZADO SAP / HEADER GRID */}
                    <div className="bg-card-fap border border-brand/50 shadow-sm rounded-lg overflow-hidden p-5 flex flex-col gap-5">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand/5 rounded-lg border border-brand/10">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-brand-main uppercase tracking-wide">
                                        Seguridad & Roles del Ecosistema
                                    </h3>
                                    <p className="text-[11px] text-brand-muted font-medium">
                                        Maestro de datos de jerarquías y perfiles funcionales.
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
                                <input
                                    type="text"
                                    placeholder="Buscar rol por nombre..."
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-brand rounded-md focus:ring-indigo-600 focus:border-indigo-600 bg-brand/5"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <hr className="border-t border-dashed border-brand" />

                        <div className="flex flex-col md:flex-row justify-between items-center bg-brand/5 border border-brand/10 p-3 rounded-md gap-4">
                            <span className="text-xs font-black text-primary uppercase tracking-widest shrink-0">
                                Alta de Perfil:
                            </span>
                            <form onSubmit={crearRol} className="flex flex-col md:flex-row w-full md:w-auto gap-3 items-start md:items-center relative">
                                <div className="w-full md:w-64 relative">
                                    <input
                                        type="text"
                                        placeholder="Nombre del nuevo rol..."
                                        className={`w-full px-3 py-2 text-xs border rounded-md focus:ring-primary focus:border-primary ${createError ? 'border-red-400 bg-red-50' : 'border-brand bg-card-fap'}`}
                                        value={newRoleName}
                                        onChange={(e) => { setNewRoleName(e.target.value); setCreateError(''); }}
                                    />
                                    {createError && (
                                        <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-bold tracking-wide whitespace-nowrap">
                                            {createError}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating || !newRoleName.trim()}
                                    className="w-full md:w-auto px-5 py-2 bg-primary hover:bg-primary-dark text-white text-[10px] uppercase font-bold tracking-widest rounded transition-all shadow-sm flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-3.5 h-3.5" /> {creating ? 'Creando...' : 'Guardar Nuevo Rol'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* DATA TABLE / MASTER DATA ALV */}
                    <div className="bg-card-fap border border-brand shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#fcfcfb] border-b border-brand">
                                    <tr>
                                        <th className="px-5 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest w-24">SYS_ID</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest">Denominación del Perfil</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest text-center">Jerarquía Operativa</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest text-center">Afiliados Vinculados</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest text-center">Módulos Abiertos</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-brand-muted uppercase tracking-widest text-right w-40 border-l border-brand">Acciones SAP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand">
                                    {filteredRoles.map((role) => {
                                        const permCount = role.permissions?.length || 0;
                                        const userCount = role.users_count || 0;

                                        return (
                                            <tr key={role.id} className="hover:bg-brand/5/50 transition-colors group">
                                                <td className="px-5 py-3">
                                                    <span className="text-[10px] font-mono text-brand-muted font-bold bg-brand/10 px-1.5 py-0.5 rounded border border-brand">
                                                        #{role.id.toString().padStart(4, '0')}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                                                        <span className="text-xs font-black text-brand-main uppercase tracking-tight">{role.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    {isSystem(role.name) ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded tracking-widest uppercase shadow-sm">
                                                            <ShieldAlert className="w-3 h-3" /> NÚCLEO / SISTEMA
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-brand/10 text-gray-600 border border-brand rounded tracking-widest uppercase">
                                                            CUSTOM / PERSONALIZADO
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-lg font-black text-indigo-600 font-mono leading-none">{userCount}</span>
                                                        <span className="text-[8px] text-brand-muted uppercase tracking-widest mt-0.5">Usuarios</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-black text-gray-600 font-mono leading-none">{role.name === 'SuperAdmin' ? 'ALL' : permCount}</span>
                                                        <span className="text-[8px] text-brand-muted uppercase tracking-widest mt-0.5">Autoridades</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-right whitespace-nowrap border-l border-brand bg-[#fcfcfb]">
                                                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <Link 
                                                            href="/admin/privilegios" 
                                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors border border-transparent hover:border-emerald-200 shadow-sm bg-card-fap"
                                                            title="Matriz de Privilegios"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </Link>
                                                        {!isSystem(role.name) && (
                                                            <>
                                                                <button 
                                                                    onClick={() => { setEditingRole(role); setEditData('name', role.name); }} 
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-200 shadow-sm bg-card-fap" 
                                                                    title="Editar Nombre"
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => eliminarRol(role)} 
                                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-500/50 shadow-sm bg-card-fap" 
                                                                    title="Eliminar Rol"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredRoles.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-brand-muted text-xs font-bold uppercase tracking-wider">
                                                No se encontraron coincidencias en el maestro de roles.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL EDICIÓN RÁPIDA */}
            {editingRole && (
                <div 
                    className="fixed inset-0 z-50 flex justify-center p-4 pt-[20vh] bg-black/40 backdrop-blur-sm" 
                    onClick={() => setEditingRole(null)}
                >
                    <div 
                        className="bg-card-fap rounded-lg shadow-2xl border border-indigo-200 max-w-sm w-full h-fit flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-3 border-b border-brand flex justify-between items-center bg-card-fap rounded-t-lg">
                            <h4 className="text-xs font-black uppercase tracking-widest text-brand-main flex items-center gap-2">
                                <Pencil className="w-3.5 h-3.5 text-indigo-600" /> Alterar Denominación
                            </h4>
                            <button type="button" onClick={() => setEditingRole(null)} className="text-brand-muted hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={editarRol} className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">Nuevo Nombre Interno</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 text-xs border border-brand rounded-md focus:ring-indigo-600 focus:border-indigo-600 uppercase"
                                    value={editData.name}
                                    onChange={e => setEditData('name', e.target.value.toUpperCase())}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingRole(null)}
                                    className="px-4 py-2 text-[10px] font-bold text-brand-muted uppercase tracking-widest hover:bg-brand/10 rounded"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={updating || !editData.name || editData.name === editingRole.name}
                                    className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save className="w-3.5 h-3.5" /> Actualizar Rol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
