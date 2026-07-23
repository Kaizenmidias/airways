<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->boolean('display_courses_in_menu')
                ->default(true)
                ->after('course_category_id');
        });

        DB::table('navbar_items')->update(['display_courses_in_menu' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->dropColumn('display_courses_in_menu');
        });
    }
};
