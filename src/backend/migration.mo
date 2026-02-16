import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldActor = {
    cruiseDeals : Map.Map<Text, {
      id : Text;
      cruiseLine : Text;
      shipName : Text;
      destination : Text;
      duration : Nat;
      startingPrice : Nat;
      promotional : Bool;
      lastUpdated : Time.Time;
    }>;
    itineraries : Map.Map<Text, {
      id : Text;
      shipSpecs : Text;
      amenities : [Text];
      portsOfCall : [Text];
      departureDate : Text;
      returnDate : Text;
      cabins : [{
        category : Text;
        price : Nat;
        availability : Nat;
      }];
      diningOptions : [Text];
      entertainment : [Text];
      images : [Text];
    }>;
    userFavorites : Map.Map<Principal, [Text]>;
    reviews : Map.Map<Text, {
      id : Text;
      userId : Principal;
      cruiseId : Text;
      rating : Nat;
      title : Text;
      comment : Text;
      createdAt : Time.Time;
    }>;
    bookings : Map.Map<Text, {
      id : Text;
      userId : Principal;
      itineraryId : Text;
      cabins : [{
        category : Text;
        price : Nat;
        availability : Nat;
      }];
      totalCost : Nat;
      status : {
        #pending;
        #confirmed;
        #declined;
      };
      bookingDate : Time.Time;
    }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    persistentAlerts : Map.Map<Text, {
      id : Text;
      bookingId : Text;
      cruiseName : Text;
      userName : Text;
      numberOfCabins : Nat;
      totalCost : Nat;
      createdAt : Time.Time;
      viewed : Bool;
      isPersistent : Bool;
    }>;
    viewingAlerts : Map.Map<Text, {
      id : Text;
      bookingId : Text;
      cruiseName : Text;
      userName : Text;
      numberOfCabins : Nat;
      totalCost : Nat;
      createdAt : Time.Time;
      viewed : Bool;
      isPersistent : Bool;
    }>;
    cruiseLineLogos : Map.Map<Text, {
      name : Text;
      imageUrl : Text;
    }>;
    shareableLinks : Map.Map<Text, {
      itineraryId : Text;
      sharedBy : Principal;
      sharedAt : Time.Time;
      isActive : Bool;
      itinerary : {
        id : Text;
        shipSpecs : Text;
        amenities : [Text];
        portsOfCall : [Text];
        departureDate : Text;
        returnDate : Text;
        cabins : [{
          category : Text;
          price : Nat;
          availability : Nat;
        }];
        diningOptions : [Text];
        entertainment : [Text];
        images : [Text];
      };
    }>;
  };

  type NewActor = {
    cruiseDeals : Map.Map<Text, {
      id : Text;
      cruiseLine : Text;
      shipName : Text;
      destination : Text;
      duration : Nat;
      startingPrice : Nat;
      promotional : Bool;
      lastUpdated : Time.Time;
    }>;
    itineraries : Map.Map<Text, {
      id : Text;
      shipSpecs : Text;
      amenities : [Text];
      portsOfCall : [Text];
      departureDate : Text;
      returnDate : Text;
      cabins : [{
        category : Text;
        price : Nat;
        availability : Nat;
      }];
      diningOptions : [Text];
      entertainment : [Text];
      images : [Text];
    }>;
    userFavorites : Map.Map<Principal, [Text]>;
    reviews : Map.Map<Text, {
      id : Text;
      userId : Principal;
      cruiseId : Text;
      rating : Nat;
      title : Text;
      comment : Text;
      createdAt : Time.Time;
    }>;
    bookings : Map.Map<Text, {
      id : Text;
      userId : Principal;
      itineraryId : Text;
      cabins : [{
        category : Text;
        price : Nat;
        availability : Nat;
      }];
      totalCost : Nat;
      status : {
        #pending;
        #confirmed;
        #declined;
      };
      bookingDate : Time.Time;
    }>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    persistentAlerts : Map.Map<Text, {
      id : Text;
      bookingId : Text;
      cruiseName : Text;
      userName : Text;
      numberOfCabins : Nat;
      totalCost : Nat;
      createdAt : Time.Time;
      viewed : Bool;
      isPersistent : Bool;
    }>;
    viewingAlerts : Map.Map<Text, {
      id : Text;
      bookingId : Text;
      cruiseName : Text;
      userName : Text;
      numberOfCabins : Nat;
      totalCost : Nat;
      createdAt : Time.Time;
      viewed : Bool;
      isPersistent : Bool;
    }>;
    cruiseLineLogos : Map.Map<Text, {
      name : Text;
      imageUrl : Text;
    }>;
    shareableLinks : Map.Map<Text, {
      itineraryId : Text;
      sharedBy : Principal;
      sharedAt : Time.Time;
      isActive : Bool;
      itinerary : {
        id : Text;
        shipSpecs : Text;
        amenities : [Text];
        portsOfCall : [Text];
        departureDate : Text;
        returnDate : Text;
        cabins : [{
          category : Text;
          price : Nat;
          availability : Nat;
        }];
        diningOptions : [Text];
        entertainment : [Text];
        images : [Text];
      };
    }>;
    brandingSettings : {
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
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      brandingSettings = {
        backgroundColor = "#ffffff";
        headerImage = "";
        footerText = "© 2023 Cruise Island";
        fontColor = "#000000";
        accentColor = "#1db954";
        showLogo = true;
        logoPosition = "top-left";
        bannerText = "Your Dream Cruise Awaits!";
        enableSocialLinks = true;
        facebookLink = "";
        instagramLink = "";
        youtubeLink = "";
        privacyPolicyUrl = "";
        termsConditionsUrl = "";
        enableAnalytics = false;
        defaultLanguage = "en";
        showNewsletterSignup = false;
        customCss = "";
        heroBannerText = "Sail the World in Style";
        heroBannerImage = "";
      };
    };
  };
};
