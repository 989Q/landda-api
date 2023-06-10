import { Request, Response } from "express";
import User from "../models/User";

// ________________________________________ get user

const getOwnerId = async (req: Request, res: Response) => {

    const ownerId = req.params.ownerId;
    // Fetch the user based on the ownerId
    return User.findOne({ _id: ownerId })
      .then((user) => {
        user
          ? res.status(200).json({ user })
          : res.status(404).json({ message: "not found user" })
      })
    .catch((error) => res.status(500).json({ error }));
};

export default {
  getOwnerId,
};
