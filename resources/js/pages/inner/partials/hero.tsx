import { Link } from '@inertiajs/react';
import { ChevronsRight, Home } from 'lucide-react';

interface Props {
   innerPage: Page;
}

const Hero = ({ innerPage }: Props) => {
   return (
      <div className="relative overflow-y-hidden bg-slate-950 pt-[212px] pb-[100px] text-white">
         <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <h1 className="text-4xl font-bold md:text-[44px]">{innerPage.name}</h1>
            <div className="flex items-center gap-1 text-slate-300">
               <Link href="/">
                  <Home size={18} />
               </Link>
               <ChevronsRight size={14} />
               <span className="text-sm">{innerPage.slug}</span>
            </div>
         </div>
      </div>
   );
};

export default Hero;
