import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Estate from "../models/estate";

import { generateImageID, generatePostID, generatePostID2 } from "../utils/generateID";
import { uploadToWasabi } from "../middlewares/wasabi";

const uploadImages = async (req: any, res: any) => {
  console.log("request files: ", req.files);

  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const key = `${generateImageID()}.jpg`;

      uploadToWasabi(key, req.files[i].buffer).then((result) => {
        console.log("uploaded image url", result);
      });
    }
  }
  
  res.json({
    msg: `${req.files.length} Images uploaded successfully`,
  });
};

// mocking
const createEstate_dev = async (req: Request, res: Response) => {
  try {
    const { head, desc, location } = req.body;

    // const user = await User.findOne({ "account.userID": head.userID });

    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    const estate = new Estate({
      head: {
        // userID: user._id, // Use the obtained _id from the user document
        userID: head.userID, // Use the obtained _id from the user document
        estateID: head.estateID, 
        postStatus: head.postStatus,
        createdAt: head.createdAt,
        updatedAt: head.updatedAt,
      },
      desc,
      location,
    });

    const savedEstate = await estate.save();

    return res.status(201).json({ estate: savedEstate });
  } catch (error) {
    console.log('createEstate error: ', error);
    return res.status(500).json({ error });
  }
};

const createEstate = async (req: Request, res: Response) => {
  // console.log("req.body: ", req.body);

  const userID = req.body.head;
  const { desc, location } = req.body;
  const images = desc.images; // Extract the images array from the request body

  // upload images to wasabi
  await uploadToWasabi(images.originalname, images.buffer);

  let checkEstateID: any;
  let isUniqueEstateID: boolean = false;
  
  // checking estateID 
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
      userID: userID,
      estateID: checkEstateID,
      postStatus: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    desc,
    location,
  });

  return estate
    .save()
    .then((estate) => res.status(201).json({ estate }))
    .catch((error) => res.status(500).json({ error }));
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
      { "desc.description": { $regex: propertySearch, $options: "i" } },
      { "location.address": { $regex: propertySearch, $options: "i" } },
      { "location.subdistrict": { $regex: propertySearch, $options: "i" } },
      { "location.district": { $regex: propertySearch, $options: "i" } },
      { "location.province": { $regex: propertySearch, $options: "i" } },
      { "location.postcode": { $regex: propertySearch, $options: "i" } },
      { "location.country": { $regex: propertySearch, $options: "i" } },
    ];
  }

  if (propertyType) {
    const typeValues = (propertyType as string).split(',');

    searchQuery['desc.estateType'] = { $in: typeValues };
  }

  if (propertyStatus) {
    // Explicitly cast propertyStatus to string and then split
    const statusValues = (propertyStatus as string).split(',');

    // Use $in operator to match any value in the array
    searchQuery['desc.estateStatus'] = { $in: statusValues };
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
      sortOption = { createdAt: 1 };
      break;
    case "newestDate":
      sortOption = { createdAt: -1 };
      break;
    case "bedroomAscending":
      sortOption = { "desc.bedroom": 1 };
      break;
    case "bedroomDescending":
      sortOption = { "desc.bedroom": -1 };
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
  getEstateByID,
  getAllEstate,
  limitEstate,
  searchEstate,
};
