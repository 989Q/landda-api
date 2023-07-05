// utils/signToken.ts

import jwt, { JwtPayload } from "jsonwebtoken";

// sign jwt
const signToken = (payload: JwtPayload, secret: any, expiresIn: string): any => {
  return jwt.sign(payload, secret, { expiresIn });
};

// verify jwt
const verifyToken = (token: string, secret: any): JwtPayload | any => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    return "Invalid token";
  }
};

export { signToken, verifyToken };

// ________________________________________ calculate time

// ...