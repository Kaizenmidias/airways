import AppLogo from '@/components/app-logo';
import DataSortModal from '@/components/data-sort-modal';
import PublicContainer from '@/components/public/public-container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Switch from '@/components/switch';
import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Settings } from 'lucide-react';
import { SharedData } from '@/types/global';
import { getYear } from 'date-fns';

type FooterSection = FooterItem & {
   items?: Array<{ title?: string; url?: string; image?: string }>;
};

const Footer = () => {
   const { props } = usePage<SharedData>();
   const { footer, system, customize, page } = props;

   const sortedItems = Array.isArray(footer?.footer_items) ? [...footer.footer_items].sort((a, b) => a.sort - b.sort) : [];
   const listItems = sortedItems.filter((item): item is FooterSection => item.type === 'list' && item.active);
   const copyrightItem = sortedItems.find((item) => item.type === 'copyright' && item.active);
   const socialMediaItem = sortedItems.find((item) => item.type === 'social_media' && item.active) as FooterSection | undefined;
   const paymentMethodsItem = sortedItems.find((item) => item.type === 'payment_methods' && item.active) as FooterSection | undefined;

   return (
      <footer className="relative border-t border-slate-200 bg-slate-950 text-slate-100">
         {customize && page && (
            <div className="absolute top-6 right-6 z-20">
               <DataSortModal
                  title="Footer Links"
                  data={listItems}
                  handler={
                     <Button size="icon" className="h-10 w-10 rounded-full bg-white text-slate-950 hover:bg-slate-100">
                        <Settings className="h-5 w-5" />
                     </Button>
                  }
                  onOrderChange={(newOrder, setOpen) => {
                     router.post(
                        route('page.section.sort'),
                        {
                           sortedData: newOrder,
                        },
                        { preserveScroll: true, onSuccess: () => setOpen && setOpen(false) },
                     );
                  }}
                  renderContent={(item) => (
                     <Card className="flex w-full items-center justify-between px-4 py-3">
                        <p>{item.name}</p>
                        <div className="flex items-center space-x-2">
                           <Label htmlFor="active">Active</Label>
                           <Switch
                              id="active"
                              defaultChecked={item.active}
                              onCheckedChange={(checked) => {
                                 router.post(route('page.section.update', item.id), {
                                    active: checked,
                                 });
                              }}
                           />
                        </div>
                     </Card>
                  )}
               />
            </div>
         )}

         <div className="border-b border-white/10">
            <PublicContainer className="grid gap-10 py-14 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
               <div className="space-y-6">
                  <Link href="/" className="inline-flex w-full max-w-[210px] items-center sm:max-w-[240px] lg:max-w-[280px]">
                     <AppLogo theme="light" className="!h-auto !w-full max-w-none" />
                  </Link>

                  <p className="max-w-xl text-sm leading-7 text-slate-300">{system.fields.description || system.fields.slogan || system.fields.footer_text}</p>

                  <div className="flex flex-wrap gap-3">
                     {system.fields.email && (
                        <Button asChild variant="outline" className="h-10 rounded-full border-white/15 bg-white/5 px-4 text-slate-100 hover:bg-white/10">
                           <a href={`mailto:${system.fields.email}`}>{system.fields.email}</a>
                        </Button>
                     )}
                     {system.fields.phone && (
                        <Button asChild variant="outline" className="h-10 rounded-full border-white/15 bg-white/5 px-4 text-slate-100 hover:bg-white/10">
                           <a href={`tel:${system.fields.phone}`}>{system.fields.phone}</a>
                        </Button>
                     )}
                  </div>

                  {socialMediaItem?.items?.length ? (
                     <div className="flex flex-wrap gap-3">
                        {socialMediaItem.items.map((socialItem, idx) => {
                           if (!socialItem?.url) {
                              return null;
                           }

                           return (
                              <Button
                                 key={`${socialItem.title || 'social'}-${idx}`}
                                 size="icon"
                                 variant="outline"
                                 className="h-11 w-11 rounded-full border-white/10 bg-white/5 text-slate-100 hover:bg-white hover:text-slate-950"
                                 asChild
                              >
                                 <a href={socialItem.url} target="_blank" rel="noreferrer">
                                    <DynamicIcon name={(socialItem as any).icon || 'circle'} className="h-5 w-5" />
                                    <span className="sr-only">{socialItem.title}</span>
                                 </a>
                              </Button>
                           );
                        })}
                     </div>
                  ) : null}
               </div>

               <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {listItems.map((section) => (
                     <div key={section.id} className="space-y-4">
                        <p className="text-sm font-semibold tracking-[0.08em] text-slate-100 uppercase">{section.title}</p>
                        <ul className="space-y-3 text-sm text-slate-300">
                           {section.items?.map((item, index) => {
                              const href = item?.url || '';

                              if (!href || section.slug === 'address') {
                                 return (
                                    <li key={`${section.id}-${index}`} className="leading-6">
                                       {item?.title}
                                    </li>
                                 );
                              }

                              return (
                                 <li key={`${section.id}-${index}`}>
                                    <Link href={href} className="transition-colors hover:text-white">
                                       {item.title}
                                    </Link>
                                 </li>
                              );
                           })}
                        </ul>
                     </div>
                  ))}
               </div>
            </PublicContainer>
         </div>

         {paymentMethodsItem?.items?.length ? (
            <div className="border-b border-white/10">
               <PublicContainer className="py-7">
                  <p className="text-sm font-semibold tracking-[0.08em] text-slate-100 uppercase">{paymentMethodsItem.title}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                     {paymentMethodsItem.items.map((paymentItem, idx) => (
                        <div key={`${paymentItem.image || 'payment'}-${idx}`} className="flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4">
                           {paymentItem.image ? <img src={paymentItem.image} alt={paymentItem.title || `Payment method ${idx + 1}`} className="h-5 w-auto object-contain" /> : null}
                        </div>
                     ))}
                  </div>
               </PublicContainer>
            </div>
         ) : null}

         <div className="border-t border-white/10">
            <PublicContainer className="flex flex-col gap-4 py-6 text-center text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:text-left">
               <p>{copyrightItem?.title || `${system.fields.footer_text || system.fields.name} - ${getYear(new Date())}`}</p>
               <p>{system.fields.footer_link || system.fields.address}</p>
            </PublicContainer>
         </div>
      </footer>
   );
};

export default Footer;
