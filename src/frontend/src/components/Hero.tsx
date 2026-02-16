import { Button } from '@/components/ui/button';
import { Ship, MapPin, Calendar } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/generated/hero-cruise-sunset.dim_1200x600.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/90 via-ocean-800/70 to-transparent" />
      </div>
      
      <div className="container relative z-10 text-white">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Sail Into Your
            <span className="block text-sunset-400">Dream Vacation</span>
          </h1>
          <p className="text-xl text-white/90">
            Discover incredible cruise deals to the world's most breathtaking destinations. 
            Your next adventure starts here.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="bg-sunset-500 hover:bg-sunset-600 text-white">
              <Ship className="mr-2 h-5 w-5" />
              Explore Cruises
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              <Calendar className="mr-2 h-5 w-5" />
              View Itineraries
            </Button>
          </div>

          <div className="flex flex-wrap gap-8 pt-8">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Ship className="h-6 w-6 text-sunset-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/80">Cruise Options</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MapPin className="h-6 w-6 text-sunset-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-white/80">Destinations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
