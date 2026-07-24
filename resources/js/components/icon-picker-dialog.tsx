import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLang } from '@/hooks/use-lang';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import IconPicker from './icon-picker';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { TooltipProvider } from './ui/tooltip';
import { X } from 'lucide-react';

interface IconPickerDialogProps {
   name: string;
   value: string;
   placeholder?: string;
   onSelect: (icon: string) => void;
   onClear?: () => void;
}

const IconPickerDialog = ({ onSelect, onClear, value, name, placeholder }: IconPickerDialogProps) => {
   const [openIcon, setOpenIcon] = useState(false);
   const { dashboard } = useLang();

   return (
      <>
         <div className="flex items-center gap-2">
            <Input required readOnly type="text" name={name} value={value} placeholder={placeholder || name} onClick={() => setOpenIcon(true)} />

            {value ? (
               <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => onClear?.()} title="Remover ícone">
                  <X className="h-4 w-4" />
               </Button>
            ) : null}
         </div>

         <TooltipProvider delayDuration={0}>
            <Dialog open={openIcon} onOpenChange={setOpenIcon}>
               <DialogContent className="p-0">
                  <ScrollArea className="max-h-[90vh] p-6">
                     <DialogHeader className="mb-6">
                        <DialogTitle>{dashboard.icon_picker}</DialogTitle>
                     </DialogHeader>

                     <IconPicker
                        onSelect={(icon) => {
                           onSelect(icon);
                           setOpenIcon(false);
                        }}
                     />
                  </ScrollArea>
               </DialogContent>
            </Dialog>
         </TooltipProvider>
      </>
   );
};

export default IconPickerDialog;
