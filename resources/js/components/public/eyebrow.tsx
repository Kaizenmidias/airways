import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type EyebrowProps = HTMLAttributes<HTMLDivElement> & {
   label?: string;
};

const Eyebrow = ({ className, label, children, ...props }: EyebrowProps) => {
   const text = label || children;

   if (!text) {
      return null;
   }

   return (
      <div className={cn('inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500', className)} {...props}>
         <span className="bg-primary h-1.5 w-1.5 rounded-full" />
         <span>{text}</span>
      </div>
   );
};

export default Eyebrow;
