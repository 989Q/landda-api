// controllers/Auth.ts

import { Request, Response } from "express";
import User from "../models/User";
import { generateUniqueUserId } from "../utils/id-generator";
import { signToken, verifyToken } from "../utils/signToken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
// 30 sec -> 30000 | 1 min -> 60000 | 1 hour -> 3600000 | 1 day -> 86400000
const setTime = 86400000 

const signIn = (req: Request, res: Response) => {
  const status = "Active";
  const memberType = "Member";
  const license_verified = "False";
  const { email, name, image, provider } = req.body;
  const createdAt = new Date();
  const updatedAt = new Date();

  // User.findOne({ email })
  User.findOne({ "profile.email": email })
    .then((existingUser) => {
      if (existingUser) {
        const accessToken = generateToken(
          existingUser.account.userId,
          existingUser.profile.email,
          existingUser.profile.name,
          existingUser.profile.image,
          existingUser.membership.memberType
        );
        const refreshToken = generateRefreshToken(existingUser.account.userId)
        const userId = existingUser.account.userId;

        const expires = Math.floor(Date.now() + setTime);

        const response = res.status(200).json({ accessToken, refreshToken, userId, expires });
        console.log("existingUser response: ", { accessToken, refreshToken, userId, expires });
        return response;
      } else {
        const userId = generateUniqueUserId(); 
        const newUser = new User({
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
            image,
          },
          membership: {
            memberType,
          },
        });

        return newUser
          .save()
          .then((savedUser) => {
            console.log("savedUser: ", savedUser);
            const accessToken = generateToken(
              savedUser.account.userId,
              savedUser.profile.email,
              savedUser.profile.name,
              savedUser.profile.image,
              savedUser.membership.memberType
            );
            const refreshToken = generateRefreshToken(
              savedUser.account.userId,
            )
            const userId = savedUser.account.userId;

            const expires = Math.floor(Date.now() + setTime);

            const response = res.status(201).json({ accessToken, refreshToken, userId, expires });
            console.log("newUser response: ", { accessToken, refreshToken, userId, expires });
            return response;
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

const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  try {
    // Verify refreshToken
    const decoded = verifyToken(refreshToken, refreshTokenSecret) as any;

    User.findOne({ "account.userId": decoded.userId })
      .then((userData) => {
        if (userData) {
          // Generate new accessToken
          const newAccessToken = signToken({ 
            userId: userData.account.userId, 
            email: userData.profile.email, 
            name: userData.profile.name, 
            image: userData.profile.image, 
            memberType: userData.membership.memberType
          }, accessTokenSecret, "1d");

          // Generate new refreshToken
          const newRefreshToken = signToken({ userId: decoded.userId }, refreshTokenSecret, "7d");
      
          const newExpires = Math.floor(Date.now() + setTime); 
      
          // Send new response
          const response = res.status(201).json({ accessToken: newAccessToken, refreshToken: newRefreshToken, expires: newExpires });
          console.log("new refreshToken response: ", { accessToken: newAccessToken, refreshToken: newRefreshToken, expires: newExpires });
      
          return response;
        }
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};

// ________________________________________ Test Response

const testaxios = (req: Request, res: Response) => {
  try {
    // Perform any necessary operations or fetch data from the server
    const data = {
      message: "This is a test response from the server",
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ________________________________________ JWT Function

const generateToken = (
  userId: string,
  email: string,
  name: string,
  image: string,
  memberType: string
): string => {
  const accessToken = signToken({ userId, email, name, image, memberType }, accessTokenSecret, "1d");

  return accessToken;
}

const generateRefreshToken = (
  userId: string,
): string => {
  const refreshToken = signToken({ userId }, refreshTokenSecret, "7d");

  return refreshToken;
}

export default {
  signIn,
  refreshToken,
  testaxios,
};
