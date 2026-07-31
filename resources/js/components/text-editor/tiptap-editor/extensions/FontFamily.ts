import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
   interface Commands<ReturnType> {
      fontFamily: {
         setFontFamily: (fontFamily: string) => ReturnType;
         unsetFontFamily: () => ReturnType;
      };
   }
}

export const FontFamily = Extension.create({
   name: 'fontFamily',

   addOptions() {
      return {
         types: ['textStyle'],
      };
   },

   addGlobalAttributes() {
      return [
         {
            types: this.options.types,
            attributes: {
               fontFamily: {
                  default: null,
                  parseHTML: (element) => (element as HTMLElement).style.fontFamily || null,
                  renderHTML: (attributes) => {
                     if (!attributes.fontFamily) {
                        return {};
                     }

                     return {
                        style: `font-family: ${attributes.fontFamily}`,
                     };
                  },
               },
            },
         },
      ];
   },

   addCommands() {
      return {
         setFontFamily:
            (fontFamily: string) =>
            ({ chain }) =>
               chain().setMark('textStyle', { fontFamily }).run(),
         unsetFontFamily:
            () =>
            ({ chain }) =>
               chain().setMark('textStyle', { fontFamily: null }).removeEmptyTextStyle().run(),
      };
   },
});

export default FontFamily;
