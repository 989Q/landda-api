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
    priceCurr: string;
    price: number;
    estateType: string;
    estateStatus: string;
    bedroom: number;
    bathroom: number;
    squareMetre: number;
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
    shareCount: { type: [String], required: false },
    favoriteCount: { type: [String], required: false },
  },
  desc: {
    images: { type: [String], required: true },
    priceCurr: { type: String, required: true },
    price: { type: Number, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    squareMetre: { type: Number, required: true },
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
});

export default mongoose.model<IEstate>("Estate", EstateSchema);


// import mongoose, { Document, Schema } from "mongoose";

// export interface IEstate {
//   head: {
//     userID: string;
//     estateID: string;
//     postStatus: string;
//     createdAt: Date;
//     updatedAt: Date;
//     seen: string; // unimportant
//     seePerDay: string; // unimportant
//     shares: string[]; // unimportant
//     favorites: string[]; // unimportant
//   };
//   desc: {
//     images: string[];
//     propStatus: string;
//     propType: string;
//     priceCurr: string;
//     price: number;
//     bed: number;
//     bath: number;
//     sqm: number;
//     title: string;
//     about: string;
//     facilities: string[];
//     comforts: string[];
//     securities: string[];
//   };
//   map: {
//     link: string; // unimportant
//     address: string; // unimportant
//     subdistrict: string;
//     district: string;
//     province: string;
//     postcode: string; // unimportant
//     country: string; // unimportant
//   };
//   user: mongoose.Types.ObjectId;
// }

// export interface EstateDocument extends IEstate, Document {}

// const EstateSchema = new Schema<EstateDocument>({
//   head: {
//     userID: { type: String, required: true },
//     estateID: { type: String, required: true },
//     postStatus: { type: String, required: true },
//     createdAt: { type: Date, required: true },
//     updatedAt: { type: Date, required: true },
//     seen: { type: String, required: false },
//     seePerDay: { type: String, required: false },
//     shares: { type: [String], required: false },
//     favorites: { type: [String], required: false },
//   },
//   desc: {
//     images: { type: [String], required: true },
//     propStatus: { type: String, required: true }, // rentPerDay, rentPerMonth, rentPerYear, sale
//     propType: { type: String, required: true },
//     priceCurr: { type: String, required: true },
//     price: { type: Number, required: true },
//     bed: { type: Number, required: true },
//     bath: { type: Number, required: true },
//     sqm: { type: Number, required: true },
//     title: { type: String, required: true },
//     about: { type: String, required: true },
//     facilities: { type: [String], required: false },
//     comforts: { type: [String], required: false },
//     securities: { type: [String], required: false },
//   },
//   map: {
//     link: { type: String, required: false },
//     address: { type: String, required: false },
//     subdistrict: { type: String, required: true },
//     district: { type: String, required: true },
//     province: { type: String, required: true },
//     postcode: { type: String, required: false },
//     country: { type: String, required: true },
//   },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
// });

// export default mongoose.model<IEstate>("Estate", EstateSchema);
