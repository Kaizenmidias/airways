<?php

namespace App\Notifications;

use App\Models\Course\Course;
use App\Services\EmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseApprovalNotification extends Notification
{
    use Queueable;

    public function __construct(private Course $course, private array $data)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $data = [
            'user' => $notifiable,
            'course' => $this->course,
            'status' => $this->data['status'],
            'feedback' => $this->data['feedback'],
        ];

        $templateService = app(EmailTemplateService::class);
        $template = $templateService->get('course_approval');

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
            ->subject('Atualização do status de aprovação do curso')
            ->view('mail.course-approval', $data);
    }

    public function toArray(object $notifiable): array
    {
        $id = $this->course->id;
        $slug = $this->course->slug;

        $url = route('course.details', [$slug, $id]);

        if ($this->course->created_from == 'api') {
            $url = airways_frontend_url("/courses/$slug/$id");
        }

        return [
            'title' => $this->course->status . ': ' . $this->course->title,
            'body' => $this->data['feedback'],
            'url' => $url,
        ];
    }
}
