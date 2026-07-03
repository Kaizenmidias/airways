import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
   <div
      className={cn(
         'inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 shadow-sm',
         className,
      )}
   >
      <span className="h-2 w-2 rounded-full bg-primary" />
      <span>{children}</span>
   </div>
);

export const EditorialHeading = ({
   eyebrow,
   title,
   description,
   className,
   align = 'left',
}: {
   eyebrow?: ReactNode;
   title?: ReactNode;
   description?: ReactNode;
   className?: string;
   align?: 'left' | 'center';
}) => (
   <div className={cn('space-y-4', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      {eyebrow && <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      {title && <h2 className="text-3xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[3.25rem]">{title}</h2>}
      {description && <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{description}</p>}
   </div>
);

export const SectionCard = ({ children, className }: { children: ReactNode; className?: string }) => (
   <div className={cn('rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]', className)}>{children}</div>
);

export const MediaFrame = ({ children, className }: { children: ReactNode; className?: string }) => (
   <div className={cn('overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-[0_20px_70px_rgba(15,23,42,0.08)]', className)}>
      {children}
   </div>
);

export const MetricValue = ({ value, label }: { value: ReactNode; label: ReactNode }) => (
   <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-6">
      <div className="text-3xl leading-none font-semibold tracking-[-0.04em] text-slate-950">{value}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{label}</div>
   </div>
);
