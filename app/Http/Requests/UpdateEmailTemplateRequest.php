<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmailTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'subject.required' => 'The email subject is required.',
            'body.required' => 'The email body is required.',
        ];
    }
}
