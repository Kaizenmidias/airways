<?php

namespace App\Notifications;

use App\Services\EmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstructorApprovalNotification extends Notification
{
    use Queueable;

    public function __construct(private array $data) {}

    public function via(object $notifiable): array
    {
        if ($notifiable->role !== 'admin') {
            return ['mail', 'database'];
        }

        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $data = [
            'user' => $notifiable,
            'status' => $this->data['status'],
            'feedback' => $this->data['feedback'],
        ];

        $templateService = app(EmailTemplateService::class);
        $template = $templateService->get('instructor_approval');

        if ($template) {
            $subject = $templateService->renderString(data_get($template->fields, 'subject'), $data);
            $body = $templateService->renderString(data_get($template->fields, 'body'), $data);

            if (filled($subject) && filled($body)) {
                return (new MailMessage)
                    ->subject($subject)
                    ->view('mail.dynamic', ['body' => $body]);
            }
        }

        return (new MailMessage)
            ->subject('Atualização da solicitação para professor')
            ->view('mail.instructor-approval', $data);
    }

    public function toArray(object $notifiable): array
    {
        $url = $notifiable->role !== 'admin'
            ? ($this->data['status'] === 'approved'
                ? route('dashboard')
                : route('student.index', ['tab' => 'instructor']))
            : route('instructors.applications');

        $feedback = $notifiable->role === 'student' || $notifiable->role === 'instructor'
            ? $this->data['feedback']
            : 'Uma solicitação para professor foi enviada para aprovação do administrador';

        return [
            'title' => 'Status da solicitação para professor: ' . $this->data['status'],
            'body' => $feedback,
            'url' => $url,
        ];
    }
}
