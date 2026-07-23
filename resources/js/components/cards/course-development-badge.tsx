import { cn } from '@/lib/utils';

interface Props {
   enabled?: boolean;
   className?: string;
}

const CourseDevelopmentBadge = ({ enabled, className }: Props) => {
   if (!enabled) {
      return null;
   }

   return (
      <div
         className={cn(
            'absolute top-3 left-3 z-10 rounded-full bg-[#FD122E] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg',
            className,
         )}
      >
         Em desenvolvimento
      </div>
   );
};

export default CourseDevelopmentBadge;
