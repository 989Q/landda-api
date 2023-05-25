import mongoose, { Document, Schema } from "mongoose";

export interface IRealEstate {
  estate_id: string;
  property_type: string;
  property_status: string;
  post_status: string;
  title: string;
  description: string;
  location: {
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    postcode: string;
    country: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size: number;
  facilities: string[];
  comforts: string[];
  securityAndPrivacy: string[];
  googleMapsLink: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EstateDocument extends IRealEstate, Document {}

const EstateSchema = new Schema<EstateDocument>({
  estate_id: { type: String, required: true, unique: true },
  property_type: { type: String, required: true },
  property_status: { type: String, required: true },
  post_status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    subdistrict: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postcode: { type: String, required: true },
    country: { type: String, required: true },
  },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  parking: { type: Number, required: true },
  size: { type: Number, required: true },

  // __________________ Property highlights 

  facilities: { type: [String], required: true },
  comforts: { type: [String], required: true },
  securityAndPrivacy: { type: [String], required: true },

  // __________________ Property System 

  googleMapsLink: { type: [String], required: false },
  images: { type: [String], required: true },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "EstateAgent" }] })
  // estateAgent: EstateAgent[];
});

export default mongoose.model<IRealEstate>('RealEstate', EstateSchema);
