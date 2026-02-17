import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ship, MapPin, Calendar, AlertCircle } from 'lucide-react';

const CRUISE_SHIP_IMAGE = '/assets/generated/cruise-ship-hero.dim_1600x900.jpg';

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section id="home" className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background - always present as fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-700 to-ocean-500" />
      
      {/* Cruise ship hero image - full screen cover background with fade-in */}
      {!imageError && (
        <div className="absolute inset-0">
          <img 
            src={CRUISE_SHIP_IMAGE}
            alt="Cruise ship sailing on the ocean"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
      )}
      
      {/* Error message if image fails to load */}
      {imageError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Hero image could not be loaded</span>
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
