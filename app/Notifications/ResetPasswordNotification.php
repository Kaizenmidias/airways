<?php

namespace App\Notifications;

use App\Services\EmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $data = [
            'url' => url(route('password.reset', [
                'token' => $this->token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false)),
            'user' => $notifiable,
            'count' => config('auth.passwords.' . config('auth.defaults.passwords') . '.expire'),
        ];

        $templateService = app(EmailTemplateService::class);
        $template = $templateService->get('password_reset');

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
            ->subject('Redefinição de senha')
            ->view('mail.reset-password', $data);
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
