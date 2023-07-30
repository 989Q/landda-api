import mongoose, { mongo } from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  subscriptionID: { type: String, required: true, unique: true },
  access: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    required: true,
  },
});

export default mongoose.model("Subscription", subscriptionSchema);
