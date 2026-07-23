import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, formatCurrency, getCourseDuration } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { Clock, Heart, Star, Users } from 'lucide-react';
import CourseDevelopmentBadge from './course-development-badge';

interface Props {
   course: Course;
   type?: 'grid' | 'list';
   className?: string;
   wishlists?: CourseWishlist[];
}

const CourseCard6 = ({ course, type = 'grid', className, wishlists }: Props) => {
   const { props } = usePage<SharedData>();
   const { user } = props.auth;
   const { button, common, frontend } = props.translate;

   const isWishlisted = wishlists?.find((wishlist) => wishlist.course_id === course.id);
   const currency = props.system.fields['selling_currency'] || 'BRL';
   const coursePrice = formatCurrency(course.price, currency);
   const discountPrice = formatCurrency(course.discount_price, currency);

   const handleWishlist = () => {
      if (isWishlisted) {
         router.delete(route('course-wishlists.destroy', { id: isWishlisted.id }));
      } else {
         router.post(route('course-wishlists.store', { user_id: user?.id, course_id: course.id }));
      }
   };

   return (
      <Card className={cn('flex w-full items-center', className)}>
         <CardHeader className="p-0">
            <div className="relative">
               <div className="p-2 pb-0">
                  <Link
                     href={route('course.details', {
                        slug: course.slug,
                        id: course.id,
                     })}
                  >
                     <div className={cn('relative h-[190px] overflow-hidden rounded-lg', type === 'grid' && 'w-full max-w-[240px]')}>
                        <img
                           src={course.thumbnail || '/assets/images/blank-image.jpg'}
                           alt={course.title}
                           className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                           onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/assets/images/blank-image.jpg';
                           }}
                        />
                        <CourseDevelopmentBadge enabled={course.is_development} />
                     </div>
                  </Link>
               </div>

               {wishlists && (
                  <TooltipProvider delayDuration={0}>
                     <Tooltip>
                        <TooltipTrigger className="absolute top-2 right-2 z-10">
                           <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white" onClick={handleWishlist}>
                              <Heart className={cn('h-4 w-4', isWishlisted && 'text-red-500')} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p> {isWishlisted ? button.remove_from_wishlist : button.add_to_wishlist}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         </CardHeader>

         <CardContent className="p-4">
            <div className="text-secondary-foreground mb-1 flex items-center gap-1.5 text-xs">
               <Users className="h-3 w-3" />
               <span>
                  {course.enrollments_count || 0} {course.enrollments_count || 0 > 0 ? common.students : frontend.student}
               </span>

               <Clock className="ml-2 h-3 w-3" />
               <span>{getCourseDuration(course, 'readable')}</span>
            </div>

            <Link
               className="space-y-3"
               href={route('course.details', {
                  slug: course.slug,
                  id: course.id,
               })}
            >
               <p className="hover:text-secondary-foreground font-semibold">{course.title}</p>

               <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{course.average_rating || 0}</span>
                  <span>
                     ({course.reviews_count || 0} {common.reviews})
                  </span>
               </p>
            </Link>
         </CardContent>

         <CardFooter className="flex items-center justify-between p-4 pt-0">
            <p className="capitalize">
               {course.pricing_type === 'free' ? (
                  common.free
               ) : course.discount ? (
                  <>
                     <span className="font-semibold">
                        {discountPrice}
                     </span>
                     <span className="text-muted-foreground ml-2 text-sm font-medium line-through">
                        {coursePrice}
                     </span>
                  </>
               ) : (
                  <>
                     <span className="font-semibold">{coursePrice}</span>
                  </>
               )}
            </p>

            <Button asChild variant="outline" className="border-secondary-light hover:bg-background hover:border-primary px-2.5">
               <Link
                  href={route('course.details', {
                     slug: course.slug,
                     id: course.id,
                  })}
               >
                  {button.learn_more}
               </Link>
            </Button>
         </CardFooter>
      </Card>
   );
};

export default CourseCard6;
