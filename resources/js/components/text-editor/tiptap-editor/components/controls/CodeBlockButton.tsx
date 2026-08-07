import { useEditorState } from '@tiptap/react';
import MenuButton from '../MenuButton';
import { useTiptapContext } from '../Provider';

const CodeBlockButton = () => {
   const { editor } = useTiptapContext();
   const state = useEditorState({
      editor,
      selector: (ctx) => {
         return {
            active: ctx.editor.isActive('codeBlock'),
            disabled: !ctx.editor.can().toggleCodeBlock(),
         };
      },
   });

   return <MenuButton icon="Code" tooltip="Bloco de codigo" onClick={() => editor.chain().focus().setCodeBlock().run()} {...state} />;
};

export default CodeBlockButton;
