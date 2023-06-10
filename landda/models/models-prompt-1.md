I want the userId to go into the EstateSchema.

models/User.ts
```ts
const UserSchema: Schema = new Schema({
  account: {
    userId: { type: String, required: true, unique: true },
    provider: { type: String, required: true }, // G
    status: { type: String, required: true }, // active, hidden
    licenseVerified: { type: String, required: false }, // false, true
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  profile: {
    image: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  active_listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" },],
  past_sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "RealEstate" }],
});
```

models/RealEstate.ts

```ts
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
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  // estateAgent: User[];
});

export default mongoose.model<IRealEstate>('RealEstate', EstateSchema);
```