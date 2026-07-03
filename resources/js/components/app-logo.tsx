import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';

const AppLogo = ({ className, theme }: { theme?: 'light' | 'dark'; className?: string }) => {
   const { system } = usePage<SharedData>().props;
   const fallback = system.fields.name || 'Airways Academy';
   const lightLogo = system.fields.logo_light || '';
   const darkLogo = system.fields.logo_dark || '';

   const fallbackMark = (
      <div className={cn('inline-flex items-center gap-3 text-sm font-semibold tracking-[0.18em] uppercase text-slate-950', className)}>
         <span className="bg-primary h-2 w-2 rounded-full" />
         <span>{fallback}</span>
      </div>
   );

   if (theme && theme === 'dark') {
      return darkLogo ? <img src={darkLogo} alt={fallback} className={cn('block h-6 w-auto', className)} /> : fallbackMark;
   }

   if (theme && theme === 'light') {
      return lightLogo ? <img src={lightLogo} alt={fallback} className={cn('block h-6 w-auto', className)} /> : fallbackMark;
   }

   if (!darkLogo && !lightLogo) {
      return fallbackMark;
   }

   return (
      <>
         <img src={darkLogo} alt={fallback} className={cn('block h-6 w-auto dark:hidden', className)} />
         <img src={lightLogo} alt={fallback} className={cn('hidden h-6 w-auto dark:block', className)} />
      </>
   );
};

export default AppLogo;
