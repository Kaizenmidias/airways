import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Props {
   enrollment: ExamEnrollment;
   showDate?: boolean;
   className?: string;
}

const EnrollmentStatus = ({ enrollment, showDate = true, className }: Props) => {
   const isActive = enrollment.is_active;
   const expiryDate = enrollment.expiry_date ? parseISO(enrollment.expiry_date) : null;
   const daysRemaining = expiryDate ? differenceInDays(expiryDate, new Date()) : null;

   return (
      <div className={cn('flex items-center gap-2', className)}>
         <Badge variant={isActive ? 'default' : 'destructive'} className="gap-1">
            {isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {isActive ? 'Ativo' : 'Expirado'}
         </Badge>

         {showDate && enrollment.enrollment_type === 'limited' && expiryDate && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
               <Calendar className="h-3.5 w-3.5" />
               {isActive && daysRemaining !== null && daysRemaining > 0 ? (
                  <span>
                     {daysRemaining} dia{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
                  </span>
               ) : (
                  <span>Expirado em {format(expiryDate, 'dd MMM yyyy', { locale: ptBR })}</span>
               )}
            </div>
         )}

         {enrollment.enrollment_type === 'lifetime' && (
            <Badge variant="secondary" className="text-xs">
               Acesso vitalício
            </Badge>
         )}
      </div>
   );
};

export default EnrollmentStatus;
