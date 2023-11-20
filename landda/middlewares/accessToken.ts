import jwt, { JwtPayload } from "jsonwebtoken";
import { tokenConfig } from "../configs/token";

export const signToken = (
  payload: JwtPayload,
  secret: any,
  expiresIn: string
): any => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: any): JwtPayload | any => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    return "Invalid token";
  }
};

export const careteAccessToken = (
  userId: string,
  email: string,
  image: string,
  name: string,
  access: string
): string => {
  const accessToken = signToken(
    { userId, email, image, name, access },
    tokenConfig.accessTokenSecret,
    "1d"
  );

  return accessToken;
};

export const createRefreshToken = (userId: string): string => {
  const refreshToken = signToken({ userId }, tokenConfig.refreshTokenSecret, "7d");

  return refreshToken;
};
