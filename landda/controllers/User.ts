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

    return User.findOne({ "account.userID": userID })
      .then((user) => {
        user
          ? res.status(200).json({ user })
          : res.status(404).json({ message: "not found user" })
      })
    .catch((error) => res.status(500).json({ error }));
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
      { "profile.name": { $regex: searchAgent, $options: "i" } },
      { "profile.company": { $regex: searchAgent, $options: "i" } },
      { "profile.description": { $regex: searchAgent, $options: "i" } },
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
    const user = await User.findOne({ 'account.userID': userID }).populate('estates');

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
      { 'account.userID': userID },
      { 'profile.name': name },
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
      { 'account.userID': userID },
      { 'profile.phone': phone },
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
      { 'account.userID': userID },
      { 'profile.speak': speak },
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

const updateCompany = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { company } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'account.userID': userID },
      { 'profile.company': company },
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

const updateAddress = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { address } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { 'account.userID': userID },
      { 'profile.address': address },
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

const updateDescription = async(req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { description } = req.body;

    // Find the user by userID and update the description field
    const updatedUser = await User.findOneAndUpdate(
      { 'account.userID': userID },
      { 'profile.description': description },
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

const updateContacts = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { contact1, contact2, contact3, contact4 } = req.body;

    // Find the user by userID and update the contact fields
    const updatedUser = await User.findOneAndUpdate(
      { 'account.userID': userID },
      {
        'profile.contact1': contact1,
        'profile.contact2': contact2,
        'profile.contact3': contact3,
        'profile.contact4': contact4,
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
  updateCompany,
  updateAddress,
  updateDescription,
  updateContacts,
};
