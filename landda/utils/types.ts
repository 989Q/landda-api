// ________________________________________ user

export enum UserLoginProvider {
  Google = "google",
  Facebook = "facebook",
  Email = "email",
}

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Suspended = "suspended",
  Blocked = "blocked",
}

export enum UserRole {
  Admin = "admin",
  Partner = "partner",
  Agent = "agent",
  Regular = "regular",
  Banned = "banned",
}

export enum UserVerificationStatus {
  False = "false",
  True = "true",
}

export enum SubscriptionStatus {
  False = "false",
  True = "true",
}

// Stripe (must have the same value as in the strip)
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
