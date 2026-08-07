import MenuButton from '../MenuButton';
import { Toolbar } from '../ui/Toolbar';

import { useEditorState } from '@tiptap/react';
import { useTiptapContext } from '../Provider';
import { PopoverClose } from '../ui/Popover';
import CodeButton from './CodeButton';
import StrikeButton from './StrikeButton';
import SubscriptButton from './SubscriptButton';
import SuperscriptButton from './SuperscriptButton';

const MoreMarkPopover = () => {
   const { editor } = useTiptapContext();

   const isDisabled = useEditorState({
      editor,
      selector: (ctx) =>
         !ctx.editor.can().setStrike() && !ctx.editor.can().setSuperscript() && !ctx.editor.can().setSubscript() && !ctx.editor.can().setCode(),
   });

   return (
      <MenuButton type="popover" icon="LetterCase" tooltip="Mais formatacao" disabled={isDisabled}>
         <PopoverClose asChild>
            <Toolbar dense={true}>
               <StrikeButton />
               <SuperscriptButton />
               <SubscriptButton />
               <CodeButton />
            </Toolbar>
         </PopoverClose>
      </MenuButton>
   );
};

export default MoreMarkPopover;
