import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import { generateUniqueUserId } from "../utils/id-generator";
import jwt from 'jsonwebtoken';

const signIn = (req: Request, res: Response, next: NextFunction) => {
  const { email, name } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const token = generateToken(existingUser.user_id);
        return res.status(200).json({ token });
      } else {
        const user_id = generateUniqueUserId(); // Generate a unique user_id
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          user_id,
          email,
          name,
        });

        return newUser
          .save()
          .then((savedUser) => {
            const token = generateToken(savedUser.user_id);
            return res.status(201).json({ token });
          })
          .catch((error) => {
            return res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

// ____________________

const generateToken = (userId: string): string => {
  const secretKey = 'your_secret_key'; // Replace with your own secret key
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
  return token;
};

// ____________________

export default {
  signIn,
};
