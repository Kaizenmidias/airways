import type { Config, route as routeFn } from 'ziggy-js';

declare global {
   const route: typeof routeFn;
}

interface AirwaysFeatures {
   instructors: boolean;
   jobs: boolean;
   payouts: boolean;
   forum: boolean;
   blog: boolean;
   blog_social: boolean;
   newsletter: boolean;
}

interface AirwaysConfig {
   mode: string;
   marketplace: boolean;
   features: AirwaysFeatures;
}

export interface SharedData {
   page: Page;
   auth: Auth;
   customize: boolean;
   navbar: Navbar;
   footer: Footer;
   notifications: Notification[];
   system: Settings<SystemFields>;
   ziggy: Config & { location: string };
   flash: {
      error: string;
      warning: string;
      success: string;
   };
   langs: Language[];
   locale: string;
   direction: 'ltr' | 'rtl';
   cartCount: number;
   airways: AirwaysConfig;
   translate: LanguageTranslations;
   [key: string]: unknown;
}

// export type SharedData<T extends Record<string, unknown> = Record<string, unknown>> = T & {
//     auth: {
//         user: User;
//     };
//     ziggy: Config & { location: string };
//     flash: {
//         error: string;
//         warning: string;
//         success: string;
//     };
// };
