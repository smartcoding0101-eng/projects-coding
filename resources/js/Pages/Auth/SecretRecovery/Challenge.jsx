import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';

export default function Challenge({ pregunta_secreta, ci }) {
    const { data, setData, post, processing, errors } = useForm({
        respuesta: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('secret.verify'));
    };

    return (
        <GuestLayout>
            <Head title="Verificación de Identidad - FAPCLAS" />

            <div className="text-center mb-6">
                <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-gray-800">Cuestionario de Seguridad</h2>
                <div className="h-1 w-10 bg-amber-500 mx-auto rounded-full mt-2 mb-3" />
                <p className="text-sm text-gray-600">
                    Socio CI: <span className="font-bold">{ci}</span>
                </p>
                <div className="mt-4 p-4 bg-gray-50 border-l-4 border-amber-500 rounded-r-md text-left">
                    <p className="text-sm font-bold text-gray-700 font-serif">
                        "{pregunta_secreta}"
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="respuesta" className="block text-sm font-bold text-gray-700">Tu Respuesta Secreta:</label>
                    <TextInput
                        id="respuesta"
                        type="password"
                        name="respuesta"
                        value={data.respuesta}
                        className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md"
                        isFocused={true}
                        onChange={(e) => setData('respuesta', e.target.value)}
                        placeholder="Escribe exactamente como la registraste..."
                        required
                    />
                    <InputError message={errors.respuesta} className="mt-2 text-red-600" />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center bg-amber-500 hover:bg-amber-600 text-white py-3 shadow-md" disabled={processing}>
                        Autenticar Identidad
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6">
                    <Link
                        href={route('secret.request')}
                        className="text-sm text-gray-500 hover:text-gray-800 underline transition-colors"
                    >
                        Equivoqué mi CI, volver al paso anterior
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
