import { Heart, Anchor } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiLinkedin } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-ocean-900 dark:bg-ocean-950 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/assets/generated/next-time-vacations-logo-transparent.dim_200x200.png" 
                alt="Next Time Vacations" 
                className="h-10 w-10"
              />
              <span className="text-lg font-bold">Next Time Vacations</span>
            </div>
            <p className="text-sm text-white/80">
              Your trusted partner for unforgettable cruise experiences around the world.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#home" className="hover:text-sunset-400 transition-colors">Home</a></li>
              <li><a href="#deals" className="hover:text-sunset-400 transition-colors">Featured Deals</a></li>
              <li><a href="#search" className="hover:text-sunset-400 transition-colors">Search Cruises</a></li>
              <li><a href="#about" className="hover:text-sunset-400 transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Destinations</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-sunset-400 transition-colors">Caribbean</a></li>
              <li><a href="#" className="hover:text-sunset-400 transition-colors">Mediterranean</a></li>
              <li><a href="#" className="hover:text-sunset-400 transition-colors">Alaska</a></li>
              <li><a href="#" className="hover:text-sunset-400 transition-colors">Asia Pacific</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="hover:text-sunset-400 transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-sunset-400 transition-colors">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-sunset-400 transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-sunset-400 transition-colors">
                <SiLinkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-white/80">
              Call us: 434-238-8796
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
          <p className="flex items-center justify-center gap-1 flex-wrap">
            © 2025. Built with <Heart className="h-4 w-4 text-sunset-400 fill-sunset-400" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sunset-400 hover:text-sunset-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
