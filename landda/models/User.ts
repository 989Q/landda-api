import mongoose, { Document, Schema } from "mongoose";

interface IUser {
  acc: {
    userID: string;
    logins: string[];
    status: string;
    role: string;
    verified: string;
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
    active: String;
    type: string;
    payment: String;
    startDate: Date;
    endDate: Date;
  };
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
      required: true 
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
      required: false,
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
    stripeID: { type: String, required: true },
    active: { 
      type: String, 
      enum: ["false", "true"], 
      required: false 
    },
    type: { 
      type: String, 
      enum: ["free", "basic", "standard", "premium"], 
      default: "free",
      required: false 
    }, 
    payment: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
  },
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" }],
  estates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estate" }],
});

export default mongoose.model<IUserModel>("User", UserSchema);



// interface IUser {
//   account: {
//     userID: string;
//     userRole: string[];
//     providers: string[];
//     status: string;
//     licenseVerified: string;
//     createdAt: Date;
//     updatedAt: Date;
//   };
//   profile: {
//     image: string;
//     name: string;
//     email: string;
//     phone: string;
//     speak: string;
//     company: string;
//     address: string;
//     description: string;
//     contact1: string;
//     contact2: string;
//     contact3: string;
//     contact4: string;
//   };
//   membership: {
//     stripeCustomerID: string;
//     memberType: string;
//     status: String;
//     startDate: Date;
//     endDate: Date;
//     billingInfo: String;
//   };
//   estates: mongoose.Types.ObjectId[];
//   favorites: mongoose.Types.ObjectId[];
// }

// export interface IUserModel extends IUser, Document {}