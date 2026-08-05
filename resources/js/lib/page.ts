import type { CSSProperties } from 'react';

export const getPageSection = (page: Page, slug: string) => {
   return page.sections.find((section: PageSection) => section.slug === slug);
};

const formatLabel = (key: string): string => {
   return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const fontSizeDevices: ResponsiveFontSizeDevice[] = ['desktop', 'tablet', 'mobile'];

const normalizeFontSize = (value: any): string | undefined => {
   if (value === null || value === undefined || value === '') {
      return undefined;
   }

   const parsed = typeof value === 'number' ? value : Number(value);

   if (!Number.isFinite(parsed)) {
      return undefined;
   }

   return `${parsed}px`;
};

const isResponsiveFontSizeValue = (value: FontSizeValue): value is ResponsiveFontSizeValue => {
   return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const getResponsiveFontSize = (value: FontSizeValue, device: ResponsiveFontSizeDevice): string | undefined => {
   if (isResponsiveFontSizeValue(value)) {
      if (device === 'desktop') {
         return normalizeFontSize(value.desktop ?? value.tablet ?? value.mobile);
      }

      if (device === 'tablet') {
         return normalizeFontSize(value.tablet ?? value.desktop ?? value.mobile);
      }

      return normalizeFontSize(value.mobile ?? value.tablet ?? value.desktop);
   }

   return normalizeFontSize(value);
};

export const getResponsiveFontSizeMap = (value: FontSizeValue): ResponsiveFontSizeValue => {
   if (isResponsiveFontSizeValue(value)) {
      return value;
   }

   const desktop = normalizeFontSize(value);

   return desktop ? { desktop } : {};
};

export const updateResponsiveFontSize = (value: FontSizeValue, device: ResponsiveFontSizeDevice, nextValue: string): ResponsiveFontSizeValue => {
   const currentValue = getResponsiveFontSizeMap(value);

   return {
      ...currentValue,
      [device]: nextValue,
   };
};

export const getTextStyle = (source: Record<string, any> | undefined, key: string, fallback?: any): CSSProperties => {
   const fontSize = getResponsiveFontSizeMap(source?.[`${key}_font_size`] ?? fallback);
   const style = {} as CSSProperties & Record<string, string>;
   const desktopValue = normalizeFontSize(fontSize.desktop ?? fontSize.tablet ?? fontSize.mobile);

   if (desktopValue) {
      style['--airways-font-size-desktop' as any] = desktopValue;
   }

   fontSizeDevices.slice(1).forEach((device) => {
      const value = fontSize[device];

      if (value !== undefined && value !== null && value !== '') {
         const normalizedValue = normalizeFontSize(value);

         if (normalizedValue) {
            style[`--airways-font-size-${device}` as any] = normalizedValue;
         }
      }
   });

   return style;
};

const generateArrayField = (key: string, value: any[]): PropertyField => {
   const sampleItem =
      Array.isArray(value) && value.length > 0 ? value.find((item: Record<string, any>) => !isEmptyArrayItem(item)) || value[0] : {};
   let itemFields: PropertyField[] = [];

   if (Object.keys(sampleItem).length > 0) {
      Object.keys(sampleItem).forEach((itemKey) => {
         if (typeof sampleItem[itemKey] === 'string' || typeof sampleItem[itemKey] === 'number' || typeof sampleItem[itemKey] === 'boolean') {
            itemFields.push(generateFieldByType(itemKey, sampleItem[itemKey], sampleItem));
         }
      });
   } else {
      itemFields = [{ type: 'text' as const, label: 'Title', name: 'title', value: '' }];
   }

   return {
      type: 'array',
      label: formatLabel(key),
      name: key,
      value: (value || []).map((item: Record<string, any>) => {
         const processedItem = { ...item };

         Object.keys(processedItem).forEach((itemKey) => {
            if (itemKey === 'image' || itemKey.includes('image')) {
               processedItem[`new_image`] = null;
            }
         });

         return processedItem;
      }),
      fields: itemFields,
   };
};

/**
 * Generate a field definition based on a value's type
 */
const generateFieldByType = (key: string, value: any, source?: Record<string, any>): PropertyField => {
   // Handle different value types
   if (typeof value === 'string') {
      // Image or URL fields
      if (key === 'image' || key.includes('image') || key === 'avatar' || (typeof value === 'string' && value.match(/\.(jpeg|jpg|gif|png)$/i))) {
         return {
            type: 'file',
            label: formatLabel(key),
            name: key,
            value: null,
         };
         // Description fields
         } else if (key === 'description' || key.includes('description') || key === 'bio' || key === 'content' || key.includes('bullet')) {
            return {
               type: 'textarea',
               label: formatLabel(key),
               name: key,
               value: value || '',
               fontSizeValue: source?.[`${key}_font_size`],
            };
         // URL fields
      } else if (key === 'url' || key.includes('_url') || key.includes('link')) {
         return {
            type: 'url',
            label: formatLabel(key),
            name: key,
            value: value || '',
            fontSizeValue: source?.[`${key}_font_size`],
         };
         // Default string field
      } else if (key === 'icon') {
         return {
            type: 'icon',
            label: formatLabel(key),
            name: key,
            value: value || '',
         };
      } else {
         return {
            type: 'text',
            label: formatLabel(key),
            name: key,
            value: value || '',
            fontSizeValue: source?.[`${key}_font_size`],
         };
      }
   } else if (typeof value === 'number') {
      return {
         type: 'number',
         label: formatLabel(key),
         name: key,
         value: value || 0,
      };
   } else if (typeof value === 'boolean') {
      return {
         type: 'boolean',
         label: formatLabel(key),
         name: key,
         value: value || false,
      };
   } else {
      // Default to text field for other types
      return {
         type: 'text',
         label: formatLabel(key),
         name: key,
         value: value?.toString() || '',
      };
   }
};

/**
 * Generate fields based only on properties object without section name dependency
 * @param properties - The section properties object
 * @returns Array of property fields
 */
export const generatePropertyFields = (properties: Record<string, any>): PropertyField[] => {
   // Handle contents property (dynamic content from database)
   if ('contents' in properties) {
      const fields: PropertyField[] = [
         {
            type: 'contents',
            label: 'Contents',
            name: 'contents',
            value: properties.contents || [],
         },
      ];

      // Add other properties to the beginning of fields array
      Object.entries(properties).forEach(([key, value]) => {
         // Skip array property as it's already handled
         if (key === 'array') {
            return;
         }

         // Skip contents property as it's handled separately
         if (key === 'contents') {
            return;
         }

         // Generate field for other properties
         const field = generateFieldByType(key, value, properties);
         fields.unshift(field);
      });

      return fields;
   }

   // Handle array property (static content defined in seeder)
   if ('array' in properties) {
      const fields: PropertyField[] = [generateArrayField('array', properties.array || [])];

      if ('bullet_points' in properties) {
         fields.push(generateArrayField('bullet_points', properties.bullet_points || []));
      }

      // Add other properties to the beginning of fields array
      Object.entries(properties).forEach(([key, value]) => {
         // Skip array property as it's already handled
         if (key === 'array') {
            return;
         }

         if (key === 'bullet_points') {
            return;
         }

         // Skip contents property as it's handled separately
        if (key === 'contents') {
           return;
        }

        // Generate field for other properties
        const field = generateFieldByType(key, value, properties);
        fields.unshift(field);
      });

      return fields;
   }

   // Process all other properties
   return Object.entries(properties).map(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
         // Handle nested objects
         return {
            type: 'object',
            label: formatLabel(key),
            name: key,
            value: value,
            fields: generatePropertyFields(value),
         } as PropertyField;
      } else {
         // Use the common field generation function for primitive types
         return generateFieldByType(key, value, properties);
      }
   });
};

export const isEmptyArrayItem = (array: Record<string, any>) => {
   let flag = true;

   Object.entries(array).forEach(([key, value]) => {
      switch (typeof value) {
         case 'string':
            if (value.length > 0) {
               flag = false;
            }
            break;
         case 'number':
            if (value > 0) {
               flag = false;
            }
            break;
         default:
            break;
      }
   });

   return flag;
};

export const removeEmptyArrayItems = (array: Record<string, any>[]) => {
   return array.filter((item) => {
      let flag = false;

      Object.entries(item).forEach(([key, value]) => {
         switch (typeof value) {
            case 'string':
               if (value.trim().length > 0) {
                  flag = true;
               }
               break;
            case 'number':
               if (value > 0) {
                  flag = true;
               }
               break;
            case 'boolean':
               if (value) {
                  flag = true;
               }
               break;
            default:
               break;
         }
      });

      return flag;
   });
};

export const getPropertyArray = (section?: PageSection) => {
   const array = section?.properties?.array;

   return array ? removeEmptyArrayItems(array) : [];
};
