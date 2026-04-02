<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PersonaKardexExport;
use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;

class PersonaController extends Controller
{
    public function index()
    {
        Gate::authorize('gestionar usuarios');

        $personas = Persona::with(['user.roles', 'cuentaAportacion', 'kardex' => function($q) {
                $q->orderBy('id', 'desc')->take(50);
            }])
            ->withSum(['creditos as deuda_total' => function($query) {
                $query->whereIn('estado', ['Desembolsado', 'En Mora']);
            }], 'saldo_capital')
            ->orderBy('id', 'desc')
            ->paginate(20);
            
        $roles = Role::all();

        return Inertia::render('Admin/Personas/Index', [
            'personas' => $personas,
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('gestionar usuarios');

        $validated = $request->validate([
            // Personales
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'ci' => 'required|string|max:20|unique:personas',
            'ext_ci' => 'nullable|string|max:5',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'nullable|string',
            'estado_civil' => 'nullable|string',
            'celular' => 'nullable|string',
            'email' => 'nullable|email',
            'direccion_domicilio' => 'nullable|string',
            
            // Trabajo
            'institucion' => 'required|string',
            'grado' => 'nullable|string',
            'escalafon' => 'nullable|string',
            'destino' => 'nullable|string',
            'sueldo_neto' => 'nullable|numeric',
            'fecha_ingreso_inst' => 'nullable|date',
            'situacion_laboral' => 'nullable|string',
            'especialidad' => 'nullable|string',
            'unidad_dependencia' => 'nullable|string',

            // Adicional
            'tipo_afiliacion' => 'nullable|string',
            'contacto_emergencia_nom' => 'nullable|string',
            'contacto_emergencia_tel' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'grado_instruccion' => 'nullable|string',
            'profesion' => 'nullable|string',
            'conyuge_nombre' => 'nullable|string',
            'conyuge_celular' => 'nullable|string',
            'numero_hijos' => 'nullable|integer',

            // Garantias
            'garantia_tipo' => 'nullable|string',
            'garantia_vehiculo_modelo' => 'nullable|string',
            'garantia_vehiculo_placa' => 'nullable|string',
            'garantia_inmueble_folio' => 'nullable|string',
            'garantia_inmueble_dir' => 'nullable|string',
            'garantia_monto_valorado' => 'nullable|numeric',
            'garantia_codigo' => 'nullable|string',
            'garantia_estado' => 'nullable|string',
            'garantia_detalle' => 'nullable|string',
            'garantia_fecha_constitucion' => 'nullable|date',
            'garantia_ubicacion_docs' => 'nullable|string',
        ]);

        Persona::create($validated);

        return redirect()->back()->with('success', 'Persona registrada exitosamente.');
    }

    public function update(Request $request, Persona $persona)
    {
        Gate::authorize('gestionar usuarios');

        $validated = $request->validate([
            // Personales
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'ci' => 'required|string|max:20|unique:personas,ci,' . $persona->id,
            'ext_ci' => 'nullable|string|max:5',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'nullable|string',
            'estado_civil' => 'nullable|string',
            'celular' => 'nullable|string',
            'email' => 'nullable|email',
            'direccion_domicilio' => 'nullable|string',
            
            // Trabajo
            'institucion' => 'required|string',
            'grado' => 'nullable|string',
            'escalafon' => 'nullable|string',
            'destino' => 'nullable|string',
            'sueldo_neto' => 'nullable|numeric',
            'fecha_ingreso_inst' => 'nullable|date',
            'situacion_laboral' => 'nullable|string',
            'especialidad' => 'nullable|string',
            'unidad_dependencia' => 'nullable|string',

            // Adicional
            'tipo_afiliacion' => 'nullable|string',
            'contacto_emergencia_nom' => 'nullable|string',
            'contacto_emergencia_tel' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'grado_instruccion' => 'nullable|string',
            'profesion' => 'nullable|string',
            'conyuge_nombre' => 'nullable|string',
            'conyuge_celular' => 'nullable|string',
            'numero_hijos' => 'nullable|integer',

            // Garantias
            'garantia_tipo' => 'nullable|string',
            'garantia_vehiculo_modelo' => 'nullable|string',
            'garantia_vehiculo_placa' => 'nullable|string',
            'garantia_inmueble_folio' => 'nullable|string',
            'garantia_inmueble_dir' => 'nullable|string',
            'garantia_monto_valorado' => 'nullable|numeric',
            'garantia_codigo' => 'nullable|string',
            'garantia_estado' => 'nullable|string',
            'garantia_detalle' => 'nullable|string',
            'garantia_fecha_constitucion' => 'nullable|date',
            'garantia_ubicacion_docs' => 'nullable|string',
        ]);

        // Para abreviar, aceptamos el request completo ya que fillable protege
        $persona->update($request->all());

        return redirect()->back()->with('success', 'Datos de la persona actualizados.');
    }

    public function promote(Request $request, Persona $persona)
    {
        Gate::authorize('gestionar usuarios');

        if ($persona->user) {
            return redirect()->back()->with('error', 'Esta persona ya tiene un usuario asignado.');
        }

        $validated = $request->validate([
            'password' => 'required|string|min:8',
            'roles' => 'array'
        ]);

        $user = User::create([
            'persona_id' => $persona->id,
            'name' => $persona->nombres . ' ' . $persona->apellidos,
            'email' => $persona->email ?? ($persona->ci . '@fapclas.com'),
            'password' => Hash::make($validated['password']),
        ]);

        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        } else {
            $user->assignRole('Socio Base');
        }

        return redirect()->back()->with('success', 'Usuario creado y vinculado correctamente.');
    }

    public function destroy(Persona $persona)
    {
        Gate::authorize('gestionar usuarios');
        
        if ($persona->user && $persona->user->id === 1) {
            return redirect()->back()->with('error', 'No se puede eliminar la persona asociada al Fundador.');
        }

        $persona->delete();

        return redirect()->back()->with('success', 'Registro de persona eliminado.');
    }

    public function kardexPdf(Persona $persona)
    {
        Gate::authorize('gestionar usuarios');

        // Cargar historial completo
        $persona->load(['cuentaAportacion', 'kardex' => function($q) {
            $q->orderBy('fecha', 'asc')->orderBy('id', 'asc');
        }]);

        // Totales rápidos para el reporte
        $totales = [
            'ingresos' => $persona->kardex->sum('ingreso'),
            'egresos' => $persona->kardex->sum('egreso'),
            'saldo_final' => $persona->cuentaAportacion->saldo_actual ?? 0,
            'fecha_reporte' => now()->format('d/m/Y H:i')
        ];

        $pdf = Pdf::loadView('pdf.persona_kardex', compact('persona', 'totales'));
        
        $filename = "Kardex_" . str_replace(' ', '_', $persona->nombre_completo) . "_" . now()->format('Ymd') . ".pdf";
        
        return $pdf->stream($filename);
    }

    public function kardexExcel(Persona $persona)
    {
        Gate::authorize('gestionar usuarios');

        $filename = "Kardex_" . str_replace(' ', '_', $persona->nombre_completo) . "_" . now()->format('Ymd') . ".xlsx";
        
        return Excel::download(new PersonaKardexExport($persona), $filename);
    }
}
