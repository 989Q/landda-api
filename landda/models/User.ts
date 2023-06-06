// models.user

import mongoose, { Document, Schema } from "mongoose";
// import { RealEstate } from "./RealEstate";

interface IUser {
  account: {
    userId: string;
    provider: string;
    status: string;
    licenseVerified: string;
    createdAt: Date;
    updatedAt: Date;
  };
  profile: {
    image: string;
    name: string;
    company: string;
    description: string;
    email: string;
    phone: string;
  };
  membership: {
    memberType: string;
    status: String;
    startDate: Date;
    endDate: Date;
    billingInfo: String;
  };
  contact: {
    contact1: string;
    contact2: string;
    contact3: string;
    contact4: string;
    contact5: string;
  };
  active_listings: mongoose.Types.ObjectId[];
  past_sales: mongoose.Types.ObjectId[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  account: {
    userId: { type: String, required: true, unique: true },
    provider: { type: String, required: true }, // G
    status: { type: String, required: true }, // active, hidden
    licenseVerified: { type: String, required: false }, // false, true
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  profile: {
    image: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    company: { type: String, required: false },
    description: { type: String, required: false },
  },
  membership: {
    memberType: { type: String, required: true }, // Member, Supporter, Partner
    status: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    billingInfo: { type: String, required: false },
  },
  contact: {
    contact1: { type: String, required: false },
    contact2: { type: String, required: false },
    contact3: { type: String, required: false },
    contact4: { type: String, required: false },
    contact5: { type: String, required: false },
  },
  active_listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" },],
  past_sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" }],
});

export default mongoose.model<IUserModel>("User", UserSchema);
