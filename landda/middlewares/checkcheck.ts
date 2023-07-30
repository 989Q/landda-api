import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";

// export function requireUser(req: Request, res: Response, next: NextFunction) {
//   // @ts-ignore
//   if (!req.user) {
//     return res.status(403).send("Invalid session");
//   }

//   return next()
// }

export const checkAuth = async (req: any, res: any, next: NextFunction) => {
  let token = req.header("authorization");

  if (!token) {
    return res.status(403).json({
      errors: [
        {
          msg: "unauthorized",
        },
      ],
    });
  }

  token = token.split(" ")[1];

  try {
    const user = (await JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    )) as { email: string };

    req.user = user.email;
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [
        {
          msg: "unauthorized",
        },
      ],
    });
  }
};
