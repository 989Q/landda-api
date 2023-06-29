// utils/signToken.ts

import jwt, { JwtPayload } from "jsonwebtoken";

// const privateKey = `MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHgnvr7O2tiApjJfid1orFnIGm69`;
// const publicKey = `80fZp+Lpbjo+NC/0whMFga2Biw5b1G2Q/B2u0tpO1Fs/E8z7Lv1nYfr5jx2S8x6B`;

// sign jwt
const signToken = (payload: JwtPayload, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

// verify jwt

// export function verifyJWT(token: string) {
//   try {
//     const decoded = jwt.verify(token, publicKey);
//     return { payload: decoded, expired: false };
//   } catch (error) {
//     return { payload: null, expired: error.message.includes("jwt expired") };
//   }
// }

const verifyToken = (token: string, secret: string): JwtPayload | string => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    return "Invalid token";
  }
};

export { signToken, verifyToken };