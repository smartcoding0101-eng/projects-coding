<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            // Step 1: Temporarily expand enum to accept old values
            DB::statement("ALTER TABLE pedidos MODIFY COLUMN tipo_entrega ENUM('recojo_tienda','envio_domicilio','recojo_local','envio') DEFAULT 'recojo_tienda'");

            // Step 2: Migrate old values to new ones
            DB::table('pedidos')->where('tipo_entrega', 'recojo_local')->update(['tipo_entrega' => 'recojo_tienda']);
            DB::table('pedidos')->where('tipo_entrega', 'envio')->update(['tipo_entrega' => 'envio_domicilio']);

            // Step 3: Shrink enum back to only valid values
            DB::statement("ALTER TABLE pedidos MODIFY COLUMN tipo_entrega ENUM('recojo_tienda','envio_domicilio') DEFAULT 'recojo_tienda'");
        }
    }

    public function down(): void
    {
        // No rollback needed
    }
};
