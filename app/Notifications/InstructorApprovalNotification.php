<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InstructorApprovalNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private array $data) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        if ($notifiable->role !== 'admin') {
            return ['mail', 'database'];
        }

        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Atualização da solicitação para professor')
            ->view('mail.instructor-approval', [
                'user' => $notifiable,
                'status' => $this->data['status'],
                'feedback' => $this->data['feedback'],
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
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
