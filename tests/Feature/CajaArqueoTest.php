<?php
namespace Tests\Feature;

use App\Models\User;
use App\Models\Caja;
use App\Models\CajaMovimiento;
use App\Models\CajaDenominacion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CajaArqueoTest extends TestCase
{
    use RefreshDatabase;

    private User $cajero;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cajero = User::factory()->create();
    }

    #[Test]
    public function auditoria_ciclo_apertura_movimientos_cierre_arqueo(): void
    {
        // 1. Apertura de Caja
        $caja = Caja::create([
            'user_id' => $this->cajero->id,
            'fecha_apertura' => now(),
            'saldo_inicial_bob' => 500.00,
            'saldo_inicial_usd' => 50.00,
            'estado' => 'abierta',
            'observaciones_apertura' => 'Apertura de prueba de auditoría QA'
        ]);

        $this->assertTrue($caja->estaAbierta());
        $this->assertEquals($caja->id, Caja::cajaAbiertaDe($this->cajero->id)->id);

        // 2. Registrar Movimientos (Ingresos y Egresos)
        CajaMovimiento::create([
            'caja_id' => $caja->id,
            'user_id' => $this->cajero->id,
            'fecha' => now(),
            'tipo' => 'ingreso',
            'concepto' => 'Pago de Aporte Socio',
            'categoria' => 'aporte',
            'monto_bob' => 150.00,
            'monto_usd' => 0.00,
            'metodo_pago' => 'efectivo'
        ]);

        CajaMovimiento::create([
            'caja_id' => $caja->id,
            'user_id' => $this->cajero->id,
            'fecha' => now(),
            'tipo' => 'ingreso',
            'concepto' => 'Pago de Cuota de Crédito',
            'categoria' => 'pago_credito',
            'monto_bob' => 300.00,
            'monto_usd' => 0.00,
            'metodo_pago' => 'efectivo'
        ]);

        CajaMovimiento::create([
            'caja_id' => $caja->id,
            'user_id' => $this->cajero->id,
            'fecha' => now(),
            'tipo' => 'egreso',
            'concepto' => 'Desembolso Menor',
            'categoria' => 'desembolso',
            'monto_bob' => 100.00,
            'monto_usd' => 0.00,
            'metodo_pago' => 'efectivo'
        ]);

        // 3. Verificar Saldos Esperados
        $caja->refresh();
        $this->assertEquals(450.00, $caja->total_ingresos_bob);
        $this->assertEquals(100.00, $caja->total_egresos_bob);
        
        // Saldo esperado: Inicial (500) + Ingresos (450) - Egresos (100) = 850 BOB
        $this->assertEquals(850.00, $caja->saldo_esperado_bob);

        // 4. Arqueo Físico - Declaración de Denominaciones (Moneda Boliviana)
        // Simulamos contar: 4 billetes de 200 (800 BOB) + 2 billetes de 20 (40 BOB) + 1 moneda de 10 (10 BOB) = 850 BOB
        $denominacionesContadas = [
            ['valor' => 200.00, 'cantidad' => 4],
            ['valor' => 20.00, 'cantidad' => 2],
            ['valor' => 10.00, 'cantidad' => 1]
        ];

        $totalDeclarado = 0;
        foreach ($denominacionesContadas as $dc) {
            $subtotal = $dc['valor'] * $dc['cantidad'];
            $totalDeclarado += $subtotal;

            CajaDenominacion::create([
                'caja_id' => $caja->id,
                'tipo' => 'cierre',
                'moneda' => 'BOB',
                'denominacion' => $dc['valor'],
                'cantidad' => $dc['cantidad'],
                'subtotal' => $subtotal
            ]);
        }

        // El arqueo físico coincide exactamente con el saldo esperado teóricamente
        $this->assertEquals($caja->saldo_esperado_bob, $totalDeclarado, 'ERROR DE AUDITORÍA: El saldo contado físico no coincide con el saldo esperado de transacciones.');

        // 5. Cierre de Caja
        $caja->update([
            'estado' => 'cerrada',
            'fecha_cierre' => now(),
            'saldo_final_bob' => $totalDeclarado,
            'saldo_final_usd' => 50.00,
            'observaciones_cierre' => 'Arqueo de caja exitoso y cuadre perfecto sin diferencias.'
        ]);

        $caja->refresh();
        $this->assertFalse($caja->estaAbierta());
        $this->assertNull(Caja::cajaAbiertaDe($this->cajero->id));
    }
}
