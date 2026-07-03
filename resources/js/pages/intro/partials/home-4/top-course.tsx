import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { File, FileQuestion, FileText, Image, Play, Video } from 'lucide-react';
import Section from '../section';
import { EditorialHeading, MediaFrame, SectionCard } from './ui';

const TopCourse = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, topCourse, customize } = props;
   const topCourseSection = getPageSection(page, 'top_course');
   const videoTypes = ['video', 'video_url'];

   return (
      <Section customize={customize} pageSection={topCourseSection} containerClass="py-12 lg:py-20">
         <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <EditorialHeading
               eyebrow={topCourseSection?.title || 'Programa em destaque'}
               title={topCourseSection?.sub_title || 'Uma experiência de formação com narrativa clara, material robusto e apresentação premium.'}
               description={
                  topCourseSection?.description ||
                  'Mantivemos o vídeo, os módulos e o conteúdo do CMS, mas a estrutura visual agora conversa com um posicionamento corporativo e aeronáutico.'
               }
            />

            {topCourse ? (
               <div className="space-y-6">
                  <MediaFrame className="relative">
                     <img className="h-[260px] w-full object-cover object-center sm:h-[360px]" src={topCourse.thumbnail ?? '/assets/images/blank-image.jpg'} alt="" />

                     {topCourse.preview && (
                        <Dialog>
                           <DialogTrigger asChild>
                              <button className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/20 transition-colors hover:bg-slate-950/10">
                                 <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md">
                                    <Play className="h-7 w-7 text-white" />
                                 </span>
                              </button>
                           </DialogTrigger>

                           <DialogContent className="overflow-hidden p-0 md:min-w-3xl">
                              <VideoPlayer
                                 source={{
                                    type: 'video' as const,
                                    sources: [
                                       {
                                          src: topCourse.preview,
                                          type: 'video/mp4' as const,
                                       },
                                    ],
                                 }}
                              />
                           </DialogContent>
                        </Dialog>
                     )}
                  </MediaFrame>

                  <SectionCard className="p-6 sm:p-8">
                     <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:items-start">
                        <div className="space-y-4">
                           <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                              Curso em destaque
                           </div>

                           <h3 className="text-2xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">{topCourse.title}</h3>
                           <p className="text-sm leading-7 text-slate-600">
                              Estrutura do curso, módulos e aulas continuam vindos do CMS, só que agora apresentados em um bloco editorial mais limpo.
                           </p>
                        </div>

                        <Accordion
                           type="single"
                           collapsible
                           className="space-y-3"
                           defaultValue={topCourse.sections.length > 0 ? (topCourse.sections[0].id as string) : ''}
                        >
                           {topCourse.sections.map((section, index) => (
                              <AccordionItem key={section.id} value={section.id as string} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                 <AccordionTrigger className="cursor-pointer px-4 py-4 text-left text-base font-semibold hover:no-underline">
                                    Módulo {index + 1}: {section.title}
                                 </AccordionTrigger>
                                 <AccordionContent className="space-y-1 border-t border-slate-100 px-4 pb-4 pt-2">
                                    {section.section_lessons.length > 0 ? (
                                       <>
                                          {section.section_lessons.map((lesson) => (
                                             <div key={lesson.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                   <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                                      {videoTypes.includes(lesson.lesson_type) && <Video className="h-4 w-4" />}

                                                      {['document', 'iframe'].includes(lesson.lesson_type) && <File className="h-4 w-4" />}

                                                      {lesson.lesson_type === 'text' && <FileText className="h-4 w-4" />}

                                                      {lesson.lesson_type === 'image' && <Image className="h-4 w-4" />}
                                                   </div>

                                                   <p className="text-slate-700">{lesson.title}</p>
                                                </div>

                                                {videoTypes.includes(lesson.lesson_type) && <span className="text-slate-500">{lesson.duration}</span>}
                                             </div>
                                          ))}

                                          {section.section_quizzes.map((quiz) => (
                                             <div key={quiz.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                   <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                                      <FileQuestion className="h-4 w-4" />
                                                   </div>

                                                   <p className="text-slate-700">{quiz.title}</p>
                                                </div>

                                                <span className="text-slate-500">{quiz.duration}</span>
                                             </div>
                                          ))}
                                       </>
                                    ) : (
                                       <div className="px-4 py-3 text-center text-sm text-slate-500">Nenhuma aula adicionada</div>
                                    )}
                                 </AccordionContent>
                              </AccordionItem>
                           ))}
                        </Accordion>
                     </div>
                  </SectionCard>
               </div>
            ) : (
               <SectionCard className="p-8 text-center text-sm text-slate-600">
                  Não há curso em destaque configurado no momento.
               </SectionCard>
            )}
         </div>
      </Section>
   );
};

export default TopCourse;
