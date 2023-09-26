import mongoose, { Document, Schema } from "mongoose";

export interface IBlog {
  lead: {
    blogID: string;
    seen: number; // unimportant
    see: number; // unimportant
    shares: string[]; // unimportant
    saves: string[]; // unimportant
    createdAt: Date;
    updatedAt: Date;
  };
  body: {
    images: string[];
    link: string; // unimportant
    tag: string[];
    title: string;
    about: string;
  };
  user: mongoose.Types.ObjectId;
}

export interface BlogDocument extends IBlog, Document {}

const BlogSchema = new Schema<BlogDocument>({
  lead: {
    blogID: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["active", "waiting", "hidden"], 
      default: "active",
      required: true 
    },
    seen: { type: Number, required: false },
    see: { type: Number, required: false },
    shares: { type: [String], required: false },
    saves: { type: [String], required: false },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  body: {
    images: { type: [String], required: true },
    link: { type: String, required: false },
    tag: { type: [String], require: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model<IBlog>("Blog", BlogSchema);