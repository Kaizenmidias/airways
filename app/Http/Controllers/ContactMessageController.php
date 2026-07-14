<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
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
}
