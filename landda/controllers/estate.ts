import mongoose from "mongoose";
import { Request, Response } from "express";
import Estate from "../models/estate";
import { uploadToWasabi } from "../middlewares/wasabi";
import { EstatePostStatus } from "../utils/helpers/types";
import { generateImageId } from "../utils/commons/createId";
import { generateUniqueEstateId } from "../utils/commons/createUniqueId";
import { updateEstateViews } from "../utils/commons/updateView";

export const uploadImages = async (req: any, res: any) => {
  console.log("request files: ", req.files);
  const imageUrls: string[] = [];

  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const key = `${generateImageId()}.jpg`;

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
export const createEstate = async (req: Request, res: Response) => {
  // console.log("req.body: ", req.body);
  const { desc, maps } = req.body;
  const images = desc.images; // extract images array from request body
  const user = req.body.user;
  
  try {
    // generate unique estateId
    const estateId = await generateUniqueEstateId();

    // upload images to Wasabi
    await uploadToWasabi(images.originalname, images.buffer);

    const estate = new Estate({
      _id: new mongoose.Types.ObjectId(),
      head: {
        estateId: estateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      desc,
      maps,
      user,
    });

    const savedEstate = await estate.save();

    res.status(201).json({ estate: savedEstate });
  } catch (error) {
    console.error("Error in createEstate:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// doing
export const updateEstate = async (req: Request, res: Response) => {
  const estateId = req.params.estateId;
  console.log("estateId ", estateId);

  try {
    // find estate by Id
    const estate = await Estate.findOne({ "head.estateId": estateId });

    if (!estate) {
      return res.status(404).json({ message: "Estate not found" });
    }

    if (req.body.desc) {
      // append new image URLs to the existing images array
      if (req.body.desc.images && Array.isArray(req.body.desc.images)) {
        req.body.desc.images.forEach((imageUrl: string) => {
          estate.desc.images.push(imageUrl);
        });
      }
      // handle other desc properties as needed
      estate.desc = { ...estate.desc, ...req.body.desc };
    }

    // update estate properties based on requirements
    if (req.body.head) {
      estate.head = { ...estate.head, ...req.body.head };
    }
    if (req.body.desc) {
      estate.desc = { ...estate.desc, ...req.body.desc };
    }
    if (req.body.maps) {
      estate.maps = { ...estate.maps, ...req.body.maps };
    }

    // save updated estate
    const updatedEstate = await estate.save();

    return res.status(200).json({ estate: updatedEstate });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEstate = async (req: Request, res: Response) => {
  const estateId = req.params.estateId;

  try {
    // find estate by ID and remove it
    const deletedEstate = await Estate.findOneAndRemove({
      "head.estateId": estateId,
    });

    if (!deletedEstate) {
      return res.status(404).json({ message: "Estate not found" });
    }

    return res.status(200).json({ message: "Estate deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getEstateById = async (req: Request, res: Response) => {
  const estateId = req.params.estateId;

  try {
    const estate = await Estate.findOne({ "head.estateId": estateId })
      .populate({
        path: "user",
        select: "-_id acc.userID acc.verified info.image info.name info.work subs.access",
      })
      .select("-__v");
    if (estate) {
      // update views
      updateEstateViews(estate);
      // save changes
      await estate.save();

      res.status(200).json({ estate });
    } else {
      res.status(404).json({ message: "not found estate" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// ________________________________________ searching

export const searchEstate = async (req: Request, res: Response) => {
  const {
    keyword,
    location,
    findStatus,
    findType,
    minBed,
    minBath,
    minPrice,
    maxPrice,
    sorting,
  } = req.query;
  const page = 1;
  const pageSize = 12;
  const searchQuery: any = {
    "head.post":  EstatePostStatus.Active
  };

  if (keyword && keyword.toString().length <= 60) {
    searchQuery["$or"] = [
      { "desc.title": { $regex: keyword, $options: "i" } },
      { "desc.about": { $regex: keyword, $options: "i" } },
      { "maps.address": { $regex: keyword, $options: "i" } },
      { "maps.postcode": { $regex: keyword, $options: "i" } },
    ];
  }
  if (location && location.toString().length <= 30) {
    searchQuery["$or"] = [
      { "maps.subdistrict": { $regex: location, $options: "i" } },
      { "maps.district": { $regex: location, $options: "i" } },
      { "maps.province": { $regex: location, $options: "i" } },
      { "maps.country": { $regex: location, $options: "i" } },
    ];
  }
  if (findStatus) {
    const statusValues = (findStatus as string).split(",");
    searchQuery["desc.status"] = { $in: statusValues };
  }
  if (findType) {
    const typeValues = (findType as string).split(",");
    searchQuery["desc.type"] = { $in: typeValues };
  }
  if (minBed) {
    searchQuery["desc.bed"] = { $gte: Number(minBed) };
  }
  if (minBath) {
    searchQuery["desc.bath"] = { $gte: Number(minBath) };
  }
  if (minPrice && maxPrice) {
    searchQuery["desc.price"] = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
  } else if (minPrice) {
    searchQuery["desc.price"] = { $gte: Number(minPrice) };
  } else if (maxPrice) {
    searchQuery["desc.price"] = { $lte: Number(maxPrice) };
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
      // default sorting or no sorting
      break;
  }

  try {
    // calculate skip value for pagination
    const skip = (Number(page) - 1) * pageSize;

    // calculate total number of records without pagination
    const totalRecords = await Estate.countDocuments(searchQuery);

    // search and retrieve estates
    const estates = await Estate.find(searchQuery)
      .populate({
        path: "user",
        select: "-_id acc.userID acc.verified info.image info.name info.work subs.access",
      })
      .select("-__v")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({ estates, totalRecords });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
};
