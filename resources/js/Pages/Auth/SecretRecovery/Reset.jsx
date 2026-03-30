import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export default function Reset() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('secret.update'));
    };

    return (
        <GuestLayout>
            <Head title="Restablecer Contraseña - FAPCLAS" />

            <div className="text-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h2 className="text-2xl font-black text-gray-800">Identidad Validada</h2>
                <div className="h-1 w-16 bg-emerald-600 mx-auto rounded-full mt-2 mb-3" />
                <p className="text-sm text-gray-600">
                    Tu respuesta secreta es correcta. Ahora puedes definir una nueva contraseña para acceder al sistema.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700">Nueva Contraseña:</label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2 text-red-600" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-bold text-gray-700">Confirmar Contraseña:</label>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2 text-red-600" />
                </div>

                <div className="pt-4">
                    <PrimaryButton className="w-full justify-center bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 transition ease-in-out duration-150 py-3" disabled={processing}>
                        Cambiar Contraseña
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
