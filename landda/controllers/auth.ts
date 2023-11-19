import User from "../models/user";
import { Request, Response } from "express";
import { signToken, verifyToken } from "../utils/generateToken";
import { generateUserId, addLetterId } from "../utils/generateId";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const setTime = 86400000; // 1 day - 86400000, 1 hour - 3600000, 1 min - 60000

const signIn = async (req: Request, res: Response) => {
  // console.log("req.body: ", req.body)
  const { logins, email, image, name } = req.body;
  const createdAt = new Date();
  const updatedAt = new Date();

  // generate unique userId
  const funcUniqueUserId = async () => {
    let userId = generateUserId();
    let addLetterCount = 0;
    let isUniqueUserId = false;

    while (!isUniqueUserId) {
      const existingUserId = await User.findOne({ "acc.userId": userId });
      if (!existingUserId) {
        isUniqueUserId = true;
      } else {
        addLetterCount += 2; // increment by 2 as per your requirement
        userId= generateUserId() + addLetterId(addLetterCount);
      }
    }

    return userId;
  };

  // generate unique userId
  const userId = await funcUniqueUserId();

  User.findOne({ "info.email": email })
    .then((existingUser) => {
      if (existingUser) {
        const accessToken = careteAccessToken(
          existingUser.acc.userId,
          existingUser.info.email,
          existingUser.info.image,
          existingUser.info.name,
          existingUser.subs.access
        );
        const refreshToken = createRefreshToken(existingUser.acc.userId);
        const userId = existingUser.acc.userId;
        const expires = Math.floor(Date.now() + setTime);
        const response = res
          .status(200)
          .json({ accessToken, refreshToken, userId, expires });

        // console.log("existingUser: ", response);
        return response;
      } else {
        const newUser = new User({
          acc: {
            userId,
            logins,
            createdAt,
            updatedAt,
          },
          info: {
            email,
            image,
            name,
          },
        });

        return newUser
          .save()
          .then((savedUser) => {
            const accessToken = careteAccessToken(
              savedUser.acc.userId,
              savedUser.info.email,
              savedUser.info.image,
              savedUser.info.name,
              savedUser.subs.access
            );
            const refreshToken = createRefreshToken(savedUser.acc.userId);
            const userId = savedUser.acc.userId;
            const expires = Math.floor(Date.now() + setTime);
            const response = res
              .status(201)
              .json({ accessToken, refreshToken, userId, expires });

            // console.log("newUser: ", response);
            return response;
          })
          .catch((error) => {
            console.log(error);
            return res.status(500);
          });
      }
    })
    .catch((error) => {
      console.log("signIn has error", error);
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

    User.findOne({ "acc.userId": decoded.userId })
      .then((userData) => {
        if (userData) {
          // create new accessToekn
          const newAccessToken = signToken(
            {
              userId: userData.acc.userId,
              email: userData.info.email,
              image: userData.info.image,
              name: userData.info.name,
              access: userData.subs.access,
            },
            accessTokenSecret,
            "1d"
          );
          // create new refreshToken
          const newRefreshToken = signToken(
            { userId: decoded.userId },
            refreshTokenSecret,
            "7d"
          );

          const newExpires = Math.floor(Date.now() + setTime);
          // send new response
          const response = res
            .status(201)
            .json({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              expires: newExpires,
            });

          // console.log("new refreshToken: ", response);
          return response;
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500);
      });
  } catch (error) {
    // console.log(error)
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token." });
  }
};

// ________________________________________ JWT Function

const careteAccessToken = (
  userId: string,
  email: string,
  image: string,
  name: string,
  access: string
): string => {
  const accessToken = signToken(
    { userId, email, image, name, access },
    accessTokenSecret,
    "1d"
  );

  return accessToken;
};

const createRefreshToken = (userId: string): string => {
  const refreshToken = signToken({ userId }, refreshTokenSecret, "7d");

  return refreshToken;
};

export default {
  signIn,
  refreshToken,
};
