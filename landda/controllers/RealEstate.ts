import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import RealEstate from "../models/RealEstate";
import { generateImageID, generatePostID } from "../utils/gen-id";

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

const createRealEstate = async (req: Request, res: Response) => {
  console.log("req.body: ", req.body);

  const { desc, location } = req.body;
  const { userID } = req.body.head;
  const images = desc.images; // Extract the images array from the request body

  // upload images to wasabi
  await uploadToWasabi(images.originalname, images.buffer);

  const realEstate = new RealEstate({
    _id: new mongoose.Types.ObjectId(),
    head: {
      userID: userID,
      estateID: generatePostID(),
      postStatus: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    desc,
    location,
  });

  return realEstate
    .save()
    .then((realEstate) => res.status(201).json({ realEstate }))
    .catch((error) => res.status(500).json({ error }));
};

const readRealEstate = (req: Request, res: Response, next: NextFunction) => {
  const estateID = req.params.estateID;

  // return RealEstate.findOne({ estateID })
  return RealEstate.findOne({ "head.estateID": estateID })
    .then((realEstate) => {
      realEstate
        ? res.status(200).json({ realEstate })
        : res.status(404).json({ message: "not found realEstate" });
    })
    .catch((error) => res.status(500).json({ error }));
};

const realAllRealEstate = (req: Request, res: Response, next: NextFunction) => {
  return RealEstate.find()
    .then((realEstates) => res.status(200).json({ realEstates }))
    .catch((error) => res.status(500).json({ error }));
};

// ________________________________________ searching

const searchRealEstate = (req: Request, res: Response, next: NextFunction) => {
  const { propertySearch, propertyType, propertyStatus } = req.query;

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
    // searchQuery.estateType = propertyType;
    searchQuery["desc.estateType"] = propertyType;
  }

  if (propertyStatus) {
    // searchQuery.estateStatus = propertyStatus;
    searchQuery["desc.estateStatus"] = propertyStatus;
  }

  RealEstate.find(searchQuery)
    .then((realEstates) => {
      return res.status(200).json({ realEstates });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

export default {
  uploadImages,
  createRealEstate,
  readRealEstate,
  realAllRealEstate,
  searchRealEstate,
};
