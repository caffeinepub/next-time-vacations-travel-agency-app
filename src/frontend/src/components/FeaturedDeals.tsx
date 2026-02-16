import { useGetFeaturedDeals } from '../hooks/useQueries';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CruiseCard } from './CruiseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useEffect, useCallback, useState } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

export function FeaturedDeals() {
  const { data: deals, isLoading, error } = useGetFeaturedDeals();
  const [api, setApi] = useState<CarouselApi>();

  const scrollNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api, scrollNext]);

  if (error) {
    return (
      <section id="deals" className="py-16 bg-muted/30">
        <div className="container">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load featured deals. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="deals" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-ocean-700 dark:text-ocean-400">
            Featured Cruise Deals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of incredible cruise offers from the world's top cruise lines
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : deals && deals.length > 0 ? (
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {deals.map((deal) => (
                <CarouselItem key={deal.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <CruiseCard deal={deal} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured deals available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
