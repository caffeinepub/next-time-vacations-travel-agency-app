module {
  type OldActor = { /* old state without backendVersion field */ };
  type NewActor = { backendVersion : Text };

  public func run(old : OldActor) : NewActor {
    { old with backendVersion = "1.0.0" };
  };
};
