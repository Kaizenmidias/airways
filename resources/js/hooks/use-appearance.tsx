import { useCallback, useEffect, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet, safeMatchMedia } from '@/lib/browser';

const prefersDark = () => {
   return safeMatchMedia('(prefers-color-scheme: dark)')?.matches ?? false;
};

const setCookie = (name: string, value: string, days = 365) => {
   if (typeof document === 'undefined') {
      return;
   }

   const maxAge = days * 24 * 60 * 60;
   document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
   const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

   document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = () => {
   return safeMatchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
   const currentAppearance = safeLocalStorageGet('appearance') as Appearance;
   applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
   try {
      const savedAppearance = (safeLocalStorageGet('appearance') as Appearance) || 'light';

      applyTheme(savedAppearance);

      const mql = mediaQuery();

      if (!mql) {
         return;
      }

      if (typeof mql.addEventListener === 'function') {
         mql.addEventListener('change', handleSystemThemeChange);
      } else if (typeof mql.addListener === 'function') {
         mql.addListener(handleSystemThemeChange);
      }
   } catch {
      // Keep the app usable even if the browser blocks storage or media queries.
   }
}

export function useAppearance(defaultTheme: Appearance = 'system') {
   const [appearance, setAppearance] = useState<Appearance>(defaultTheme);

   const updateAppearance = useCallback((mode: Appearance) => {
      setAppearance(mode);

      // Store in localStorage for client-side persistence...
      safeLocalStorageSet('appearance', mode);

      // Store in cookie for SSR...
      setCookie('appearance', mode);

      applyTheme(mode);
   }, []);

   useEffect(() => {
      const savedAppearance = safeLocalStorageGet('appearance') as Appearance | null;
      updateAppearance(savedAppearance || defaultTheme);

      const mql = mediaQuery();

      return () => {
         if (!mql) {
            return;
         }

         if (typeof mql.removeEventListener === 'function') {
            mql.removeEventListener('change', handleSystemThemeChange);
         } else if (typeof mql.removeListener === 'function') {
            mql.removeListener(handleSystemThemeChange);
         }
      };
   }, [defaultTheme, updateAppearance]);

   return { appearance, updateAppearance } as const;
}
