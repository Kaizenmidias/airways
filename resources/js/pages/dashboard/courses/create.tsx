import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/layout';
import { shouldShowCollaborativeUi } from '@/lib/airways';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { ReactNode, useMemo } from 'react';

interface Props extends SharedData {
   prices: string[];
   expiries: string[];
   categories: CourseCategory[];
   instructors: Instructor[];
}

const Index = (props: Props) => {
   const { props: pageProps } = usePage<Props>();
   const { translate, airways } = pageProps;
   const { input, button, common } = translate;

   const user = props.auth.user;
   const { prices, expiries, categories, instructors, system } = props;
   const showInstructorSelector = user.role === 'admin' && shouldShowCollaborativeUi(airways, system.sub_type);
   const defaultInstructorId = String(user.instructor_id ?? instructors[0]?.id ?? '');

   const { data, setData, post, errors, processing } = useForm({
      title: '',
      sub_title: '',
      short_description: '',
      description: '',
      status: user.role === 'admin' ? 'approved' : 'draft',
      pricing_type: 'paid',
      price: '',
      discount: false as boolean,
      discount_price: '',
      expiry_type: 'lifetime',
      expiry_duration: '30',
      drip_content: false as boolean,
      is_development: false as boolean,
      thumbnail: null,
      instructor_id: showInstructorSelector ? '' : defaultInstructorId,
      course_category_id: '',
      course_category_child_id: '',
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('courses.store'));
   };

   const transformedInstructors = instructors.map((instructor) => ({
      label: instructor.user.name,
      value: instructor.id as string,
   }));

   const selectedCategory = useMemo(
      () => categories.find((category) => String(category.id) === String(data.course_category_id)),
      [categories, data.course_category_id],
   );

   const selectedChildCategory = useMemo(
      () =>
         selectedCategory?.category_children?.find((child) => String(child.id) === String(data.course_category_child_id)) ?? null,
      [selectedCategory, data.course_category_child_id],
   );

   const coursePricingLabels: Record<string, string> = {
      free: 'Grátis',
      paid: 'Pago',
   };

   const courseExpiryLabels: Record<string, string> = {
      lifetime: 'Vitalício',
      limited_time: 'Tempo limitado',
   };

   const accessDurationOptions = [
      { value: '30', label: '30 dias' },
      { value: '60', label: '60 dias' },
      { value: '90', label: '90 dias' },
      { value: '365', label: '1 ano' },
   ];

   return (
      <Card className="container p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               {/* Left Column */}
               <div className="space-y-4">
                  <div>
                     <Label>{input.title} *</Label>
                     <Input name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder={input.title_placeholder} />
                     <InputError message={errors.title} />
                  </div>

                  <div>
                     <Label>{input.sub_title}</Label>
                     <Input name="sub_title" value={data.sub_title} onChange={(e) => onHandleChange(e, setData)} placeholder="Ex.: Grand School" />
                     <InputError message={errors.sub_title} />
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
                     <Checkbox id="is_development" checked={Boolean(data.is_development)} onCheckedChange={(checked) => setData('is_development', checked === true)} />
                     <div className="space-y-0.5">
                        <Label htmlFor="is_development" className="cursor-pointer">
                           Em desenvolvimento
                        </Label>
                        <p className="text-xs text-muted-foreground">Ao ativar, o curso exibirá uma página de aviso em vez da página normal.</p>
                     </div>
                  </div>

                  <div>
                     <Label>{input.short_description}</Label>
                     <Textarea
                        rows={5}
                        name="short_description"
                        value={data.short_description}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.short_description_placeholder}
                     />
                     <InputError message={errors.short_description} />
                  </div>

                  <div>
                     <Label>{input.description}</Label>
                     <TiptapEditor
                        ssr={true}
                        output="html"
                        placeholder={{
                           paragraph: input.description_placeholder,
                           imageCaption: input.description_placeholder,
                        }}
                        contentMinHeight={256}
                        contentMaxHeight={640}
                        initialContent={data.description}
                        onContentChange={(value) =>
                           setData((prev) => ({
                              ...prev,
                              description: value as string,
                           }))
                        }
                     />
                     <InputError message={errors.description} />
                  </div>
               </div>

               {/* Right Column */}
               <div className="space-y-4">
                  {showInstructorSelector && (
                     <div>
                        <Label htmlFor="instructor_id">{input.course_instructor} *</Label>
                        <Combobox
                           defaultValue={data.instructor_id as string}
                           data={transformedInstructors || []}
                           placeholder={input.course_instructor}
                           onSelect={(selected) => setData('instructor_id', selected.value)}
                        />
                        <InputError message={errors.instructor_id} />
                     </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                     <div>
                        <Label htmlFor="course_category_id">{input.category} *</Label>
                        <Combobox
                           data={categories.map((category) => ({
                              id: category.id,
                              label: category.title,
                              value: String(category.id),
                           }))}
                           placeholder={input.category_placeholder}
                           defaultValue={String(data.course_category_id || '')}
                           onSelect={(selected) => {
                              setData('course_category_id', String(selected.id));
                              setData('course_category_child_id', '');
                           }}
                        />
                        <InputError message={errors.course_category_id} />
                     </div>

                     {selectedCategory?.category_children?.length ? (
                        <div>
                           <Label htmlFor="course_category_child_id">Subcategoria</Label>
                           <Combobox
                              data={selectedCategory.category_children.map((child) => ({
                                 id: child.id,
                                 label: child.title,
                                 value: String(child.id),
                              }))}
                              placeholder="Selecione uma subcategoria"
                              defaultValue={selectedChildCategory ? String(selectedChildCategory.id) : ''}
                              onSelect={(selected) => setData('course_category_child_id', String(selected.id))}
                           />
                           <InputError message={errors.course_category_child_id} />
                        </div>
                     ) : null}

                  </div>

                  <div>
                     <Label>{input.pricing_type} *</Label>
                     <RadioGroup
                        defaultValue={data.pricing_type as string}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('pricing_type', value)}
                     >
                        {prices.map((price) => (
                           <div key={price} className="flex items-center space-x-2">
                              <RadioGroupItem className="cursor-pointer" id={price} value={price} />
                              <Label htmlFor={price} className="capitalize">
                                 {coursePricingLabels[price] ?? price}
                              </Label>
                           </div>
                        ))}
                     </RadioGroup>
                     <InputError message={errors.pricing_type} />

                     <Accordion collapsible type="single" value={data.pricing_type as string}>
                        <AccordionItem value={prices[1]} className="border-none">
                           <AccordionContent className="space-y-4 p-0.5">
                              <div className="pt-3">
                                 <Label htmlFor="price">{input.price} *</Label>
                                 <Input
                                    type="number"
                                    inputMode="decimal"
                                    min="0"
                                    step="0.01"
                                    name="price"
                                    value={data.price}
                                    onChange={(e) => onHandleChange(e, setData)}
                                    placeholder={input.course_price_placeholder}
                                 />
                                 <InputError message={errors.price} />
                              </div>

                              <div className="space-y-2">
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="discount"
                                       name="discount"
                                       checked={data.discount as any}
                                       onCheckedChange={(checked: boolean) => {
                                          setData('discount', checked as any);
                                       }}
                                    />
                                    <Label htmlFor="discount">{input.course_discount}</Label>
                                 </div>

                                 {data.discount && (
                                    <div>
                                       <Input
                                          type="number"
                                          inputMode="decimal"
                                          min="0"
                                          step="0.01"
                                          name="discount_price"
                                          value={data.discount_price}
                                          onChange={(e) => onHandleChange(e, setData)}
                                          placeholder={input.discount_price_placeholder}
                                       />
                                       <InputError message={errors.discount_price} />
                                    </div>
                                 )}
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </div>

                  <div>
                     <Label>Tipo de acesso</Label>
                     <RadioGroup
                        defaultValue={data.expiry_type}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('expiry_type', value)}
                     >
                        {expiries.map((expiry) => (
                           <div key={expiry} className="flex items-center space-x-2">
                              <RadioGroupItem className="cursor-pointer" id={expiry} value={expiry} />
                              <Label htmlFor={expiry} className="capitalize">
                                 {courseExpiryLabels[expiry] ?? expiry}
                              </Label>
                           </div>
                        ))}
                     </RadioGroup>
                     <InputError message={errors.expiry_type} />

                     <Accordion collapsible type="single" value={data.expiry_type}>
                        <AccordionItem value={expiries[1]} className="border-none">
                           <AccordionContent className="space-y-4 p-0.5">
                              <div className="pt-3">
                                 <Label>Duração do acesso</Label>
                                 <RadioGroup
                                    defaultValue={String(data.expiry_duration)}
                                    className="grid gap-3 pt-2 sm:grid-cols-2"
                                    onValueChange={(value) => setData('expiry_duration', value)}
                                 >
                                    {accessDurationOptions.map((option) => (
                                       <div key={option.value} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                                          <RadioGroupItem className="cursor-pointer" id={`expiry_duration_${option.value}`} value={option.value} />
                                          <Label htmlFor={`expiry_duration_${option.value}`} className="cursor-pointer font-normal">
                                             {option.label}
                                          </Label>
                                       </div>
                                    ))}
                                 </RadioGroup>
                                 <p className="text-xs text-muted-foreground">O vencimento será contado a partir da matrícula do aluno.</p>
                                 <InputError message={errors.expiry_duration} />
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </div>

                  <div>
                     <Label htmlFor="thumbnail">{input.thumbnail}</Label>
                     <Input type="file" name="thumbnail" onChange={(e) => onHandleChange(e, setData)} />
                     <InputError message={errors.thumbnail} />
                  </div>

                  <div>
                     <Label htmlFor="drip_content">{input.enable_drip_content} *</Label>
                     <RadioGroup
                        defaultValue={data.drip_content ? 'on' : 'off'}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('drip_content', value === 'on')}
                     >
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem className="cursor-pointer" id="off" value="off" />
                           <Label htmlFor="off">{common.off}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem className="cursor-pointer" id="on" value="on" />
                           <Label htmlFor="on">{common.on}</Label>
                        </div>
                     </RadioGroup>
                     <InputError message={errors.drip_content} />
                  </div>
               </div>
            </div>

            <div className="col-span-2 mt-6 text-right">
               <LoadingButton loading={processing}>{button.create_course}</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

Index.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Index;
