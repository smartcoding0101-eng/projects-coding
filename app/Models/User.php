<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'persona_id',
        'name',
        'email',
        'password',
        'whatsapp',
        'theme_preference',
        'pregunta_secreta',
        'respuesta_secreta',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'respuesta_secreta',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación con los datos personales/laborales
     */
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    // ─── Relaciones Financieras ───

    public function creditos()
    {
        return $this->hasMany(Credito::class);
    }

    public function kardex()
    {
        return $this->hasMany(Kardex::class)->orderBy('id', 'desc');
    }

    public function cuentaAportacion()
    {
        return $this->hasOne(CuentaAportacion::class);
    }

    public function libroDiario()
    {
        return $this->hasMany(LibroDiario::class)->orderBy('id', 'desc');
    }
}
