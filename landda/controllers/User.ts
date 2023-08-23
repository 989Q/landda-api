import { Request, Response } from "express";
import User from "../models/user";

// ________________________________________ Get user

const getAllUser = async (req: Request, res: Response) => {
 return User.find()
  .then((users) => res.status(200).json({ users }))
  .catch((error) => res.status(500).json({ error }));
}

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

// ________________________________________ Search user

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

export default {
  limitAgent,
  getAllUser,
  getUserByID,
  searchAgent,
};
