import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import IconPickerDialog from '@/components/icon-picker-dialog';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSectionEditor } from '../context';
import ArrayFields from './array';
import Contents from './contents';

interface FieldsProps {
   field: PropertyField;
   onChange: (nameOrPatch: string | Record<string, any>, value?: any) => void;
}

const Fields = ({ field, onChange }: FieldsProps) => {
   const { section } = useSectionEditor();

   // Local state for basic field types to handle immediate UI updates
   const [localValue, setLocalValue] = useState<any>(field.value || '');
   const [localFontSize, setLocalFontSize] = useState<any>(field.fontSizeValue || '');
   const fontSizeFieldName = `${field.name}_font_size`;

   // Update local state when field.value changes from parent
   useEffect(() => {
      setLocalValue(field.value || '');
   }, [field.value, field.type]);

   useEffect(() => {
      setLocalFontSize(field.fontSizeValue || '');
   }, [field.fontSizeValue, field.type]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type } = e.target as HTMLInputElement;

      if (type === 'checkbox') {
         const checked = (e.target as HTMLInputElement).checked;
         setLocalValue(checked);
         onChange(field.name, checked);
         return;
      }

      // Update local state immediately for better UX
      setLocalValue(value);

      // Notify parent component
      onChange(field.name, value);
   };

   const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setLocalFontSize(value);
      onChange(fontSizeFieldName, value);
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setLocalValue(file);
      onChange(field.name, file);
   };

   // Render different form elements based on field type
   const renderField = () => {
      switch (field.type) {
         case 'contents':
            return <Contents field={field} section_slug={section.slug} onChange={(value) => onChange(field.name, value)} />;

         case 'text':
         case 'url':
            return (
               <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-start">
                  <Input type="text" id={field.name} name={field.name} value={localValue} onChange={handleInputChange} />

                  <div className="space-y-2">
                     <Label htmlFor={fontSizeFieldName} className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Tamanho da fonte
                     </Label>
                     <Input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        id={fontSizeFieldName}
                        name={fontSizeFieldName}
                        value={localFontSize}
                        onChange={handleFontSizeChange}
                        placeholder="px"
                     />
                  </div>
               </div>
            );

         case 'textarea':
            return (
               <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-start">
                  <Textarea id={field.name} name={field.name} rows={3} value={localValue} onChange={handleInputChange} />

                  <div className="space-y-2">
                     <Label htmlFor={fontSizeFieldName} className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Tamanho da fonte
                     </Label>
                     <Input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        id={fontSizeFieldName}
                        name={fontSizeFieldName}
                        value={localFontSize}
                        onChange={handleFontSizeChange}
                        placeholder="px"
                     />
                  </div>
               </div>
            );

         case 'number':
            return <Input type="number" id={field.name} name={field.name} value={localValue} onChange={handleInputChange} />;

         case 'icon':
            return (
               <IconPickerDialog
                  name={field.name}
                  value={localValue}
                  placeholder={field.label}
                  onSelect={(icon) => {
                     setLocalValue(icon);
                     onChange(field.name, icon);
                  }}
                  onClear={() => {
                     setLocalValue('');
                     onChange(field.name, '');
                  }}
               />
            );

         case 'image':
         case 'file':
            return (
               <div className="space-y-2">
                  <Input type="file" id={field.name} name={field.name} onChange={handleFileChange} />

                  {localValue ? (
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => {
                           setLocalValue('');
                           onChange(field.name, null);
                        }}
                     >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Remover imagem
                     </Button>
                  ) : null}
               </div>
            );

         case 'boolean':
            return (
               <Input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={localValue || false}
                  onChange={handleInputChange}
                  className="h-4 w-4"
               />
            );

         case 'array':
            return <ArrayFields field={field} onChange={(value) => onChange(field.name, value)} />;

         case 'object':
            return (
               <Card>
                  <CardContent className="p-4">
                     {field.fields?.map((subField, index) => (
                        <div key={index} className="mb-4">
                           <Label htmlFor={`${field.name}-${subField.name}`} className="mb-2 block">
                              {subField.label}
                           </Label>
                           <div className="mt-1">
                           <Fields
                              field={{
                                 ...subField,
                                    name: subField.name,
                                    value: field.value && field.value[subField.name] !== undefined ? field.value[subField.name] : subField.value,
                                    fontSizeValue: field.value && field.value[`${subField.name}_font_size`] !== undefined ? field.value[`${subField.name}_font_size`] : subField.fontSizeValue,
                                 }}
                                 onChange={(nameOrPatch, value) => {
                                    const patch = typeof nameOrPatch === 'string' ? { [nameOrPatch]: value } : nameOrPatch;
                                    const newValue = { ...(field.value || {}), ...patch };
                                    onChange(field.name, newValue);
                                 }}
                              />
                           </div>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            );

         default:
            return null;
      }
   };

   return (
      <div className="mb-4">
         {field.type !== 'boolean' && field.type !== 'contents' && (
            <Label htmlFor={field.name} className="mb-2 block">
               {field.label}
            </Label>
         )}

         {renderField()}

         {field.type === 'boolean' && (
            <Label htmlFor={field.name} className="ml-2 inline-block">
               {field.label}
            </Label>
         )}
      </div>
   );
};

export default Fields;
