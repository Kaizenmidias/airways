<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->foreignId('course_category_id')
                ->nullable()
                ->after('subtitle')
                ->constrained('course_categories')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('course_category_id');
        });
    }
};
