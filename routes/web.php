<?php

use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\JobCircularController;
use App\Http\Controllers\SubscribeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home')->middleware('customize');
Route::get('demo/{slug}', [HomeController::class, 'demo'])->name('home.demo')->middleware('customize');
Route::get('job-circulars/{job_circular}', [JobCircularController::class, 'show'])->name('job-circulars.show');

// course page
Route::controller(CourseController::class)->group(function () {
    Route::get('category/{category}/{category_child?}', 'category_courses')->name('category.courses')->middleware('customize');
    Route::get('courses/details/{slug}/{id}', 'show')->name('course.details');
    Route::get('courses/{category}/{category_child?}', function (string $category, ?string $category_child = null) {
        return redirect()->route('category.courses', array_merge([
            'category' => $category,
            'category_child' => $category_child,
        ], request()->query()), 301);
    })->middleware('customize');
});

Route::get('instructors/{instructor}', [InstructorController::class, 'show'])->name('instructors.show');
Route::resource('subscribes', SubscribeController::class)->only(['index', 'store']);
Route::post('contact-us', [ContactMessageController::class, 'store'])->name('contact-messages.store');
