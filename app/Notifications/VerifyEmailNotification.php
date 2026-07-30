<?php

namespace App\Notifications;

use App\Services\EmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(config('auth.verification.expire', 5)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ],
        );
    }

    public function toMail(object $notifiable): MailMessage
    {
        $data = [
            'user' => $notifiable,
            'url' => $this->verificationUrl($notifiable),
            'count' => config('auth.verification.expire', 5),
        ];

        $templateService = app(EmailTemplateService::class);
        $template = $templateService->get('verification');

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
            ->subject('Verifique seu endereço de e-mail')
            ->view('mail.email-verification', $data);
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
