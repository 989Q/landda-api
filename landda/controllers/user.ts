import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import Estate, { IEstate } from "../models/estate";

// ________________________________________ get user

const getUserByID = async (req: Request, res: Response) => {
  const userID = req.params.userID;

  try {
    const user = await User.findOne({ "acc.userID": userID })
      .select("-_id -__v -acc.logins -info.email -subs.stripeID -subs.active -messages -saves")
      .populate("estates");

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ________________________________________ searching

const searchAgent = async (req: Request, res: Response) => {
  const { 
    keyword,
    page = 1
  } = req.query;

  const pageSize = 9;

  const searchQuery: any = {
    "acc.role": "agent",
    "acc.status": "active",
  };

  if (keyword && keyword.toString().length <= 60) {
    searchQuery["$or"] = [
      { "info.name": { $regex: keyword, $options: "i" } },
      { "info.work": { $regex: keyword, $options: "i" } },
      { "info.about": { $regex: keyword, $options: "i" } },
    ];
  }

  try {
    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * pageSize;

    // Calculate total number of records without pagination
    const totalRecords = await User.countDocuments(searchQuery);

    const users = await User.find(searchQuery)
      .select("-_id -__v -acc.logins -acc.status -info.email -subs.stripeID -subs.active -messages -saves")
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({ users, totalRecords });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ________________________________________ manage saves(favorite)

const listFavorites = async (req: Request, res: Response) => {
  const userID = req.params.userID;

  try {
    const user = await User.findOne({ "acc.userID": userID })
      .populate({
        select: "-_id -head.see -head.seen -head.shares -head.saves",
        path: "saves",
        populate: {
          path: "user", // Populate the 'user' field in the 'IEstate' model
          select: "-_id acc.userID info.name subs.access", // Select specific fields from the 'user' object
          },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract saved estates from user document
    const savedEstates = user.saves;

    res.status(200).json({ favorites: savedEstates });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const checkFavorites = async (req: Request, res: Response) => {
  const userID = req.params.userID;

  try {
    const user = await User.findOne({ "acc.userID": userID });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract saved estates from user document and map to get estateID values
    const savedEstates = await Estate.find({ _id: { $in: user.saves } });

    const estateIDs = savedEstates.map((estate) => estate.head.estateID);

    res.status(200).json({ favorites: estateIDs });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const saveFavorite = async (req: Request, res: Response) => {
  try {
    const { userID, estateID } = req.body;

    // find user
    const user = await User.findOne({ "acc.userID": userID });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // find estate
    const estate = await Estate.findOne({ "head.estateID": estateID });

    if (!estate) {
      return res.status(404).json({ error: "Estate not found" });
    }

    // Check if the estate is already saved by the user
    if (user.saves.includes(estate._id)) {
      return res.status(400).json({ error: "Estate already saved" });
    }

    // Save the estate ID to the user's favorites
    user.saves.push(estate._id);
    await user.save();

    res.status(200).json({ message: "Estate saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { userID, estateID } = req.body;

    // find user
    const user = await User.findOne({ "acc.userID": userID });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // find estate
    const estate = await Estate.findOne({ "head.estateID": estateID });

    if (!estate) {
      return res.status(404).json({ error: "Estate not found" });
    }

    // Check if the estate is in the user's favorites
    const index = user.saves.indexOf(estate._id);

    if (index === -1) {
      return res.status(400).json({ error: "Estate not found in favorites" });
    }

    // Remove the estate ID from the user's favorites
    user.saves.splice(index, 1);
    await user.save();

    res
      .status(200)
      .json({ message: "Estate removed from favorites successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ________________________________________ manage owned estate listing

const manageListing = async (req: Request, res: Response) => {
  try {
    // console.log(req.params)
    const userID = req.params.userID;

    // Retrieve the user's data including their owned items
    const user = await User.findOne({ "acc.userID": userID }).populate(
      "estates"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract owned items from the user object
    const ownedItems = user.estates;

    return res.status(200).json({ ownedItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ________________________________________ update user

const getUserInfo = async (req: any, res: Response) => {
  const userID = req.user.userID;

  try {
    const user = await User.findOne({ "acc.userID": userID })
      .select("-_id -__v -acc.logins -messages -saves");

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateName = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID;
    const { name } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "acc.userID": userID },
      { "info.name": name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePhone = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID;
    const { phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "acc.userID": userID },
      { "info.phone": phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateSpeak = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID;
    const { speak } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "acc.userID": userID },
      { "info.speak": speak },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateWork = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID;
    const { work } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "acc.userID": userID },
      { "info.work": work },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateLive = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID;
    const { live } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "acc.userID": userID },
      { "info.live": live },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateAbout = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID;
    const { about } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "acc.userID": userID },
      { "info.about": about },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateLinks = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID;
    const { link1, link2, link3, link4 } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { "acc.userID": userID },
      {
        "info.link1": link1,
        "info.link2": link2,
        "info.link3": link3,
        "info.link4": link4,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getUserByID,
  searchAgent,
  // Saves
  listFavorites,
  checkFavorites,
  saveFavorite,
  removeFavorite,
  // Manage
  manageListing,
  // Update
  getUserInfo,
  updateName,
  updatePhone,
  updateSpeak,
  updateWork,
  updateLive,
  updateAbout,
  updateLinks,
};
