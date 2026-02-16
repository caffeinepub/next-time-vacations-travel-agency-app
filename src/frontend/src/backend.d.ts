import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SearchFilters {
    departureMonth?: string;
    destination?: string;
    minDuration?: bigint;
    maxPrice?: bigint;
    maxDuration?: bigint;
    minPrice?: bigint;
    cruiseLine?: string;
}
export interface CruiseLineLogo {
    name: string;
    imageUrl: string;
}
export type Time = bigint;
export interface Cabin {
    availability: bigint;
    category: string;
    price: bigint;
}
export interface AdminAlert {
    id: string;
    userName: string;
    bookingId: string;
    createdAt: Time;
    totalCost: bigint;
    numberOfCabins: bigint;
    isPersistent: boolean;
    cruiseName: string;
    viewed: boolean;
}
export interface CruiseDeal {
    id: string;
    startingPrice: bigint;
    destination: string;
    duration: bigint;
    shipName: string;
    lastUpdated: Time;
    cruiseLine: string;
    promotional: boolean;
}
export interface ShareableLink {
    itineraryId: string;
    sharedAt: Time;
    sharedBy: Principal;
    isActive: boolean;
    itinerary: Itinerary;
}
export interface Itinerary {
    id: string;
    departureDate: string;
    entertainment: Array<string>;
    amenities: Array<string>;
    cabins: Array<Cabin>;
    portsOfCall: Array<string>;
    diningOptions: Array<string>;
    returnDate: string;
    shipSpecs: string;
    images: Array<string>;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export interface Booking {
    id: string;
    status: BookingStatus;
    itineraryId: string;
    userId: Principal;
    totalCost: bigint;
    bookingDate: Time;
    cabins: Array<Cabin>;
}
export interface Review {
    id: string;
    title: string;
    cruiseId: string;
    userId: Principal;
    createdAt: Time;
    comment: string;
    rating: bigint;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    pending = "pending",
    confirmed = "confirmed",
    declined = "declined"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCruiseDeal(id: string, cruiseLine: string, shipName: string, destination: string, duration: bigint, startingPrice: bigint, promotional: boolean): Promise<void>;
    addCruiseLineLogo(name: string, imageUrl: string): Promise<void>;
    addFavorite(cruiseId: string): Promise<void>;
    addItinerary(id: string, shipSpecs: string, amenities: Array<string>, portsOfCall: Array<string>, departureDate: string, returnDate: string, cabins: Array<Cabin>, diningOptions: Array<string>, entertainment: Array<string>, images: Array<string>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookTrip(itineraryId: string, cabins: Array<Cabin>, totalCost: bigint): Promise<void>;
    createShareableLink(itineraryId: string): Promise<string>;
    deactivateShareableLink(linkId: string): Promise<void>;
    deleteCruiseLineLogo(name: string): Promise<void>;
    deleteReview(reviewId: string): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAdminAlerts(): Promise<Array<AdminAlert>>;
    getAllBookings(arg0: {
    }): Promise<Array<Booking>>;
    getAllCruiseDeals(): Promise<Array<CruiseDeal>>;
    getAllCruiseLineLogos(): Promise<Array<CruiseLineLogo>>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getAllShareableLinks(arg0: {
    }): Promise<Array<ShareableLink>>;
    getAverageRatingByCruiseId(cruiseId: string): Promise<number>;
    getBookingsByUser(arg0: {
    }): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<string>>;
    getFeaturedDeals(): Promise<Array<CruiseDeal>>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getItinerary(id: string): Promise<Itinerary>;
    getReviewsByCruiseId(cruiseId: string): Promise<Array<Review>>;
    getShareableLink(linkId: string): Promise<ShareableLink | null>;
    getShareableLinksByUser(arg0: {
    }): Promise<Array<ShareableLink>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserReviews(): Promise<Array<Review>>;
    hasViewingAlerts(): Promise<boolean>;
    initialize(arg0: {
    }): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markAlertsAsViewed(): Promise<void>;
    removeFavorite(cruiseId: string): Promise<void>;
    removeViewingAlerts(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchCruisesWithFilters(searchText: string, filters: SearchFilters): Promise<Array<CruiseDeal>>;
    searchItineraries(searchText: string): Promise<Array<Itinerary>>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    submitReview(cruiseId: string, rating: bigint, title: string, comment: string): Promise<void>;
    updateCabinAvailability(itineraryId: string, category: string, availability: bigint): Promise<void>;
    updateCruiseDeal(id: string, cruiseLine: string, shipName: string, destination: string, duration: bigint, startingPrice: bigint, promotional: boolean): Promise<void>;
    updateCruiseLineLogo(name: string, imageUrl: string): Promise<void>;
    updateReview(reviewId: string, rating: bigint, title: string, comment: string): Promise<void>;
}
