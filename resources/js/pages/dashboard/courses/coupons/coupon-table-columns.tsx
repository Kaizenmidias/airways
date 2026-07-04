import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format, isFuture, isPast, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Copy, Pencil } from 'lucide-react';
import CouponForm from './coupon-form';

interface CouponTableColumnsProps {
   courses: Course[];
}

const CouponTableColumns = ({ courses }: CouponTableColumnsProps): ColumnDef<CourseCoupon>[] => {
   const getCouponStatus = (coupon: CourseCoupon) => {
      if (!coupon.is_active) return { label: 'Inativo', variant: 'secondary' as const };
      if (coupon.valid_to && isPast(parseISO(coupon.valid_to))) return { label: 'Expirado', variant: 'destructive' as const };
      if (coupon.valid_from && isFuture(parseISO(coupon.valid_from))) return { label: 'Agendado', variant: 'secondary' as const };
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return { label: 'Esgotado', variant: 'destructive' as const };
      return { label: 'Ativo', variant: 'default' as const };
   };

   const copyCouponCode = (code: string) => {
      navigator.clipboard.writeText(code);
      alert('Código do cupom copiado para a área de transferência!');
   };

   return [
      {
         accessorKey: 'code',
         header: () => <p className="pl-4">Código do cupom</p>,
         cell: ({ row }) => (
            <div className="flex items-center gap-2 pl-4">
               <code className="rounded bg-gray-100 px-2 py-1 font-bold">{row.original.code}</code>
               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCouponCode(row.original.code)}>
                  <Copy className="h-3 w-3" />
               </Button>
            </div>
         ),
      },
      {
         accessorKey: 'discount',
         header: 'Discount',
         cell: ({ row }) => (
            <Badge variant="outline">
               {row.original.discount_type === 'percentage' ? `${row.original.discount}% OFF` : `$${row.original.discount} OFF`}
            </Badge>
         ),
      },
      {
         accessorKey: 'course',
         header: 'Course',
         cell: ({ row }) =>
            row.original.course ? (
               <span className="font-medium">{row.original.course.title}</span>
            ) : (
               <span className="text-primary font-medium">Cupom global</span>
            ),
      },
      {
         accessorKey: 'usage',
         header: 'Usage',
         cell: ({ row }) => {
            const limited = row.original.usage_type === 'limited';

            return limited ? (
               <span>
                  {row.original.used_count} / {row.original.usage_limit}
               </span>
            ) : (
               <span>Ilimitado</span>
            );
         },
      },
      {
         accessorKey: 'valid_from',
         header: 'Valid From',
         cell: ({ row }) => (row.original.valid_from ? format(parseISO(row.original.valid_from), 'dd MMM yyyy HH:mm', { locale: ptBR }) : '-'),
      },
      {
         accessorKey: 'valid_to',
         header: 'Valid To',
         cell: ({ row }) => (row.original.valid_to ? format(parseISO(row.original.valid_to), 'dd MMM yyyy HH:mm', { locale: ptBR }) : '-'),
      },
      {
         accessorKey: 'status',
         header: 'Status',
         cell: ({ row }) => {
            const status = getCouponStatus(row.original);
            return <Badge variant={status.variant}>{status.label}</Badge>;
         },
      },
      {
         id: 'actions',
         header: () => <p className="pr-4 text-end">Ações</p>,
         cell: ({ row }) => {
            const coupon = row.original;

            return (
               <div className="flex items-center justify-end py-2 pr-4">
                  <CouponForm
                     title="Edit Coupon"
                     coupon={coupon}
                     courses={courses}
                     handler={
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                           <Pencil />
                        </Button>
                     }
                  />
               </div>
            );
         },
      },
   ];
};

export default CouponTableColumns;
