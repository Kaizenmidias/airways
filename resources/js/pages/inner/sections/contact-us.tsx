import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Section from '@/pages/intro/partials/section';
import { useForm, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone, SendHorizontal } from 'lucide-react';
import { FormEvent, useMemo } from 'react';
import { InnerPageProps } from '..';

const formatPhoneMask = (value: string) => {
   const digits = value.replace(/\D/g, '').slice(0, 11);

   if (digits.length <= 2) {
      return digits ? `(${digits}` : '';
   }

   const area = digits.slice(0, 2);
   const firstPart = digits.slice(2, 7);
   const secondPart = digits.slice(7, 11);

   if (digits.length <= 6) {
      return `(${area})${digits.slice(2)}`;
   }

   if (digits.length <= 10) {
      return `(${area})${digits.slice(2, 6)}-${digits.slice(6)}`;
   }

   return `(${area})${firstPart}-${secondPart}`;
};

const ContactUs = () => {
   const { props } = usePage<InnerPageProps>();
   const { innerPage } = props;
   const contactSection = innerPage.sections.find((section) => section.slug === 'contact_content');
   const contactContent = contactSection?.description || innerPage.description;
   const contactDetails = useMemo(
      () => ({
         email: String(contactSection?.properties?.email || 'contato@airways.com'),
         phone: formatPhoneMask(String(contactSection?.properties?.phone || '(11)99999-9999')),
         address: String(contactSection?.properties?.address || 'Av. Paulista, 1000, São Paulo - SP'),
      }),
      [contactSection],
   );

   const { data, setData, post, reset, processing, errors } = useForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      accepted_privacy: false,
   });

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      post(route('contact-messages.store'), {
         preserveScroll: true,
         onSuccess: () => {
            reset();
         },
      });
   };

   return (
      <Section
         customize={props.customize}
         pageSection={contactSection}
         containerClass="pt-12 pb-20 md:pt-16 lg:pt-20"
         contentClass="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
      >
         <div className="space-y-6">
            <div className="space-y-3">
               <p className="text-sm font-semibold tracking-[0.28em] text-[#FD122E] uppercase">Contato</p>
               <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-4xl">Fale com a Airways</h2>
            </div>

            {contactContent && (
               <div className="prose prose-slate max-w-none prose-headings:font-black prose-p:text-slate-700 prose-li:text-slate-700">
                  <TiptapRenderer>{contactContent}</TiptapRenderer>
               </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
               <Card className="border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                     <div className="bg-primary/10 text-primary rounded-2xl p-3">
                        <Mail className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">E-mail</p>
                        <p className="mt-1 text-sm text-slate-700">{contactDetails.email}</p>
                     </div>
                  </div>
               </Card>

               <Card className="border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                     <div className="bg-primary/10 text-primary rounded-2xl p-3">
                        <Phone className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Telefone</p>
                        <p className="mt-1 text-sm text-slate-700">{contactDetails.phone}</p>
                     </div>
                  </div>
               </Card>

               <Card className="border-slate-200/80 bg-white p-5 shadow-sm sm:col-span-2">
                  <div className="flex items-start gap-4">
                     <div className="bg-primary/10 text-primary rounded-2xl p-3">
                        <MapPin className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Endereço</p>
                        <p className="mt-1 text-sm text-slate-700">{contactDetails.address}</p>
                     </div>
                  </div>
               </Card>
            </div>
         </div>

         <Card className="border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8">
            <div className="mb-6 space-y-2">
               <p className="text-sm font-semibold tracking-[0.24em] text-[#FD122E] uppercase">Envie uma mensagem</p>
               <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">Preencha o formulário</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                     <Label htmlFor="name">Nome</Label>
                     <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Seu nome" />
                     <InputError message={errors.name} />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="email">E-mail</Label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="voce@exemplo.com"
                     />
                     <InputError message={errors.email} />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                     id="phone"
                     name="phone"
                     type="tel"
                     inputMode="tel"
                     maxLength={15}
                     value={data.phone}
                     onChange={(e) => setData('phone', formatPhoneMask(e.target.value))}
                     placeholder="(11)99999-9999"
                  />
                  <InputError message={errors.phone} />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                     id="message"
                     name="message"
                     rows={6}
                     value={data.message}
                     onChange={(e) => setData('message', e.target.value)}
                     placeholder="Conte como podemos ajudar"
                  />
                  <InputError message={errors.message} />
               </div>

               <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <Checkbox
                     id="privacy"
                     checked={data.accepted_privacy}
                     onCheckedChange={(checked) => setData('accepted_privacy', Boolean(checked))}
                     className="mt-0.5"
                  />
                  <span>
                     Li, entendi e estou de acordo com a{' '}
                     <a
                        href="https://escolasuperiordoar.com.br/politica-de-privacidade."
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-slate-950 underline decoration-slate-400 underline-offset-4 hover:text-[#FD122E]"
                     >
                        Política de Privacidade
                     </a>
                     .
                  </span>
               </label>
               <InputError message={errors.accepted_privacy} />

               <LoadingButton type="submit" loading={processing} className="h-12 w-full bg-[#FD122E] font-semibold text-white hover:bg-[#d90f26]">
                  <SendHorizontal className="h-4 w-4" />
                  Enviar mensagem
               </LoadingButton>
            </form>
         </Card>
      </Section>
   );
};

export default ContactUs;
