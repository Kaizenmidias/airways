<!DOCTYPE html>
<html lang="pt-BR">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>{{ config('app.name') }}</title>
   <style>
      .email-body {
         line-height: 1.6;
         color: #1f2328;
         font-size: 16px;
      }

      .email-body img {
         max-width: 100%;
         height: auto;
         display: block;
      }

      .email-body table {
         width: 100%;
         border-collapse: collapse;
      }

      .email-body th,
      .email-body td {
         border: 1px solid #d1d5db;
         padding: 8px 10px;
         vertical-align: top;
      }

      .email-body blockquote {
         margin: 1em 0;
         padding-left: 16px;
         border-left: 4px solid #e5e7eb;
         color: #4b5563;
      }

      .email-body pre {
         white-space: pre-wrap;
         word-break: break-word;
         background: #f3f4f6;
         padding: 12px;
         border-radius: 10px;
      }
   </style>
</head>
<body style="margin:0;padding:0;background:#f6f8fa;font-family:Arial,Helvetica,sans-serif;color:#1f2328;">
   <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
         <div class="email-body">
            {!! $body !!}
         </div>
      </div>
   </div>
</body>
</html>
