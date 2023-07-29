import { Request, Response } from "express";
import User from "../models/User";

// ________________________________________ get user

const getuserID = async (req: Request, res: Response) => {

    const userID = req.params.userID;
    // Fetch the user based on the userID
    return User.findOne({ "account.userID": userID })
      .then((user) => {
        user
          ? res.status(200).json({ user })
          : res.status(404).json({ message: "not found user" })
      })
    .catch((error) => res.status(500).json({ error }));
};

export default {
  getuserID,
};
