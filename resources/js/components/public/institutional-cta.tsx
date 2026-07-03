import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type InstitutionalCTAProps = {
   title: string;
   description?: string;
   primaryLabel?: string;
   primaryHref?: string;
   secondaryLabel?: string;
   secondaryHref?: string;
   className?: string;
};

const InstitutionalCTA = ({
   title,
   description,
   primaryLabel,
   primaryHref,
   secondaryLabel,
   secondaryHref,
   className,
}: InstitutionalCTAProps) => {
   return (
      <div
         className={cn(
            'rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:px-8',
            className,
         )}
      >
         <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
               <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Airways Academy</p>
               <h3 className="max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">{title}</h3>
               {description && <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p>}
            </div>

            <div className="flex flex-wrap gap-3">
               {primaryLabel && primaryHref && (
                  <Button asChild className="h-11 rounded-full bg-primary px-5 text-white hover:bg-primary/90">
                     <Link href={primaryHref}>
                        {primaryLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                  </Button>
               )}

               {secondaryLabel && secondaryHref && (
                  <Button asChild variant="outline" className="h-11 rounded-full px-5">
                     <Link href={secondaryHref}>{secondaryLabel}</Link>
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
};

export default InstitutionalCTA;
