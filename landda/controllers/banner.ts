import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Banner from "../models/banner";

import { generateBannerID, } from "../utils/generateID";

const createBanner = async (req: Request, res: Response) => {
  // console.log("req.body: ", req.body);

  const { userID, supporterName } = req.body.head;
  const { desc } = req.body;

  let checkBannerID: any;
  let isUniqueBannerID: boolean = false;
  
  if (!isUniqueBannerID) {
    checkBannerID = generateBannerID();

    const existingBannerID = await Banner.findOne({ 'head.bannerID': checkBannerID });

    if (!existingBannerID) {
      isUniqueBannerID = true; 
    } 
  }

  const banner = new Banner({
    // _id: new mongoose.Types.ObjectId(),
    head: {
      userID: userID,
      bannerID: checkBannerID,
      supporterName: supporterName,
      postStatus: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    desc,
  });

  return banner
    .save()
    .then((banner) => res.status(201).json({ banner }))
    .catch((error) => res.status(500).json({ error }));
};

const getBannerByID = (req: Request, res: Response, next: NextFunction) => {
  const bannerID = req.params.bannerID;

  return Banner.findOne({ "head.bannerID": bannerID })
    .then((banner) => {
      banner
        ? res.status(200).json({ banner })
        : res.status(404).json({ message: "not found banner" });
    })
    .catch((error) => res.status(500).json({ error }));
};

const getAllBanner = (req: Request, res: Response, next: NextFunction) => {
  return Banner.find()
    .then((banners) => res.status(200).json({ banners }))
    .catch((error) => res.status(500).json({ error }));
};

// ________________________________________ searching

const searchBanner = (req: Request, res: Response, next: NextFunction) => {
  const { propertySearch, propertyType, propertyStatus } = req.query;

  const searchQuery: any = {};

  if (propertySearch) {
    searchQuery["$or"] = [
      { "desc.title": { $regex: propertySearch, $options: "i" } },
      { "desc.description": { $regex: propertySearch, $options: "i" } },
      { "location.address": { $regex: propertySearch, $options: "i" } },
    ];
  }

  if (propertyType) {
    // searchQuery.estateType = propertyType;
    searchQuery["desc.estateType"] = propertyType;
  }

  if (propertyStatus) {
    // searchQuery.estateyStatus = propertyStatus;
    searchQuery["desc.estateyStatus"] = propertyStatus;
  }

  Banner.find(searchQuery)
    .then((banners) => {
      return res.status(200).json({ banners });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

export default {
  createBanner,
  getBannerByID,
  getAllBanner,
  searchBanner,
};
