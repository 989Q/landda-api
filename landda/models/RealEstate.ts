import mongoose, { Document, Schema } from "mongoose";

// export interface IRealEstate {
//   estate_id: string;
//   property_type: string;
//   property_status: string;
//   post_status: string;
//   title: string;
//   description: string;
//   location: {
//     address: string;
//     subdistrict: string;
//     district: string;
//     province: string;
//     postcode: string;
//     country: string;
//   };
//   price: number;
//   bedrooms: number;
//   bathrooms: number;
//   parking: number;
//   size: number;
//   facilities: string[];
//   comforts: string[];
//   securityAndPrivacy: string[];
//   googleMapsLink: string[];
//   images: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface IRealEstate {
  head: {
    estateId: string;
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
  }
  support: {
    support1: string; // unimportant
    support2: string; // unimportant
    support3: string; // unimportant
  }
  location: {
    address: string; // unimportant
    subdistrict: string;
    district: string;
    province: string;
    postcode: string; // unimportant
    country: string; // unimportant
    googleMaps: string[]; // unimportant
  };
  user: {
    account: {
      userId: string;
    }
  }
}

export interface EstateDocument extends IRealEstate, Document {}

const EstateSchema = new Schema<EstateDocument>({
  head: {
    estateId: { type: String, required: true, unique: true },
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
    price: { type: Number, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    parking: { type: Number, required: true },
    size: { type: Number, required: true },
    estateType: { type: String, required: true },
    estateStatus: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    facilities: { type: [String], required: true },
    comforts: { type: [String], required: true },
    securityAndPrivacy: { type: [String], required: true },
  },
  support: {
    support1: { type: String, required: false },
    support2: { type: String, required: false },
    support3: { type: String, required: false },
    support4: { type: String, required: false },
    support5: { type: String, required: false },
  },
  location: {
    address: { type: String, required: false },
    subdistrict: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postcode: { type: String, required: false },
    country: { type: String, required: false },
    googleMaps: { type: [String], required: false },
  },
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "EstateAgent" }] })
  // estateAgent: EstateAgent[];
});

// const EstateSchema = new Schema<EstateDocument>({
//   estate_id: { type: String, required: true, unique: true },
//   property_type: { type: String, required: true },
//   property_status: { type: String, required: true },
//   post_status: { type: String, required: true },
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   location: {
//     address: { type: String, required: true },
//     subdistrict: { type: String, required: true },
//     district: { type: String, required: true },
//     province: { type: String, required: true },
//     postcode: { type: String, required: true },
//     country: { type: String, required: true },
//   },
//   price: { type: Number, required: true },
//   bedrooms: { type: Number, required: true },
//   bathrooms: { type: Number, required: true },
//   parking: { type: Number, required: true },
//   size: { type: Number, required: true },

//   facilities: { type: [String], required: true },
//   comforts: { type: [String], required: true },
//   securityAndPrivacy: { type: [String], required: true },

//   googleMapsLink: { type: [String], required: false },
//   images: { type: [String], required: true },
//   createdAt: { type: Date, required: false },
//   updatedAt: { type: Date, required: false },

//   // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "EstateAgent" }] })
//   // estateAgent: EstateAgent[];
// });

export default mongoose.model<IRealEstate>('RealEstate', EstateSchema);
