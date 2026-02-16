import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetFavorites, useGetAllCruiseDeals } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { CruiseCard } from './CruiseCard';
import { Heart } from 'lucide-react';

interface FavoritesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FavoritesDialog({ open, onOpenChange }: FavoritesDialogProps) {
  const { data: favorites, isLoading: favoritesLoading } = useGetFavorites();
  const { data: allDeals, isLoading: dealsLoading } = useGetAllCruiseDeals();

  const isLoading = favoritesLoading || dealsLoading;
  const favoriteDeals = allDeals?.filter(deal => favorites?.includes(deal.id)) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-ocean-700 dark:text-ocean-400 flex items-center gap-2">
            <Heart className="h-6 w-6 fill-current text-red-500" />
            My Favorite Cruises
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          ) : favoriteDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDeals.map((deal) => (
                <CruiseCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No favorites yet</p>
              <p className="text-sm text-muted-foreground">
                Start adding cruises to your favorites by clicking the heart icon on cruise cards
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
