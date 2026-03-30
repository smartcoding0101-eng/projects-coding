import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { ShieldAlert } from 'lucide-react';

export default function UpdateSecretQuestionForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm({
        pregunta_secreta: user.pregunta_secreta || '',
        respuesta_secreta: '',
        password: '',
    });

    const updateSecret = (e) => {
        e.preventDefault();

        post(route('profile.secret'), {
            preserveScroll: true,
            onSuccess: () => reset('respuesta_secreta', 'password'),
            onError: () => reset('password'),
        });
    };

    const hasSecret = !!user.pregunta_secreta;

    return (
        <section className={className}>
            <header>
                <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-medium text-gray-900">
                        Pregunta de Seguridad (Recuperación)
                    </h2>
                </div>

                <p className="mt-1 text-sm text-gray-600">
                    {hasSecret 
                        ? 'Tu cuenta ya está protegida con una pregunta secreta. Puedes actualizarla llenando los siguientes campos.'
                        : 'Establece una pregunta y respuesta secreta. Esto te permitirá recuperar el acceso a tu cuenta usando solo tu CI en caso de que olvides tu contraseña.'}
                </p>
                <p className="mt-1 text-xs text-amber-600 font-bold font-mono">
                    La respuesta será encriptada y no podrá ser leída por nadie, ni siquiera por los administradores. Escoge una respuesta fácil de recordar pero difícil de adivinar.
                </p>
            </header>

            <form onSubmit={updateSecret} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="pregunta_secreta" value="Elige una Pregunta Secreta" />

                    <select
                        id="pregunta_secreta"
                        value={data.pregunta_secreta}
                        onChange={(e) => setData('pregunta_secreta', e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        required
                    >
                        <option value="" disabled>Selecciona una pregunta...</option>
                        <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                        <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                        <option value="¿Cuál era el apellido de tu profesor favorito en la primaria?">¿Cuál era el apellido de tu profesor favorito en la primaria?</option>
                        <option value="¿Cuál es el segundo nombre de tu madre?">¿Cuál es el segundo nombre de tu madre?</option>
                        <option value="¿Cuál es el modelo de tu primer auto o moto?">¿Cuál es el modelo de tu primer auto o moto?</option>
                    </select>

                    <InputError message={errors.pregunta_secreta} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="respuesta_secreta" value="Tu Respuesta Secreta" />

                    <TextInput
                        id="respuesta_secreta"
                        type="password"
                        className="mt-1 block w-full"
                        value={data.respuesta_secreta}
                        onChange={(e) => setData('respuesta_secreta', e.target.value)}
                        required
                        placeholder="Escribe tu respuesta aquí"
                    />

                    <InputError message={errors.respuesta_secreta} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="secret_password" value="Contraseña Actual" />

                    <TextInput
                        id="secret_password"
                        type="password"
                        className="mt-1 block w-full"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Ingresa tu contraseña actual para confirmar"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar Pregunta de Seguridad</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600">Configuración Guardada.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
