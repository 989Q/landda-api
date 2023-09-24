import mongoose, { Document, Schema } from "mongoose";

export interface IEstate {
  head: {
    estateID: string;
    post: string;
    seen: number; // unimportant
    see: number; // unimportant
    shares: string[]; // unimportant
    saves: string[]; // unimportant
    createdAt: Date;
    updatedAt: Date;
  };
  desc: {
    images: string[];
    status: string;
    type: string;
    curr: string;
    price: number;
    bed: number;
    bath: number;
    sqm: number;
    title: string;
    about: string;
    facs: string[];
    coms: string[];
    secs: string[];
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
    estateID: { type: String, required: true },
    post: {
      type: String,
      enum: ["active", "waiting", "hidden", "sold"],
      default: "active",
      required: true,
    },
    seen: { type: Number, required: false },
    see: { type: Number, required: false },
    shares: { type: [String], required: false },
    saves: { type: [String], required: false },
    createdAt: { type: Date, required: true }, 
    updatedAt: { type: Date, required: true },
  },
  desc: {
    images: { type: [String], required: true },
    status: {
      type: String,
      enum: ["rentPerDay", "rentPerMonth", "rentPerYear", "sale"],
      required: true,
    },
    type: { type: String, required: true }, // land, home, condo
    curr: { type: String, required: true },
    price: { type: Number, required: true },
    bed: { type: Number, required: true },
    bath: { type: Number, required: true },
    sqm: { type: Number, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    facs: { type: [String], required: false },
    coms: { type: [String], required: false },
    secs: { type: [String], required: false },
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model<IEstate>("Estate", EstateSchema);