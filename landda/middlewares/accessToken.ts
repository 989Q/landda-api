import { Request, Response, NextFunction } from "express";
import { tokenConfig } from "../configs/token";
import jwt, { JwtPayload } from "jsonwebtoken";

// ________________________________________ interface

export interface AuthRequest extends Request {
  userToken?: {
    userId?: string,
    email?: string,
    image?: string,
    access?: string, 
  };
}

// ________________________________________ function

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

export const validateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied." });
  }

  token = token.split(" ")[1];

  try {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      tokenConfig.accessTokenSecret
    ) as jwt.JwtPayload;

    req.userToken = {
      userId: decoded.userId,
      email: decoded.email,
      image: decoded.image,
      access: decoded.access,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error });
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
