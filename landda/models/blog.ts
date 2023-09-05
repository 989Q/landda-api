import mongoose, { Document, Schema } from "mongoose";

export interface IBlog {
  head: {
    userID: string;
    blogID: string;
    supporterName: string;
    postStatus: string;
    createdAt: Date;
    updatedAt: Date;
    seen: string; // unimportant
    seePerDay: string; // unimportant
    shareCount: string[]; // unimportant
    favoriteCount: string[]; // unimportant
  };
  desc: {
    link: string; // unimportant
    tag: string[];
    images: string[];
    title: string;
    description: string;
  };
  user: mongoose.Types.ObjectId;
}

export interface BlogDocument extends IBlog, Document {}

const BlogSchema = new Schema<BlogDocument>({
  head: {
    userID: { type: String, required: true },
    blogID: { type: String, required: true },
    blogType: { type: String, required: true },
    blogStatus: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    seen: { type: String, required: false },
    seePerDay: { type: String, required: false },
    shareCount: { type: [String], required: false },
    favoriteCount: { type: [String], required: false },
  },
  desc: {
    link: { type: String, required: false },
    tag: { type: [String], require: true },
    images: { type: [String], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This should match the name you used when creating the User model
  },
});

export default mongoose.model<IBlog>("Blog", BlogSchema);
