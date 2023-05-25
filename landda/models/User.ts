import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  user_id: string;
  name: string;
  email: string;
  image: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  image: { type: String },
});

export default mongoose.model<IUserModel>('User', UserSchema);
