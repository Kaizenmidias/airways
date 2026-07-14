<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Requests\SendContactMessageReplyRequest;
use App\Mail\ContactMessageReply;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = ContactMessage::query()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dashboard/contact/index', compact('messages'));
    }

    public function store(StoreContactMessageRequest $request)
    {
        ContactMessage::create($request->validated());

        return back()->with('success', 'Sua mensagem foi enviada com sucesso. Em breve entraremos em contato.');
    }

    public function sendReply(SendContactMessageReplyRequest $request, ContactMessage $contactMessage)
    {
        Mail::to($contactMessage->email)->send(new ContactMessageReply(
            contactMessage: $contactMessage,
            replySubject: $request->validated()['reply_subject'],
            replyBody: $request->validated()['reply_body'],
        ));

        return back()->with('success', 'E-mail enviado com sucesso para o lead.');
    }
}
