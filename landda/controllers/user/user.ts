import { Request, Response } from "express";
import User from "../../models/user";
import { UserRole, UserStatus } from "../../utils/types";
import { AuthRequest } from "../../middlewares/accesstoken";

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ "acc.userId": userId })
      .select("-_id -__v -acc.logins -info.email -subs.stripeId -subs.active -messages -saves")
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

export const searchAgent = async (req: Request, res: Response) => {
  const { keyword, page = 1 } = req.query;

  const pageSize = 9;

  const searchQuery: any = {
    $or: [
      { "acc.role": { $in: [UserRole.Partner, UserRole.Agent] } },
      { "acc.status": { $in: [UserStatus.Active, UserStatus.Inactive] } },
    ],
  };

  if (keyword && keyword.toString().length <= 60) {
    searchQuery["$or"] = [
      { "info.name": { $regex: keyword, $options: "i" } },
      { "info.work": { $regex: keyword, $options: "i" } },
      { "info.about": { $regex: keyword, $options: "i" } },
    ];
  }

  try {
    // calculate skip value for pagination
    const skip = (Number(page) - 1) * pageSize;

    // calculate total number of records without pagination
    const totalRecords = await User.countDocuments(searchQuery);

    const users = await User.find(searchQuery)
      .select("-_id -__v -acc.logins -acc.status -info.email -subs.stripeId -subs.active -messages -saves")
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({ users, totalRecords });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ________________________________________ manage owned estate listing

export const searchListing = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { keyword, sorting } = req.query;

  try {
    const user = await User.findOne({ "acc.userId": userId })
      .populate("estates");

    if (!user) {return res.status(404).json({ message: "User not found" });}

    // extract owned items from user object
    let ownedItems = user.estates;

    if (typeof keyword === 'string') {
      // limit keyword to 60 characters
      const limitedKeyword = keyword.substring(0, 60).toLowerCase();

      // filter ownedItems based on the keyword
      ownedItems = ownedItems.filter((item: any) => {
        // modify this condition to match filtering criteria
        return (
          item.desc.title.toLowerCase().includes(limitedKeyword) ||
          item.desc.about.toLowerCase().includes(limitedKeyword) ||
          // maps
          item.maps.address.toLowerCase().includes(limitedKeyword) ||
          item.maps.subdistrict.toLowerCase().includes(limitedKeyword) ||
          item.maps.district.toLowerCase().includes(limitedKeyword) ||
          item.maps.address.toLowerCase().includes(limitedKeyword) ||
          item.maps.province.toLowerCase().includes(limitedKeyword) ||
          item.maps.postcode.toString().includes(limitedKeyword) ||
          item.maps.country.toLowerCase().includes(limitedKeyword) 
        );
      });
    }

    if (sorting === 'highestPrice') {
      ownedItems.sort((a: any, b: any) => b.desc.price - a.desc.price);
    } else if (sorting === 'lowestPrice') {
      ownedItems.sort((a: any, b: any) => a.desc.price - b.desc.price);
    } else if (sorting === 'newestDate') {
      ownedItems.sort((a: any, b: any) => b.head.updatedAt - a.head.updatedAt);
    } else if (sorting === 'oldestDate') {
      ownedItems.sort((a: any, b: any) => a.head.updatedAt - b.head.updatedAt);
    }

    return res.status(200).json({ ownedItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ________________________________________ update user

export const getUserInfo = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;

  try {
    const user = await User.findOne({ "acc.userId": userId })
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

export const updateName = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { name } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { "acc.userId": userId },
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

export const updatePhone = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { phone } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { "acc.userId": userId },
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

export const updateSpeak = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { speak } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { "acc.userId": userId },
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

export const updateWork = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { work } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { "acc.userId": userId },
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

export const updateLive = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { live } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { "acc.userId": userId },
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

export const updateAbout = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { about } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { "acc.userId": userId },
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

export const updateLinks = async (req: AuthRequest, res: Response) => {
  const userId = req.userToken?.userId;
  const { link1, link2, link3, link4 } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { "acc.userId": userId },
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
