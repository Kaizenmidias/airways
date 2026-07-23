import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import { formatCurrency } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { BadgeCheck, CalendarDays, Clock3, Laptop, Play, Smartphone, NotebookPen, Headset } from 'lucide-react';
import { ReactNode } from 'react';
import { CourseDetailsProps } from '../show';
import EnrollOrPlayerButton from './course-player-button';

const parseLessonDuration = (duration?: string) => {
   if (!duration) {
      return 0;
   }

   const parts = duration.split(':').map((part) => Number(part || 0));

   if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
   }

   if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
   }

   const numericDuration = Number(duration);
   return Number.isFinite(numericDuration) ? numericDuration * 60 : 0;
};

const formatCourseDuration = (course: Course) => {
   const totalSeconds = course.sections.reduce((totalTime, section) => {
      return (
         totalTime +
         section.section_lessons.reduce((sectionTime, lesson) => {
            return sectionTime + parseLessonDuration(lesson.duration);
         }, 0)
      );
   }, 0);

   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);

   if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
   }

   if (hours > 0) {
      return `${hours}h`;
   }

   return `${minutes}min`;
};

const formatAccessPeriod = (course: Course) => {
   if (course.expiry_type !== 'limited_time' || !course.expiry_duration) {
      return 'Acesso vitalício';
   }

   const accessDays = Number(course.expiry_duration);

   if (Number.isFinite(accessDays) && accessDays > 0) {
      return accessDays === 365 ? '1 ano de acesso' : `${accessDays} dias de acesso`;
   }

   const startDate = new Date(course.created_at);
   const endDate = new Date(course.expiry_duration as string);

   if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 'Acesso limitado';
   }

   const days = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

   return days === 365 ? '1 ano de acesso' : `${days} dias de acesso`;
};

const FeatureRow = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) => (
   <div className="flex items-center gap-3 py-0.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-500">
         {icon}
      </div>

      <p className="min-w-0 text-sm leading-6 font-semibold text-slate-800">
         <span className="font-black text-slate-900">{label}</span>
         {value ? `: ${value}` : ''}
      </p>
   </div>
);

const CoursePreview = () => {
   const { course, system } = usePage<CourseDetailsProps>().props;
   const currency = system.fields['selling_currency'] || 'BRL';
   const coursePrice = formatCurrency(course.price, currency);
   const discountPrice = formatCurrency(course.discount_price, currency);
   const durationLabel = formatCourseDuration(course);
   const accessLabel = formatAccessPeriod(course);

   return (
      <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
         <div className="space-y-4 p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-[20px]">
               <img className="h-52 w-full object-cover" src={course.thumbnail ?? '/assets/images/blank-image.jpg'} alt={course.title} />

               {course.preview && (
                  <Dialog>
                     <DialogTrigger asChild>
                        <button className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-950/80 backdrop-blur-sm transition-transform hover:scale-110">
                           <Play className="h-6 w-6 text-white" />
                        </button>
                     </DialogTrigger>

                     <DialogContent className="overflow-hidden p-0 md:min-w-3xl">
                        <VideoPlayer
                           source={{
                              type: 'video' as const,
                              sources: [
                                 {
                                    src: course.preview,
                                    type: 'video/mp4' as const,
                                 },
                              ],
                           }}
                        />
                     </DialogContent>
                  </Dialog>
               )}
            </div>

            <div className="space-y-1">
               <h2 className="text-3xl leading-none font-black tracking-[-0.06em] text-slate-950 sm:text-[2.15rem]">
                  {course.pricing_type === 'free' ? (
                     'Grátis'
                  ) : course.discount ? (
                     <>
                        <span>{discountPrice}</span>
                        <span className="text-muted-foreground ml-3 text-sm font-semibold line-through sm:text-base">{coursePrice}</span>
                     </>
                  ) : (
                     <span>{coursePrice}</span>
                  )}
               </h2>
            </div>

            <EnrollOrPlayerButton />
         </div>

         <div className="space-y-0.5 border-t border-slate-200/80 px-4 py-3 sm:px-5">
            <FeatureRow icon={<Clock3 className="h-4 w-4" />} label="Carga horária" value={durationLabel} />

            <FeatureRow
               icon={<Laptop className="h-4 w-4" />}
               label="Todos dispositivos"
            />

            <FeatureRow icon={<NotebookPen className="h-4 w-4" />} label="Exercícios práticos" />

            <FeatureRow icon={<CalendarDays className="h-4 w-4" />} label={accessLabel} />

            <FeatureRow icon={<Headset className="h-4 w-4" />} label="Suporte a dúvidas" />

            <FeatureRow icon={<BadgeCheck className="h-4 w-4" />} label="Certificado" />
         </div>
      </div>
   );
};

export default CoursePreview;
