<?php

namespace App\Mail;

use App\Models\User;
use App\Services\EmailTemplateService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ChangeEmailVerification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $app;
    public $verificationUrl;

    public function __construct(User $user, $app, $verificationUrl)
    {
        $this->user = $user;
        $this->app = $app;
        $this->verificationUrl = $verificationUrl;
    }

    public function envelope(): Envelope
    {
        $data = $this->templateData();
        $templateService = app(EmailTemplateService::class);
        $template = $templateService->get('change_email');

        $subject = 'Confirme sua alteração de e-mail';

        if ($template) {
            $renderedSubject = $templateService->renderString(data_get($template->fields, 'subject'), $data);

            if (filled($renderedSubject)) {
                $subject = $renderedSubject;
            }
        }

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        $data = $this->templateData();
        $templateService = app(EmailTemplateService::class);
        $template = $templateService->get('change_email');

        if ($template) {
            $body = $templateService->renderString(data_get($template->fields, 'body'), $data);

            if (filled($body)) {
                return new Content(
                    view: 'mail.dynamic',
                    with: [
                        'body' => $body,
                    ],
                );
            }
        }

        return new Content(
            view: 'mail.email-change-verification',
            with: $data,
        );
    }

    public function attachments(): array
    {
        return [];
    }

    private function templateData(): array
    {
        return [
            'user' => $this->user,
            'app' => $this->app,
            'url' => $this->verificationUrl,
        ];
    }
}
