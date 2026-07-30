import { ChangeEvent } from 'react';

type SetData = (key: string, value: unknown) => void;

export const normalizeCurrencyInput = (value: string) => {
   const digits = value.replace(/\D/g, '');

   if (!digits) {
      return '';
   }

   return (Number(digits) / 100).toFixed(2);
};

export const formatCurrencyInput = (value: number | string | null | undefined, locale = 'pt-BR', currency = 'BRL') => {
   if (value === null || value === undefined || value === '') {
      return '';
   }

   const numericValue =
      typeof value === 'string'
         ? Number(
              value
                 .replace(/[^\d,.-]/g, '')
                 .replace(/\./g, '')
                 .replace(',', '.'),
           )
         : Number(value);

   if (!Number.isFinite(numericValue)) {
      return '';
   }

   return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(numericValue);
};

export const onCurrencyInputChange = (event: ChangeEvent<HTMLInputElement>, setData: SetData, field: string) => {
   setData(field, normalizeCurrencyInput(event.target.value));
};
