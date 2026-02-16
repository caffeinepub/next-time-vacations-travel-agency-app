import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Ship, Calendar, Bed, DollarSign } from 'lucide-react';
import { useBookTrip } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Itinerary, Cabin } from '../backend';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itinerary: Itinerary;
}

export function BookingModal({ open, onOpenChange, itinerary }: BookingModalProps) {
  const [selectedCabins, setSelectedCabins] = useState<Map<string, number>>(new Map());
  const bookTrip = useBookTrip();

  const handleCabinSelection = (cabin: Cabin, checked: boolean) => {
    const newSelection = new Map(selectedCabins);
    if (checked) {
      newSelection.set(cabin.category, 1);
    } else {
      newSelection.delete(cabin.category);
    }
    setSelectedCabins(newSelection);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedCabins.forEach((quantity, category) => {
      const cabin = itinerary.cabins.find((c) => c.category === category);
      if (cabin) {
        total += Number(cabin.price) * quantity;
      }
    });
    return total;
  };

  const handleBooking = async () => {
    if (selectedCabins.size === 0) {
      toast.error('Please select at least one cabin');
      return;
    }

    const cabinsToBook: Cabin[] = [];
    selectedCabins.forEach((quantity, category) => {
      const cabin = itinerary.cabins.find((c) => c.category === category);
      if (cabin) {
        cabinsToBook.push(cabin);
      }
    });

    try {
      await bookTrip.mutateAsync({
        itineraryId: itinerary.id,
        cabins: cabinsToBook,
        totalCost: BigInt(calculateTotal()),
      });
      toast.success('Booking submitted successfully! Awaiting confirmation.');
      onOpenChange(false);
      setSelectedCabins(new Map());
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit booking');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-ocean-700 dark:text-ocean-400">
            Book Your Cruise
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cruise Summary */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-ocean-600" />
                <span className="font-semibold">{itinerary.shipSpecs}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {itinerary.departureDate} - {itinerary.returnDate}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cabin Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Select Cabins</Label>
            <div className="space-y-3">
              {itinerary.cabins.map((cabin) => {
                const isSelected = selectedCabins.has(cabin.category);
                const isAvailable = Number(cabin.availability) > 0;

                return (
                  <Card
                    key={cabin.category}
                    className={`${
                      isSelected ? 'border-ocean-600 bg-ocean-50 dark:bg-ocean-950' : ''
                    } ${!isAvailable ? 'opacity-50' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleCabinSelection(cabin, checked as boolean)
                            }
                            disabled={!isAvailable}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <Bed className="h-4 w-4 text-ocean-600" />
                              <span className="font-semibold">{cabin.category}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {isAvailable
                                ? `${Number(cabin.availability)} available`
                                : 'Sold out'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-sunset-600 dark:text-sunset-400">
                            ${Number(cabin.price).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-sunset-600" />
              <span>Total Cost:</span>
            </div>
            <span className="text-2xl text-sunset-600 dark:text-sunset-400">
              ${calculateTotal().toLocaleString()}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={selectedCabins.size === 0 || bookTrip.isPending}
            className="bg-ocean-600 hover:bg-ocean-700 text-white"
          >
            {bookTrip.isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
