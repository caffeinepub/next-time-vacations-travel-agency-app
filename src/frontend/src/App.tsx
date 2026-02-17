import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedDeals } from './components/FeaturedDeals';
import { SearchSection } from './components/SearchSection';
import { Footer } from './components/Footer';
import { ProfileSetupDialog } from './components/ProfileSetupDialog';
import { AdminAlertToast } from './components/AdminAlertToast';
import { CruiseLinePartners } from './components/CruiseLinePartners';
import { SharedItineraryPage } from './components/SharedItineraryPage';
import { useEffect, useState } from 'react';

function App() {
  const [shareLinkId, setShareLinkId] = useState<string | null>(null);

  useEffect(() => {
    // Function to extract share parameter from URL
    const checkForShareLink = () => {
      // Check both query string and hash for share parameter
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const shareParam = urlParams.get('share') || hashParams.get('share');
      setShareLinkId(shareParam);
    };

    // Check on mount
    checkForShareLink();

    // Listen for URL changes (back/forward navigation, manual URL changes)
    const handlePopState = () => {
      checkForShareLink();
    };

    window.addEventListener('popstate', handlePopState);
    
    // Also listen for hash changes
    window.addEventListener('hashchange', checkForShareLink);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', checkForShareLink);
    };
  }, []);

  // If there's a share link, show the shared itinerary page
  if (shareLinkId) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SharedItineraryPage linkId={shareLinkId} />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Otherwise, show the normal app
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main>
          <Hero />
          <FeaturedDeals />
          <CruiseLinePartners />
          <SearchSection />
        </main>
        <Footer />
        <ProfileSetupDialog />
        <AdminAlertToast />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
