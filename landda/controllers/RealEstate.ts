import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import RealEstate from "../models/RealEstate";

import { generateUniqueId } from "../utils/id-generator";

const createRealEstate = (req: Request, res: Response, next: NextFunction) => {
  const { ...restProperties } = req.body;

  const realEstate = new RealEstate({
    _id: new mongoose.Types.ObjectId(),
    estate_id: generateUniqueId(),
    ...restProperties,
    createdAt: new Date(),
    updateAt: new Date(),
  });

  return realEstate
    .save()
    .then((realEstate) => res.status(201).json({ realEstate }))
    .catch((error) => res.status(500).json({ error }));
};

// const readRealEstate = (req: Request, res: Response, next: NextFunction) => {
//   const realEstateId = req.params.realEstateId;

//   return RealEstate.findById(realEstateId)
//     .then((realEstate) => {
//       realEstate
//         ? res.status(200).json({ realEstate })
//         : res.status(404).json({ message: "not found realEstate" });
//     })
//     .catch((error) => res.status(500).json({ error }));
// };

const realAllRealEstate = (req: Request, res: Response, next: NextFunction) => {
  return RealEstate.find()
    .then((realEstates) => res.status(200).json({ realEstates }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createRealEstate,
  // readRealEstate,
  realAllRealEstate,
};
