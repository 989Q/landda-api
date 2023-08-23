import mongoose, { Document, Schema } from "mongoose";

export interface IEstate {
  head: {
    userID: string;
    estateID: string;
    postStatus: string;
    createdAt: Date;
    updatedAt: Date;
    seen: string; // unimportant
    seePerDay: string; // unimportant
    shareCount: string[]; // unimportant
    favoriteCount: string[]; // unimportant
  };
  desc: {
    images: string[];
    priceCurrency: string;
    price: number;
    estateType: string;
    estateStatus: string;
    bedroom: number;
    bathroom: number;
    parking: number;
    size: number;
    title: string;
    description: string;
    facilities: string[];
    comforts: string[];
    securityAndPrivacy: string[];
  };
  location: {
    address: string; // unimportant
    subdistrict: string;
    district: string;
    province: string;
    postcode: string; // unimportant
    country: string; // unimportant
    googleMaps: string; // unimportant
  };
}

export interface EstateDocument extends IEstate, Document {}

const EstateSchema = new Schema<EstateDocument>({
  head: {
    // userID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    // userID: { type: String, required: true, ref: "User" },
    userID: { type: String, required: true },
    estateID: { type: String, required: true },
    postStatus: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    seen: { type: String, required: false },
    seePerDay: { type: String, required: false },
    shareCount: { type: [String], required: false },
    favoriteCount: { type: [String], required: false },
  },
  desc: {
    images: { type: [String], required: true },
    priceCurrency: { type: String, required: true },
    price: { type: Number, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    parking: { type: Number, required: false },
    size: { type: Number, required: true },
    estateType: { type: String, required: true },
    estateStatus: { type: String, required: true }, // rentPerDay, rentPerMonth, rentPerYear, sale
    title: { type: String, required: true },
    description: { type: String, required: true },
    facilities: { type: [String], required: false },
    comforts: { type: [String], required: false },
    securityAndPrivacy: { type: [String], required: false },
  },
  location: {
    address: { type: String, required: false },
    subdistrict: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postcode: { type: String, required: false },
    country: { type: String, required: true },
    googleMap: { type: String, required: false },
  },
});

export default mongoose.model<IEstate>("Estate", EstateSchema);
