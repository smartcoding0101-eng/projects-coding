<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plan_pagos', function (Blueprint $table) {
            $table->decimal('monto_mora', 15, 2)->default(0)->after('interes_pagado')
                  ->comment('Interés moratorio calculado por retraso');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_pagos', function (Blueprint $table) {
            $table->dropColumn('monto_mora');
        });
    }
};
