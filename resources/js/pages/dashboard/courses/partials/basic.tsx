import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import courseLanguages from '@/data/course-languages';
import DashboardLayout from '@/layouts/dashboard/layout';
import { shouldShowCollaborativeUi } from '@/lib/airways';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { ReactNode, useMemo } from 'react';
import { CourseUpdateProps } from '../update';

const Basic = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { auth, system, tab, labels, categories, course, instructors, translate, airways } = props;
   const { input, button, common } = translate;
   const showInstructorSelector = auth.user.role === 'admin' && shouldShowCollaborativeUi(airways, system.sub_type);

   const { data, setData, post, errors, processing } = useForm({
      tab: tab,
      title: course.title,
      sub_title: course.sub_title ?? '',
      short_description: course.short_description,
      description: course.description,
      status: course.status,
      level: course.level,
      language: course.language,
      instructor_id: course.instructor_id,
      drip_content: Boolean(course.drip_content),
      is_development: Boolean(course.is_development),
      course_category_id: course.course_category_id,
      course_category_child_id: course.course_category_child_id,
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('courses.update', { id: course.id }));
   };

   const transformedInstructors = instructors?.map((instructor) => ({
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

   const courseLevelLabels: Record<string, string> = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
      expert: 'Especialista',
   };

   return (
      <Card className="container p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label>{input.sub_title}</Label>
               <Input name="sub_title" value={data.sub_title} onChange={(e) => onHandleChange(e, setData)} placeholder="Ex.: Grand School" />
               <InputError message={errors.sub_title} />
            </div>

            <div>
               <Label>{input.title} *</Label>
               <Input name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder={input.title_placeholder} />
               <InputError message={errors.title} />
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

            {showInstructorSelector && (
               <div>
                  <Label>{input.course_instructor} *</Label>
                  <Combobox
                     defaultValue={data.instructor_id as string}
                     data={transformedInstructors || []}
                     placeholder={input.instructor_placeholder}
                     onSelect={(selected) => setData('instructor_id', selected.value)}
                  />
                  <InputError message={errors.instructor_id} />
               </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
               <div>
                  <Label>{input.category} *</Label>
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
                     <Label>Subcategoria</Label>
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

               <div>
                  <Label>{input.course_level} *</Label>
                  <Select value={data.level} onValueChange={(value) => setData('level', value)}>
                     <SelectTrigger>
                        <SelectValue placeholder={input.course_level_placeholder} />
                     </SelectTrigger>
                        <SelectContent>
                           {labels.map((label) => (
                              <SelectItem key={label} value={label} className="capitalize">
                                 {courseLevelLabels[label] ?? label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                  </Select>
                  <InputError message={errors.level} />
               </div>

               <div>
                  <Label>{input.course_language} *</Label>
                  <Combobox
                     defaultValue={data.language}
                     data={courseLanguages}
                     placeholder={input.course_language_placeholder}
                     onSelect={(selected) => setData('language', selected.value)}
                  />
                  <InputError message={errors.language} />
               </div>

               <div>
                  <Label>{input.enable_drip_content} *</Label>
                  <RadioGroup
                     defaultValue={data.drip_content ? 'on' : 'off'}
                     className="flex items-center space-x-4 pt-2 pb-1"
                     onValueChange={(value) => setData('drip_content', value == 'on' ? true : false)}
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

            <div className="mt-8">
               <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

Basic.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Basic;
