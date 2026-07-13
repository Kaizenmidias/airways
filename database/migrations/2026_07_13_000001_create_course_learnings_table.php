<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_learnings', function (Blueprint $table) {
            $table->id();
            $table->integer('sort')->default(0);
            $table->text('learning')->nullable();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_learnings');
    }
};
