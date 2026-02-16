import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [shareLinkId, setShareLinkId] = useState<string | null>(null);

  useEffect(() => {
    // Check for share link in URL
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');
    if (shareParam) {
      setShareLinkId(shareParam);
    }
  }, []);

  // If there's a share link, show the shared itinerary page
  if (shareLinkId) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SharedItineraryPage linkId={shareLinkId} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Otherwise, show the normal app
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
