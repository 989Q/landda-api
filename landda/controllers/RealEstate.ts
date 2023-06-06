import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import RealEstate from "../models/RealEstate";

import { generateUniqueId } from "../utils/id-generator";

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

const readRealEstate = (req: Request, res: Response, next: NextFunction) => {
  const estateId = req.params.estateId;

  // return RealEstate.findOne({ estateId })
  return RealEstate.findOne({ "head.estateId": estateId })
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
    searchQuery['$or'] = [
      { 'desc.title': { $regex: propertySearch, $options: 'i' } },
      { 'location.address': { $regex: propertySearch, $options: 'i' } },
      { 'location.subdistrict': { $regex: propertySearch, $options: 'i' } },
      { 'location.district': { $regex: propertySearch, $options: 'i' } },
      { 'location.province': { $regex: propertySearch, $options: 'i' } },
      { 'location.postcode': { $regex: propertySearch, $options: 'i' } },
      { 'location.country': { $regex: propertySearch, $options: 'i' } },
    ];
  }

  if (propertyType) {
    searchQuery.property_type = propertyType;
  }

  if (propertyStatus) {
    searchQuery.property_status = propertyStatus;
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
  createRealEstate,
  readRealEstate,
  realAllRealEstate,
  searchRealEstate,
};
