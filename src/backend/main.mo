import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import InviteLinksModule "invite-links/invite-links-module";

import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let inviteState = InviteLinksModule.initState();

  var backendVersion : Text = "1.0.0";

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

  public type Itinerary = {
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

  public type UserProfile = {
    name : Text;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #declined;
  };

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

  public type AdminAlert = {
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

  public type BrandingSettings = {
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

  let cruiseDeals = Map.empty<Text, CruiseDeal>();
  let itineraries = Map.empty<Text, Itinerary>();
  let userFavorites = Map.empty<Principal, [Text]>();
  let reviews = Map.empty<Text, Review>();
  let bookings = Map.empty<Text, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var persistentAlerts = Map.empty<Text, AdminAlert>();
  var viewingAlerts = Map.empty<Text, AdminAlert>();
  var cruiseLineLogos = Map.empty<Text, CruiseLineLogo>();
  var shareableLinks = Map.empty<Text, ShareableLink>();

  var brandingSettings : BrandingSettings = {
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

  module CruiseDeal {
    public func compareByPrice(a : CruiseDeal, b : CruiseDeal) : Order.Order {
      Nat.compare(a.startingPrice, b.startingPrice);
    };

    public func compareByLastUpdated(a : CruiseDeal, b : CruiseDeal) : Order.Order {
      Int.compare(a.lastUpdated, b.lastUpdated);
    };
  };

  module Itinerary {
    public func compareByDepartureDate(a : Itinerary, b : Itinerary) : Order.Order {
      Text.compare(a.departureDate, b.departureDate);
    };

    public func compareByPrice(a : Itinerary, b : Itinerary) : Order.Order {
      switch (a.cabins.compare(b.cabins, Cabin.compareByPrice)) {
        case (#equal) { #equal };
        case (order) { order };
      };
    };
  };

  module Cabin {
    public func compareByPrice(a : Cabin, b : Cabin) : Order.Order {
      Nat.compare(a.price, b.price);
    };
  };

  public query func getBackendDiagnostics() : async (Time.Time, Text) {
    (Time.now(), backendVersion);
  };

  func joinTextArray(array : [Text], separator : Text) : Text {
    var result = "";
    for (i in Nat.range(0, array.size())) {
      if (i > 0) {
        result := result # separator;
      };
      result := result # array[i];
    };
    result;
  };

  public shared ({ caller }) func initialize(_ : {}) : async () {
    do {
      AccessControl.initialize(accessControlState, caller, "", "");
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addCruiseDeal(
    id : Text,
    cruiseLine : Text,
    shipName : Text,
    destination : Text,
    duration : Nat,
    startingPrice : Nat,
    promotional : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add cruise deals");
    };
    let deal : CruiseDeal = {
      id;
      cruiseLine;
      shipName;
      destination;
      duration;
      startingPrice;
      promotional;
      lastUpdated = Time.now();
    };
    cruiseDeals.add(id, deal);
  };

  public shared ({ caller }) func updateCruiseDeal(
    id : Text,
    cruiseLine : Text,
    shipName : Text,
    destination : Text,
    duration : Nat,
    startingPrice : Nat,
    promotional : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update cruise deals");
    };
    switch (cruiseDeals.get(id)) {
      case (null) { Runtime.trap("Cruise deal not found") };
      case (?_) {
        let updatedDeal : CruiseDeal = {
          id;
          cruiseLine;
          shipName;
          destination;
          duration;
          startingPrice;
          promotional;
          lastUpdated = Time.now();
        };
        cruiseDeals.add(id, updatedDeal);
      };
    };
  };

  public query func getFeaturedDeals() : async [CruiseDeal] {
    let deals = cruiseDeals.values().toArray().sort(CruiseDeal.compareByLastUpdated);
    deals.sliceToArray(0, Nat.min(deals.size(), 10));
  };

  public query func getAllCruiseDeals() : async [CruiseDeal] {
    cruiseDeals.values().toArray();
  };

  public shared ({ caller }) func addItinerary(
    id : Text,
    shipSpecs : Text,
    amenities : [Text],
    portsOfCall : [Text],
    departureDate : Text,
    returnDate : Text,
    cabins : [Cabin],
    diningOptions : [Text],
    entertainment : [Text],
    images : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add itineraries");
    };
    let itinerary : Itinerary = {
      id;
      shipSpecs;
      amenities;
      portsOfCall;
      departureDate;
      returnDate;
      cabins;
      diningOptions;
      entertainment;
      images;
    };
    itineraries.add(id, itinerary);
  };

  public query func getItinerary(id : Text) : async Itinerary {
    switch (itineraries.get(id)) {
      case (null) { Runtime.trap("Itinerary not found") };
      case (?itinerary) { itinerary };
    };
  };

  public query func searchItineraries(searchText : Text) : async [Itinerary] {
    let results = itineraries.values().toArray().filter(
      func(itinerary) {
        itinerary.portsOfCall.any(
          func(port) {
            port.contains(#text searchText);
          }
        );
      }
    );
    results;
  };

  public shared ({ caller }) func updateCabinAvailability(itineraryId : Text, category : Text, availability : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update cabin availability");
    };
    switch (itineraries.get(itineraryId)) {
      case (null) { Runtime.trap("Itinerary not found") };
      case (?itinerary) {
        let updatedCabins = itinerary.cabins.map(
          func(cabin) {
            if (cabin.category == category) {
              { category = cabin.category; price = cabin.price; availability };
            } else { cabin };
          }
        );
        let updatedItinerary : Itinerary = {
          id = itinerary.id;
          shipSpecs = itinerary.shipSpecs;
          amenities = itinerary.amenities;
          portsOfCall = itinerary.portsOfCall;
          departureDate = itinerary.departureDate;
          returnDate = itinerary.returnDate;
          cabins = updatedCabins;
          diningOptions = itinerary.diningOptions;
          entertainment = itinerary.entertainment;
          images = itinerary.images;
        };
        itineraries.add(itineraryId, updatedItinerary);
      };
    };
  };

  public query func searchCruisesWithFilters(searchText : Text, filters : SearchFilters) : async [CruiseDeal] {
    let allDeals = cruiseDeals.values().toArray();

    let filtered = allDeals.filter(
      func(deal) {
        let matchesSearch = searchText == "" or deal.destination.contains(#text searchText) or deal.cruiseLine.contains(#text searchText);
        let matchesDestination = switch (filters.destination) {
          case (null) { true };
          case (?dest) { deal.destination == dest };
        };
        let matchesCruiseLine = switch (filters.cruiseLine) {
          case (null) { true };
          case (?line) { deal.cruiseLine == line };
        };
        let matchesDuration = switch (filters.minDuration, filters.maxDuration) {
          case (null, null) { true };
          case (null, ?maxDur) { deal.duration <= maxDur };
          case (?minDur, null) { deal.duration >= minDur };
          case (?minDur, ?maxDur) { deal.duration >= minDur and deal.duration <= maxDur };
        };
        let matchesPrice = switch (filters.minPrice, filters.maxPrice) {
          case (null, null) { true };
          case (null, ?maxPrice) { deal.startingPrice <= maxPrice };
          case (?minPrice, null) { deal.startingPrice >= minPrice };
          case (?minPrice, ?maxPrice) { deal.startingPrice >= minPrice and deal.startingPrice <= maxPrice };
        };
        matchesSearch and matchesDestination and matchesCruiseLine and matchesDuration and matchesPrice
      }
    );

    filtered.sort(CruiseDeal.compareByPrice);
  };

  public shared ({ caller }) func submitReview(cruiseId : Text, rating : Nat, title : Text, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit reviews");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let review : Review = {
      id = Time.now().toText();
      userId = caller;
      cruiseId;
      rating;
      title;
      comment;
      createdAt = Time.now();
    };

    reviews.add(review.id, review);
  };

  public shared ({ caller }) func updateReview(reviewId : Text, rating : Nat, title : Text, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update reviews");
    };

    switch (reviews.get(reviewId)) {
      case (null) { Runtime.trap("Review not found") };
      case (?existingReview) {
        if (existingReview.userId != caller) {
          Runtime.trap("Unauthorized: Can only update your own reviews");
        };
        let updatedReview : Review = {
          id = reviewId;
          userId = caller;
          cruiseId = existingReview.cruiseId;
          rating;
          title;
          comment;
          createdAt = Time.now();
        };
        reviews.add(reviewId, updatedReview);
      };
    };
  };

  public shared ({ caller }) func deleteReview(reviewId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete reviews");
    };

    switch (reviews.get(reviewId)) {
      case (null) { Runtime.trap("Review not found") };
      case (?existingReview) {
        if (existingReview.userId != caller) {
          Runtime.trap("Unauthorized: Can only delete your own reviews");
        };
        reviews.remove(reviewId);
      };
    };
  };

  public query func getReviewsByCruiseId(cruiseId : Text) : async [Review] {
    reviews.values().toArray().filter(func(review) { review.cruiseId == cruiseId });
  };

  public query ({ caller }) func getUserReviews() : async [Review] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reviews");
    };
    reviews.values().toArray().filter(func(review) { review.userId == caller });
  };

  public query func getAverageRatingByCruiseId(cruiseId : Text) : async Float {
    let cruiseReviews = reviews.values().toArray().filter(func(review) { review.cruiseId == cruiseId });
    let reviewCount = cruiseReviews.size();
    if (reviewCount == 0) { return 0.0 };

    let totalRating = cruiseReviews.foldLeft(
      0.0,
      func(acc, review) {
        acc + review.rating.toFloat();
      },
    );

    totalRating / reviewCount.toFloat();
  };

  public shared ({ caller }) func addFavorite(cruiseId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add favorites");
    };
    let currentFavorites = switch (userFavorites.get(caller)) {
      case (null) { [] };
      case (?favorites) { favorites };
    };

    let alreadyFavorite = currentFavorites.any(func(favId) { favId == cruiseId });

    if (alreadyFavorite) {
      Runtime.trap("Cruise already in favorites");
    } else {
      userFavorites.add(caller, currentFavorites.concat([cruiseId]));
    };
  };

  public shared ({ caller }) func removeFavorite(cruiseId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can remove favorites");
    };
    let currentFavorites = switch (userFavorites.get(caller)) {
      case (null) { Runtime.trap("Favorites not found") };
      case (?favorites) { favorites };
    };

    if (not currentFavorites.any(func(favId) { favId != cruiseId })) {
      Runtime.trap("Cruise is not in favorites");
    };

    userFavorites.add(
      caller,
      currentFavorites.filter(func(favId) { favId != cruiseId })
    );
  };

  public query ({ caller }) func getFavorites() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view favorites");
    };
    switch (userFavorites.get(caller)) {
      case (null) { [] };
      case (?favorites) { favorites };
    };
  };

  public shared ({ caller }) func bookTrip(
    itineraryId : Text,
    cabins : [Cabin],
    totalCost : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can book trips");
    };

    let booking : Booking = {
      id = Time.now().toText();
      userId = caller;
      itineraryId;
      cabins;
      totalCost;
      status = #pending;
      bookingDate = Time.now();
    };

    bookings.add(booking.id, booking);

    switch (itineraries.get(itineraryId)) {
      case (null) { Runtime.trap("Itinerary not found") };
      case (?existingItinerary) {
        do {
          for (selectedCabin in cabins.values()) {
            let updatedCabins = existingItinerary.cabins.map(
              func(cabin) {
                if (cabin.category == selectedCabin.category) {
                  {
                    category = cabin.category;
                    price = cabin.price;
                    availability = if (cabin.availability > 0) {
                      cabin.availability - 1;
                    } else { 0 };
                  };
                } else { cabin };
              }
            );
            let updatedItinerary : Itinerary = {
              id = existingItinerary.id;
              shipSpecs = existingItinerary.shipSpecs;
              amenities = existingItinerary.amenities;
              portsOfCall = existingItinerary.portsOfCall;
              departureDate = existingItinerary.departureDate;
              returnDate = existingItinerary.returnDate;
              cabins = updatedCabins;
              diningOptions = existingItinerary.diningOptions;
              entertainment = existingItinerary.entertainment;
              images = existingItinerary.images;
            };
            itineraries.add(itineraryId, updatedItinerary);
          };
        };
      };
    };

    let cruiseName = switch (itineraries.get(itineraryId)) {
      case (null) { "Unknown Cruise" };
      case (?itinerary) { joinTextArray(itinerary.portsOfCall, ", ") };
    };

    let userName = switch (userProfiles.get(caller)) {
      case (null) { "Anonymous" };
      case (?profile) { profile.name };
    };

    let alert : AdminAlert = {
      id = Time.now().toText();
      bookingId = booking.id;
      cruiseName;
      userName;
      numberOfCabins = cabins.size();
      totalCost;
      createdAt = Time.now();
      viewed = false;
      isPersistent = true;
    };

    persistentAlerts.add(alert.id, alert);

    let toastAlert : AdminAlert = {
      id = "toast_" # Time.now().toText();
      bookingId = booking.id;
      cruiseName;
      userName;
      numberOfCabins = cabins.size();
      totalCost;
      createdAt = Time.now();
      viewed = false;
      isPersistent = false;
    };

    viewingAlerts.add(toastAlert.id, toastAlert);
  };

  public shared ({ caller }) func removeViewingAlerts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove booking alerts");
    };

    viewingAlerts := Map.empty<Text, AdminAlert>();
  };

  public shared ({ caller }) func markAlertsAsViewed() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark booking alerts as viewed");
    };

    let persistentAlertsNotViewed = persistentAlerts.filter(
      func(_id, alert) {
        not alert.viewed;
      }
    );

    persistentAlertsNotViewed.forEach(
      func(id, alert) {
        let updatedAlert = {
          id = alert.id;
          bookingId = alert.bookingId;
          cruiseName = alert.cruiseName;
          userName = alert.userName;
          numberOfCabins = alert.numberOfCabins;
          totalCost = alert.totalCost;
          createdAt = alert.createdAt;
          viewed = true;
          isPersistent = alert.isPersistent;
        };
        persistentAlerts.add(id, updatedAlert);
      }
    );
  };

  public query ({ caller }) func getBookingsByUser(_ : {}) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their bookings");
    };
    bookings.values().toArray().filter(func(booking) { booking.userId == caller });
  };

  public query ({ caller }) func getAllBookings(_ : {}) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  public query ({ caller }) func getAdminAlerts() : async [AdminAlert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access booking alerts");
    };

    let persistentAlertsArray = persistentAlerts.values().toArray();

    persistentAlertsArray.sort(
      func(a, b) {
        Int.compare(b.createdAt, a.createdAt);
      }
    );
  };

  public query ({ caller }) func hasViewingAlerts() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can check booking alerts");
    };

    persistentAlerts.values().toArray().any(func(alert) { not alert.viewed }) or
    viewingAlerts.values().toArray().any(func(alert) { not alert.viewed });

  };

  public shared ({ caller }) func addCruiseLineLogo(name : Text, imageUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add cruise line logos");
    };
    let logo : CruiseLineLogo = {
      name;
      imageUrl;
    };
    cruiseLineLogos.add(name, logo);
  };

  public shared ({ caller }) func updateCruiseLineLogo(name : Text, imageUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update cruise line logos");
    };
    switch (cruiseLineLogos.get(name)) {
      case (null) { Runtime.trap("Cruise line logo not found") };
      case (?_) {
        let updatedLogo : CruiseLineLogo = {
          name;
          imageUrl;
        };
        cruiseLineLogos.add(name, updatedLogo);
      };
    };
  };

  public shared ({ caller }) func deleteCruiseLineLogo(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete cruise line logos");
    };
    if (not cruiseLineLogos.containsKey(name)) {
      Runtime.trap("Cruise line logo not found");
    };
    cruiseLineLogos.remove(name);
  };

  public query func getAllCruiseLineLogos() : async [CruiseLineLogo] {
    cruiseLineLogos.values().toArray();
  };

  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let code = Time.now().toText();
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  public func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    switch (inviteState.inviteCodes.get(inviteCode)) {
      case (null) { Runtime.trap("Direktlink nicht gültig") };
      case (?invite) {
        if (invite.used) {
          Runtime.trap("Direktlink wurde bereits benutzt");
        };
      };
    };
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };

  public query func getShareableLink(linkId : Text) : async ?ShareableLink {
    shareableLinks.get(linkId);
  };

  public shared ({ caller }) func createShareableLink(itineraryId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create shareable links");
    };

    switch (itineraries.get(itineraryId)) {
      case (null) { Runtime.trap("Itinerary not found") };
      case (?itinerary) {
        let linkId = Time.now().toText();
        let shareableLink : ShareableLink = {
          itineraryId;
          sharedBy = caller;
          sharedAt = Time.now();
          isActive = true;
          itinerary;
        };
        shareableLinks.add(linkId, shareableLink);
        linkId;
      };
    };
  };

  public shared ({ caller }) func deactivateShareableLink(linkId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can deactivate shareable links");
    };

    switch (shareableLinks.get(linkId)) {
      case (null) { Runtime.trap("Shareable link not found") };
      case (?link) {
        if (link.sharedBy != caller and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
          Runtime.trap("Unauthorized: Can only deactivate your own shareable links");
        };

        let updatedLink = {
          itineraryId = link.itineraryId;
          sharedBy = link.sharedBy;
          sharedAt = link.sharedAt;
          isActive = false;
          itinerary = link.itinerary;
        };
        shareableLinks.add(linkId, updatedLink);
      };
    };
  };

  public query ({ caller }) func getShareableLinksByUser(_ : {}) : async [ShareableLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view shareable links");
    };

    var userLinks = Array.empty<ShareableLink>();

    for ((_, link) in shareableLinks.entries()) {
      if (link.sharedBy == caller) {
        userLinks := userLinks.concat([link]);
      };
    };

    userLinks;
  };

  public query ({ caller }) func getAllShareableLinks(_ : {}) : async [ShareableLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all shareable links");
    };

    shareableLinks.values().toArray();
  };

  public query func getBrandingSettings() : async BrandingSettings {
    brandingSettings;
  };

  public shared ({ caller }) func updateBrandingSettings(newSettings : BrandingSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update branding settings");
    };

    brandingSettings := newSettings;
  };
};
