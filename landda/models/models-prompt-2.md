### 1

create models/RealEstate.ts with code

```ts
export interface EstateDocument extends IRealEstate, Document {}

const EstateSchema = new Schema<EstateDocument>({
  head: {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
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
});

export default mongoose.model<IRealEstate>('RealEstate', EstateSchema);
```

### 2

create controllers/RealEstate.ts with code 

```ts
const createRealEstate = (req: Request, res: Response, next: NextFunction) => {
  const { ...restProperties } = req.body;

  const realEstate = new RealEstate({
    _id: new mongoose.Types.ObjectId(),
    head: {
      estateId: generateUniqueId(),
      postStatus: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ...restProperties,
  });

  return realEstate
    .save()
    .then((realEstate) => res.status(201).json({ realEstate }))
    .catch((error) => res.status(500).json({ error }));
};
```