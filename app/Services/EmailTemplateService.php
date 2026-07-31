<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Blade;
use Throwable;

class EmailTemplateService
{
    private const TYPE = 'email_template';

    public function defaults(): array
    {
        return [
            'verification' => [
                'title' => 'Verificação de e-mail',
                'subject' => 'Verifique seu endereço de e-mail',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Olá, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">Obrigado por se cadastrar. Clique no botão abaixo para verificar seu endereço de e-mail:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Verificar endereço de e-mail</a>
</p>
<p style="margin: 0 0 12px;">Este link de verificação expira em {{ $count }} minutos.</p>
<p style="margin: 0 0 20px;">Se você não criou uma conta, nenhuma ação é necessária.</p>
<p style="margin: 28px 0 0;">Atenciosamente,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'password_reset' => [
                'title' => 'Redefinição de senha',
                'subject' => 'Redefinição de senha',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Olá, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Redefinir senha</a>
</p>
<p style="margin: 0 0 12px;">Este link de redefinição expira em {{ $count }} minutos.</p>
<p style="margin: 0 0 20px;">Se você não solicitou essa redefinição, nenhuma ação é necessária.</p>
<p style="margin: 28px 0 0;">Atenciosamente,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'change_email' => [
                'title' => 'Confirmação de alteração de e-mail',
                'subject' => 'Confirme sua alteração de e-mail',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Olá, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">Recebemos uma solicitação para alterar seu endereço de e-mail. Confirme a alteração clicando abaixo:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Confirmar alteração</a>
</p>
<p style="margin: 0 0 20px;">Se você não solicitou essa alteração, pode ignorar este e-mail.</p>
<p style="margin: 28px 0 0;">Atenciosamente,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'course_approval' => [
                'title' => 'Aprovação de curso',
                'subject' => 'Atualização do status de aprovação do curso',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Atualização do status de aprovação do curso</h1>
@if ($status === 'approved')
   <h2 style="font-size: 20px; margin: 0 0 16px;">🎉 Parabéns, {{ $user->name }}!</h2>
   <p style="margin: 0 0 20px;">Seu curso "{{ $course->title }}" foi aprovado e já está disponível na plataforma.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Feedback da revisão:</h3>
         {!! $feedback !!}
      </div>
   @endif
   <p style="margin: 0 0 20px;">Os alunos já podem se matricular no seu curso. Compartilhe para alcançar mais pessoas!</p>
   <p style="margin: 0 0 20px;">
      <a href="{{ route('course.details', ['slug' => $course->slug, 'id' => $course->id]) }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Ver curso</a>
   </p>
@else
   <h2 style="font-size: 20px; margin: 0 0 16px;">Status do curso: {{ ucfirst($status) }}</h2>
   <p style="margin: 0 0 12px;">Seu curso "{{ $course->title }}" foi atualizado para <strong>{{ ucfirst($status) }}</strong>.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Feedback da revisão:</h3>
         {!! $feedback !!}
      </div>
   @endif
   <p style="margin: 0 0 20px;">
      <a href="{{ route('courses.edit', $course->id) }}" style="display:inline-block;padding:12px 20px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Atualizar curso</a>
   </p>
@endif
<p style="margin: 28px 0 0;">Atenciosamente,<br>{{ config('mail.from.name') }} Equipe</p>
BLADE,
            ],
            'instructor_approval' => [
                'title' => 'Aprovação de professor',
                'subject' => 'Atualização da solicitação para professor',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Atualização da solicitação para professor</h1>
@if ($status === 'approved')
   <h2 style="font-size: 20px; margin: 0 0 16px;">🎉 Parabéns, {{ $user->name }}!</h2>
   <p style="margin: 0 0 20px;">Sua solicitação para professor foi aprovada. Agora você já pode criar e gerenciar cursos na plataforma.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Observações da equipe:</h3>
         {!! $feedback !!}
      </div>
   @endif
   <p style="margin: 0 0 20px;">Comece criando seu primeiro curso e compartilhe seu conhecimento com estudantes do mundo todo.</p>
   <p style="margin: 0 0 20px;">
      <a href="{{ route('dashboard') }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Ir para o painel</a>
   </p>
@else
   <h2 style="font-size: 20px; margin: 0 0 16px;">Status da solicitação: {{ ucfirst($status) }}</h2>
   <p style="margin: 0 0 12px;">Sua solicitação para professor foi atualizada para <strong>{{ ucfirst($status) }}</strong>.</p>
   @if (!empty($feedback))
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
         <h3 style="font-weight: 600; margin: 0 0 8px;">Feedback da revisão:</h3>
         {!! $feedback !!}
      </div>
   @endif
   @if ($status === 'rejected')
      <p style="margin: 0 0 20px;">
         <a href="{{ route('student.index', ['tab' => 'instructor']) }}" style="display:inline-block;padding:12px 20px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Solicitar novamente</a>
      </p>
   @endif
@endif
<p style="margin: 28px 0 0;">Atenciosamente,<br>{{ config('mail.from.name') }} Equipe</p>
BLADE,
            ],
        ];
    }

    public function ensureDefaults(): void
    {
        foreach ($this->defaults() as $subType => $template) {
            $setting = Setting::where('type', self::TYPE)->where('sub_type', $subType)->first();

            if (!$setting) {
                Setting::create([
                    'type' => self::TYPE,
                    'sub_type' => $subType,
                    'title' => $template['title'],
                    'fields' => [
                        'subject' => $template['subject'],
                        'body' => $template['body'],
                    ],
                ]);

                continue;
            }

            $fields = $setting->fields ?? [];
            if ($this->isLegacyDefaultTemplate($subType, $fields)) {
                $setting->update([
                    'title' => $template['title'],
                    'fields' => [
                        'subject' => $template['subject'],
                        'body' => $template['body'],
                    ],
                ]);
            }
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

    public function find(string $id): ?Setting
    {
        $this->ensureDefaults();

        return Setting::where('type', self::TYPE)->find($id);
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

    public function sampleData(string $subType): array
    {
        return match ($subType) {
            'verification' => [
                'user' => (object) ['name' => 'Lucas Dos Santos Rocha'],
                'url' => 'https://airwaysacademy.com.br/verify-email/2/7b1c4bb0a9edcd75fffc41c08347852725eaebde?expires=1785443527&signature=c7302083dac5d1506334cbc62aefd648d07fa806a3402a5485cbc7e14f454a13',
                'count' => 5,
            ],
            'password_reset' => [
                'user' => (object) ['name' => 'Lucas Dos Santos Rocha'],
                'url' => 'https://airwaysacademy.com.br/password-reset/preview-token',
                'count' => 60,
            ],
            'change_email' => [
                'user' => (object) ['name' => 'Lucas Dos Santos Rocha'],
                'app' => app('system_settings'),
                'url' => 'https://airwaysacademy.com.br/account/change-email/save?token=preview-token',
            ],
            'course_approval' => [
                'user' => (object) ['name' => 'Lucas Dos Santos Rocha'],
                'course' => (object) [
                    'title' => 'Curso de Navegação Aérea',
                    'slug' => 'curso-de-navegacao-aerea',
                    'id' => 1,
                ],
                'status' => 'approved',
                'feedback' => '<p>Seu curso ficou excelente. Apenas revise alguns detalhes finais e está pronto.</p>',
            ],
            'instructor_approval' => [
                'user' => (object) ['name' => 'Lucas Dos Santos Rocha'],
                'status' => 'approved',
                'feedback' => '<p>Perfil aprovado com sucesso. Bem-vindo à equipe de instrutores.</p>',
            ],
            default => [],
        };
    }

    public function previewHtml(string $subType, array $data): string
    {
        $template = $this->get($subType);

        if (!$template) {
            return '';
        }

        $body = $this->renderString(data_get($template->fields, 'body'), $data);

        return view('mail.dynamic', ['body' => $body])->render();
    }

    public function renderPreview(string $subType, array $data): string
    {
        return $this->previewHtml($subType, $data);
    }

    private function isLegacyDefaultTemplate(string $subType, array $fields): bool
    {
        $legacy = $this->legacyDefaults()[$subType] ?? null;

        if (!$legacy) {
            return false;
        }

        return data_get($fields, 'subject') === $legacy['subject']
            && data_get($fields, 'body') === $legacy['body'];
    }

    private function legacyDefaults(): array
    {
        return [
            'verification' => [
                'subject' => 'Verifique seu endereÃ§o de e-mail',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Hello, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">Thank you for registering with us. Please verify your email address by clicking the button below:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Verificar EndereÃ§o de E-mail</a>
</p>
<p style="margin: 0 0 12px;">This verification link will expire in {{ $count }} minutes.</p>
<p style="margin: 0 0 20px;">Se vocÃª nÃ£o criou uma conta, nenhuma aÃ§Ã£o Ã© necessÃ¡ria.</p>
<p style="margin: 28px 0 0;">Thanks,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'password_reset' => [
                'subject' => 'RedefiniÃ§Ã£o de senha',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Hello, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">You requested a password reset. Click the button below to create a new password:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Redefinir Senha</a>
</p>
<p style="margin: 0 0 12px;">This password reset link will expire in {{ $count }} minutes.</p>
<p style="margin: 0 0 20px;">Se vocÃª nÃ£o solicitou a redefiniÃ§Ã£o, nenhuma aÃ§Ã£o Ã© necessÃ¡ria.</p>
<p style="margin: 28px 0 0;">Thanks,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'change_email' => [
                'subject' => 'Confirme sua alteraÃ§Ã£o de e-mail',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Hello, {{ $user->name }}!</h1>
<p style="margin: 0 0 20px;">We received a request to change your e-mail address. Confirm the change by clicking below:</p>
<p style="margin: 0 0 20px;">
   <a href="{{ $url }}" style="display:inline-block;padding:12px 20px;background:#0969da;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Confirmar alteraÃ§Ã£o</a>
</p>
<p style="margin: 0 0 20px;">Se vocÃª nÃ£o solicitou essa alteraÃ§Ã£o, pode ignorar este e-mail.</p>
<p style="margin: 28px 0 0;">Thanks,<br>{{ config('mail.from.name') }}</p>
BLADE,
            ],
            'course_approval' => [
                'subject' => 'AtualizaÃ§Ã£o do status de aprovaÃ§Ã£o do curso',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Course Approval Status Update</h1>
@if ($status === 'approved')
   <h2 style="font-size: 20px; margin: 0 0 16px;">ðŸŽ‰ Congratulations, {{ $user->name }}!</h2>
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
                'subject' => 'AtualizaÃ§Ã£o da solicitaÃ§Ã£o para professor',
                'body' => <<<'BLADE'
<h1 style="font-size: 24px; margin: 0 0 16px;">Instructor Application Status Update</h1>
@if ($status === 'approved')
   <h2 style="font-size: 20px; margin: 0 0 16px;">ðŸŽ‰ Congratulations, {{ $user->name }}!</h2>
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
}
