import { Request, Response } from "express";
import User from "../models/User";
import { generateUniqueUserId } from "../utils/id-generator";
import { signToken, verifyToken } from "../utils/signToken";

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
        const token = generateToken(
          existingUser.account.userId,
          existingUser.profile.email,
          existingUser.profile.name,
          existingUser.profile.image,
          existingUser.membership.memberType
        );
        const refreshToken = generateRefreshToken(
          existingUser.account.userId,
        )
        const userId = existingUser.account.userId;
        // const exp = Math.floor(Date.now() / 1000) + 3600 // Set expiration to 1 hour (in seconds)
        const exp = Math.floor((Date.now() / 1000) + (6 * 3600)); // 6 hour

        const response = res.status(200).json({ token, refreshToken, userId, exp });
        console.log("existingUser response: ", { token, refreshToken, userId, exp });
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
            const token = generateToken(
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
            const exp = Math.floor((Date.now() / 1000) + (6 * 3600)); 

            const response = res.status(201).json({ token, refreshToken, userId, exp });
            console.log("newUser response: ", { token, refreshToken, userId, exp });
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
    // Verify the refresh token
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "c3Rvb2Rw-d2hlcmVw-Z2l2ZW5y-c2hha2Vz";
    const decoded = verifyToken(refreshToken, refreshTokenSecret) as any;

    // Generate a new access token
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "Z2VuZXJh-ZGV0YWls-Z3VhcmRo-cXVpY2ty";
    const accessToken = signToken({ 
      userId: decoded.userId, 
      email: decoded.email, 
      name: decoded.name, 
      image: decoded.image, 
      memberType: decoded.memberType
    }, accessTokenSecret, "6h");

    // Set the expiration time
    const exp = Math.floor(Date.now() / 1000) + 6 * 3600;

    // Generate a new refresh token
    const newRefreshToken = signToken({ userId: decoded.userId }, refreshTokenSecret, "7d");

    // Send the new access token, expiration time, and refresh token in the response
    res.json({ accessToken, exp, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};

// ________________________________________ JWT 

const generateToken = (
  userId: string,
  email: string,
  name: string,
  image: string,
  memberType: string
): string => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "Z2VuZXJh-ZGV0YWls-Z3VhcmRo-cXVpY2ty";
  const accessTokenPayload = { userId, email, name, image, memberType };
  const accessToken = signToken(accessTokenPayload, accessTokenSecret, "6h");

  return accessToken;
}

const generateRefreshToken = (
  userId: string,
): string => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "c3Rvb2Rw-d2hlcmVw-Z2l2ZW5y-c2hha2Vz";
  const refreshTokenPayload = { userId };
  const refreshToken = signToken(refreshTokenPayload, refreshTokenSecret, "7d");

  return refreshToken;
}

export default {
  signIn,
  refreshToken,
};
