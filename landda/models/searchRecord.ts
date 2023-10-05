import mongoose, { Document, Schema } from "mongoose";

export interface ISearchRecord {
  tag: "estate" | "agent" | "blog";
  query: string;
  count: number;
  date: string,
}

export interface SearchRecordDocument extends ISearchRecord, Document {}

const SearchRecordSchema = new Schema<SearchRecordDocument>({
  tag: {
    type: String,
    enum: ["estate", "agent", "blog"],
  },
  query: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
  },
});

export default mongoose.model<SearchRecordDocument>('SearchRecord', SearchRecordSchema);
