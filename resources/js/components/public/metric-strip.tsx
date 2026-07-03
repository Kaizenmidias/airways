import { cn } from '@/lib/utils';

type MetricItem = {
   value: string;
   label: string;
   detail?: string;
};

type MetricStripProps = {
   items: MetricItem[];
   className?: string;
};

const MetricStrip = ({ items, className }: MetricStripProps) => {
   if (!items.length) {
      return null;
   }

   return (
      <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
         {items.map((item) => (
            <div key={`${item.label}-${item.value}`} className="rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
               <p className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{item.value}</p>
               <p className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
               {item.detail && <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>}
            </div>
         ))}
      </div>
   );
};

export default MetricStrip;
