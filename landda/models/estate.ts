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
    shares: string[]; // unimportant
    favorites: string[]; // unimportant
  };
  desc: {
    images: string[];
    listStatus: string;
    listType: string;
    priceCurr: string;
    price: number;
    bed: number;
    bath: number;
    sqm: number;
    title: string;
    about: string;
    facilities: string[];
    comforts: string[];
    securities: string[];
  };
  maps: {
    link: string; // unimportant
    address: string; // unimportant
    subdistrict: string;
    district: string;
    province: string;
    postcode: string; // unimportant
    country: string; // unimportant
  };
  user: mongoose.Types.ObjectId;
}

export interface EstateDocument extends IEstate, Document {}

const EstateSchema = new Schema<EstateDocument>({
  head: {
    userID: { type: String, required: true },
    estateID: { type: String, required: true },
    postStatus: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    seen: { type: String, required: false },
    seePerDay: { type: String, required: false },
    shares: { type: [String], required: false },
    favorites: { type: [String], required: false },
  },
  desc: {
    images: { type: [String], required: true },
    listStatus: { type: String, required: true }, // rentPerDay, rentPerMonth, rentPerYear, sale
    listType: { type: String, required: true },
    priceCurr: { type: String, required: true },
    price: { type: Number, required: true },
    bed: { type: Number, required: true },
    bath: { type: Number, required: true },
    sqm: { type: Number, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    facilities: { type: [String], required: false },
    comforts: { type: [String], required: false },
    securities: { type: [String], required: false },
  },
  maps: {
    link: { type: String, required: false },
    address: { type: String, required: false },
    subdistrict: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postcode: { type: String, required: false },
    country: { type: String, required: true },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
});

export default mongoose.model<IEstate>("Estate", EstateSchema);
