import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getResponsiveFontSize, getResponsiveFontSizeMap, updateResponsiveFontSize } from '@/lib/page';
import { Monitor, Smartphone, TabletSmartphone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
   const currentFontSize = useMemo(() => getResponsiveFontSize(fontSizeValue, device) || '', [device, fontSizeValue]);
   const [localFontSize, setLocalFontSize] = useState(currentFontSize);

   useEffect(() => {
      setLocalFontSize(currentFontSize);
   }, [currentFontSize]);

   const DeviceIcon = deviceMeta[device].icon;

   return (
      <div className="space-y-2">
         {showLabel && <Label htmlFor={fieldName}>{label}</Label>}

         <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(96px,25%)] sm:items-start">
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

            <div className="min-w-0 space-y-2">
               <Select
                  value={device}
                  onValueChange={(nextDevice) => {
                     const normalizedDevice = nextDevice as ResponsiveFontSizeDevice;
                     setDevice(normalizedDevice);
                     setLocalFontSize(getResponsiveFontSize(fontSizeValue, normalizedDevice) || '');
                  }}
               >
                  <SelectTrigger
                     aria-label="Selecionar dispositivo"
                     className="h-8 w-10 justify-center gap-0 rounded-full border-border bg-background px-0"
                  >
                     <DeviceIcon className="h-3.5 w-3.5 shrink-0" />
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
                  type="number"
                  step="any"
                  inputMode="decimal"
                  id={`${fieldName}-font-size`}
                  name={`${fieldName}-font-size`}
                  value={localFontSize}
                  onChange={(e) => {
                     const nextValue = e.target.value;
                     setLocalFontSize(nextValue);
                     onFontSizeChange(updateResponsiveFontSize(getResponsiveFontSizeMap(fontSizeValue), device, nextValue));
                  }}
                  placeholder="px"
                  className="w-full min-w-0"
               />
            </div>
         </div>

         {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
   );
};

export default ResponsiveTextField;
