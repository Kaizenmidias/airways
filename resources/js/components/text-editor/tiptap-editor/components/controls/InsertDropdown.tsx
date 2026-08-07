import { ChangeEvent, Fragment, useCallback, useRef } from 'react';
import MenuButton from '../MenuButton';
import { useTiptapContext } from '../Provider';
import { DropdownMenuItem } from '../ui/DropdownMenu';

const InsertDropdown = () => {
   const { editor } = useTiptapContext();
   const fileInput = useRef<HTMLInputElement>(null);

   const insertCodeBlock = () => editor.chain().focus().setCodeBlock().run();
   const insertBlockquote = () => editor.chain().focus().setBlockquote().run();
   const insertImage = () => fileInput.current?.click();

   const insertYoutube = () => {
      const src = prompt('Cole a URL do video do YouTube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      if (src) {
         editor.chain().focus().embedYoutube({ src }).run();
      }
   };

   const onUploadImage = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
         const file = event.target.files?.[0];

         if (!file?.type.startsWith('image/')) {
            event.target.value = '';
            return;
         }

         const reader = new FileReader();
         reader.onload = () => {
            const src = reader.result;

            if (typeof src === 'string') {
               editor.chain().focus().setImage({ src, alt: file.name }).run();
            }
         };
         reader.readAsDataURL(file);
         event.target.value = '';
      },
      [editor],
   );

   return (
      <Fragment>
         <MenuButton type="dropdown" tooltip="Inserir" disabled={!editor.isEditable} icon="Plus" dropdownStyle={{ minWidth: '9rem' }}>
            <DropdownMenuItem asChild>
               <MenuButton text="Citacao" hideText={false} tooltip={false} icon="Quote" onClick={insertBlockquote} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <MenuButton text="Bloco de codigo" hideText={false} tooltip={false} icon="CodeBlock" onClick={insertCodeBlock} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <MenuButton text="YouTube" hideText={false} tooltip={false} icon="Youtube" onClick={insertYoutube} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <MenuButton text="Imagem" hideText={false} tooltip={false} icon="Image" onClick={insertImage} />
            </DropdownMenuItem>
         </MenuButton>
         <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={onUploadImage} />
      </Fragment>
   );
};

export default InsertDropdown;
