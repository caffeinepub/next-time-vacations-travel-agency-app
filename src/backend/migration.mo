import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import InviteLinksModule "invite-links/invite-links-module";

module {
  // Define the types that were previously only in the actor (main.mo)
  type CruiseDeal = {
    id : Text;
    cruiseLine : Text;
    shipName : Text;
    destination : Text;
    duration : Nat;
    startingPrice : Nat;
    promotional : Bool;
    lastUpdated : Time.Time;
  };

  type Cabin = {
    category : Text;
    price : Nat;
    availability : Nat;
  };

  type Itinerary = {
    id : Text;
    shipSpecs : Text;
    amenities : [Text];
    portsOfCall : [Text];
    departureDate : Text;
    returnDate : Text;
    cabins : [Cabin];
    diningOptions : [Text];
    entertainment : [Text];
    images : [Text];
  };

  type ShareableLink = {
    itineraryId : Text;
    sharedBy : Principal;
    sharedAt : Time.Time;
    isActive : Bool;
    itinerary : Itinerary;
  };

  type SearchFilters = {
    destination : ?Text;
    cruiseLine : ?Text;
    minDuration : ?Nat;
    maxDuration : ?Nat;
    minPrice : ?Nat;
    maxPrice : ?Nat;
    departureMonth : ?Text;
  };

  type UserProfile = { name : Text };

  type BookingStatus = { #pending; #confirmed; #declined };

  type Booking = {
    id : Text;
    userId : Principal;
    itineraryId : Text;
    cabins : [Cabin];
    totalCost : Nat;
    status : BookingStatus;
    bookingDate : Time.Time;
  };

  type Review = {
    id : Text;
    userId : Principal;
    cruiseId : Text;
    rating : Nat;
    title : Text;
    comment : Text;
    createdAt : Time.Time;
  };

  type AdminAlert = {
    id : Text;
    bookingId : Text;
    cruiseName : Text;
    userName : Text;
    numberOfCabins : Nat;
    totalCost : Nat;
    createdAt : Time.Time;
    viewed : Bool;
    isPersistent : Bool;
  };

  type CruiseLineLogo = {
    name : Text;
    imageUrl : Text;
  };

  type BrandingSettings = {
    backgroundColor : Text;
    headerImage : Text;
    footerText : Text;
    fontColor : Text;
    accentColor : Text;
    showLogo : Bool;
    logoPosition : Text;
    bannerText : Text;
    enableSocialLinks : Bool;
    facebookLink : Text;
    instagramLink : Text;
    youtubeLink : Text;
    privacyPolicyUrl : Text;
    termsConditionsUrl : Text;
    enableAnalytics : Bool;
    defaultLanguage : Text;
    showNewsletterSignup : Bool;
    customCss : Text;
    heroBannerText : Text;
    heroBannerImage : Text;
  };

  // Actual migration function - one to one mapping for now.
  type Actor = {
    persistentAlerts : Map.Map<Text, AdminAlert>;
    viewingAlerts : Map.Map<Text, AdminAlert>;
    inviteState : InviteLinksModule.InviteLinksSystemState;
    accessControlState : AccessControl.AccessControlState;
    cruiseDeals : Map.Map<Text, CruiseDeal>;
    itineraries : Map.Map<Text, Itinerary>;
    userFavorites : Map.Map<Principal, [Text]>;
    reviews : Map.Map<Text, Review>;
    bookings : Map.Map<Text, Booking>;
    userProfiles : Map.Map<Principal, UserProfile>;
    cruiseLineLogos : Map.Map<Text, CruiseLineLogo>;
    shareableLinks : Map.Map<Text, ShareableLink>;
    brandingSettings : BrandingSettings;
    backendVersion : Text;
  };

  public func run(old : Actor) : Actor { old };
};

