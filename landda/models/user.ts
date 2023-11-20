import mongoose, { Document, Schema } from "mongoose";
import {
  UserLoginProvider,
  UserStatus,
  UserRole,
  UserVerificationStatus,
  SubscriptionStatus,
  SubscriptionAccess,
} from "../utils/types";

export interface IUser {
  acc: {
    userId: string;
    logins: UserLoginProvider[];
    status: UserStatus;
    role: UserRole;
    verified: UserVerificationStatus;
    createdAt: Date;
    updatedAt: Date;
  };
  info: {
    email: string;
    image: string;
    name: string;
    work: string;
    about: string;
    phone: string;
    speak: string;
    live: string;
    link1: string;
    link2: string;
    link3: string;
    link4: string;
  };
  subs: {
    stripeId: string;
    active: SubscriptionStatus;
    access: SubscriptionAccess;
    payment: String;
    startDate: Date;
    endDate: Date;
  };
  messages: mongoose.Types.ObjectId[];
  saves: mongoose.Types.ObjectId[];
  estates: mongoose.Types.ObjectId[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  acc: {
    userId: { type: String, required: true },
    logins: {
      type: [String],
      enum: Object.values(UserLoginProvider),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
      required: true,
    },
    verified: {
      type: String,
      enum: Object.values(UserVerificationStatus),
      default: UserVerificationStatus.False,
      required: true,
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  info: {
    email: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    work: { type: String, required: false },
    about: { type: String, required: false },
    phone: { type: String, required: false },
    speak: { type: String, required: false },
    live: { type: String, required: false },
    link1: { type: String, required: false },
    link2: { type: String, required: false },
    link3: { type: String, required: false },
    link4: { type: String, required: false },
  },
  subs: {
    stripeId: { type: String, required: false },
    active: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: false,
    },
    access: {
      type: String,
      enum: Object.values(SubscriptionAccess),
      default: SubscriptionAccess.Free,
      required: true,
    },
    payment: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" }],
  estates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" }],
});

export default mongoose.model<IUserModel>("User", UserSchema);
