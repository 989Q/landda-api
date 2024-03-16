import { Request, Response } from "express";
import User from "../../models/user";
import {
  signToken,
  verifyToken,
  careteAccessToken,
  createRefreshToken,
} from "../../middlewares/accesstoken";
import { tokenConfig } from "../../configs/token";
import { generateUniqueUserId } from "../../utils/gen_unique_id";

// ________________________________________ lib

const handleExistingUser = (user: any, res: Response, statusCode: number) => {
  // extract properties from user
  const { userId, role } = user.acc;
  const { email, image, name } = user.info;
  const { access } = user.subs;
  
  const accessToken = careteAccessToken(userId, role, email, image, name, access);
  const refreshToken = createRefreshToken(userId);
  const expires = Math.floor(Date.now() + tokenConfig.setTimeToken);

  // console.log("Handling existing user:", { userId, accessToken, refreshToken, expires });
  
  return res.status(statusCode).json({ accessToken, refreshToken, userId, expires });
};

// ________________________________________ main

export const signIn = async (req: Request, res: Response) => {
  const { email, image, name, logins } = req.body;

  try {
    // check if user already exists
    const existingUser = await User.findOne({ "info.email": email });

    if (existingUser) {
      return handleExistingUser(existingUser, res, 200);
    }

    // generate unique userId
    const userId = await generateUniqueUserId();

    // create new user
    const newUser = new User({
      acc: {
        userId,
        logins: logins,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      info: { email, image, name },
    });

    const savedUser = await newUser.save();

    return handleExistingUser(savedUser, res, 201);
  } catch (error) {
    return res.status(500).json({ error: "Error in signIn." });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: requestRefreshToken } = req.body;

  if (!requestRefreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  try {
    const decoded = verifyToken(requestRefreshToken, tokenConfig.refreshTokenSecret);

    const userData = await User.findOne({ "acc.userId": decoded.userId });

    if (!userData) {
      return res.status(401).json({ message: "User not found for the provided refresh token." });
    }

    // create new accessToken
    const newAccessToken = signToken(
      {
        userId: userData.acc.userId,
        email: userData.info.email,
        image: userData.info.image,
        name: userData.info.name,
        access: userData.subs.access,
      },
      tokenConfig.accessTokenSecret,
      "1d"
    );

    // create new refreshToken
    const newRefreshToken = signToken({ userId: decoded.userId }, tokenConfig.refreshTokenSecret, "7d");

    const newExpires = Math.floor(Date.now() + tokenConfig.setTimeToken);

    const response = res.status(201).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expires: newExpires,
    });

    return response;
  } catch (error) {
    console.error("Error in refreshToken:", error);
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};
