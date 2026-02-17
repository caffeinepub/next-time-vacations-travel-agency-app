import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Ship, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { getPublicAssetUrl, getAssetUrlFallbacks } from '@/utils/publicAssetUrl';
import { useGetHomepageHeroImage } from '../hooks/useQueries';

const CRUISE_SHIP_IMAGE_PATH = '/assets/generated/cruise-ship-hero.dim_1600x900.jpg';

export function Hero() {
  const { data: customHeroImage, isLoading: heroImageLoading } = useGetHomepageHeroImage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(getPublicAssetUrl(CRUISE_SHIP_IMAGE_PATH));
  const [attemptedUrls, setAttemptedUrls] = useState<string[]>([]);

  // Update current image URL when custom hero image changes
  useEffect(() => {
    if (!heroImageLoading) {
      if (customHeroImage) {
        // Use custom hero image
        setCurrentImageUrl(customHeroImage);
        setAttemptedUrls([]);
        setImageError(false);
        setImageLoaded(false);
      } else {
        // Use default static hero image
        setCurrentImageUrl(getPublicAssetUrl(CRUISE_SHIP_IMAGE_PATH));
        setAttemptedUrls([]);
        setImageError(false);
        setImageLoaded(false);
      }
    }
  }, [customHeroImage, heroImageLoading]);

  // Reset state when URL changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentImageUrl]);

  const handleImageError = () => {
    // If custom image fails, try static fallbacks
    if (customHeroImage && currentImageUrl === customHeroImage) {
      // Custom image failed, fall back to static image
      const staticUrl = getPublicAssetUrl(CRUISE_SHIP_IMAGE_PATH);
      setAttemptedUrls(prev => [...prev, currentImageUrl]);
      setCurrentImageUrl(staticUrl);
      setImageError(false);
      return;
    }

    // Try static image fallbacks
    const fallbacks = getAssetUrlFallbacks(CRUISE_SHIP_IMAGE_PATH);
    const nextUrl = fallbacks.find(url => !attemptedUrls.includes(url) && url !== currentImageUrl);
    
    if (nextUrl) {
      // Try next fallback URL
      setAttemptedUrls(prev => [...prev, currentImageUrl]);
      setCurrentImageUrl(nextUrl);
      setImageError(false);
    } else {
      // All fallbacks exhausted
      setAttemptedUrls(prev => [...prev, currentImageUrl]);
      setImageError(true);
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <section id="home" className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background - always present as fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-700 to-ocean-500" />
      
      {/* Cruise ship hero image - full screen cover background with fade-in */}
      {!imageError && (
        <div className="absolute inset-0">
          <img 
            src={currentImageUrl}
            alt="Cruise ship sailing on the ocean"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
      
      {/* Enhanced error banner with diagnostic information */}
      {imageError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-500/95 text-white px-4 py-3 rounded-lg shadow-xl max-w-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2 text-xs">
              <div className="font-semibold text-sm">Hero image failed to load</div>
              <div className="space-y-1">
                <div><span className="font-medium">Current URL:</span> {currentImageUrl}</div>
                <div><span className="font-medium">Attempted URLs ({attemptedUrls.length}):</span></div>
                <ul className="list-disc list-inside pl-2 space-y-0.5">
                  {attemptedUrls.map((url, idx) => (
                    <li key={idx} className="break-all">{url}</li>
                  ))}
                </ul>
                <div><span className="font-medium">Page URL:</span> {window.location.href}</div>
                <div className="pt-1 text-yellow-200">
                  Expected file location: <code className="bg-black/20 px-1 py-0.5 rounded">frontend/public{CRUISE_SHIP_IMAGE_PATH}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced gradient overlay for text readability in both light and dark modes */}
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/85 via-ocean-800/65 to-ocean-900/50 dark:from-ocean-950/90 dark:via-ocean-900/75 dark:to-ocean-950/60" />
      
      <div className="container relative z-10 text-white">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Sail Into Your
            <span className="block text-sunset-400">Dream Vacation</span>
          </h1>
          <p className="text-xl text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            Discover incredible cruise deals to the world's most breathtaking destinations. 
            Your next adventure starts here.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="bg-sunset-500 hover:bg-sunset-600 text-white shadow-lg">
              <Ship className="mr-2 h-5 w-5" />
              Explore Cruises
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-lg">
              <Calendar className="mr-2 h-5 w-5" />
              View Itineraries
            </Button>
          </div>

          <div className="flex flex-wrap gap-8 pt-8">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-md">
                <Ship className="h-6 w-6 text-sunset-400" />
              </div>
              <div>
                <div className="text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">500+</div>
                <div className="text-sm text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">Cruise Options</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-md">
                <MapPin className="h-6 w-6 text-sunset-400" />
              </div>
              <div>
                <div className="text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">100+</div>
                <div className="text-sm text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">Destinations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
