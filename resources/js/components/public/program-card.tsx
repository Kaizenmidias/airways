import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight, Clock3, GraduationCap } from 'lucide-react';

type ProgramCardProps = {
   title: string;
   description?: string;
   href?: string;
   category?: string;
   duration?: string;
   level?: string;
   className?: string;
};

const ProgramCard = ({ title, description, href, category, duration, level, className }: ProgramCardProps) => {
   const content = (
      <div
         className={cn(
            'group flex h-full flex-col rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1',
            className,
         )}
      >
         <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
               {category && <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{category}</p>}
               <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-primary group-hover:text-white">
               <GraduationCap className="h-5 w-5" />
            </div>
         </div>

         {description && <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>}

         <div className="mt-6 flex flex-wrap gap-2">
            {duration && (
               <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  <Clock3 className="h-3.5 w-3.5" />
                  {duration}
               </span>
            )}
            {level && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{level}</span>}
         </div>

         <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span>Ver programa</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
         </div>
      </div>
   );

   if (!href) {
      return content;
   }

   return <Link href={href}>{content}</Link>;
};

export default ProgramCard;
