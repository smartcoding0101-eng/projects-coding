<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\KardexProducto;
use Illuminate\Support\Facades\DB;

class InventarioService
{
    /**
     * Get products with low stock alerts.
     */
    public function getQuiebresDeStock()
    {
        return Producto::whereRaw('stock_actual <= stock_minimo')
                       ->where('activo', true)
                       ->get();
    }

    /**
     * Ajustar stock manual via Kardex.
     */
    public function ajustarStock(Producto $producto, int $cantidad, string $tipoMovimiento, string $concepto, $adminId)
    {
        DB::beginTransaction();
        try {
            $saldoAnterior = $producto->stock_actual;
            $nuevoSaldo = $tipoMovimiento === 'ingreso' ? $saldoAnterior + $cantidad : $saldoAnterior - $cantidad;

            if ($nuevoSaldo < 0) {
                throw new \Exception("El saldo no puede ser negativo.");
            }

            $producto->update(['stock_actual' => $nuevoSaldo]);

            KardexProducto::create([
                'producto_id' => $producto->id,
                'tipo_movimiento' => $tipoMovimiento,
                'cantidad' => $cantidad,
                'saldo_stock' => $nuevoSaldo,
                'concepto' => $concepto,
                'usuario_admin_id' => $adminId
            ]);

            DB::commit();
            return $producto;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
