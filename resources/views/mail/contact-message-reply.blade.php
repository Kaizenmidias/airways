<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
   <title>{{ config('app.name') }}</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>

<body style="margin:0;padding:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
   <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f8fb;padding:32px 16px;">
      <tr>
         <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
               <tr>
                  <td style="padding:32px 32px 16px;">
                     <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#fd122e;font-weight:700;">
                        Airways Academy
                     </div>
                     <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;color:#0f172a;">{{ $replySubject }}</h1>
                     <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#475569;">
                        Olá, {{ $contactMessage->name }}. Recebemos sua mensagem pelo formulário do site e estamos respondendo por e-mail.
                     </p>
                  </td>
               </tr>

               <tr>
                  <td style="padding:0 32px 24px;">
                     <div style="border:1px solid #e5e7eb;border-radius:14px;padding:18px 20px;background:#fafafa;">
                        <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:8px;">
                           Nossa resposta
                        </div>
                        <div style="font-size:15px;line-height:1.75;color:#334155;white-space:pre-line;">{{ $replyBody }}</div>
                     </div>
                  </td>
               </tr>

               <tr>
                  <td style="padding:0 32px 32px;">
                     <div style="border-top:1px solid #e5e7eb;padding-top:20px;">
                        <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#64748b;font-weight:700;margin-bottom:10px;">
                           Dados do lead
                        </div>
                        <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#334155;"><strong>Nome:</strong> {{ $contactMessage->name }}</p>
                        <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#334155;"><strong>E-mail:</strong> {{ $contactMessage->email }}</p>
                        <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#334155;"><strong>Telefone:</strong> {{ $contactMessage->phone ?? '--' }}</p>
                        <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#475569;white-space:pre-line;"><strong>Mensagem original:</strong>
{{ $contactMessage->message }}</p>
                     </div>
                  </td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</body>

</html>
