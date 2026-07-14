import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

const ContactMessagesTableColumns = (): ColumnDef<ContactMessage>[] => {
   return [
      {
         accessorKey: 'name',
         header: () => <span>Nome</span>,
         cell: ({ row }) => <div className="px-3 py-1 font-medium">{row.getValue('name')}</div>,
      },
      {
         accessorKey: 'email',
         header: () => <span>E-mail</span>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.getValue('email')}</div>,
      },
      {
         accessorKey: 'phone',
         header: () => <span>Telefone</span>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.getValue('phone') || '--'}</div>,
      },
      {
         accessorKey: 'message',
         header: () => <span>Mensagem</span>,
         cell: ({ row }) => <div className="max-w-[420px] px-3 py-1 text-sm text-slate-700">{row.getValue('message')}</div>,
      },
      {
         accessorKey: 'accepted_privacy',
         header: () => <span>Privacidade</span>,
         cell: ({ row }) => (
            <div className="px-3 py-1">
               <Badge variant={row.getValue('accepted_privacy') ? 'default' : 'secondary'}>{row.getValue('accepted_privacy') ? 'Aceito' : 'Não'}</Badge>
            </div>
         ),
      },
      {
         accessorKey: 'created_at',
         header: () => <span>Recebido em</span>,
         cell: ({ row }) => (
            <div className="text-muted-foreground px-3 py-1 text-sm">
               {new Date(row.getValue('created_at')).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
               })}
            </div>
         ),
      },
   ];
};

export default ContactMessagesTableColumns;
