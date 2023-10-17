import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sender: {
    email: string;
    phone: string;
  };
  text: string;
  sentAt: Date;
  user: mongoose.Schema.Types.ObjectId;
  estate: mongoose.Schema.Types.ObjectId;
}

export interface MessageDocument extends IMessage, Document {}

const Message = new Schema<MessageDocument>({
  sender: {
    email: { type: String, require: true },
    phone: { type: String, require: true },
  },
  text: { type: String, require: true },
  sentAt: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  estate: { type: mongoose.Schema.Types.ObjectId, ref: "Estate" },
});

export default mongoose.model<IMessage>("Message", Message);