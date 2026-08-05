import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getResponsiveFontSize, getResponsiveFontSizeMap, updateResponsiveFontSize } from '@/lib/page';
import { Monitor, Smartphone, TabletSmartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

type ResponsiveTextFieldProps = {
   fieldName: string;
   label: string;
   value: string;
   fontSizeValue: FontSizeValue;
   placeholder: string;
   onValueChange: (value: string) => void;
   onFontSizeChange: (value: ResponsiveFontSizeValue) => void;
   multiline?: boolean;
   rows?: number;
   error?: string;
   showLabel?: boolean;
};

const deviceMeta = {
   desktop: {
      icon: Monitor,
   },
   tablet: {
      icon: TabletSmartphone,
   },
   mobile: {
      icon: Smartphone,
   },
} as const;

const getFontSizeInputValue = (value: string | undefined) => {
   if (!value) {
      return '';
   }

   const match = value.match(/[\d.]+/);

   return match?.[0] || '';
};

const sanitizeFontSizeInput = (value: string) => {
   const cleaned = value.replace(/[^\d.]/g, '');
   const [integerPart = '', decimalPart = ''] = cleaned.split('.');

   if (!decimalPart) {
      return integerPart;
   }

   return `${integerPart}.${decimalPart}`;
};

const ResponsiveTextField = ({
   fieldName,
   label,
   value,
   fontSizeValue,
   placeholder,
   onValueChange,
   onFontSizeChange,
   multiline = false,
   rows = 3,
   error,
   showLabel = true,
}: ResponsiveTextFieldProps) => {
   const [device, setDevice] = useState<ResponsiveFontSizeDevice>('desktop');
   const currentFontSize = getResponsiveFontSize(fontSizeValue, device) || '';
   const [localFontSize, setLocalFontSize] = useState(getFontSizeInputValue(currentFontSize));

   useEffect(() => {
      setLocalFontSize(getFontSizeInputValue(currentFontSize));
   }, [currentFontSize]);

   const DeviceIcon = deviceMeta[device].icon;

   return (
      <div className="space-y-2">
         {showLabel && <Label htmlFor={fieldName}>{label}</Label>}

         <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)] md:items-start">
            <div className="min-w-0">
               {multiline ? (
                  <Textarea
                     id={fieldName}
                     name={fieldName}
                     value={value}
                     onChange={(e) => onValueChange(e.target.value)}
                     placeholder={placeholder}
                     rows={rows}
                     className="w-full min-w-0"
                  />
               ) : (
                  <Input
                     type="text"
                     id={fieldName}
                     name={fieldName}
                     value={value}
                     onChange={(e) => onValueChange(e.target.value)}
                     placeholder={placeholder}
                     className="w-full min-w-0"
                  />
               )}
            </div>

            <div className="flex min-w-0 items-start gap-2">
               <Select
                  value={device}
                  onValueChange={(nextDevice) => {
                     const normalizedDevice = nextDevice as ResponsiveFontSizeDevice;
                     setDevice(normalizedDevice);
                     setLocalFontSize(getFontSizeInputValue(getResponsiveFontSize(fontSizeValue, normalizedDevice) || ''));
                  }}
               >
                  <SelectTrigger
                     aria-label="Selecionar dispositivo"
                     className="h-10 w-10 shrink-0 justify-center gap-0 rounded-full border-border bg-background px-0"
                  >
                     <DeviceIcon className="h-4 w-4 shrink-0" />
                  </SelectTrigger>
                  <SelectContent>
                     {Object.entries(deviceMeta).map(([key, meta]) => {
                        const Icon = meta.icon;

                        return (
                           <SelectItem key={key} value={key}>
                              <Icon className="h-4 w-4" />
                           </SelectItem>
                        );
                     })}
                  </SelectContent>
               </Select>

               <Input
                  type="text"
                  inputMode="decimal"
                  id={`${fieldName}-font-size`}
                  name={`${fieldName}-font-size`}
                  value={localFontSize}
                  onChange={(e) => {
                     const nextValue = sanitizeFontSizeInput(e.target.value);
                     setLocalFontSize(nextValue);
                     onFontSizeChange(updateResponsiveFontSize(getResponsiveFontSizeMap(fontSizeValue), device, nextValue));
                  }}
                  placeholder="px"
                  className="min-w-0 flex-1"
               />
            </div>
         </div>

         {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
   );
};

export default ResponsiveTextField;
