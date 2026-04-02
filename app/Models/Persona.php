<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    /** @use HasFactory<\Database\Factories\PersonaFactory> */
    use HasFactory;

    protected $fillable = [
        'nombres', 'apellidos', 'ci', 'ext_ci', 'fecha_nacimiento',
        'genero', 'estado_civil', 'celular', 'email', 'direccion_domicilio',
        'institucion', 'grado', 'escalafon', 'destino', 'sueldo_neto', 'fecha_ingreso_inst',
        'situacion_laboral', 'especialidad', 'unidad_dependencia',
        'tipo_afiliacion', 'contacto_emergencia_nom', 'contacto_emergencia_tel', 'observaciones',
        'grado_instruccion', 'profesion', 'conyuge_nombre', 'conyuge_celular', 'numero_hijos',
        'garantia_tipo', 'garantia_vehiculo_modelo', 'garantia_vehiculo_placa',
        'garantia_inmueble_folio', 'garantia_inmueble_dir', 'garantia_monto_valorado',
        'garantia_codigo', 'garantia_estado', 'garantia_detalle', 'garantia_fecha_constitucion', 'garantia_ubicacion_docs'
    ];

    /**
     * Relación con el Usuario (si tiene acceso al sistema)
     */
    public function user()
    {
        return $this->hasOne(User::class);
    }

    /**
     * Relaciones Financieras (Master Identity)
     */
    public function creditos()
    {
        return $this->hasMany(Credito::class);
    }

    public function cuentaAportacion()
    {
        return $this->hasOne(CuentaAportacion::class);
    }

    public function kardex()
    {
        return $this->hasMany(Kardex::class)->orderBy('id', 'desc');
    }

    public function comprasConvenio()
    {
        return $this->hasMany(CompraConvenio::class);
    }

    /**
     * Nombre completo
     */
    public function getNombreCompletoAttribute()
    {
        return "{$this->nombres} {$this->apellidos}";
    }
}
