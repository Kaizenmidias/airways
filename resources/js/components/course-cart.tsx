import { SharedData } from '@/types/global';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

const CourseCart = ({ iconOnly = false }: { iconOnly?: boolean }) => {
   const { cartCount } = usePage<SharedData>().props;

      return (
         <Link href={route('course-cart.index')}>
            <div className="relative">
               {cartCount && cartCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                     {cartCount}
                  </span>
               ) : null}

               <Button
                  variant={iconOnly ? 'ghost' : 'outline'}
                  size="icon"
                  className={iconOnly ? 'relative h-9 w-9 rounded-full border-0 bg-transparent p-0 text-white shadow-none hover:bg-white/10 hover:text-white' : 'relative h-9 w-9 rounded-full border-white/20 bg-white/10 p-0 text-white shadow-none hover:bg-white/15 hover:text-white'}
               >
                  <ShoppingCart className="!h-5 !w-5 text-white" />
               </Button>
            </div>
         </Link>
      );
};

export default CourseCart;
