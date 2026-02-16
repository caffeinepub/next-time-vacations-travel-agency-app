import { useQuery, useMutation, useQueryClient, MutationCache } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CruiseDeal, Itinerary, SearchFilters, UserProfile, Review, Booking, Cabin, BookingStatus, AdminAlert, UserRole, CruiseLineLogo, ShareableLink, BrandingSettings } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetFeaturedDeals() {
  const { actor, isFetching } = useActor();

  return useQuery<CruiseDeal[]>({
    queryKey: ['featuredDeals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedDeals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCruiseDeals() {
  const { actor, isFetching } = useActor();

  return useQuery<CruiseDeal[]>({
    queryKey: ['allCruiseDeals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCruiseDeals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetItinerary(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Itinerary | null>({
    queryKey: ['itinerary', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getItinerary(id);
      } catch (error) {
        console.error('Error fetching itinerary:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchItineraries(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Itinerary[]>({
    queryKey: ['searchItineraries', searchText],
    queryFn: async () => {
      if (!actor || !searchText) return [];
      return actor.searchItineraries(searchText);
    },
    enabled: !!actor && !isFetching && searchText.length > 0,
  });
}

export function useSearchCruisesWithFilters(searchText: string, filters: SearchFilters) {
  const { actor, isFetching } = useActor();

  return useQuery<CruiseDeal[]>({
    queryKey: ['searchCruisesWithFilters', searchText, filters],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchCruisesWithFilters(searchText, filters);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCruiseDeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      cruiseLine: string;
      shipName: string;
      destination: string;
      duration: bigint;
      startingPrice: bigint;
      promotional: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addCruiseDeal(
        params.id,
        params.cruiseLine,
        params.shipName,
        params.destination,
        params.duration,
        params.startingPrice,
        params.promotional
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredDeals'] });
      queryClient.invalidateQueries({ queryKey: ['allCruiseDeals'] });
    },
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Favorites Queries
export function useGetFavorites() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFavorites();
      } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cruiseId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addFavorite(cruiseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cruiseId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeFavorite(cruiseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

// Review Queries
export function useGetReviewsByCruiseId(cruiseId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', cruiseId],
    queryFn: async () => {
      if (!actor || !cruiseId) return [];
      try {
        return await actor.getReviewsByCruiseId(cruiseId);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!cruiseId,
  });
}

export function useGetAverageRating(cruiseId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['averageRating', cruiseId],
    queryFn: async () => {
      if (!actor || !cruiseId) return 0;
      try {
        return await actor.getAverageRatingByCruiseId(cruiseId);
      } catch (error) {
        console.error('Error fetching average rating:', error);
        return 0;
      }
    },
    enabled: !!actor && !isFetching && !!cruiseId,
  });
}

export function useGetUserReviews() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Review[]>({
    queryKey: ['userReviews'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getUserReviews();
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { cruiseId: string; rating: bigint; title: string; comment: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitReview(params.cruiseId, params.rating, params.title, params.comment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.cruiseId] });
      queryClient.invalidateQueries({ queryKey: ['averageRating', variables.cruiseId] });
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
    },
  });
}

export function useUpdateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { reviewId: string; rating: bigint; title: string; comment: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateReview(params.reviewId, params.rating, params.title, params.comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['averageRating'] });
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
    },
  });
}

export function useDeleteReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteReview(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['averageRating'] });
      queryClient.invalidateQueries({ queryKey: ['userReviews'] });
    },
  });
}

// Booking Queries
export function useGetUserBookings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getBookingsByUser({});
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Booking[]>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllBookings({});
      } catch (error) {
        console.error('Error fetching all bookings:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useBookTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { itineraryId: string; cabins: Cabin[]; totalCost: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.bookTrip(params.itineraryId, params.cabins, params.totalCost);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['itinerary', variables.itineraryId] });
      queryClient.invalidateQueries({ queryKey: ['adminAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['hasViewingAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { bookingId: string; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      // Note: Backend doesn't have updateBookingStatus, but we'll keep this for future use
      // For now, this will throw an error if called
      throw new Error('Update booking status not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      try {
        return await actor.getCallerUserRole();
      } catch (error) {
        return 'guest' as UserRole;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.assignCallerUserRole(params.user, params.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
    },
  });
}

// Admin Alert Queries
export function useGetAdminAlerts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AdminAlert[]>({
    queryKey: ['adminAlerts'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAdminAlerts();
      } catch (error) {
        console.error('Error fetching admin alerts:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 5000, // Poll every 5 seconds for new alerts
  });
}

export function useHasViewingAlerts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['hasViewingAlerts'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.hasViewingAlerts();
      } catch (error) {
        console.error('Error checking viewing alerts:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 3000, // Poll every 3 seconds for badge updates
  });
}

export function useMarkAlertsAsViewed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.markAlertsAsViewed();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAlerts'] });
      queryClient.invalidateQueries({ queryKey: ['hasViewingAlerts'] });
    },
  });
}

export function useRemoveViewingAlerts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeViewingAlerts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasViewingAlerts'] });
    },
  });
}

// Cruise Line Logo Queries
export function useGetAllCruiseLineLogos() {
  const { actor, isFetching } = useActor();

  return useQuery<CruiseLineLogo[]>({
    queryKey: ['cruiseLineLogos'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllCruiseLineLogos();
      } catch (error) {
        console.error('Error fetching cruise line logos:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCruiseLineLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addCruiseLineLogo(params.name, params.imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruiseLineLogos'] });
    },
  });
}

export function useUpdateCruiseLineLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateCruiseLineLogo(params.name, params.imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruiseLineLogos'] });
    },
  });
}

export function useDeleteCruiseLineLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteCruiseLineLogo(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruiseLineLogos'] });
    },
  });
}

// Shareable Link Queries
export function useGetShareableLink(linkId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ShareableLink | null>({
    queryKey: ['shareableLink', linkId],
    queryFn: async () => {
      if (!actor || !linkId) return null;
      try {
        return await actor.getShareableLink(linkId);
      } catch (error) {
        console.error('Error fetching shareable link:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!linkId,
  });
}

export function useCreateShareableLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itineraryId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createShareableLink(itineraryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shareableLinks'] });
    },
  });
}

// Branding Settings Queries
export function useGetBrandingSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<BrandingSettings>({
    queryKey: ['brandingSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBrandingSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateBrandingSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: BrandingSettings) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateBrandingSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandingSettings'] });
    },
  });
}
