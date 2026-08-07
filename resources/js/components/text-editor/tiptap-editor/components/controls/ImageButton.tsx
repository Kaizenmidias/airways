import { useEditorState } from '@tiptap/react';
import { ChangeEvent, Fragment, useCallback, useRef } from 'react';
import MenuButton from '../MenuButton';
import { useTiptapContext } from '../Provider';

const ImageButton = () => {
   const { editor } = useTiptapContext();
   const state = useEditorState({
      editor,
      selector: (ctx) => {
         return {
            active: ctx.editor.isActive('image'),
            disabled: !ctx.editor.isEditable,
         };
      },
   });

   const fileInput = useRef<HTMLInputElement>(null);
   const handleClick = useCallback(() => {
      fileInput.current?.click();
   }, []);

   const onUpload = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
         const target = e.target;
         const file = target.files?.[0];
         if (file?.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
               const src = reader.result;
               if (typeof src === 'string') {
                  editor.chain().focus().setImage({ src, alt: file.name }).run();
               }
            };
            reader.readAsDataURL(file);
         }
         target.value = '';
      },
      [editor],
   );

   return (
      <Fragment>
         <MenuButton icon="Image" tooltip="Imagem" {...state} onClick={handleClick} />
         <input style={{ display: 'none' }} type="file" accept="image/*" ref={fileInput} onChange={onUpload} />
      </Fragment>
   );
};

export default ImageButton;
