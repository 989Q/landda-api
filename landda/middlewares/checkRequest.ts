import { Request, Response, NextFunction } from "express";

export const limitParams = (paramName: string, maxLength: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let paramValue = req.params[paramName];

    // truncate parameter to maximum length
    paramValue = paramValue.slice(0, maxLength);

    if (paramValue.length > maxLength) {
      return res
        .status(400)
        .json({ error: `The ${paramName} exceeds ${maxLength} characters.` });
    }

    // set truncated value back to request params
    req.params[paramName] = paramValue;

    // console.log(req.params[paramName])

    next();
  };
};
