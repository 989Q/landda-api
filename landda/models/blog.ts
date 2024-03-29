import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";
import { BlogStatus, BlogTag } from "../utils/helpers/types";

export interface IBlog {
  lead: {
    blogId: string;
    status: BlogStatus;
    seen: number;
    see: {
      date: string;
      count: number;
    };
    shares?: string[];
    saves?: string[];
    createdAt: Date;
    updatedAt: Date;
  };
  body: {
    images: string[];
    link?: string;
    tag: BlogTag[];
    title: string;
    about: string;
  };
  user: mongoose.Types.ObjectId | IUser;
}

export interface BlogDocument extends IBlog, Document {}

const Blog = new Schema<BlogDocument>({
  lead: {
    blogId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BlogStatus),
      default: BlogStatus.Active,
      required: true,
    },
    seen: { type: Number, default: 0 },
    see: {
      date: { type: String, default: "2020-1-01" },
      count: { type: Number, default: 0 },
    },
    shares: { type: [String], required: false },
    saves: { type: [String], required: false },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  body: {
    images: { type: [String], required: true },
    link: { type: String, required: false },
    tag: {
      type: [String],
      required: true,
      enum: Object.values(BlogTag),
    },
    title: { type: String, required: true },
    about: { type: String, required: true },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model<IBlog>("Blog", Blog);
