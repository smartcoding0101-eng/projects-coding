import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, Save, AlertCircle, Info } from 'lucide-react';

export default function Index({ roles, permissions, auth }) {
    const [selectedRole, setSelectedRole] = useState(roles[0] || null);
    
    // Inicializar el formulario con los permisos del rol seleccionado
    const getInitialPermissions = (role) => {
        if (!role) return [];
        return role.permissions.map(p => p.name);
    };

    const { data, setData, post, processing, isDirty, reset } = useForm({
        permissions: getInitialPermissions(selectedRole),
    });

    // Cambiar de vista de Rol
    const switchRole = (role) => {
        if (isDirty && !window.confirm("Tienes cambios sin guardar. ¿Deseas descartarlos?")) {
            return;
        }
        setSelectedRole(role);
        setData('permissions', getInitialPermissions(role));
    };

    // Alternar check de un permiso
    const togglePermission = (permissionName) => {
        if (data.permissions.includes(permissionName)) {
            setData('permissions', data.permissions.filter(p => p !== permissionName));
        } else {
            setData('permissions', [...data.permissions, permissionName]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if(!selectedRole) return;
        
        post(route('admin.privilegios.update', selectedRole.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Roles list in props should be updated from server, updating local view
                const updatedRole = roles.find(r => r.id === selectedRole.id);
                if(updatedRole) {
                    setData('permissions', getInitialPermissions(updatedRole));
                }
            }
        });
    };

    // Agrupar permisos por módulos para la vista (heurística simple)
    const groupedPermissions = permissions.reduce((acc, perm) => {
        let group = 'Ajustes Generales';
        if (perm.name.includes('personas')) group = 'Afiliados / Personas';
        else if (perm.name.includes('creditos')) group = 'Créditos y Préstamos';
        else if (perm.name.includes('kardex') || perm.name.includes('diario')) group = 'Contabilidad / Kardex';
        else if (perm.name.includes('reportes') || perm.name.includes('estado cuenta') || perm.name.includes('morosidad')) group = 'Reportes';
        else if (perm.name.includes('tienda') || perm.name.includes('ecommerce') || perm.name.includes('inventario') || perm.name.includes('catalogos')) group = 'Ecommerce';

        if (!acc[group]) acc[group] = [];
        acc[group].push(perm);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-brand-main leading-tight">Matriz Integral de Seguridad FAPCLAS</h2>}
        >
            <Head title="Control A.B.A.C." />

            <div className="py-8 bg-main min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* ENCABEZADO PANEL DE CONTROL */}
                    <div className="bg-card-fap border-t-4 border-t-primary border border-brand/20 shadow-sm rounded-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-primary rounded-lg">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-brand-main uppercase tracking-tight">Central de Control de Beneficios y Accesos Modulares</h3>
                                    <p className="text-xs text-brand-muted font-medium mt-1">Configura granularmente qué botones, reportes y vistas puede operar cada perfil de la Institución.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* SIDEBAR: LISTA DE ROLES */}
                        <div className="w-full lg:w-1/4">
                            <div className="bg-card-fap border border-brand/30 shadow-sm rounded-lg overflow-hidden">
                                <div className="bg-card-fap px-4 py-3 border-b border-brand/20">
                                    <span className="text-[11px] font-black text-brand-muted uppercase tracking-widest">Perfiles de Jerarquía</span>
                                </div>
                                <div className="flex flex-col divide-y divide-brand p-2">
                                    {roles.map(role => (
                                        <button 
                                            key={role.id}
                                            onClick={() => switchRole(role)}
                                            className={`text-left px-4 py-3 rounded-md text-xs font-bold transition-all ${
                                                selectedRole?.id === role.id 
                                                ? 'bg-primary text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-brand/5 hover:text-primary'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="uppercase">{role.name}</span>
                                                {role.name === 'SuperAdmin' && <ShieldCheck className="w-4 h-4 opacity-70" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 bg-brand/5 border-t border-brand">
                                    <p className="text-[10px] text-brand-muted font-medium leading-relaxed italic text-center">
                                        Selecciona un perfil organizacional para auditar o modificar sus facultades dentro del Módulo ERP y Tienda Virtual.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* WORKSPACE: MATRIZ DE PERMISOS */}
                        <div className="w-full lg:w-3/4">
                            <form onSubmit={submit} className="bg-card-fap border border-brand/30 shadow-sm rounded-lg overflow-hidden flex flex-col h-full">
                                <div className="px-6 py-4 bg-[#fdfdfa] border-b border-brand/20 flex justify-between items-center sticky top-0 z-10">
                                    <div>
                                        <h4 className="text-sm font-black text-brand-main uppercase tracking-tight flex items-center gap-2">
                                            Edición Directa: Autoridades de <span className="text-primary">[{selectedRole?.name}]</span>
                                        </h4>
                                        <div className="text-[10px] text-brand-muted font-medium mt-1">
                                            Activando <span className="font-bold text-brand-main">{data.permissions.length}</span> de <span className="font-bold text-brand-main">{permissions.length}</span> bloques funcionales disponibles en el núcleo.
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={processing || selectedRole?.name === 'SuperAdmin' || !isDirty}
                                        className={`px-6 py-2 rounded shadow-md text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                                            isDirty && selectedRole?.name !== 'SuperAdmin'
                                            ? 'bg-primary hover:bg-primary-dark text-white animate-pulse' 
                                            : 'bg-gray-200 text-brand-muted cursor-not-allowed'
                                        }`}
                                    >
                                        <Save className="w-4 h-4" /> {processing ? 'Actualizando Matrix...' : 'Compilar Perfil'}
                                    </button>
                                </div>

                                {selectedRole?.name === 'SuperAdmin' && (
                                    <div className="mx-6 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <div>
                                            <h5 className="text-xs font-bold uppercase tracking-widest">Perfil Inmutable: Autoridad Jerárquica Suprema</h5>
                                            <p className="text-[11px] mt-1 pr-6 leading-relaxed text-amber-900/80">
                                                Las claves técnicas con nivel SuperAdmin ("Comandante Root") poseen un bypass permanente (Gate::before) a nivel código de servidor. Este perfil visualiza y opera el 100% del sistema automáticamente. La eliminación parcial de facultades desde esta matriz visual está bloqueada por arquitectura.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                    {Object.entries(groupedPermissions).map(([groupName, groupPerms]) => (
                                        <div key={groupName} className="flex flex-col">
                                            <h5 className="text-[11px] font-black text-brand-main uppercase tracking-widest border-b border-brand/20 pb-2 mb-4">
                                                Ecosistema de {groupName}
                                            </h5>
                                            <div className="space-y-3">
                                                {groupPerms.map((perm) => {
                                                    const isChecked = selectedRole?.name === 'SuperAdmin' ? true : data.permissions.includes(perm.name);
                                                    const isDisabled = selectedRole?.name === 'SuperAdmin' || processing;
                                                    
                                                    return (
                                                        <div 
                                                            key={perm.id} 
                                                            className={`flex items-center justify-between p-3 rounded border transition-all ${
                                                                isChecked 
                                                                ? 'border-emerald-200 bg-emerald-50/30' 
                                                                : 'border-brand bg-brand/5/50 hover:bg-brand/10'
                                                            }`}
                                                        >
                                                            <div className="flex flex-col pr-4">
                                                                <span className={`text-xs font-bold uppercase tracking-tight ${isChecked ? 'text-brand-main' : 'text-brand-muted'}`}>
                                                                    {perm.name}
                                                                </span>
                                                                <span className="text-[9px] text-brand-muted font-mono mt-0.5">
                                                                    SYS_CODE: {perm.name.toUpperCase().replace(/\s+/g, '_')}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                disabled={isDisabled}
                                                                onClick={() => togglePermission(perm.name)}
                                                                className={`p-1 rounded-full transition-colors focus:outline-none ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                title={isChecked ? 'Retirar Permiso' : 'Otorgar Permiso'}
                                                            >
                                                                {isChecked ? (
                                                                    <ToggleRight className="w-8 h-8 text-primary" />
                                                                ) : (
                                                                    <ToggleLeft className="w-8 h-8 text-gray-300 hover:text-brand-muted" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
