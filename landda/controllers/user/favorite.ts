import { Request, Response } from "express";
import User from "../../models/user";
import Estate from "../../models/estate";
import { AuthRequest } from "../../middlewares/accessToken";

export const listFavorites = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;

  try {
    const user = await User.findOne({ "acc.userId": userId })
      .populate({
        select: "-_id -head.see -head.seen -head.shares -head.saves",
        path: "saves",
        populate: {
          path: "user", // populate 'user' field in 'IEstate' model
          select: "-_id acc.userId info.name subs.access", // select specific fields from 'user' object
          },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // extract saved estates from user document
    const savedEstates = user.saves;

    res.status(200).json({ favorites: savedEstates });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const checkFavorites = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;

  try {
    const user = await User.findOne({ "acc.userId": userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // extract saved estates from user document and map to get estateId values
    const savedEstates = await Estate.find({ _id: { $in: user.saves } });

    const estateIds = savedEstates.map((estate) => estate.head.estateId);

    res.status(200).json({ favorites: estateIds });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const saveFavorite = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const estateId = req.params.estateId;

  try {
    const user = await User.findOne({ "acc.userId": userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const estate = await Estate.findOne({ "head.estateId": estateId });

    if (!estate) {
      return res.status(404).json({ error: "Estate not found" });
    }

    // check if estate is already saved by user
    if (user.saves.includes(estate._id)) {
      return res.status(400).json({ error: "Estate already saved" });
    }

    // save estate ID to user's favorites
    user.saves.push(estate._id);
    await user.save();

    res.status(200).json({ message: "Estate saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const estateId = req.params.estateId;

  try {
    const user = await User.findOne({ "acc.userId": userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const estate = await Estate.findOne({ "head.estateId": estateId });

    if (!estate) {
      return res.status(404).json({ error: "Estate not found" });
    }

    // check if estate is in user's favorites
    const index = user.saves.indexOf(estate._id);

    if (index === -1) {
      return res.status(400).json({ error: "Estate not found in favorites" });
    }

    // remove estate ID from user's favorites
    user.saves.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Estate removed from favorites successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
