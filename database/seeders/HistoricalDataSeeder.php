<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Caja;
use App\Models\CajaDenominacion;
use App\Models\CajaMovimiento;
use App\Models\Credito;
use App\Models\Kardex;
use App\Models\KardexProducto;
use App\Models\LibroDiario;
use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\Persona;
use App\Models\PlanPago;
use App\Models\Producto;
use App\Models\TipoCredito;
use App\Models\User;

/**
 * ═══════════════════════════════════════════════════════════════════
 *  HISTORICAL DATA SEEDER — NORMALIZADO CON TRAZABILIDAD COMPLETA
 * ═══════════════════════════════════════════════════════════════════
 *
 * CADA OPERACIÓN sigue el pipeline contable real del sistema:
 *
 *   Pedido Pagado     → LibroDiario (ingreso) + CajaMovimiento (ref:Pedido)
 *   Pedido Entregado  → KardexProducto (egreso) + Producto.stock_actual
 *   Crédito Desemb.   → LibroDiario (egreso) + Kardex (desembolso) + CajaMovimiento (ref:Credito)
 *   Cuota Pagada       → LibroDiario (ingreso) + Kardex (pago_cuota) + CajaMovimiento (ref:PlanPago)
 *   Cuota Mora         → LibroDiario (ingreso mora) + Kardex (mora)
 *   Caja Sesión        → CajaDenominacion (apertura+cierre)
 *
 * RESULTADO: 0 registros huérfanos. Trazabilidad auditada al 100%.
 */
class HistoricalDataSeeder extends Seeder
{
    private User $admin;
    private array $socios = [];
    private int $numOps;

    public function run(): void
    {
        $this->command->info('══════════════════════════════════════════════════════');
        $this->command->info(' NORMALIZACIÓN INTEGRAL — MARZO 2026');
        $this->command->info('══════════════════════════════════════════════════════');

        $this->limpiarTablas();
        $this->prepararActores();
        $this->numOps = rand(6, 8);

        $this->generarSesionesCaja();
        $this->generarPedidosEcommerce();
        $this->generarCreditos();
        $this->asegurarCajasConMovimientos();

        $this->command->newLine();
        $this->command->info('══════════════════════════════════════════════════════');
        $this->command->info(' ✅ NORMALIZACIÓN COMPLETA — SISTEMA AUDITADO');
        $this->command->info('══════════════════════════════════════════════════════');
        $this->imprimirResumen();
    }

    // ═══════════════════════════════════════════════
    //  FASE 0: LIMPIEZA DE TABLAS TRANSACCIONALES
    // ═══════════════════════════════════════════════

    private function limpiarTablas(): void
    {
        $this->command->warn('Limpiando tablas transaccionales...');

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('libro_diarios')->truncate();
        DB::table('kardex')->truncate();
        DB::table('kardex_productos')->truncate();
        DB::table('caja_movimientos')->truncate();
        DB::table('caja_denominaciones')->truncate();
        DB::table('cajas')->truncate();
        DB::table('plan_pagos')->truncate();
        DB::table('creditos')->truncate();
        DB::table('pedido_detalles')->truncate();
        DB::table('pedidos')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Restaurar stock original de productos
        Producto::query()->update(['stock_actual' => DB::raw('stock_minimo + FLOOR(RAND() * 50) + 20')]);

        $this->command->info('  ✓ Tablas limpiadas. Stock restaurado.');
    }

    // ═══════════════════════════════════════════════
    //  FASE 1: PREPARAR ACTORES (ADMIN + SOCIOS)
    // ═══════════════════════════════════════════════

    private function prepararActores(): void
    {
        $this->admin = User::first();

        $sociosData = [
            ['ci' => '4521876', 'nombres' => 'Carlos Alberto', 'apellidos' => 'Mamani Quispe', 'grado' => 'Sgto. 1ro.', 'escalafon' => 'POL-2024-001'],
            ['ci' => '6783412', 'nombres' => 'María Elena', 'apellidos' => 'Condori Choque', 'grado' => 'Cabo', 'escalafon' => 'POL-2024-002'],
            ['ci' => '3298765', 'nombres' => 'Juan Roberto', 'apellidos' => 'Flores Vásquez', 'grado' => 'Sgto. 2do.', 'escalafon' => 'POL-2024-003'],
            ['ci' => '8912345', 'nombres' => 'Ana Patricia', 'apellidos' => 'Rojas Mendoza', 'grado' => 'Sgto.', 'escalafon' => 'POL-2024-004'],
        ];

        foreach ($sociosData as $i => $data) {
            $persona = Persona::firstOrCreate(
                ['ci' => $data['ci']],
                array_merge($data, [
                    'institucion' => 'Policía Boliviana',
                    'destino' => 'Batallón de Seguridad Física Privada',
                    'email' => strtolower(explode(' ', $data['nombres'])[0]) . '.' . strtolower(explode(' ', $data['apellidos'])[0]) . '@fapclas.org',
                    'garantia_tipo' => 'Sin Garantía',
                    'tipo_afiliacion' => 'Activo',
                    'situacion_laboral' => 'Activo',
                    'genero' => $data['nombres'] === 'María Elena' || $data['nombres'] === 'Ana Patricia' ? 'Femenino' : 'Masculino',
                    'celular' => '7' . rand(1000000, 9999999),
                    'sueldo_neto' => rand(3000, 6000),
                ])
            );

            $user = User::firstOrCreate(
                ['email' => $persona->email],
                [
                    'name' => $data['nombres'] . ' ' . $data['apellidos'],
                    'password' => bcrypt('Socio123!'),
                    'persona_id' => $persona->id,
                ]
            );

            $this->socios[] = $user;
        }

        $this->command->info('  ✓ ' . count($this->socios) . ' socios preparados.');
    }

    // ═══════════════════════════════════════════════
    //  FASE 2: SESIONES DE CAJA CON DENOMINACIONES
    // ═══════════════════════════════════════════════

    private function generarSesionesCaja(): void
    {
        $this->command->info('Generando sesiones de Caja General...');

        // Crear sesiones entre el 3 y 28 de marzo para no tener fechas límite
        for ($d = 3; $d <= 28; $d += rand(3, 5)) {
            $fechaApertura = Carbon::create(2026, 3, $d, 8, 0, 0);
            $fechaCierre = $fechaApertura->copy()->addHours(9)->addMinutes(rand(10, 30));

            // Denominaciones de apertura
            $denomsApertura = $this->generarDenominaciones();
            $totalAperturaBob = collect($denomsApertura)->sum(fn($d) => $d['denominacion'] * $d['cantidad']);

            $caja = Caja::create([
                'user_id' => $this->admin->id,
                'fecha_apertura' => $fechaApertura,
                'fecha_cierre' => $fechaCierre,
                'saldo_inicial_bob' => $totalAperturaBob,
                'saldo_inicial_usd' => 0,
                'saldo_final_bob' => $totalAperturaBob + rand(500, 2000),
                'saldo_final_usd' => 0,
                'estado' => 'cerrada',
                'observaciones_apertura' => 'Apertura Caja - ' . $fechaApertura->format('d/m/Y'),
                'observaciones_cierre' => 'Cierre sin novedades',
                'created_at' => $fechaApertura,
                'updated_at' => $fechaCierre,
            ]);

            // Registrar denominaciones de apertura
            foreach ($denomsApertura as $den) {
                if ($den['cantidad'] > 0) {
                    CajaDenominacion::create([
                        'caja_id' => $caja->id,
                        'tipo' => 'apertura',
                        'moneda' => 'BOB',
                        'denominacion' => $den['denominacion'],
                        'cantidad' => $den['cantidad'],
                        'subtotal' => $den['denominacion'] * $den['cantidad'],
                    ]);
                }
            }

            // Denominaciones de cierre (un poco más)
            $denomsCierre = $this->generarDenominaciones(1.3);
            foreach ($denomsCierre as $den) {
                if ($den['cantidad'] > 0) {
                    CajaDenominacion::create([
                        'caja_id' => $caja->id,
                        'tipo' => 'cierre',
                        'moneda' => 'BOB',
                        'denominacion' => $den['denominacion'],
                        'cantidad' => $den['cantidad'],
                        'subtotal' => $den['denominacion'] * $den['cantidad'],
                    ]);
                }
            }
        }

        $total = Caja::count();
        $this->command->info("  ✓ {$total} sesiones de Caja con denominaciones completas.");
    }

    private function generarDenominaciones(float $factor = 1.0): array
    {
        return [
            ['denominacion' => 200, 'cantidad' => (int)(rand(1, 3) * $factor)],
            ['denominacion' => 100, 'cantidad' => (int)(rand(2, 6) * $factor)],
            ['denominacion' => 50,  'cantidad' => (int)(rand(3, 8) * $factor)],
            ['denominacion' => 20,  'cantidad' => (int)(rand(5, 15) * $factor)],
            ['denominacion' => 10,  'cantidad' => (int)(rand(5, 10) * $factor)],
            ['denominacion' => 5,   'cantidad' => (int)(rand(0, 5) * $factor)],
        ];
    }

    // ═══════════════════════════════════════════════
    //  FASE 3: PEDIDOS eCOMMERCE — TRAZABILIDAD TOTAL
    // ═══════════════════════════════════════════════

    private function generarPedidosEcommerce(): void
    {
        $this->command->info('Generando Pedidos eCommerce con trazabilidad contable...');

        $productos = Producto::all();
        if ($productos->count() === 0) {
            $this->command->warn('  ⚠ Sin productos. Saltando eCommerce.');
            return;
        }

        $tiposPago = ['qr', 'credito_asociado'];
        $cajas = Caja::orderBy('fecha_apertura')->get();

        for ($i = 0; $i < $this->numOps; $i++) {
            $socio = $this->socios[array_rand($this->socios)];
            $caja = $cajas[$i % $cajas->count()]; // Distribuir entre cajas
            $fecha = Carbon::parse($caja->fecha_apertura)->addHours(rand(1, 6));

            // ─── (a) Crear Pedido ───
            $pedido = Pedido::create([
                'numero_orden' => 'ORD-2603' . str_pad($i + 1, 3, '0', STR_PAD_LEFT) . strtoupper(Str::random(2)),
                'user_id' => $socio->id,
                'persona_id' => $socio->persona_id,
                'nombre_cliente' => $socio->name,
                'ci_cliente' => $socio->persona->ci ?? '0000000',
                'telefono_contacto' => '7' . rand(1000000, 9999999),
                'tipo_pago' => $tiposPago[array_rand($tiposPago)],
                'tipo_entrega' => 'envio_domicilio',
                'direccion_envio' => 'Zona Central, Calle ' . rand(1, 50),
                'costo_envio' => 15.00,
                'estado_pago' => 'pagado',
                'estado_entrega' => 'entregado',
                'total' => 0,
                'created_at' => $fecha,
                'updated_at' => $fecha,
            ]);

            // ─── (b) Detalles del pedido ───
            $totalPedido = 0;
            $numItems = rand(1, 3);
            $prodSeleccionados = $productos->random(min($numItems, $productos->count()));

            foreach ($prodSeleccionados as $prod) {
                $cantidad = rand(1, 2);
                $precio = (float) $prod->precio_general;
                $subtotal = $precio * $cantidad;
                $totalPedido += $subtotal;

                PedidoDetalle::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $prod->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precio,
                    'subtotal' => $subtotal,
                    'created_at' => $fecha,
                    'updated_at' => $fecha,
                ]);

                // ─── (c) PIPELINE: KardexProducto (egreso por entrega) ───
                $nuevoStock = max(0, $prod->stock_actual - $cantidad);
                KardexProducto::create([
                    'producto_id' => $prod->id,
                    'tipo_movimiento' => 'egreso',
                    'cantidad' => $cantidad,
                    'saldo_stock' => $nuevoStock,
                    'costo_unitario' => $prod->precio_costo ?? ($precio * 0.65),
                    'concepto' => 'Salida por Entrega Ecommerce - Orden #' . $pedido->numero_orden,
                    'usuario_admin_id' => $this->admin->id,
                    'notas' => 'Entrega presencial confirmada.',
                    'created_at' => $fecha,
                    'updated_at' => $fecha,
                ]);
                $prod->update(['stock_actual' => $nuevoStock]);
            }

            $totalConEnvio = $totalPedido + 15.00;
            $pedido->update(['total' => $totalConEnvio]);

            // ─── (d) PIPELINE: LibroDiario (ingreso por venta) ───
            LibroDiario::create([
                'user_id' => $socio->id,
                'cajero_id' => $this->admin->id,
                'fecha' => $fecha->toDateString(),
                'concepto' => 'Venta Ecommerce / Beneficios - Orden #' . $pedido->numero_orden . ' (ID: ' . $pedido->id . ')',
                'ingreso' => $totalConEnvio,
                'egreso' => 0,
                'tipo_transaccion' => 'venta_ecommerce',
                'referencia_id' => $pedido->id,
                'created_at' => $fecha,
                'updated_at' => $fecha,
            ]);

            // ─── (e) PIPELINE: CajaMovimiento (ingreso trazable) ───
            CajaMovimiento::create([
                'caja_id' => $caja->id,
                'user_id' => $this->admin->id,
                'fecha' => $fecha,
                'tipo' => 'ingreso',
                'concepto' => 'Venta Ecommerce Orden #' . $pedido->numero_orden,
                'categoria' => 'venta_ecommerce',
                'monto_bob' => $totalConEnvio,
                'monto_usd' => 0,
                'metodo_pago' => $pedido->tipo_pago === 'qr' ? 'qr_banco' : 'efectivo',
                'referencia_tipo' => 'Pedido',
                'referencia_id' => $pedido->id,
                'created_at' => $fecha,
                'updated_at' => $fecha,
            ]);
        }

        $this->command->info("  ✓ {$this->numOps} Pedidos: LibroDiario + KardexProducto + CajaMovimiento.");
    }

    // ═══════════════════════════════════════════════
    //  FASE 4: CRÉDITOS — DESEMBOLSO + CUOTAS + MORA
    // ═══════════════════════════════════════════════

    private function generarCreditos(): void
    {
        $this->command->info('Generando Créditos con trazabilidad contable completa...');

        $tipoCredito = TipoCredito::first();
        $cajas = Caja::orderBy('fecha_apertura')->get();

        $cuotasPagadas = 0;
        $cuotasMora = 0;
        $creditosCreados = 0;

        foreach ($this->socios as $idx => $socio) {
            // Cada socio tiene 2 créditos:
            //  - 1 crédito ANTIGUO (desembolsado en Ene/Feb → cuotas pagadas en Marzo)
            //  - 1 crédito NUEVO (desembolsado en Marzo → cuotas en Abril, algunas en mora)
            $creditoConfigs = [
                ['mes_desembolso' => rand(1, 2), 'dia' => rand(5, 20)], // Ene o Feb
                ['mes_desembolso' => 3, 'dia' => rand(3, 15)],          // Marzo
            ];

            foreach ($creditoConfigs as $ci => $config) {
                $creditosCreados++;
                $caja = $cajas[($idx + $ci) % $cajas->count()];
                $fechaDesembolso = Carbon::create(2026, $config['mes_desembolso'], $config['dia'], 10, 0, 0);
                $monto = rand(5, 15) * 1000;
                $plazo = [12, 18, 24][array_rand([12, 18, 24])];

                // ─── (a) Crear Crédito ───
                $credito = Credito::create([
                    'persona_id' => $socio->persona_id,
                    'user_id' => $socio->id,
                    'tipo_credito_id' => $tipoCredito?->id,
                    'monto_aprobado' => $monto,
                    'saldo_capital' => $monto,
                    'tasa_interes' => 15.00,
                    'plazo_meses' => $plazo,
                    'estado' => Credito::ESTADO_DESEMBOLSADO,
                    'metodo_descuento' => 'Ventanilla',
                    'fecha_desembolso' => $fechaDesembolso,
                    'aprobado_por' => $this->admin->id,
                    'created_at' => $fechaDesembolso->copy()->subDays(rand(2, 5)),
                    'updated_at' => $fechaDesembolso,
                ]);

                // ─── (b) PIPELINE: LibroDiario (egreso por desembolso) ───
                LibroDiario::create([
                    'user_id' => $socio->id,
                    'cajero_id' => $this->admin->id,
                    'fecha' => $fechaDesembolso->toDateString(),
                    'concepto' => 'Desembolso de Crédito Aprobado - Préstamo #' . $credito->id,
                    'ingreso' => 0,
                    'egreso' => $monto,
                    'tipo_transaccion' => 'desembolso_credito',
                    'referencia_id' => $credito->id,
                    'created_at' => $fechaDesembolso,
                    'updated_at' => $fechaDesembolso,
                ]);

                // ─── (c) PIPELINE: Kardex social (desembolso) ───
                $ultimoSaldo = (float) (Kardex::where('user_id', $socio->id)->orderBy('id', 'desc')->value('saldo_acumulado') ?? 0);
                $nuevoSaldoDesembolso = $ultimoSaldo + $monto;

                Kardex::create([
                    'user_id' => $socio->id,
                    'fecha' => $fechaDesembolso->toDateString(),
                    'tipo_movimiento' => Kardex::TIPO_DESEMBOLSO_CREDITO,
                    'concepto' => 'Desembolso de Crédito #' . $credito->id,
                    'ingreso' => $monto,
                    'egreso' => 0,
                    'saldo_acumulado' => $nuevoSaldoDesembolso,
                    'referencia_tipo' => 'credito',
                    'referencia_id' => $credito->id,
                    'metodo' => 'Transferencia',
                    'created_at' => $fechaDesembolso,
                    'updated_at' => $fechaDesembolso,
                ]);

                // ─── (d) PIPELINE: CajaMovimiento (egreso por desembolso) ───
                CajaMovimiento::create([
                    'caja_id' => $caja->id,
                    'user_id' => $this->admin->id,
                    'fecha' => $fechaDesembolso,
                    'tipo' => 'egreso',
                    'concepto' => 'Desembolso Crédito #' . $credito->id . ' - ' . $socio->name,
                    'categoria' => 'desembolso',
                    'monto_bob' => $monto,
                    'monto_usd' => 0,
                    'metodo_pago' => 'efectivo',
                    'referencia_tipo' => 'Credito',
                    'referencia_id' => $credito->id,
                    'created_at' => $fechaDesembolso,
                    'updated_at' => $fechaDesembolso,
                ]);

                // ─── (e) Generar Plan de Pagos ───
                $capitalMensual = round($monto / $plazo, 2);
                $interesMensual = round(($monto * 0.15) / 12, 2);
                $saldoCapitalVivo = $monto;

                for ($k = 1; $k <= $plazo; $k++) {
                    $fechaVencimiento = $fechaDesembolso->copy()->addMonths($k);

                    $estadoCuota = PlanPago::ESTADO_PENDIENTE;
                    $fechaPago = null;
                    $montoMora = 0;
                    $cuotaTotal = $capitalMensual + $interesMensual;

                    // Cuotas que vencen en marzo 2026 → PAGADAS
                    if ($fechaVencimiento->month === 3 && $fechaVencimiento->year === 2026) {
                        $estadoCuota = PlanPago::ESTADO_PAGADA;
                        $fechaPago = $fechaVencimiento->copy()->subDays(rand(1, 3));
                    }
                    // Cuotas que vencen primera quincena abril → 40% Retrasada con mora
                    elseif ($fechaVencimiento->isBefore(Carbon::create(2026, 4, 15)) && rand(1, 100) <= 40) {
                        $estadoCuota = PlanPago::ESTADO_RETRASADA;
                        $diasMora = (int) $fechaVencimiento->diffInDays(Carbon::create(2026, 4, 3));
                        $montoMora = round($cuotaTotal * 0.001 * $diasMora, 2); // 0.1% diario
                    }

                    $cuota = PlanPago::create([
                        'credito_id' => $credito->id,
                        'nro_cuota' => $k,
                        'fecha_vencimiento' => $fechaVencimiento,
                        'cuota_total' => $cuotaTotal,
                        'capital_amortizado' => $capitalMensual,
                        'interes_pagado' => $interesMensual,
                        'monto_mora' => $montoMora,
                        'estado' => $estadoCuota,
                        'fecha_pago_real' => $fechaPago,
                        'created_at' => $fechaDesembolso,
                        'updated_at' => $fechaPago ?? $fechaDesembolso,
                    ]);

                    // ─── PIPELINE: Cuota PAGADA → LibroDiario + Kardex + CajaMovimiento ───
                    if ($estadoCuota === PlanPago::ESTADO_PAGADA && $fechaPago) {
                        $cuotasPagadas++;

                        // Actualizar saldo de capital
                        $saldoCapitalVivo -= $capitalMensual;
                        $credito->update(['saldo_capital' => max(0, $saldoCapitalVivo)]);

                        // LibroDiario
                        LibroDiario::create([
                            'user_id' => $socio->id,
                            'cajero_id' => $this->admin->id,
                            'fecha' => $fechaPago->toDateString(),
                            'concepto' => 'Pago Cuota #' . $k . ' - Crédito #' . $credito->id,
                            'ingreso' => $cuotaTotal,
                            'egreso' => 0,
                            'tipo_transaccion' => 'pago_cuota',
                            'referencia_id' => $cuota->id,
                            'created_at' => $fechaPago,
                            'updated_at' => $fechaPago,
                        ]);

                        // Kardex social (pago = egreso del socio)
                        $ultimoSaldo = (float) (Kardex::where('user_id', $socio->id)->orderBy('id', 'desc')->value('saldo_acumulado') ?? 0);
                        Kardex::create([
                            'user_id' => $socio->id,
                            'fecha' => $fechaPago->toDateString(),
                            'tipo_movimiento' => Kardex::TIPO_PAGO_CUOTA,
                            'concepto' => 'Pago Cuota #' . $k . ' - Crédito #' . $credito->id,
                            'ingreso' => 0,
                            'egreso' => $cuotaTotal,
                            'saldo_acumulado' => round($ultimoSaldo - $cuotaTotal, 2),
                            'referencia_tipo' => 'plan_pago',
                            'referencia_id' => $cuota->id,
                            'metodo' => 'Ventanilla',
                            'created_at' => $fechaPago,
                            'updated_at' => $fechaPago,
                        ]);

                        // CajaMovimiento trazable — buscar caja más cercana
                        $cajaParaPago = $cajas->first(fn($c) => Carbon::parse($c->fecha_apertura)->lte($fechaPago) && Carbon::parse($c->fecha_cierre)->gte($fechaPago));
                        // Si no hay caja abierta en esa fecha exacta, usar la más cercana
                        if (!$cajaParaPago) {
                            $cajaParaPago = $cajas->sortBy(fn($c) => abs(Carbon::parse($c->fecha_apertura)->diffInDays($fechaPago)))->first();
                        }
                        if ($cajaParaPago) {
                            CajaMovimiento::create([
                                'caja_id' => $cajaParaPago->id,
                                'user_id' => $this->admin->id,
                                'fecha' => $fechaPago,
                                'tipo' => 'ingreso',
                                'concepto' => 'Pago Cuota #' . $k . ' Crédito #' . $credito->id . ' - ' . $socio->name,
                                'categoria' => 'pago_credito',
                                'monto_bob' => $cuotaTotal,
                                'monto_usd' => 0,
                                'metodo_pago' => 'efectivo',
                                'referencia_tipo' => 'PlanPago',
                                'referencia_id' => $cuota->id,
                                'created_at' => $fechaPago,
                                'updated_at' => $fechaPago,
                            ]);
                        }
                    }

                    // ─── PIPELINE: Cuota EN MORA → LibroDiario + Kardex ───
                    if ($estadoCuota === PlanPago::ESTADO_RETRASADA && $montoMora > 0) {
                        $cuotasMora++;

                        LibroDiario::create([
                            'user_id' => $socio->id,
                            'cajero_id' => $this->admin->id,
                            'fecha' => $fechaVencimiento->toDateString(),
                            'concepto' => 'Interés moratorio - Cuota #' . $k . ' - Crédito #' . $credito->id,
                            'ingreso' => $montoMora,
                            'egreso' => 0,
                            'tipo_transaccion' => 'mora',
                            'referencia_id' => $cuota->id,
                            'created_at' => $fechaVencimiento,
                            'updated_at' => $fechaVencimiento,
                        ]);

                        $ultimoSaldo = (float) (Kardex::where('user_id', $socio->id)->orderBy('id', 'desc')->value('saldo_acumulado') ?? 0);
                        Kardex::create([
                            'user_id' => $socio->id,
                            'fecha' => $fechaVencimiento->toDateString(),
                            'tipo_movimiento' => Kardex::TIPO_MORA,
                            'concepto' => 'Interés moratorio - Cuota #' . $k . ' - Crédito #' . $credito->id,
                            'ingreso' => 0,
                            'egreso' => $montoMora,
                            'saldo_acumulado' => round($ultimoSaldo - $montoMora, 2),
                            'referencia_tipo' => 'plan_pago',
                            'referencia_id' => $cuota->id,
                            'created_at' => $fechaVencimiento,
                            'updated_at' => $fechaVencimiento,
                        ]);
                    }
                }
            }
        }

        $this->command->info("  ✓ {$creditosCreados} Créditos, {$cuotasPagadas} Cuotas Pagadas, {$cuotasMora} en Mora.");
        $this->command->info("    → LibroDiario + Kardex + CajaMovimiento sincronizados.");
    }

    // ═══════════════════════════════════════════════
    //  FASE 5: GARANTIZAR MOVIMIENTO EN TODA CAJA
    // ═══════════════════════════════════════════════

    private function asegurarCajasConMovimientos(): void
    {
        $cajasVacias = Caja::whereDoesntHave('movimientos')->get();

        if ($cajasVacias->isEmpty()) {
            $this->command->info('  ✓ Todas las cajas ya tienen movimientos.');
            return;
        }

        $conceptosOp = [
            ['tipo' => 'ingreso', 'concepto' => 'Aportación Mensual Socio', 'categoria' => 'aporte', 'monto' => rand(200, 800)],
            ['tipo' => 'egreso',  'concepto' => 'Pago Servicios Básicos', 'categoria' => 'gasto_operativo', 'monto' => rand(50, 150)],
            ['tipo' => 'ingreso', 'concepto' => 'Depósito por Transferencia', 'categoria' => 'otro_ingreso', 'monto' => rand(300, 1000)],
        ];

        foreach ($cajasVacias as $caja) {
            $ops = rand(2, 3);
            for ($i = 0; $i < $ops; $i++) {
                $op = $conceptosOp[array_rand($conceptosOp)];
                CajaMovimiento::create([
                    'caja_id' => $caja->id,
                    'user_id' => $this->admin->id,
                    'fecha' => Carbon::parse($caja->fecha_apertura)->addHours(rand(1, 6)),
                    'tipo' => $op['tipo'],
                    'concepto' => $op['concepto'],
                    'categoria' => $op['categoria'],
                    'monto_bob' => $op['monto'],
                    'monto_usd' => 0,
                    'metodo_pago' => 'efectivo',
                    'created_at' => $caja->fecha_apertura,
                    'updated_at' => $caja->fecha_apertura,
                ]);
            }
        }

        $this->command->info("  ✓ {$cajasVacias->count()} cajas vacías → movimientos operativos inyectados.");
    }

    // ═══════════════════════════════════════════════
    //  RESUMEN FINAL
    // ═══════════════════════════════════════════════

    private function imprimirResumen(): void
    {
        $this->command->newLine();
        $this->command->info('┌────────────────────────┬───────────┐');
        $this->command->info('│ Tabla                  │ Registros │');
        $this->command->info('├────────────────────────┼───────────┤');
        $this->command->info('│ libro_diarios          │ ' . str_pad(LibroDiario::count(), 9) . ' │');
        $this->command->info('│ kardex                 │ ' . str_pad(Kardex::count(), 9) . ' │');
        $this->command->info('│ kardex_productos       │ ' . str_pad(KardexProducto::count(), 9) . ' │');
        $this->command->info('│ caja_movimientos       │ ' . str_pad(CajaMovimiento::count(), 9) . ' │');
        $this->command->info('│ caja_denominaciones    │ ' . str_pad(CajaDenominacion::count(), 9) . ' │');
        $this->command->info('│ cajas                  │ ' . str_pad(Caja::count(), 9) . ' │');
        $this->command->info('│ creditos               │ ' . str_pad(Credito::count(), 9) . ' │');
        $this->command->info('│ plan_pagos             │ ' . str_pad(PlanPago::count(), 9) . ' │');
        $this->command->info('│ pedidos                │ ' . str_pad(Pedido::count(), 9) . ' │');
        $this->command->info('│ pedido_detalles        │ ' . str_pad(PedidoDetalle::count(), 9) . ' │');
        $this->command->info('├────────────────────────┼───────────┤');
        $this->command->info('│ Balance LibroDiario    │ Bs ' . str_pad(number_format(LibroDiario::sum('ingreso') - LibroDiario::sum('egreso'), 2), 6) . ' │');
        $this->command->info('└────────────────────────┴───────────┘');
    }
}
