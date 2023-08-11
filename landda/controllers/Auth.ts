// controllers/Auth.ts

import { Request, Response } from "express";
import User from "../models/user";
import { generateUserID, generateUserID2 } from "../utils/generateID";
import { signToken, verifyToken } from "../utils/generateToken";
import { stripe } from "../middlewares/stripe";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
// 30 sec -> 30000 | 1 min -> 60000 | 1 hour -> 3600000 | 1 day -> 86400000
const setTime = 86400000 

const signIn = async (req: Request, res: Response) => {
  // console.log('req.body: ', req.body)
  const { email, name, image, provider } = req.body;
  const status = "Active";
  const memberType = "Member";
  const licenseVerified = "False";
  const createdAt = new Date();
  const updatedAt = new Date();

  const stripeCustomer = await stripe.customers.create({
    email 
  }, {
    apiKey: process.env.STRIPE_SECRET_KEY
  })

  const stripeCustomerID = stripeCustomer.id

  let checkUserID: any;
  let isUniqueUserID: boolean = false;
  
  // checking userID 
  while (!isUniqueUserID) {
    checkUserID = generateUserID();
  
    const existingUserID = await User.findOne({ 'account.userID': checkUserID });
    
    if (!existingUserID) {
      isUniqueUserID = true;
    } else {
      checkUserID = generateUserID2(); // If duplicate, try using generateUserID2

      const existingUserID2 = await User.findOne({ 'account.userID': checkUserID });

      if(!existingUserID2) {
        isUniqueUserID = true
      }
    }
  }
  
  // User.findOne({ email })
  User.findOne({ "profile.email": email })
    .then((existingUser) => {
      if (existingUser) {
        const accessToken = generateToken(
          existingUser.account.userID,
          existingUser.profile.email,
          existingUser.profile.name,
          existingUser.profile.image,
          existingUser.membership.memberType
        );
        const refreshToken = generateRefreshToken(existingUser.account.userID)
        const userID = existingUser.account.userID;

        const expires = Math.floor(Date.now() + setTime);

        const response = res.status(200).json({ accessToken, refreshToken, userID, expires });
        console.log("existingUser response: ", { accessToken, refreshToken, userID, expires });
        return response;
      } else {
        const userID = checkUserID; 
        const newUser = new User({
          account: {
            userID,
            provider,
            status,
            licenseVerified,
            createdAt,
            updatedAt,
          },
          profile: {
            email,
            name,
            image,
          },
          membership: {
            stripeCustomerID,
            memberType,
          },
        });

        return newUser
          .save()
          .then((savedUser) => {
            console.log("savedUser: ", savedUser);
            const accessToken = generateToken(
              savedUser.account.userID,
              savedUser.profile.email,
              savedUser.profile.name,
              savedUser.profile.image,
              savedUser.membership.memberType
            );
            const refreshToken = generateRefreshToken(
              savedUser.account.userID,
            )
            const userID = savedUser.account.userID;

            const expires = Math.floor(Date.now() + setTime);

            const response = res.status(201).json({ accessToken, refreshToken, userID, expires });
            console.log("newUser response: ", { accessToken, refreshToken, userID, expires });
            return response;
          })
          .catch((error) => {
            console.log(error)
            return res.status(500);
          });
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(500);
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

    User.findOne({ "account.userID": decoded.userID })
      .then((userData) => {
        if (userData) {
          // Generate new accessToken
          const newAccessToken = signToken({ 
            userID: userData.account.userID, 
            email: userData.profile.email, 
            name: userData.profile.name, 
            image: userData.profile.image, 
            memberType: userData.membership.memberType
          }, accessTokenSecret, "1d");

          // Generate new refreshToken
          const newRefreshToken = signToken({ userID: decoded.userID }, refreshTokenSecret, "7d");
      
          const newExpires = Math.floor(Date.now() + setTime); 
      
          // Send new response
          const response = res.status(201).json({ accessToken: newAccessToken, refreshToken: newRefreshToken, expires: newExpires });
          console.log("new refreshToken response: ", { accessToken: newAccessToken, refreshToken: newRefreshToken, expires: newExpires });
      
          return response;
        }
      })
      .catch((error) => {
        console.log(error)
        return res.status(500);
      });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};

// ________________________________________ JWT Function

const generateToken = (
  userID: string,
  email: string,
  name: string,
  image: string,
  memberType: string
): string => {
  const accessToken = signToken({ userID, email, name, image, memberType }, accessTokenSecret, "1d");

  return accessToken;
}

const generateRefreshToken = (
  userID: string,
): string => {
  const refreshToken = signToken({ userID }, refreshTokenSecret, "7d");

  return refreshToken;
}

export default {
  signIn,
  refreshToken,
};
