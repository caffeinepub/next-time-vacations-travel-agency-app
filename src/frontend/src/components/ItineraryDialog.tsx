import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetItinerary, useGetReviewsByCruiseId, useGetAverageRating, useCreateShareableLink } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, MapPin, Calendar, Utensils, Music, Bed, Users, Star, Share2, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';
import { BookingModal } from './BookingModal';
import { ReviewSection } from './ReviewSection';
import { toast } from 'sonner';
import { generateItineraryPDF } from '../utils/itineraryPdf';

interface ItineraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cruiseId: string;
}

export function ItineraryDialog({ open, onOpenChange, cruiseId }: ItineraryDialogProps) {
  const { data: itinerary, isLoading } = useGetItinerary(cruiseId);
  const { data: reviews } = useGetReviewsByCruiseId(cruiseId);
  const { data: averageRating } = useGetAverageRating(cruiseId);
  const { identity } = useInternetIdentity();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const createShareableLink = useCreateShareableLink();
  const isAuthenticated = !!identity;

  const handleBooking = () => {
    setShowBookingModal(true);
  };

  const handleShareableLink = async () => {
    if (!itinerary) {
      toast.error('Itinerary data is not available');
      return;
    }

    try {
      const linkId = await createShareableLink.mutateAsync(itinerary.id);
      const shareableUrl = `${window.location.origin}?share=${linkId}`;
      
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Shareable link copied to clipboard!', {
        description: 'Share this link with your clients to view the itinerary.',
      });
    } catch (error) {
      console.error('Error creating shareable link:', error);
      toast.error('Failed to create shareable link', {
        description: 'Please try again later.',
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!itinerary) {
      toast.error('Itinerary data is not available');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await generateItineraryPDF(itinerary);
      toast.success('PDF print dialog opened!', {
        description: 'Use your browser\'s print dialog to save as PDF.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl text-ocean-700 dark:text-ocean-400 flex items-center justify-between">
              <span>Cruise Itinerary Details</span>
              {averageRating !== undefined && averageRating > 0 && (
                <div className="flex items-center gap-2">
                  {renderStars(averageRating)}
                  <span className="text-sm text-muted-foreground">
                    ({reviews?.length || 0} reviews)
                  </span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : itinerary ? (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Images Gallery */}
                {itinerary.images && itinerary.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {itinerary.images.slice(0, 4).map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Cruise view ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
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
                <div className="grid grid-cols-2 gap-4">
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

                <Tabs defaultValue="itinerary" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="cabins">Cabins</TabsTrigger>
                    <TabsTrigger value="dining">Dining</TabsTrigger>
                    <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="itinerary" className="space-y-4">
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
                  </TabsContent>

                  <TabsContent value="cabins" className="space-y-4">
                    <div className="grid gap-4">
                      {itinerary.cabins.map((cabin, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Bed className="h-5 w-5 text-ocean-600" />
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="dining" className="space-y-4">
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
                  </TabsContent>

                  <TabsContent value="entertainment" className="space-y-4">
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
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-4">
                    <ReviewSection cruiseId={cruiseId} />
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex gap-3 flex-wrap">
                  <Button 
                    className="flex-1 bg-ocean-600 hover:bg-ocean-700 text-white" 
                    size="lg"
                    onClick={handleBooking}
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Book This Cruise' : 'Login to Book'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleShareableLink}
                    disabled={createShareableLink.isPending}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {createShareableLink.isPending ? 'Generating...' : 'Share Link'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Itinerary details not available.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {itinerary && (
        <BookingModal
          open={showBookingModal}
          onOpenChange={setShowBookingModal}
          itinerary={itinerary}
        />
      )}
    </>
  );
}
