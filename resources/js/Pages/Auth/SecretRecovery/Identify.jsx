import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Identify() {
    const { data, setData, post, processing, errors } = useForm({
        ci: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('secret.store'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña - FAPCLAS" />

            <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-emerald-800 mb-2">Recuperación Segura</h2>
                <div className="h-1 w-16 bg-emerald-600 mx-auto rounded-full mb-4" />
                <p className="text-sm text-gray-600">
                    Ingresa tu número de Carnet de Identidad (CI) tal como está registrado en el sistema ERP.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="ci" className="block text-sm font-bold text-gray-700">Carnet de Identidad (CI)</label>
                    <TextInput
                        id="ci"
                        type="text"
                        name="ci"
                        value={data.ci}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                        isFocused={true}
                        onChange={(e) => setData('ci', e.target.value)}
                        placeholder="Ej. 1234567"
                        required
                    />
                    <InputError message={errors.ci} className="mt-2 text-red-600" />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 py-3" disabled={processing}>
                        Siguiente Paso
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6 border-t pt-4">
                    <Link
                        href={route('login')}
                        className="text-sm text-emerald-600 hover:text-emerald-900 font-bold transition-colors"
                    >
                        Volver al Inicio de Sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
