import { cn } from '@/lib/utils';

type TrustBandItem = {
   label: string;
   value?: string;
};

type TrustBandProps = {
   items: TrustBandItem[];
   className?: string;
};

const TrustBand = ({ items, className }: TrustBandProps) => {
   if (!items.length) {
      return null;
   }

   return (
      <div className={cn('grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
         {items.map((item) => (
            <div key={`${item.label}-${item.value ?? ''}`} className="rounded-[22px] bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
               <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
               {item.value && <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-slate-950">{item.value}</p>}
            </div>
         ))}
      </div>
   );
};

export default TrustBand;
