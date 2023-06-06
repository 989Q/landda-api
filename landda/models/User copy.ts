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

// const UserSchema: Schema = new Schema({
//   account: {
//     type: {
//       userId: { type: String, required: true, unique: true },
//       provider: { type: String }, // G
//       status: { type: String }, // active, hidden
//       licenseVerified: { type: String }, // false, true
//       createdAt: { type: Date },
//       updatedAt: { type: Date },
//     },
//     required: false,
//   },
//   profile: {
//     type: {
//       image: { type: String }, // G
//       name: { type: String }, // G
//       email: { type: String }, // G
//       phone: { type: String },
//       company: { type: String },
//       description: { type: String },
//     },
//     required: false,
//   },
//   membership: {
//     type: {
//       memberType: { type: String }, // Member, Supporter, Partner
//       status: { type: String },
//       startDate: { type: Date },
//       endDate: { type: Date },
//       billingInfo: { type: String },
//     },
//     required: false,
//   },
//   contact: {
//     type: {
//       contact1: { type: String },
//       contact2: { type: String },
//       contact3: { type: String },
//       contact4: { type: String },
//       contact5: { type: String },
//     },
//     required: false,
//   },
//   active_listings: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" },
//   ],
//   past_sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" }],
// });

const UserSchema: Schema = new Schema({
  account: {
    type: new Schema(
      {
        userId: { type: String, required: true, unique: true },
        provider: { type: String }, // G
        status: { type: String }, // active, hidden
        licenseVerified: { type: String }, // false, true
        createdAt: { type: Date },
        updatedAt: { type: Date },
      },
      { _id: false }
    ),
    required: false,
  },
  profile: {
    type: new Schema(
      {
        image: { type: String },
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        company: { type: String },
        description: { type: String },
      },
      { _id: false }
    ),
    required: false,
  },
  membership: {
    type: new Schema(
      {
        memberType: { type: String }, // Member, Supporter, Partner
        status: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        billingInfo: { type: String },
      },
      { _id: false }
    ),
    required: false,
  },
  contact: {
    type: new Schema(
      {
        contact1: { type: String },
        contact2: { type: String },
        contact3: { type: String },
        contact4: { type: String },
        contact5: { type: String },
      },
      { _id: false }
    ),
    required: false,
  },
  active_listings: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" },
  ],
  past_sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" }],
});

export default mongoose.model<IUserModel>("User", UserSchema);
