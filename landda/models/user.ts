import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  acc: {
    userID: string;
    logins: ("google" | "facebook" | "email")[];
    status: "active" | "wait" | "hidden";
    role: "user" | "agent" | "partner" | "admin";
    verified: "false" | "true";
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
    stripeID: string;
    active: "false" | "true";
    access: "Free" | "Basic" | "Standard" | "Premium";
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
    userID: { type: String, required: true },
    logins: {
      type: [String],
      enum: ["google", "facebook", "email"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "wait", "hidden"],
      required: true,
      default: "active",
    },
    role: {
      type: String,
      enum: ["user", "agent", "partner", "admin"],
      default: "user",
      required: true,
    },
    verified: {
      type: String,
      enum: ["false", "true"],
      default: "false",
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
    stripeID: { type: String, required: false },
    active: {
      type: String,
      enum: ["false", "true"],
      required: false,
    },
    access: {
      type: String,
      enum: ["Free", "Basic", "Standard", "Premium"],
      default: "Free",
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
