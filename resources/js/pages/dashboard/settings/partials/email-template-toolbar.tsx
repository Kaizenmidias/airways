import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTiptapContext } from '@/components/text-editor/tiptap-editor/components/Provider';
import { useEditorState } from '@tiptap/react';
import { Upload } from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';

const fontFamilies = [
   { value: 'inherit', label: 'Padrão do e-mail' },
   { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
   { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica Neue' },
   { value: 'Georgia, serif', label: 'Georgia' },
   { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
   { value: '"Courier New", Courier, monospace', label: 'Courier New' },
];

const fontSizes = [
   { value: 'inherit', label: 'Tamanho padrão' },
   { value: '12px', label: '12 px' },
   { value: '14px', label: '14 px' },
   { value: '16px', label: '16 px' },
   { value: '18px', label: '18 px' },
   { value: '20px', label: '20 px' },
   { value: '24px', label: '24 px' },
   { value: '28px', label: '28 px' },
   { value: '32px', label: '32 px' },
];

const EmailTemplateToolbar = () => {
   const { editor } = useTiptapContext();
   const imageInputRef = useRef<HTMLInputElement>(null);

   const state = useEditorState({
      editor,
      selector: (ctx) => ({
         fontFamily: ctx.editor.getAttributes('textStyle').fontFamily || 'inherit',
         fontSize: ctx.editor.getAttributes('textStyle').fontSize || 'inherit',
         isEditable: ctx.editor.isEditable,
      }),
   });

   const applyFontFamily = (value: string) => {
      if (value === 'inherit') {
         editor.chain().focus().unsetFontFamily().run();
         return;
      }

      editor.chain().focus().setFontFamily(value).run();
   };

   const applyFontSize = (value: string) => {
      if (value === 'inherit') {
         editor.chain().focus().unsetFontSize().run();
         return;
      }

      editor.chain().focus().setFontSize(value).run();
   };

   const handleImageUpload = () => {
      imageInputRef.current?.click();
   };

   const onImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';

      if (!file || !file.type.startsWith('image/')) {
         return;
      }

      const reader = new FileReader();
      reader.onload = () => {
         const result = reader.result;
         if (typeof result === 'string') {
            editor.chain().focus().setImage({ src: result, alt: file.name }).run();
         }
      };
      reader.readAsDataURL(file);
   };

   return (
      <div className="space-y-4 rounded-2xl border border-border/60 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 shadow-sm">
         <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="grid flex-1 gap-2">
               <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Família da fonte</label>
               <Select value={state.fontFamily} onValueChange={applyFontFamily} disabled={!state.isEditable}>
                  <SelectTrigger className="h-10 rounded-xl bg-white">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     {fontFamilies.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                           {item.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="grid w-full gap-2 lg:max-w-[220px]">
               <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tamanho</label>
               <Select value={state.fontSize} onValueChange={applyFontSize} disabled={!state.isEditable}>
                  <SelectTrigger className="h-10 rounded-xl bg-white">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     {fontSizes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                           {item.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
               <Button type="button" variant="outline" className="rounded-xl" onClick={handleImageUpload} disabled={!state.isEditable}>
                  <Upload className="h-4 w-4" />
                  Imagem
               </Button>
               <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => editor.chain().focus().unsetFontFamily().unsetFontSize().run()}
                  disabled={!state.isEditable}
               >
                  Remover fonte
               </Button>
               <Button type="button" variant="secondary" className="rounded-xl" onClick={() => editor.chain().focus().setParagraph().run()} disabled={!state.isEditable}>
                  Parágrafo
               </Button>
            </div>
         </div>

         <p className="text-xs leading-5 text-muted-foreground">
            O conteúdo abaixo é salvo como HTML real e enviado como e-mail real. Você pode usar cores, links, listas, tabelas, imagens e formatação avançada.
         </p>

         <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
      </div>
   );
};

export default EmailTemplateToolbar;
