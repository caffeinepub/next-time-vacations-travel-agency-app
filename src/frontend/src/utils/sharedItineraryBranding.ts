import type { BrandingSettings } from '../backend';

// Default branding values matching the current shared page
export const DEFAULT_BRANDING = {
  brandName: 'Next Time Vacations',
  tagline: 'Your Dream Cruise Awaits',
  phoneNumber: '1-800-CRUISE-NOW',
  logoUrl: '',
  primaryColor: '',
  accentColor: '',
};

// Merge fetched settings with defaults
export function mergeBrandingWithDefaults(settings: BrandingSettings | null | undefined): {
  brandName: string;
  tagline: string;
  phoneNumber: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
} {
  if (!settings) {
    return DEFAULT_BRANDING;
  }

  return {
    brandName: settings.bannerText || DEFAULT_BRANDING.brandName,
    tagline: settings.heroBannerText || DEFAULT_BRANDING.tagline,
    phoneNumber: settings.footerText || DEFAULT_BRANDING.phoneNumber,
    logoUrl: settings.headerImage || DEFAULT_BRANDING.logoUrl,
    primaryColor: settings.fontColor || DEFAULT_BRANDING.primaryColor,
    accentColor: settings.accentColor || DEFAULT_BRANDING.accentColor,
  };
}
