import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

const PublicContainer = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
   return <div className={cn('mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8', className)} {...props} />;
};

export default PublicContainer;
