import { cn } from '@/lib/utils';
import Eyebrow from './eyebrow';
import type { ReactNode } from 'react';

type EditorialHeadingProps = {
   eyebrow?: string;
   title: string;
   description?: string;
   align?: 'left' | 'center';
   className?: string;
   children?: ReactNode;
};

const EditorialHeading = ({ eyebrow, title, description, align = 'left', className, children }: EditorialHeadingProps) => {
   return (
      <div className={cn('space-y-4', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
         {eyebrow && <Eyebrow className={align === 'center' ? 'justify-center' : ''} label={eyebrow} />}

         <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">{title}</h2>
            {description && <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p>}
         </div>

         {children}
      </div>
   );
};

export default EditorialHeading;
