<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkCourseActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => 'required|string|in:delete,development_on,development_off,approve,draft,pending',
            'course_ids' => 'required|array|min:1',
            'course_ids.*' => 'required|integer|exists:courses,id',
        ];
    }
}
