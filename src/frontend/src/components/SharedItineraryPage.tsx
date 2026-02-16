import { useGetShareableLink } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Ship, MapPin, Calendar, Utensils, Music, Bed, Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SharedItineraryPageProps {
  linkId: string;
}

export function SharedItineraryPage({ linkId }: SharedItineraryPageProps) {
  const { data: shareableLink, isLoading, error } = useGetShareableLink(linkId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !shareableLink || !shareableLink.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Itinerary Not Available</AlertTitle>
            <AlertDescription>
              The shared itinerary link is invalid or has expired. Please contact the person who shared this link with you.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const itinerary = shareableLink.itinerary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-sunset-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-ocean-700 dark:text-ocean-400">
            Cruise Itinerary
          </h1>
          <p className="text-muted-foreground">
            Shared with you by Next Time Vacations
          </p>
        </div>

        {/* Images Gallery */}
        {itinerary.images && itinerary.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {itinerary.images.slice(0, 4).map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`Cruise view ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        )}

        {/* Ship Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-ocean-600" />
              Ship Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{itinerary.shipSpecs}</p>
          </CardContent>
        </Card>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-ocean-600" />
                <span className="text-sm font-medium">Departure</span>
              </div>
              <p className="text-lg font-bold">{itinerary.departureDate}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-ocean-600" />
                <span className="text-sm font-medium">Return</span>
              </div>
              <p className="text-lg font-bold">{itinerary.returnDate}</p>
            </CardContent>
          </Card>
        </div>

        {/* Ports of Call */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ocean-600" />
              Ports of Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itinerary.portsOfCall.map((port, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-700 dark:text-ocean-400 font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{port}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cabins */}
        {itinerary.cabins && itinerary.cabins.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-ocean-600" />
                Cabin Categories & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {itinerary.cabins.map((cabin, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-semibold">{cabin.category}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {Number(cabin.availability)} cabins available
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-sunset-600 dark:text-sunset-400">
                        ${Number(cabin.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dining Options */}
        {itinerary.diningOptions && itinerary.diningOptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-ocean-600" />
                Dining Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {itinerary.diningOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-ocean-600" />
                    <p>{option}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entertainment */}
        {itinerary.entertainment && itinerary.entertainment.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-ocean-600" />
                Entertainment & Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {itinerary.entertainment.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-sunset-600" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amenities */}
        {itinerary.amenities && itinerary.amenities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ship Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {itinerary.amenities.map((amenity, idx) => (
                  <Badge key={idx} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="bg-ocean-50 dark:bg-ocean-950 border-ocean-200 dark:border-ocean-800">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold text-ocean-700 dark:text-ocean-400 mb-2">
              Interested in booking this cruise?
            </p>
            <p className="text-muted-foreground mb-4">
              Contact Next Time Vacations to reserve your spot!
            </p>
            <p className="text-xl font-bold text-ocean-600 dark:text-ocean-400">
              📞 434-238-8796
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
