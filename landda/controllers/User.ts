import { Request, Response } from "express";
import User from "../models/user";

// ________________________________________ Get Users

const getAllUser = async (req: Request, res: Response) => {
 return User.find()
  .then((users) => res.status(200).json({ users }))
  .catch((error) => res.status(500).json({ error }));
}

// ________________________________________ Get User

const getUserByID = async (req: Request, res: Response) => {
  const userID = req.params.userID;

  try {
    const user = await User.findOne({ "acc.userID": userID }).populate('estates');

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const limitAgent = async (req: Request, res: Response) => {
  try {
    const users = await User.find().limit(6); // Apply the limit here
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ________________________________________ Search Agent

const searchAgent = (req: Request, res: Response) => {
  const {searchAgent} = req.query;

  const searchQuery: any = {};

  if (searchAgent) {
    searchQuery["$or"] = [
      { "info.name": { $regex: searchAgent, $options: "i" } },
      { "info.work": { $regex: searchAgent, $options: "i" } },
      { "info.about": { $regex: searchAgent, $options: "i" } },
    ]
  }

  User.find(searchQuery)
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    })
}

// ________________________________________ Manage Owned Estate Listing

const manageListing = async (req: Request, res: Response) => {
  try {
    // console.log(req.params)
    const userID = req.params.userID; 

    // Retrieve the user's data including their owned items
    const user = await User.findOne({ 'acc.userID': userID }).populate('estates');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract owned items from the user object
    const ownedItems = user.estates;

    return res.status(200).json({ ownedItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ________________________________________ Update User

const updateName = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { name } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'acc.userID': userID },
      { 'info.name': name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updatePhone = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'acc.userID': userID },
      { 'info.phone': phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateSpeak = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { speak } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'acc.userID': userID },
      { 'info.speak': speak },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateWork = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { work } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'acc.userID': userID },
      { 'info.work': work },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateLive = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { live } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'acc.userID': userID },
      { 'info.live': live },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateAbout = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { about } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'acc.userID': userID },
      { 'info.about': about },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateLinks = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { link1, link2, link3, link4 } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'acc.userID': userID },
      {
        'info.link1': link1,
        'info.link2': link2,
        'info.link3': link3,
        'info.link4': link4,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default {
  limitAgent,
  getAllUser,
  getUserByID,
  searchAgent,
  // Manage
  manageListing,
  // Update
  updateName,
  updatePhone,
  updateSpeak,
  updateWork,
  updateLive,
  updateAbout,
  updateLinks,
};
