// ________________________________________ user

export enum UserLoginProvider {
  Google = "google",
  Facebook = "facebook",
  Email = "email",
}

export enum UserStatus {
  Active = "active",
  Wait = "wait",
  Hidden = "hidden",
}

export enum UserRole {
  Admin = "admin",
  Partner = "partner",
  User = "user",
  Agent = "agent",
}

export enum UserVerificationStatus {
  False = "false",
  True = "true",
}

export enum SubscriptionStatus {
  False = "false",
  True = "true",
}

// stripe
export enum SubscriptionAccess {
  Free = "Free",
  Basic = "Basic",
  Standard = "Standard",
  Premium = "Premium",
}

// ________________________________________ estate

export enum EstatePostStatus {
  Active = "active",
  Waiting = "waiting",
  Hidden = "hidden",
  Sold = "sold",
}

export enum EstateDescStatus {
  RentPerDay = "rentPerDay",
  RentPerMonth = "rentPerMonth",
  RentPerYear = "rentPerYear",
  Sale = "sale",
}

// ________________________________________ blog

export enum BlogStatus {
  Active = "active",
  Waiting = "waiting",
  Hidden = "hidden",
}

export enum BlogTag {
  Article = "article",
  Supported = "supported",
  Promotion = "promotion",
}
