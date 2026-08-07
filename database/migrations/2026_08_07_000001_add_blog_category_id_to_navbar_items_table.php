<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->foreignId('blog_category_id')
                ->nullable()
                ->after('course_category_id')
                ->constrained('blog_categories')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('blog_category_id');
        });
    }
};
