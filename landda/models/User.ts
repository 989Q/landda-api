// import mongoose, { Document, Schema } from "mongoose";

// interface IUser {
//   acc: {
//     userID: string;
//     provider: string[];
//     status: string;
//     role: string;
//     verified: string;
//     createdAt: Date;
//     updatedAt: Date;
//   };
//   info: {
//     email: string;
//     image: string;
//     name: string;
//     work: string;
//     about: string;
//     phone: string;
//     speak: string;
//     live: string;
//     link1: string;
//     link2: string;
//     link3: string;
//     link4: string;
//   };
//   subs: {
//     stripeID: string;
//     active: String;
//     type: string;
//     payment: String;
//     startDate: Date;
//     endDate: Date;
//   };
//   estates: mongoose.Types.ObjectId[];
//   favorites: mongoose.Types.ObjectId[];
// }

// export interface IUserModel extends IUser, Document {}

// const UserSchema: Schema = new Schema({
//   acc: {
//     userID: { type: String, required: true },
//     provider: { 
//       type: [String], 
//       enum: ["google", "facebook"], 
//       required: true 
//     }, 
//     status: {
//       type: String,
//       enum: ["active", "wait", "hidden"],
//       required: true,
//       default: "active",
//     },
//     role: {
//       type: String,
//       enum: ["user", "agent", "partner", "admin"],
//       default: "user",
//       required: true,
//     },
//     verified: {
//       type: String,
//       enum: ["false", "true"],
//       default: "false",
//       required: false,
//     },
//     createdAt: { type: Date, required: true },
//     updatedAt: { type: Date, required: true },
//   },
//   info: {
//     email: { type: String, required: true },
//     image: { type: String, required: true },
//     name: { type: String, required: true },
//     work: { type: String, required: false },
//     about: { type: String, required: false },
//     phone: { type: String, required: false },
//     speak: { type: String, required: false },
//     live: { type: String, required: false },
//     link1: { type: String, required: false },
//     link2: { type: String, required: false },
//     link3: { type: String, required: false },
//     link4: { type: String, required: false },
//   },
//   subs: {
//     stripeID: { type: String, required: true },
//     active: { 
//       type: String, 
//       enum: ["false", "true"], 
//       required: false 
//     },
//     type: { 
//       type: String, 
//       enum: ["basic", "standard", "premium"], 
//       required: true 
//     }, 
//     payment: { type: String, required: false },
//     startDate: { type: Date, required: false },
//     endDate: { type: Date, required: false },
//   },
//   estates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" }],
//   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" }],
// });

// export default mongoose.model<IUserModel>("User", UserSchema);

import mongoose, { Document, Schema } from "mongoose";

interface IUser {
  account: {
    userID: string;
    userRole: string[];
    provider: string[];
    status: string;
    licenseVerified: string;
    createdAt: Date;
    updatedAt: Date;
  };
  profile: {
    image: string;
    name: string;
    email: string;
    phone: string;
    speak: string;
    company: string;
    address: string;
    description: string;
    contact1: string;
    contact2: string;
    contact3: string;
    contact4: string;
  };
  membership: {
    stripeCustomerID: string;
    memberType: string;
    status: String;
    startDate: Date;
    endDate: Date;
    billingInfo: String;
  };
  estates: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  account: {
  // acc: {
    userID: { type: String, required: true },
    userRole: { type: [String], required: true }, // user, agent, admin
    provider: { type: [String], required: true }, // google, facebook
    status: { type: String, required: true }, // active, hidden
    licenseVerified: { type: String, required: false }, // false, true
    // verified: { type: String, required: false }, // false, true
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  profile: {
  // user: {
    image: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    speak: { type: String, required: false },
    company: { type: String, required: false },
    address: { type: String, required: false },
    // live: { type: String, required: false },
    description: { type: String, required: false },
    // about: { type: String, required: false },
    contact1: { type: String, required: false },
    contact2: { type: String, required: false },
    contact3: { type: String, required: false },
    contact4: { type: String, required: false },
  },
  membership: {
  // member: {
    stripeCustomerID: { type: String, required: true },
    memberType: { type: String, required: true }, // member, supporter, partner
    status: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    billingInfo: { type: String, required: false },
  },
  estates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" },],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" },],
});

export default mongoose.model<IUserModel>("User", UserSchema);
