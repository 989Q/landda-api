import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateToken = (req: any, res: any, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      errors: [{ msg: "unauthorized" }],
    });
  }

  token = token.split(" ")[1];

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as {
      userID: string,
      email: string,
      image: string,
      name: string,
      access: string
    };

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [{ msg: "unauthorized" }],
    });
  }
};
