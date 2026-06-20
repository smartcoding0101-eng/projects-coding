<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Amplía el ENUM tipo_pago para incluir efectivo y transferencia.
     * Requerido para permitir al administrador cambiar el método de pago
     * cuando un cliente paga por un medio distinto al registrado (ej: QR observado → Efectivo).
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE pedidos MODIFY COLUMN tipo_pago ENUM('qr', 'credito_asociado', 'efectivo', 'transferencia') NOT NULL");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            // Revertir solo si no hay datos con los nuevos valores
            DB::statement("ALTER TABLE pedidos MODIFY COLUMN tipo_pago ENUM('qr', 'credito_asociado') NOT NULL");
        }
    }
};
