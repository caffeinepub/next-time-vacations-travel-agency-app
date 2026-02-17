import { Button } from '@/components/ui/button';
import { Ship, MapPin, Calendar } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background sunset image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/generated/hero-cruise-sunset.dim_1200x600.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/90 via-ocean-800/70 to-transparent" />
      </div>
      
      {/* Cruise ship hero image - full screen cover */}
      <div className="absolute inset-0">
        <img 
          src="/assets/generated/cruise-ship-hero.dim_1600x900.jpg" 
          alt="Cruise ship"
          className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-50"
        />
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/80 via-ocean-800/60 to-ocean-900/40" />
      
      <div className="container relative z-10 text-white">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            Sail Into Your
            <span className="block text-sunset-400">Dream Vacation</span>
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
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
                <div className="text-2xl font-bold drop-shadow-md">500+</div>
                <div className="text-sm text-white/80 drop-shadow-sm">Cruise Options</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-md">
                <MapPin className="h-6 w-6 text-sunset-400" />
              </div>
              <div>
                <div className="text-2xl font-bold drop-shadow-md">100+</div>
                <div className="text-sm text-white/80 drop-shadow-sm">Destinations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
