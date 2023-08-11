import { Request, Response } from "express";
import User from "../models/user";

// ________________________________________ get user


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

const recommend = async (req: Request, res: Response) => {
  try {
    const users = await User.find().limit(6); // Apply the limit here
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default {
  recommend,
  getAllUser,
  getUserByID,
};
