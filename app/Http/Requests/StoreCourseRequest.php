<?php

namespace App\Http\Requests;

use App\Enums\ExpiryLimitType;
use App\Enums\CoursePricingType;
use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        // Convert numeric fields
        $this->merge([
            'price' => request('price') ? (float) request('price') : null,
            'discount' => filter_var(request('discount'), FILTER_VALIDATE_BOOLEAN),
            'discount_price' => request('discount_price') ? (float) request('discount_price') : null,
            'drip_content' => filter_var(request('drip_content'), FILTER_VALIDATE_BOOLEAN),
            'is_development' => filter_var(request('is_development'), FILTER_VALIDATE_BOOLEAN),
            'level' => request('level') ?: 'beginner',
            'language' => request('language') ?: 'pt',
            'instructor_id' => (int) request('instructor_id'),
            'course_category_id' => (int) request('course_category_id'),
            'course_category_child_id' => request('course_category_child_id') ? (int) request('course_category_child_id') : null,
            'expiry_duration' => request('expiry_duration') ? (int) request('expiry_duration') : null,
        ]);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $free = CoursePricingType::FREE->value;
        $paid = CoursePricingType::PAID->value;
        $lifetime = ExpiryLimitType::LIFETIME->value;
        $limited = ExpiryLimitType::LIMITED_TIME->value;

        return [
            'title' => 'required|string|max:255',
            'sub_title' => 'nullable|string|max:255',
            'short_description' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'pricing_type' => "required|string|in:$free,$paid",
            'price' => "nullable|numeric|min:1|required_if:pricing_type,$paid",
            'discount' => 'boolean',
            'discount_price' => 'nullable|numeric|min:1|lt:price|required_if:discount,true',
            'expiry_type' => "required|string|in:$lifetime,$limited",
            'expiry_duration' => "nullable|integer|in:30,60,90,365|required_if:expiry_type,$limited",
            'drip_content' => 'boolean',
            'is_development' => 'boolean',
            'thumbnail' => 'nullable|image|max:2048',
            'created_from' => 'nullable|string|in:web,api',
            'instructor_id' => 'required|exists:instructors,id',
            'course_category_id' => 'required|exists:course_categories,id',
            'course_category_child_id' => 'nullable|exists:course_category_children,id',
        ];
    }
}
