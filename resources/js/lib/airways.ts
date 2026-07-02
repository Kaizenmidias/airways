import type { SharedData } from '@/types/global';

export type AirwaysConfig = SharedData['airways'];
export type AirwaysFeature = keyof AirwaysConfig['features'];

export const isAirwaysFeatureEnabled = (airways: AirwaysConfig | undefined, feature: AirwaysFeature) => {
   return Boolean(airways?.features?.[feature]);
};

export const isMarketplaceEnabled = (airways: AirwaysConfig | undefined) => {
   return Boolean(airways?.marketplace);
};

export const shouldShowCollaborativeUi = (airways: AirwaysConfig | undefined, subType?: string) => {
   return isMarketplaceEnabled(airways) && subType === 'collaborative';
};
