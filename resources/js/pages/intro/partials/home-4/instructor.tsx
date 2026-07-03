import { Button } from '@/components/ui/button';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { Pencil, ShieldCheck, Sparkles, Users2 } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import InstructorSocials from '../instructor-socials';
import Section from '../section';
import { EditorialHeading, SectionCard } from './ui';

const Instructor = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, instructor, customize } = props;
   const instructorSection = getPageSection(page, 'instructor');

   const oddElements = getPropertyArray(instructorSection).filter((_, index) => index % 2 === 0);
   const evenElements = getPropertyArray(instructorSection).filter((_, index) => index % 2 !== 0);

   return (
      <Section customize={customize} pageSection={instructorSection} containerClass="py-12 lg:py-16">
         <div className="grid gap-10">
            <EditorialHeading
               eyebrow={instructorSection?.title || 'Corpo docente'}
               title={instructorSection?.sub_title || 'A presença humana por trás da formação continua sendo um dos nossos diferenciais.'}
               description={
                  instructorSection?.description ||
                  'A seção mantém os dados do CMS e ganha um acabamento editorial mais sofisticado, com destaque para autoridade, experiência e confiança.'
               }
               align="center"
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_1.08fr_1fr] lg:items-stretch">
               <div className="grid gap-4">
                  {oddElements?.map((item, index) => (
                     <SectionCard key={index} className="p-5">
                        <div className="space-y-4">
                           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-primary">
                              <DynamicIcon name={item.icon} className="h-5 w-5" />
                           </div>
                           <div>
                              <h3 className="text-base font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                           </div>
                        </div>
                     </SectionCard>
                  ))}
               </div>

               <SectionCard className="overflow-hidden">
                  <div className="relative">
                     <img
                        className="h-[420px] w-full object-cover object-top"
                        src={instructorSection?.thumbnail || '/assets/images/blank-image.jpg'}
                        alt={instructor ? instructor.user.name : ''}
                     />
                     <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.58))]" />

                     {customize && (
                        <Button asChild size="icon" variant="secondary" className="absolute top-4 right-4 z-20 bg-white text-slate-700 shadow-none hover:bg-slate-100">
                           <Link href={route('settings.account', { tab: 'profile-update' })}>
                              <Pencil className="h-5 w-5" />
                           </Link>
                        </Button>
                     )}

                     <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md">
                           <ShieldCheck className="h-3.5 w-3.5" />
                           Autoridade técnica
                        </div>

                        <div className="mt-4 space-y-2">
                           <h3 className="text-2xl font-semibold tracking-[-0.04em]">{instructor ? instructor.user.name : 'Equipe Airways Academy'}</h3>
                           <p className="text-sm text-slate-200">{instructor?.designation || 'Instrutor e referência de formação'}</p>
                        </div>
                     </div>
                  </div>

                  {instructor && (
                     <div className="space-y-6 p-6">
                        <div className="space-y-3">
                           <p className="text-sm leading-7 text-slate-600">{instructor.biography}</p>
                           <InstructorSocials instructor={instructor} className="py-0" buttonClass="h-9 w-9" />
                        </div>
                     </div>
                  )}
               </SectionCard>

               <div className="grid gap-4">
                  {evenElements?.map((item, index) => (
                     <SectionCard key={index} className="p-5">
                        <div className="space-y-4">
                           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-primary">
                              <DynamicIcon name={item.icon} className="h-5 w-5" />
                           </div>
                           <div>
                              <h3 className="text-base font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h3>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                           </div>
                        </div>
                     </SectionCard>
                  ))}
               </div>
            </div>

            {customize && (
               <div className="mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
                     <Users2 className="h-4 w-4 text-primary" />
                     A edição continua disponível via CMS e ?customize=true.
                  </div>
               </div>
            )}
         </div>
      </Section>
   );
};

export default Instructor;
