import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAllBookings, useGetItinerary, useGetAdminAlerts, useMarkAlertsAsViewed } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Ship, Calendar, DollarSign, Bed, Bell, Shield, Image as ImageIcon, Palette } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Booking, AdminAlert } from '../backend';
import { useEffect } from 'react';
import { CruiseLineLogosManagement } from './CruiseLineLogosManagement';
import { SharedPageBrandingSettingsTab } from './SharedPageBrandingSettingsTab';

interface AdminDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminDashboardDialog({ open, onOpenChange }: AdminDashboardDialogProps) {
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();
  const { data: alerts, isLoading: alertsLoading } = useGetAdminAlerts();
  const markAsViewed = useMarkAlertsAsViewed();

  // Mark alerts as viewed when dialog opens
  useEffect(() => {
    if (open && alerts && alerts.length > 0) {
      const unviewedAlerts = alerts.filter(alert => !alert.viewed);
      if (unviewedAlerts.length > 0) {
        markAsViewed.mutate();
      }
    }
  }, [open, alerts]);

  const pendingBookings = bookings?.filter((b) => b.status === 'pending') || [];
  const processedBookings = bookings?.filter((b) => b.status !== 'pending') || [];
  const unviewedAlerts = alerts?.filter(alert => !alert.viewed) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-ocean-700 dark:text-ocean-400 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Admin Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts" className="relative">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
              {unviewedAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unviewedAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="mr-2 h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="logos">
              <ImageIcon className="mr-2 h-4 w-4" />
              Logos
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Palette className="mr-2 h-4 w-4" />
              Branding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-4">
            <ScrollArea className="h-[55vh] pr-4">
              {alertsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <AdminAlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No booking alerts</p>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4">
            <ScrollArea className="h-[55vh] pr-4">
              {bookingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pending Bookings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Pending Bookings ({pendingBookings.length})
                    </h3>
                    {pendingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {pendingBookings.map((booking) => (
                          <AdminBookingCard key={booking.id} booking={booking} />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <p className="text-muted-foreground">No pending bookings</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Processed Bookings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Processed Bookings ({processedBookings.length})
                    </h3>
                    {processedBookings.length > 0 ? (
                      <div className="space-y-4">
                        {processedBookings.map((booking) => (
                          <AdminBookingCard key={booking.id} booking={booking} />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <p className="text-muted-foreground">No processed bookings</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="logos" className="mt-4">
            <ScrollArea className="h-[55vh] pr-4">
              <CruiseLineLogosManagement />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="branding" className="mt-4">
            <ScrollArea className="h-[55vh] pr-4">
              <SharedPageBrandingSettingsTab />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface AdminAlertCardProps {
  alert: AdminAlert;
}

function AdminAlertCard({ alert }: AdminAlertCardProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Alert className={alert.viewed ? 'border-muted' : 'border-sunset-500 bg-sunset-50 dark:bg-sunset-950/20'}>
      <Bell className={`h-4 w-4 ${alert.viewed ? 'text-muted-foreground' : 'text-sunset-600'}`} />
      <AlertTitle className="flex items-center justify-between">
        <span className="font-semibold">New Booking Received</span>
        {!alert.viewed && (
          <Badge variant="destructive" className="ml-2">New</Badge>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Cruise:</span> {alert.cruiseName}
          </div>
          <div>
            <span className="font-medium">Guest:</span> {alert.userName}
          </div>
          <div>
            <span className="font-medium">Cabins:</span> {Number(alert.numberOfCabins)}
          </div>
          <div>
            <span className="font-medium">Total:</span> ${Number(alert.totalCost).toLocaleString()}
          </div>
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {formatDate(alert.createdAt)}
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface AdminBookingCardProps {
  booking: Booking;
}

function AdminBookingCard({ booking }: AdminBookingCardProps) {
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
        <div className="text-sm text-muted-foreground">
          User: {booking.userId.toString().slice(0, 10)}...
        </div>
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
