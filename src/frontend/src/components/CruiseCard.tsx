import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ship, MapPin, Clock, DollarSign, Heart } from 'lucide-react';
import type { CruiseDeal } from '../backend';
import { useState } from 'react';
import { ItineraryDialog } from './ItineraryDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAddFavorite, useRemoveFavorite, useGetFavorites } from '../hooks/useQueries';
import { toast } from 'sonner';

interface CruiseCardProps {
  deal: CruiseDeal;
}

export function CruiseCard({ deal }: CruiseCardProps) {
  const [showItinerary, setShowItinerary] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: favorites } = useGetFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isAuthenticated = !!identity;
  const isFavorite = favorites?.includes(deal.id) || false;

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync(deal.id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite.mutateAsync(deal.id);
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  const getDestinationImage = (destination: string) => {
    const dest = destination.toLowerCase();
    if (dest.includes('caribbean')) return '/assets/generated/caribbean-beach.dim_800x500.jpg';
    if (dest.includes('mediterranean')) return '/assets/generated/mediterranean-coast.dim_800x500.jpg';
    return '/assets/generated/cruise-deck-pool.dim_800x500.jpg';
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={getDestinationImage(deal.destination)}
            alt={deal.destination}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {deal.promotional && (
            <Badge className="absolute top-4 right-4 bg-sunset-500 hover:bg-sunset-600 text-white">
              Special Offer
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            className={`absolute top-4 left-4 bg-white/90 hover:bg-white ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardHeader className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-ocean-700 dark:text-ocean-400 mb-1">
                {deal.shipName}
              </h3>
              <p className="text-sm text-muted-foreground">{deal.cruiseLine}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-ocean-600 dark:text-ocean-400" />
            <span className="font-medium">{deal.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-ocean-600 dark:text-ocean-400" />
            <span>{Number(deal.duration)} Days</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-sunset-600 dark:text-sunset-400" />
            <div>
              <span className="text-2xl font-bold text-sunset-600 dark:text-sunset-400">
                ${Number(deal.startingPrice).toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground ml-1">per person</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button 
            className="flex-1 bg-ocean-600 hover:bg-ocean-700 text-white"
            onClick={() => setShowItinerary(true)}
          >
            <Ship className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </CardFooter>
      </Card>

      <ItineraryDialog 
        open={showItinerary} 
        onOpenChange={setShowItinerary}
        cruiseId={deal.id}
      />
    </>
  );
}
