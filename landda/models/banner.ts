import mongoose, { Document, Schema } from "mongoose";

export interface IBanner {
  head: {
    userID: string;
    bannerID: string;
    supporterName: string;
    postStatus: string;
    createdAt: Date;
    updatedAt: Date;
    seen: string; // unimportant
    seePerDay: string; // unimportant
    shareCount: string[]; // unimportant
    // favoriteCount: string[]; // unimportant
  };
  desc: {
    link: string; // unimportant
    tag: string[];
    images: string[];
    title: string;
    description: string;
  };
}

export interface BannerDocument extends IBanner, Document {}

const BannerSchema = new Schema<BannerDocument>({
  head: {
    userID: { type: String, required: true },
    bannerID: { type: String, required: true },
    supporterName: { type: String, require: true},
    postStatus: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    seen: { type: String, required: false },
    seePerDay: { type: String, required: false },
    shareCount: { type: [String], required: false },
    // favoriteCount: { type: [String], required: false },
  },
  desc: {
    link: { type: String, required: false },
    tag: { type: [String], require: true },
    images: { type: [String], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
});

export default mongoose.model<IBanner>("Banner", BannerSchema);
