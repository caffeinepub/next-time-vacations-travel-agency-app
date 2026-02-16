import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetBrandingSettings, useUpdateBrandingSettings } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Palette, RotateCcw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DEFAULT_BRANDING } from '../utils/sharedItineraryBranding';
import type { BrandingSettings } from '../backend';

export function SharedPageBrandingSettingsTab() {
  const { data: settings, isLoading } = useGetBrandingSettings();
  const updateSettings = useUpdateBrandingSettings();

  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');

  // Initialize form when settings load
  useState(() => {
    if (settings) {
      setBrandName(settings.bannerText || DEFAULT_BRANDING.brandName);
      setTagline(settings.heroBannerText || DEFAULT_BRANDING.tagline);
      setPhoneNumber(settings.footerText || DEFAULT_BRANDING.phoneNumber);
      setLogoUrl(settings.headerImage || '');
      setPrimaryColor(settings.fontColor || '');
      setAccentColor(settings.accentColor || '');
    }
  });

  // Update form when settings change
  if (settings && brandName === '' && tagline === '') {
    setBrandName(settings.bannerText || DEFAULT_BRANDING.brandName);
    setTagline(settings.heroBannerText || DEFAULT_BRANDING.tagline);
    setPhoneNumber(settings.footerText || DEFAULT_BRANDING.phoneNumber);
    setLogoUrl(settings.headerImage || '');
    setPrimaryColor(settings.fontColor || '');
    setAccentColor(settings.accentColor || '');
  }

  const handleSave = async () => {
    if (!settings) return;

    try {
      const updatedSettings: BrandingSettings = {
        ...settings,
        bannerText: brandName,
        heroBannerText: tagline,
        footerText: phoneNumber,
        headerImage: logoUrl,
        fontColor: primaryColor,
        accentColor: accentColor,
      };

      await updateSettings.mutateAsync(updatedSettings);
      toast.success('Branding settings saved successfully');
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast.error('Failed to save branding settings');
    }
  };

  const handleReset = async () => {
    if (!settings) return;

    try {
      const resetSettings: BrandingSettings = {
        ...settings,
        bannerText: DEFAULT_BRANDING.brandName,
        heroBannerText: DEFAULT_BRANDING.tagline,
        footerText: DEFAULT_BRANDING.phoneNumber,
        headerImage: '',
        fontColor: '',
        accentColor: '',
      };

      await updateSettings.mutateAsync(resetSettings);
      
      setBrandName(DEFAULT_BRANDING.brandName);
      setTagline(DEFAULT_BRANDING.tagline);
      setPhoneNumber(DEFAULT_BRANDING.phoneNumber);
      setLogoUrl('');
      setPrimaryColor('');
      setAccentColor('');

      toast.success('Branding settings reset to defaults');
    } catch (error) {
      console.error('Error resetting branding settings:', error);
      toast.error('Failed to reset branding settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-ocean-600" />
            Shared Page Branding
          </CardTitle>
          <CardDescription>
            Customize how your shared itinerary pages appear to guests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={DEFAULT_BRANDING.brandName}
            />
            <p className="text-xs text-muted-foreground">
              Displayed in the header of shared itinerary pages
            </p>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline / Subtitle</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={DEFAULT_BRANDING.tagline}
            />
            <p className="text-xs text-muted-foreground">
              Appears below the brand name
            </p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Contact Phone Number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={DEFAULT_BRANDING.phoneNumber}
            />
            <p className="text-xs text-muted-foreground">
              Shown in the contact information section
            </p>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo Image URL</Label>
            <Input
              id="logoUrl"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground">
              Optional: URL to your logo image (leave empty for text-only branding)
            </p>
            {logoUrl && (
              <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                <p className="text-xs font-medium mb-2">Logo Preview:</p>
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#0066CC or rgb(0, 102, 204)"
              />
              <input
                type="color"
                value={primaryColor.startsWith('#') ? primaryColor : '#0066CC'}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used for title text and primary accents (hex, rgb, or hsl format)
            </p>
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accentColor"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#FF6B35 or rgb(255, 107, 53)"
              />
              <input
                type="color"
                value={accentColor.startsWith('#') ? accentColor : '#FF6B35'}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used for icons and secondary highlights
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending}
              className="flex-1"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={updateSettings.isPending}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset to Default Branding?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will restore the default branding values (Next Time Vacations, {DEFAULT_BRANDING.phoneNumber}) and remove any custom colors or logo. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>
                    Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
