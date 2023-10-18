import mongoose from "mongoose";
import Estate, { EstateDocument, IEstate } from "../models/estate";
import { NextFunction, Request, Response } from "express";
import { generateImageID, generateListID, addLetterID } from "../utils/generateID";
import { uploadToWasabi } from "../middlewares/wasabi";

// ________________________________________ lib

const updateEstateViews = (estate: EstateDocument) => {
  // Update seen
  estate.head.seen = (estate.head.seen || 0) + 1;

  // Update see for the current date
  const today = new Date().toISOString().split('T')[0];
  const seeEntry = estate.head.see; 

  if (seeEntry) {
      // If the date is different, update it
      if (seeEntry.date !== today) {
          seeEntry.date = today;
          seeEntry.count = 1;
      } else {
          seeEntry.count++;
      }
  } else {
      // If no entry exists, create a new one
      estate.head.see = { date: today, count: 1 };
  }
};

// ________________________________________ main function

const uploadImages = async (req: any, res: any) => {
  console.log("request files: ", req.files);
  const imageUrls: string[] = [];

  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const key = `${generateImageID()}.jpg`;

      // uploadToWasabi(key, req.files[i].buffer).then((result) => {
      //   console.log("uploaded image url", result);
      // });
      const imageUrl = await uploadToWasabi(key, req.files[i].buffer);
      imageUrls.push(imageUrl);
    }
  }
  
  res.json({
    msg: `${req.files.length} Images uploaded successfully`,
    imageUrls: imageUrls,
  });
};

// doing
const createEstate = async (req: Request, res: Response) => {
  // console.log("req.body: ", req.body);
  const { desc, maps } = req.body;
  const images = desc.images; // Extract the images array from the request body
  const user = req.body.user;

  // generate unique estateID
  const generateUniqueEstateID = async () => {
    let estateID = generateListID();
    let addLetterCount = 0;
    let isUnique = false;

    while (!isUnique) {
      const existingEstateID = await Estate.findOne({ "head.estateID": estateID });
      if (!existingEstateID) {
        isUnique = true;
      } else {
        addLetterCount += 2;
        estateID = generateListID() + addLetterID(addLetterCount);
      }
    }

    return estateID;
  };

  // generate unique estateID
  const estateID = await generateUniqueEstateID();

  // upload images to wasabi
  await uploadToWasabi(images.originalname, images.buffer);

  const estate = new Estate({
    _id: new mongoose.Types.ObjectId(),
    head: {
      estateID: estateID,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    desc,
    maps,
    user
  });

  return estate
    .save()
    .then((estate) => res.status(201).json({ estate }))
    .catch((error) => res.status(500).json({ error }));
};

// doing
const updateEstate = async (req: Request, res: Response) => {
  const estateID = req.params.estateID;
  console.log("estateID ", estateID);

  try {
    // Find the estate by ID
    const estate = await Estate.findOne({ 'head.estateID': estateID });

    if (!estate) {
      return res.status(404).json({ message: 'Estate not found' });
    }

    if (req.body.desc) {
      // Append the new image URLs to the existing images array
      if (req.body.desc.images && Array.isArray(req.body.desc.images)) {
        req.body.desc.images.forEach((imageUrl: string) => {
          estate.desc.images.push(imageUrl);
        });
      }
      // Handle other desc properties as needed
      estate.desc = { ...estate.desc, ...req.body.desc };
    }

    // Update estate properties based on your requirements
    if (req.body.head) {
      estate.head = { ...estate.head, ...req.body.head };
    }
    if (req.body.desc) {
      estate.desc = { ...estate.desc, ...req.body.desc };
    }
    if (req.body.maps) {
      estate.maps = { ...estate.maps, ...req.body.maps };
    }

    // Save the updated estate
    const updatedEstate = await estate.save();

    return res.status(200).json({ estate: updatedEstate });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEstate = async (req: Request, res: Response) => {
  const estateID = req.params.estateID;

  try {
    // Find the estate by ID and remove it
    const deletedEstate = await Estate.findOneAndRemove({ 'head.estateID': estateID });

    if (!deletedEstate) {
      return res.status(404).json({ message: 'Estate not found' });
    }

    return res.status(200).json({ message: 'Estate deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getEstateByID = async (req: Request, res: Response) => {
  const estateID = req.params.estateID;

  try {
    const estate = await Estate.findOne({ "head.estateID": estateID })
      .populate('user')
      .select('-__v');
    if (estate) {
      // Update views
      updateEstateViews(estate);
      // Save the changes
      await estate.save();

      res.status(200).json({ estate });
    } else {
      res.status(404).json({ message: "not found estate" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getAllEstate = async (req: Request, res: Response) => {
  try {
    const estates: IEstate[] = await Estate.find({ 'head.post': 'active' });
    return res.status(200).json({ estates });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// In limitEstate, it will pick up the first 4 data in the database and send it to the api.
// But want to make estates values ​​able to randomize the data sent to the API.

const limitEstate = async (req: Request, res: Response) => {
  try {
    // const estates: IEstate[] = await Estate.find({ 'head.post': 'active' })
    //   .populate('user')
    //   .select('-__v')
    //   .limit(8);
    const estates: IEstate[] = await Estate.aggregate([
      { $match: { 'head.post': 'active' } }, // Match only documents with 'head.post' set to 'active'
      { $sample: { size: 8 } }, // Randomly sample 8 documents
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } }, // Populate user
      { $unwind: '$user' }, // Unwind the user array
      { $project: { __v: 0 } }, // Exclude the __v field
    ]);
    return res.status(200).json({ estates });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// ________________________________________ searching

const searchEstate = async (req: Request, res: Response) => {
  const {
    keyword,
    findStatus,
    findType,
    minBed,
    minBath,
    minPrice,
    maxPrice,
    sorting,
    page = 1,
  } = req.query;

  const pageSize = 12; // Set your default pageSize here

  const searchQuery: any = {
    'head.post': 'active', // filter head.post
  };

  if (keyword && keyword.toString().length <= 60) {
    searchQuery["$or"] = [
      { "desc.title": { $regex: keyword, $options: "i" } },
      { "desc.about": { $regex: keyword, $options: "i" } },
      { "maps.address": { $regex: keyword, $options: "i" } },
      { "maps.subdistrict": { $regex: keyword, $options: "i" } },
      { "maps.district": { $regex: keyword, $options: "i" } },
      { "maps.province": { $regex: keyword, $options: "i" } },
      // { "maps.postcode": { $regex: keyword, $options: "i" } },
      { "maps.country": { $regex: keyword, $options: "i" } },
    ];
  }
  if (findStatus) {
    const statusValues = (findStatus as string).split(',');
    searchQuery['desc.status'] = { $in: statusValues };
  }
  if (findType) {
    const typeValues = (findType as string).split(',');
    searchQuery['desc.type'] = { $in: typeValues };
  }
  if (minBed) {
    searchQuery['desc.bed'] = { $gte: Number(minBed) };
  }
  if (minBath) {
    searchQuery['desc.bath'] = { $gte: Number(minBath) };
  }
  if (minPrice && maxPrice) {
    searchQuery['desc.price'] = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else if (minPrice) {
    searchQuery['desc.price'] = { $gte: Number(minPrice) };
  } else if (maxPrice) {
    searchQuery['desc.price'] = { $lte: Number(maxPrice) };
  }

  let sortOption: any = {};
  switch (sorting) {
    case "lowestPrice":
      sortOption = { "desc.price": 1 };
      break;
    case "highestPrice":
      sortOption = { "desc.price": -1 };
      break;
    case "oldestDate":
      sortOption = { "head.updatedAt": 1 };
      break;
    case "newestDate":
      sortOption = { "head.updatedAt": -1 };
      break;
    case "bedroomAscending":
      sortOption = { "desc.bed": 1 };
      break;
    case "bedroomDescending":
      sortOption = { "desc.bed": -1 };
      break;
    default:
      // Default sorting or no sorting
      break;
  }

  try {
    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * pageSize;

    // Calculate total number of records without pagination
    const totalRecords = await Estate.countDocuments(searchQuery);

    // Search and retrieve estates
    const estates = await Estate.find(searchQuery)
      .populate('user')
      .select('-__v')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)

    res.status(200).json({ estates, totalRecords });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default {
  uploadImages,
  createEstate,
  updateEstate,
  deleteEstate,
  getEstateByID,
  getAllEstate,
  limitEstate,
  searchEstate,
};
