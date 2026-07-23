import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LandingLayout from '@/layouts/landing-layout';
import { SharedData } from '@/types/global';
import { Head, Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props extends SharedData {
   course: Course;
}

const Development = ({ course, system }: Props) => {
   const siteName = system.fields?.name || 'Airways Academy';
   const pageTitle = `${course.title} | ${siteName}`;
   const message = 'Este curso está em desenvolvimento, em breve estará disponível.';

   return (
      <>
         <Head title={pageTitle}>
            <meta name="description" content={message} />
         </Head>

         <section className="relative flex min-h-screen overflow-hidden bg-slate-950 px-6 py-24 text-white sm:px-10 lg:px-14 lg:py-32">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,18,46,0.2),transparent_30%),linear-gradient(180deg,#02070f_0%,#04101f_100%)]" />

            <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center text-center">
               <Card className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
                  <div className="space-y-4">
                     {course.sub_title ? <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ccccccb8]">{course.sub_title}</p> : null}
                     <h1 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">{course.title}</h1>
                     <div className="mx-auto h-1.5 w-20 rounded-full bg-[#FD122E]" />
                  </div>

                  <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">{message}</p>

                  <div className="mt-10 flex justify-center">
                     <Button asChild className="rounded-full bg-primary px-6 text-white hover:bg-primary/90">
                        <Link href={route('home')}>Voltar para a página inicial</Link>
                     </Button>
                  </div>
               </Card>
            </div>
         </section>
      </>
   );
};

Development.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} navbarHeight={false} />;

export default Development;
