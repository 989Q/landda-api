import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { EstatePostStatus, EstateDescStatus } from "../utils/helpers/types";

export interface IEstate {
  head: {
    estateId: string;
    post: EstatePostStatus;
    score: number;
    seen: number;
    see: {
      date: string;
      count: number;
    };
    shares: number;
    saves: number;
    createdAt: Date;
    updatedAt: Date;
  };
  desc: {
    images: string[];
    status: EstateDescStatus;
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
    link?: string;
    address?: string;
    subdistrict: string;
    district: string;
    province: string;
    postcode?: string;
    country: string;
  };
  user: mongoose.Types.ObjectId | IUser;
}

export interface EstateDocument extends IEstate, Document {}

const EstateSchema = new Schema<EstateDocument>({
  head: {
    estateId: { type: String, required: true },
    post: {
      type: String,
      enum: Object.values(EstatePostStatus),
      default: EstatePostStatus.Active,
      required: true,
    },
    score: { type: Number, default: 100 },
    seen: { type: Number, default: 0 },
    see: {
      date: { type: String, default: "2020-1-01" },
      count: { type: Number, default: 0 },
    },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  desc: {
    images: { type: [String], required: true },
    status: {
      type: String,
      enum: Object.values(EstateDescStatus),
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
