import React from 'react';
import { useGetAllCruiseLineLogos } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export function CruiseLinePartners() {
  const { data: logos, isLoading } = useGetAllCruiseLineLogos();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Our Cruise Line Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We partner with the world's leading cruise lines to bring you the best vacation experiences
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="w-full h-32 rounded-lg" />
            ))}
          </div>
        ) : logos && logos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-8 items-center justify-items-center">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-full h-32"
              >
                <img
                  src={logo.imageUrl}
                  alt={`${logo.name} logo`}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No cruise line partners available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
