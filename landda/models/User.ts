import mongoose, { Document, Schema } from "mongoose";
// import { Estate } from "./Estate";

interface IUser {
  account: {
    userID: string;
    userRole: string;
    provider: string;
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
  active_listings: mongoose.Types.ObjectId[];
  past_sales: mongoose.Types.ObjectId[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  account: {
    // userID: { type: String, required: true, unique: false },
    userID: { type: String, required: true },
    userRole: { type: String, required: true }, // user, agent, admin
    provider: { type: String, required: true }, // google
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
    speak: { type: String, required: false },
    company: { type: String, required: false },
    address: { type: String, required: false },
    description: { type: String, required: false },
    contact1: { type: String, required: false },
    contact2: { type: String, required: false },
    contact3: { type: String, required: false },
    contact4: { type: String, required: false },
  },
  membership: {
    stripeCustomerID: { type: String, required: true },
    memberType: { type: String, required: true }, // member, supporter, partner
    status: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    billingInfo: { type: String, required: false },
  },
  activeListings: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" },],
  pastSales: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" }],
});

export default mongoose.model<IUserModel>("User", UserSchema);
