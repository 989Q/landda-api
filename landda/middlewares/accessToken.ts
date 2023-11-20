import jwt, { JwtPayload } from "jsonwebtoken";

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
// 1 day - 86400000, 1 hour - 3600000, 1 min - 60000
export const setTimeToken = 86400000; 

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
    accessTokenSecret,
    "1d"
  );

  return accessToken;
};

export const createRefreshToken = (userId: string): string => {
  const refreshToken = signToken({ userId }, refreshTokenSecret, "7d");

  return refreshToken;
};
