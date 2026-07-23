import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, usePage } from '@inertiajs/react';
import { Star, TrendingUp } from 'lucide-react';
import { Separator } from '../ui/separator';
import CourseDevelopmentBadge from './course-development-badge';

interface Props {
   course: Course;
   className?: string;
}

const CourseCard5 = ({ course, className }: Props) => {
   const { props } = usePage<SharedData>();
   const { common } = props.translate;
   const currency = props.system.fields['selling_currency'] || 'BRL';
   const coursePrice = formatCurrency(course.price, currency);
   const discountPrice = formatCurrency(course.discount_price, currency);

   return (
      <Card className={cn('flex items-center', className)}>
         <CardHeader className="p-0">
            <Link
               href={route('course.details', {
                  slug: course.slug,
                  id: course.id,
               })}
            >
               <div className="relative h-[260px] w-[250px] overflow-hidden rounded-l-lg">
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
         </CardHeader>

         <div className="flex w-full flex-col justify-between p-5">
            <CardContent className="p-0">
               <div className="mb-6 flex items-center justify-between">
                  <p className="text-secondary-foreground text-xs uppercase">{course.course_category.title}</p>

                  <div className="flex items-center gap-2">
                     {course.is_development ? <p className="text-lg font-semibold text-muted-foreground">Em breve</p> : course.discount ? <p className="pt-1 text-gray-300 line-through">{coursePrice}</p> : null}

                     {course.is_development ? null : course.pricing_type === 'free' ? (
                        <p className="text-lg font-semibold">{common.free}</p>
                     ) : (
                        <p className="text-lg font-semibold">{course.discount ? discountPrice : coursePrice}</p>
                     )}
                  </div>
               </div>

               <Link
                  href={route('course.details', {
                     slug: course.slug,
                     id: course.id,
                  })}
               >
                  <p className="hover:text-secondary-foreground text-lg font-semibold">{course.title}</p>
               </Link>

               <div className="flex items-center gap-8 py-5">
                  <p className="flex items-center gap-1.5">
                     <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                     <span className="font-medium">{course.average_rating || 0}</span>
                     <span className="text-muted-foreground text-sm">
                        ({course.reviews_count || 0} {common.reviews})
                     </span>
                  </p>
               </div>
            </CardContent>

            <Separator className="bg-muted" />

            <CardFooter className="flex items-center gap-5 p-0 pt-6">
               <p className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">{course.level}</span>
               </p>
            </CardFooter>
         </div>
      </Card>
   );
};

export default CourseCard5;
