<?php

namespace Tests\Unit;

use App\Models\Kardex;
use App\Models\User;
use App\Services\KardexService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KardexServiceTest extends TestCase
{
    use RefreshDatabase;

    private KardexService $service;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new KardexService();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function registra_movimiento_con_saldo_acumulado_correcto(): void
    {
        $mov1 = $this->service->registrar($this->user, 'aporte', 'Aporte inicial', 1000, 0);
        $this->assertEquals(1000, $mov1->saldo_acumulado);

        $mov2 = $this->service->registrar($this->user, 'pago_cuota', 'Pago cuota', 0, 300);
        $this->assertEquals(700, $mov2->saldo_acumulado);

        $mov3 = $this->service->registrar($this->user, 'aporte', 'Segundo aporte', 500, 0);
        $this->assertEquals(1200, $mov3->saldo_acumulado);
    }

    /** @test */
    public function registrar_aporte_crea_movimiento_tipo_aporte(): void
    {
        $mov = $this->service->registrarAporte($this->user, 500);

        $this->assertEquals(Kardex::TIPO_APORTE, $mov->tipo_movimiento);
        $this->assertEquals(500, $mov->ingreso);
        $this->assertEquals(0, $mov->egreso);
        $this->assertEquals(500, $mov->saldo_acumulado);
    }

    /** @test */
    public function registrar_desembolso_crea_movimiento_correcto(): void
    {
        $mov = $this->service->registrarDesembolso($this->user, 10000, 42);

        $this->assertEquals(Kardex::TIPO_DESEMBOLSO_CREDITO, $mov->tipo_movimiento);
        $this->assertEquals(10000, $mov->ingreso);
        $this->assertEquals('credito', $mov->referencia_tipo);
        $this->assertEquals(42, $mov->referencia_id);
    }

    /** @test */
    public function registrar_pago_cuota_genera_egreso(): void
    {
        // Primero dar saldo
        $this->service->registrarAporte($this->user, 5000);

        $mov = $this->service->registrarPagoCuota($this->user, 10, 55, 3, 850.25, 'Planilla');

        $this->assertEquals(Kardex::TIPO_PAGO_CUOTA, $mov->tipo_movimiento);
        $this->assertEquals(0, $mov->ingreso);
        $this->assertEquals(850.25, $mov->egreso);
        $this->assertEquals(4149.75, $mov->saldo_acumulado);
        $this->assertEquals('Planilla', $mov->metodo);
    }

    /** @test */
    public function registrar_interes_ganado_incrementa_saldo(): void
    {
        $this->service->registrarAporte($this->user, 10000);
        $mov = $this->service->registrarInteresGanado($this->user, 33.33);

        $this->assertEquals(Kardex::TIPO_INTERES_GANADO, $mov->tipo_movimiento);
        $this->assertEquals(33.33, $mov->ingreso);
        $this->assertEquals(10033.33, $mov->saldo_acumulado);
        $this->assertEquals('Automático', $mov->metodo);
    }

    /** @test */
    public function registrar_mora_genera_egreso(): void
    {
        $mov = $this->service->registrarMora($this->user, 100, 3, 10, 45.50);

        $this->assertEquals(Kardex::TIPO_MORA, $mov->tipo_movimiento);
        $this->assertEquals(45.50, $mov->egreso);
    }

    /** @test */
    public function registrar_compra_convenio_genera_egreso(): void
    {
        $this->service->registrarAporte($this->user, 2000);
        $mov = $this->service->registrarCompraConvenio($this->user, 150, 7, 'Seguro Dental');

        $this->assertEquals(Kardex::TIPO_COMPRA_CONVENIO, $mov->tipo_movimiento);
        $this->assertEquals(150, $mov->egreso);
        $this->assertEquals(1850, $mov->saldo_acumulado);
        $this->assertStringContains('Seguro Dental', $mov->concepto);
    }

    /** @test */
    public function saldo_usuario_independiente_de_otro(): void
    {
        $otroUser = User::factory()->create();

        $this->service->registrarAporte($this->user, 1000);
        $this->service->registrarAporte($otroUser, 5000);

        $saldoUser1 = Kardex::where('user_id', $this->user->id)->orderBy('id', 'desc')->value('saldo_acumulado');
        $saldoUser2 = Kardex::where('user_id', $otroUser->id)->orderBy('id', 'desc')->value('saldo_acumulado');

        $this->assertEquals(1000, $saldoUser1);
        $this->assertEquals(5000, $saldoUser2);
    }

    private function assertStringContains(string $needle, string $haystack): void
    {
        $this->assertTrue(str_contains($haystack, $needle), "Failed asserting that '{$haystack}' contains '{$needle}'");
    }
}
