import InputError from '@/components/input-error';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { useEffect } from 'react';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
   categories: ExamCategory[];
   isEdit?: boolean;
}

const ExamBasicForm = ({ data, setData, errors, categories, isEdit = false }: Props) => {
   // Auto-generate slug from title
   useEffect(() => {
      if (!isEdit && data.title) {
         const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
         setData('slug', slug);
      }
   }, [data.title, isEdit]);

   return (
      <div className="space-y-4">
         <div>
            <Label htmlFor="title">Título da prova *</Label>
            <Input id="title" name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder="Digite o título da prova" required />
            <InputError message={errors.title} />
         </div>

         <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" value={data.slug} onChange={(e) => onHandleChange(e, setData)} placeholder="exam-slug" required />
            <InputError message={errors.slug} />
         </div>

         <div>
            <Label htmlFor="exam_category_id">Category *</Label>
            <Select
               name="exam_category_id"
               value={data.exam_category_id?.toString()}
               onValueChange={(value) => setData('exam_category_id', parseInt(value))}
            >
               <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
               </SelectTrigger>
               <SelectContent>
                  {categories.map((category) => (
                     <SelectItem key={category.id} value={category.id.toString()}>
                        {category.title}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
            <InputError message={errors.exam_category_id} />
         </div>

         <div>
            <Label htmlFor="level">Nível de dificuldade</Label>
            <Select name="level" value={data.level || ''} onValueChange={(value) => setData('level', value)}>
               <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                  <SelectItem value="expert">Especialista</SelectItem>
               </SelectContent>
            </Select>
            <InputError message={errors.level} />
         </div>

         <div>
            <Label htmlFor="short_description">Descrição curta</Label>
            <Textarea
               id="short_description"
               name="short_description"
               value={data.short_description}
               onChange={(e) => onHandleChange(e, setData)}
               placeholder="Breve descrição para os cards da prova"
               rows={3}
            />
            <InputError message={errors.short_description} />
         </div>

         <div>
            <Label htmlFor="description">Descrição completa</Label>
            <TiptapEditor
               ssr={true}
               output="html"
               placeholder={{
                  paragraph: 'Digite a descrição detalhada da prova...',
                  imageCaption: 'Digite a legenda da imagem (opcional)',
               }}
               contentMinHeight={256}
               contentMaxHeight={640}
               initialContent={data.description}
               onContentChange={(value) => setData('description', value as string)}
            />
            <InputError message={errors.description} />
         </div>
      </div>
   );
};

export default ExamBasicForm;
