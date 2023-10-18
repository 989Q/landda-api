// controllers/Auth.ts

import User from "../models/user";
import { Request, Response } from "express";
import { stripe } from "../middlewares/stripe";
import { signToken, verifyToken } from "../utils/generateToken";
import { generateUserID, addLetterID } from "../utils/generateID";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const setTime = 86400000 // 1 day - 86400000, 1 hour - 3600000, 1 min - 60000

const signIn = async (req: Request, res: Response) => {
  // console.log('req.body: ', req.body)
  const { logins, email, image, name } = req.body;
  const createdAt = new Date();
  const updatedAt = new Date();

  const stripeCustomer = await stripe.customers.create({
    email 
  }, {
    apiKey: process.env.STRIPE_SECRET_KEY
  })
  const stripeID = stripeCustomer.id

  // generate unique userID
  const generateUniqueUserID = async () => {
    let userID = generateUserID();
    let addLetterCount = 0;
    let isUniqueUserID = false;

    while (!isUniqueUserID) {
      const existingUserID = await User.findOne({ 'acc.userID': userID });
      if (!existingUserID) {
        isUniqueUserID = true;
      } else {
        addLetterCount += 2; // increment by 2 as per your requirement
        userID = generateUserID() + addLetterID(addLetterCount);
      }
    }

    return userID;
  };

  // generate unique userID
  const userID = await generateUniqueUserID();
  
  User.findOne({ "info.email": email })
    .then((existingUser) => {
      if (existingUser) {
        const accessToken = careteAccessToken(
          existingUser.acc.userID,
          existingUser.info.email,
          existingUser.info.image,
          existingUser.info.name,
          existingUser.subs.access
        );
        const refreshToken = createRefreshToken(existingUser.acc.userID)
        const userID = existingUser.acc.userID;
        const expires = Math.floor(Date.now() + setTime);
        const response = res.status(200).json({ accessToken, refreshToken, userID, expires });

        // console.log("existingUser: ", response);
        return response;
      } else {
        const newUser = new User({
          acc: {
            userID,
            logins,
            createdAt,
            updatedAt,
          },
          info: {
            email,
            image,
            name,
          },
          subs: {
            stripeID,
          },
        });

        return newUser
          .save()
          .then((savedUser) => {
            const accessToken = careteAccessToken(
              savedUser.acc.userID,
              savedUser.info.email,
              savedUser.info.image,
              savedUser.info.name,
              savedUser.subs.access
            );
            const refreshToken = createRefreshToken(
              savedUser.acc.userID,
            )
            const userID = savedUser.acc.userID;
            const expires = Math.floor(Date.now() + setTime);
            const response = res.status(201).json({ accessToken, refreshToken, userID, expires });

            // console.log("newUser: ", response);
            return response;
          })
          .catch((error) => {
            console.log(error)
            return res.status(500);
          });
      }
    })
    .catch((error) => {
      console.log('signIn has error', error)
      return res.status(500);
    });
};

const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  try {
    // vertify refreshToken
    const decoded = verifyToken(refreshToken, refreshTokenSecret) as any;

    User.findOne({ "acc.userID": decoded.userID })
      .then((userData) => {
        if (userData) {
          // create new accessToekn
          const newAccessToken = signToken({ 
            userID: userData.acc.userID, 
            email: userData.info.email, 
            image: userData.info.image, 
            name: userData.info.name, 
            access: userData.subs.access
          }, accessTokenSecret, "1d");
          // create new refreshToken
          const newRefreshToken = signToken({ userID: decoded.userID }, refreshTokenSecret, "7d");
          
          const newExpires = Math.floor(Date.now() + setTime); 
          // send new response
          const response = res.status(201).json({ accessToken: newAccessToken, refreshToken: newRefreshToken, expires: newExpires });

          // console.log("new refreshToken: ", response);
          return response;
        }
      })
      .catch((error) => {
        console.log(error)
        return res.status(500);
      });
  } catch (error) {
    // console.log(error)
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};

// ________________________________________ JWT Function

const careteAccessToken = (
  userID: string,
  email: string,
  image: string,
  name: string,
  access: string
): string => {
  const accessToken = signToken({ userID, email, image, name, access }, accessTokenSecret, "1d");

  return accessToken;
}

const createRefreshToken = (
  userID: string,
): string => {
  const refreshToken = signToken({ userID }, refreshTokenSecret, "7d");

  return refreshToken;
}

export default {
  signIn,
  refreshToken,
};
