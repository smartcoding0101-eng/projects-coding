<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AUDITORÍA: Añadir SoftDeletes a compras_convenio para preservar
     * la trazabilidad histórica de compras de convenio de afiliados.
     * Ninguna compra puede eliminarse físicamente — solo se marca como eliminada.
     */
    public function up(): void
    {
        Schema::table('compras_convenio', function (Blueprint $table) {
            $table->softDeletes()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('compras_convenio', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
