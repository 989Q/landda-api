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
      userID: string;
      email: string;
      name: string;
    };

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [{ msg: "unauthorized" }],
    });
  }
};

// export const validateToken_2 = (req: any, res: any, next: NextFunction) => {
//   let token = req.headers.authorization;

//   if (!token) {
//     return res.status(403).json({
//       errors: [{ message: "unauthorized" }],
//     });
//   }

//   token = token.split(" ")[1];

//   try {
//     jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET as string,
//       (err: any, decoded: any) => {
//         if (err) {
//           return res.status(403).json({ errors: [{ message: "Forbidden" }] });
//         }

//         req.user = {
//           userID: decoded.userID,
//           email: decoded.email,
//         };
//         next();
//       }
//     );
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
