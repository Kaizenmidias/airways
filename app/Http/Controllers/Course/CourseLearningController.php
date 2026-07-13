<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseLearningRequest;
use App\Http\Requests\UpdateCourseLearningRequest;
use App\Services\Course\CourseLearningService;

class CourseLearningController extends Controller
{
    public function __construct(
        private CourseLearningService $learningService,
    ) {}

    public function store(StoreCourseLearningRequest $request)
    {
        $this->learningService->createLearning($request->validated());

        return back()->with('success', 'Course learning added successfully');
    }

    public function update(UpdateCourseLearningRequest $request, string $learning)
    {
        $this->learningService->updateLearning($request->validated(), $learning);

        return back()->with('success', 'Course learning updated successfully');
    }

    public function destroy(string $learning)
    {
        $this->learningService->deleteLearning($learning);

        return back()->with('success', 'Course learning deleted successfully');
    }
}
