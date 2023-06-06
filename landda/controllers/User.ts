import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import { generateUniqueUserId } from "../utils/id-generator";
import jwt from 'jsonwebtoken';

const signIn = (req: Request, res: Response, next: NextFunction) => {
  const status = 'Active'
  const memberType = 'Member'
  const license_verified = 'False'
  const { email, name, image, provider } = req.body;
  const createdAt = new Date;
  const updatedAt = new Date;

  // User.findOne({ email })
  User.findOne({ 'profile.email': email })
    .then((existingUser) => {
      if (existingUser) {
        const token = generateToken(existingUser.account.userId, existingUser.profile.email, existingUser.profile.name, existingUser.profile.image, existingUser.membership.memberType);

        const userId = existingUser.account.userId
        const response = res.status(200).json({ token, userId });
        console.log('existingUser response: ', { token, userId })
        return response
      } else {
        const userId = generateUniqueUserId(); // Generate a unique user_id
        const newUser = new User({
          // _id: new mongoose.Types.ObjectId(),
          account: {
            userId,
            provider,
            status,
            license_verified,
            createdAt,
            updatedAt,
          },
          profile: {
            email,
            name,
            image
          },
          membership: {
            memberType,
          },
        });

        return newUser
          .save()
          .then((savedUser) => {
            console.log('savedUser: ', savedUser)
            const token = generateToken(savedUser.account.userId, savedUser.profile.email, savedUser.profile.name, savedUser.profile.image, savedUser.membership.memberType);
            const userId = savedUser.account.userId
            const response = res.status(201).json({ token, userId });
            console.log('user token response: ', { token, userId })
            return response
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

const generateToken = (userId: string, email: string , name: string , image: string , memberType: string ): string => {
  const secretKey = 'your_secret_key'; // Replace with your own secret key
  const token = jwt.sign({ userId, email, name, image, memberType }, secretKey, { expiresIn: '24h' });
  return token;
};

export default {
  signIn,
};
