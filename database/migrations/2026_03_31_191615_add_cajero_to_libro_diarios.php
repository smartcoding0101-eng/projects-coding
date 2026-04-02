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
        Schema::table('libro_diarios', function (Blueprint $table) {
            $table->foreignId('cajero_id')->nullable()->after('user_id')->constrained('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('libro_diarios', function (Blueprint $table) {
            $table->dropForeign(['cajero_id']);
            $table->dropColumn('cajero_id');
        });
    }
};
