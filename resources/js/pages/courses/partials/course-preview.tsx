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

   const startDate = new Date(course.created_at);
   const endDate = new Date(course.expiry_duration);

   if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 'Acesso limitado';
   }

   const days = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

   return `${days} dias de acesso`;
};

const FeatureRow = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) => (
   <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="mt-0.5 rounded-2xl bg-slate-950 p-2 text-white shadow-lg shadow-slate-950/15">{icon}</div>

      <div className="min-w-0">
         <p className="text-sm font-black tracking-[-0.02em] text-slate-950">{label}</p>
         {value ? <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p> : null}
      </div>
   </div>
);

const CoursePreview = () => {
   const { course, system, translate } = usePage<CourseDetailsProps>().props;
   const { frontend } = translate;
   const currency = system.fields['selling_currency'] || 'BRL';
   const coursePrice = formatCurrency(course.price, currency);
   const discountPrice = formatCurrency(course.discount_price, currency);
   const durationLabel = formatCourseDuration(course);
   const accessLabel = formatAccessPeriod(course);

   return (
      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
         <div className="space-y-5 p-5 sm:p-6">
            <div className="relative overflow-hidden rounded-[24px]">
               <img className="h-56 w-full object-cover" src={course.thumbnail ?? '/assets/images/blank-image.jpg'} alt={course.title} />

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

            <div className="space-y-2">
               <p className="text-xs font-bold tracking-[0.28em] text-[#FD122E] uppercase">Investimento</p>
               <h2 className="text-4xl leading-none font-black tracking-[-0.06em] text-slate-950">
                  {course.pricing_type === 'free' ? (
                     'Grátis'
                  ) : course.discount ? (
                     <>
                        <span>{discountPrice}</span>
                        <span className="text-muted-foreground ml-3 text-base font-semibold line-through">{coursePrice}</span>
                     </>
                  ) : (
                     <span>{coursePrice}</span>
                  )}
               </h2>
            </div>

            <EnrollOrPlayerButton />
         </div>

         <div className="border-t border-slate-200/80 bg-slate-50 p-5 sm:p-6">
            <div className="grid gap-3">
               <FeatureRow icon={<Clock3 className="h-4 w-4" />} label="Carga horária" value={durationLabel} />

               <FeatureRow
                  icon={
                     <div className="flex items-center gap-1.5">
                        <Laptop className="h-4 w-4" />
                        <Smartphone className="h-4 w-4" />
                     </div>
                  }
                  label="Todos dispositivos"
               />

               <FeatureRow icon={<NotebookPen className="h-4 w-4" />} label="Exercícios práticos" />

               <FeatureRow icon={<CalendarDays className="h-4 w-4" />} label={accessLabel} />

               <FeatureRow icon={<Headset className="h-4 w-4" />} label="Suporte a dúvidas" />

               <FeatureRow icon={<BadgeCheck className="h-4 w-4" />} label="Certificado" />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
               <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  {frontend.students}
               </span>
               <span className="text-sm font-semibold text-slate-950">{course.enrollments_count || 0}</span>
            </div>
         </div>
      </div>
   );
};

export default CoursePreview;
