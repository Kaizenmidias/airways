<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Blade;
use Throwable;

class EmailTemplateService
{
    private const TYPE = 'email_template';

    /**
     * Default templates used for fresh installs and fallback rendering.
     *
     * @return array<string, array<string, string>>
     */
    public function defaults(): array
    {
        return [
            'verification' => [
                'title' => 'Email Verification',
                'subject' => 'Verifique seu endereço de e-mail',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Hello, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">Thank you for registering with us. Please verify your email address by clicking the button below:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Verificar Endereço de E-mail</a>
</p>
<p style="margin: 0 0 12px;">This verification link will expire in {{ $count }} minutes.</p>
<p style="margin: 0 0 20px;">Se você não criou uma conta, nenhuma ação é necessária.</p>
<p style="margin: 28px 0 0;">Thanks,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'password_reset' => [
                'title' => 'Password Reset',
                'subject' => 'Redefinição de senha',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Hello, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">You requested a password reset. Click the button below to create a new password:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Redefinir Senha</a>
</p>
<p style="margin: 0 0 12px;">This password reset link will expire in {{ $count }} minutes.</p>
<p style="margin: 0 0 20px;">Se você não solicitou a redefinição, nenhuma ação é necessária.</p>
<p style="margin: 28px 0 0;">Thanks,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'change_email' => [
                'title' => 'Email Change Verification',
                'subject' => 'Confirme sua alteração de e-mail',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Hello, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">We received a request to change your e-mail address. Confirm the change by clicking below:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Confirmar alteração</a>
</p>
<p style="margin: 0 0 20px;">Se você não solicitou essa alteração, pode ignorar este e-mail.</p>
<p style="margin: 28px 0 0;">Thanks,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'course_approval' => [
                'title' => 'Course Approval',
                'subject' => 'Atualização do status de aprovação do curso',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Course Approval Status Update</h1>
@if ($status === 'approved')
   <h2 style="font-size: 20px; margin: 0 0 16px;">🎉 Congratulations, {{ $user->name }}!</h2>
   <p style="margin: 0 0 20px;">Your course "{{ $course->title }}" has been approved and is now live on our platform.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Reviewer Feedback:</h3>
         {!! $feedback !!}
      </div>
   @endif
   <p style="margin: 0 0 20px;">Students can now enroll in your course. Promote it to reach more learners!</p>
   <p style="margin: 0 0 20px;">
      <a href="{{ route('course.details', ['slug' => $course->slug, 'id' => $course->id]) }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">View Course</a>
   </p>
@else
   <h2 style="font-size: 20px; margin: 0 0 16px;">Course status: {{ ucfirst($status) }}</h2>
   <p style="margin: 0 0 12px;">Your course "{{ $course->title }}" status has been updated to <strong>{{ ucfirst($status) }}</strong>.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Reviewer Feedback:</h3>
         {!! $feedback !!}
      </div>
   @endif
   <p style="margin: 0 0 20px;">
      <a href="{{ route('courses.edit', $course->id) }}" style="display:inline-block;padding:12px 20px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Update Course</a>
   </p>
@endif
<p style="margin: 28px 0 0;">Best regards,<br>{{ config('mail.from.name') }} Team</p>
BLADE,
            ],
            'instructor_approval' => [
                'title' => 'Instructor Approval',
                'subject' => 'Atualização da solicitação para professor',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Instructor Application Status Update</h1>
@if ($status === 'approved')
   <h2 style="font-size: 20px; margin: 0 0 16px;">🎉 Congratulations, {{ $user->name }}!</h2>
   <p style="margin: 0 0 20px;">Your instructor application has been approved! You can now create and manage courses on our platform.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Notes from our team:</h3>
         {!! $feedback !!}
      </div>
   @endif
   <p style="margin: 0 0 20px;">Start creating your first course and share your knowledge with students around the world!</p>
   <p style="margin: 0 0 20px;">
      <a href="{{ route('dashboard') }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard</a>
   </p>
@else
   <h2 style="font-size: 20px; margin: 0 0 16px;">Application status: {{ ucfirst($status) }}</h2>
   <p style="margin: 0 0 12px;">Your instructor application status has been updated to <strong>{{ ucfirst($status) }}</strong>.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Reviewer Feedback:</h3>
         {!! $feedback !!}
      </div>
   @endif
   @if ($status === 'rejected')
      <p style="margin: 0 0 20px;">
         <a href="{{ route('student.index', ['tab' => 'instructor']) }}" style="display:inline-block;padding:12px 20px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Re-apply</a>
      </p>
   @endif
@endif
<p style="margin: 28px 0 0;">Best regards,<br>{{ config('mail.from.name') }} Team</p>
BLADE,
            ],
        ];
    }

    public function ensureDefaults(): void
    {
        foreach ($this->defaults() as $subType => $template) {
            Setting::firstOrCreate(
                ['type' => self::TYPE, 'sub_type' => $subType],
                [
                    'title' => $template['title'],
                    'fields' => [
                        'subject' => $template['subject'],
                        'body' => $template['body'],
                    ],
                ],
            );
        }
    }

    public function all()
    {
        $this->ensureDefaults();

        return Setting::where('type', self::TYPE)->orderBy('title')->get();
    }

    public function get(string $subType): ?Setting
    {
        $this->ensureDefaults();

        return Setting::where('type', self::TYPE)->where('sub_type', $subType)->first();
    }

    public function update(string $id, array $data): Setting
    {
        $setting = Setting::findOrFail($id);
        $setting->update(['fields' => $data]);

        return $setting->fresh();
    }

    public function renderString(?string $template, array $data, string $fallback = ''): string
    {
        if (!filled($template)) {
            return $fallback;
        }

        try {
            return Blade::render($template, $data);
        } catch (Throwable) {
            return $fallback;
        }
    }
}
