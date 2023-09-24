import mongoose from "mongoose";
import Estate from "../models/estate";
import { NextFunction, Request, Response } from "express";

import { generateImageID, generatePostID, generatePostID2 } from "../utils/generateID";
import { uploadToWasabi } from "../middlewares/wasabi";

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

  // upload images to wasabi
  await uploadToWasabi(images.originalname, images.buffer);
  
  let checkEstateID: any;
  let isUniqueEstateID: boolean = false;
  
  // check estateID 
  while (!isUniqueEstateID) {
    checkEstateID = generatePostID();

    const existingEstateID = await Estate.findOne({ 'head.estateID': checkEstateID });

    if (!existingEstateID) {
      isUniqueEstateID = true; 
    } else {
      checkEstateID = generatePostID2(); // If duplicate, try using generatePostID2

      const existingEstateID2 = await Estate.findOne({ 'head.estateID': checkEstateID });

      if (!existingEstateID2) {
        isUniqueEstateID = true; 
      }
    }
  }

  const estate = new Estate({
    _id: new mongoose.Types.ObjectId(),
    head: {
      estateID: checkEstateID,
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
    estate
      ? res.status(200).json({ estate })
      : res.status(404).json({ message: "not found realEstate" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getAllEstate = async (req: Request, res: Response) => {
  try {
    const estates = await Estate.find();
    return res.status(200).json({ estates });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const limitEstate = async (req: Request, res: Response) => {
  try {
    const estates = await Estate.find()
      .populate('user')
      .select('-__v')
      .limit(8);
    return res.status(200).json({ estates });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// ________________________________________ searching

const searchEstate = (req: Request, res: Response) => {
  const { propertySearch, propertyType, propertyStatus, minPrice, maxPrice, sorting } = req.query;

  const searchQuery: any = {};

  if (propertySearch) {
    searchQuery["$or"] = [
      { "desc.title": { $regex: propertySearch, $options: "i" } },
      { "desc.about": { $regex: propertySearch, $options: "i" } },
      { "maps.address": { $regex: propertySearch, $options: "i" } },
      { "maps.subdistrict": { $regex: propertySearch, $options: "i" } },
      { "maps.district": { $regex: propertySearch, $options: "i" } },
      { "maps.province": { $regex: propertySearch, $options: "i" } },
      { "maps.postcode": { $regex: propertySearch, $options: "i" } },
      { "maps.country": { $regex: propertySearch, $options: "i" } },
    ];
  }

  if (propertyType) {
    const typeValues = (propertyType as string).split(',');

    searchQuery['desc.type'] = { $in: typeValues };
  }

  if (propertyStatus) {
    // Explicitly cast propertyStatus to string and then split
    const statusValues = (propertyStatus as string).split(',');

    // Use $in operator to match any value in the array
    searchQuery['desc.status'] = { $in: statusValues };
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

  Estate.find(searchQuery)
    .populate('user')
    .select('-__v')
    .sort(sortOption)
    .then((estates) => {
      return res.status(200).json({ estates });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
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
