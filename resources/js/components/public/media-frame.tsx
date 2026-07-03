import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

type MediaFrameProps = HTMLAttributes<HTMLDivElement> & {
   image?: string;
   video?: string;
   alt?: string;
   caption?: string;
   children?: ReactNode;
};

const MediaFrame = ({ className, image, video, alt = '', caption, children, ...props }: MediaFrameProps) => {
   return (
      <div
         className={cn(
            'relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_24px_64px_rgba(15,23,42,0.12)]',
            className,
         )}
         {...props}
      >
         <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(15,23,42,0.06)_100%)]" />

         {image && <img src={image} alt={alt} className="relative z-10 h-full w-full object-cover" />}
         {video && <video src={video} className="relative z-10 h-full w-full object-cover" autoPlay muted loop playsInline />}

         {caption && (
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-950/75 to-transparent px-5 py-4 text-sm font-medium text-white">
               {caption}
            </div>
         )}

         {children}
      </div>
   );
};

export default MediaFrame;
