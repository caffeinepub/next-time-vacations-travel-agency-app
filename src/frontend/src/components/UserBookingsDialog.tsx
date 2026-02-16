import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetUserBookings, useGetItinerary } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Ship, Calendar, DollarSign, Bed } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Booking } from '../backend';

interface UserBookingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserBookingsDialog({ open, onOpenChange }: UserBookingsDialogProps) {
  const { data: bookings, isLoading } = useGetUserBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'declined':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-ocean-700 dark:text-ocean-400">
            My Bookings
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  You haven't made any bookings yet. Start exploring our cruise deals!
                </p>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const { data: itinerary } = useGetItinerary(booking.itineraryId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'declined':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Booking #{booking.id.slice(0, 8)}</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {itinerary && (
          <div className="flex items-center gap-2 text-sm">
            <Ship className="h-4 w-4 text-ocean-600" />
            <span className="font-medium">{itinerary.shipSpecs}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Booked on {formatDate(booking.bookingDate)}</span>
        </div>
        {itinerary && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Trip: {itinerary.departureDate} - {itinerary.returnDate}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Bed className="h-4 w-4 text-ocean-600" />
          <span>
            {booking.cabins.length} cabin{booking.cabins.length > 1 ? 's' : ''} (
            {booking.cabins.map((c) => c.category).join(', ')})
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t">
          <DollarSign className="h-5 w-5 text-sunset-600" />
          <span className="text-xl font-bold text-sunset-600 dark:text-sunset-400">
            ${Number(booking.totalCost).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
