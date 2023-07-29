
It feels like I'm not very good at coding, refreshToken is back in refreshToken again.

```ts
import { Request, Response } from "express";
import User from "../models/User";
import { generateUniqueuserID } from "../utils/id-generator";
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
          existingUser.account.userID,
          existingUser.profile.email,
          existingUser.profile.name,
          existingUser.profile.image,
          existingUser.membership.memberType
        );
        const refreshToken = generateRefreshToken(
          existingUser.account.userID,
        )

        const userID = existingUser.account.userID;
        // const exp = Math.floor(Date.now() / 1000) + 3600 // Set expiration to 1 hour (in seconds)
        const exp = Math.floor((Date.now() / 1000) + (6 * 3600));

        const response = res.status(200).json({ token, refreshToken, userID, exp});
        console.log("existingUser response: ", { token, refreshToken, userID, exp });
        return response;
      } else {
        const userID = generateUniqueuserID(); 
        const newUser = new User({
          account: {
            userID,
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
              savedUser.account.userID,
              savedUser.profile.email,
              savedUser.profile.name,
              savedUser.profile.image,
              savedUser.membership.memberType
            );
            const refreshToken = generateRefreshToken(
              savedUser.account.userID,
            )
            const userID = savedUser.account.userID;
            // const exp = Math.floor(Date.now() / 1000) + 3600 // Set expiration to 1 hour (in seconds)
            const exp = Math.floor((Date.now() / 1000) + (6 * 3600));

            const response = res.status(201).json({ token, refreshToken, userID, exp });
            console.log("user token response: ", { token, refreshToken, userID, exp });
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

const generateToken = (
  userID: string,
  email: string,
  name: string,
  image: string,
  memberType: string
): { accessToken: string } => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "Z2VuZXJh-ZGV0YWls-Z3VhcmRo-cXVpY2ty";
  const accessTokenPayload = { userID, email, name, image, memberType };
  const accessToken = signToken(accessTokenPayload, accessTokenSecret, "6h");

  return { accessToken };
}

const generateRefreshToken = (
  userID: string,
): { refreshToken: string } => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "c3Rvb2Rw-d2hlcmVw-Z2l2ZW5y-c2hha2Vz";
  const refreshTokenPayload = { userID };
  const refreshToken = signToken(refreshTokenPayload, refreshTokenSecret, "7d");

  return { refreshToken };
}

export default {
  signIn,
};

```

get response
```json
  existingUser response:  {
    token: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzNW45LTQyOXkteDM0biIsImVtYWlsIjoic2luc2FtdXRxQGdtYWlsLmNvbSIsIm5hbWUiOiJ3YXNpbiBrYWV3cGx1bmciLCJpbWFnZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVxX0c5VXBWWkJqRjRjdXgwMnJRbk4xRkkxcS0zV1haQzZoc3NqPXM5Ni1jIiwibWVtYmVyVHlwZSI6Ik1lbWJlciIsImlhdCI6MTY4ODAzMDY3MSwiZXhwIjoxNjg4MDUyMjcxfQ.oPcsiRo-W8RTIq6K32hBy9avE4lVkr-hw9XE_u6cewE'
    },
    refreshToken: {
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzNW45LTQyOXkteDM0biIsImlhdCI6MTY4ODAzMDY3MSwiZXhwIjoxNjg4NjM1NDcxfQ.yKUbqFJLNQ0HwHxptkia2OG7eHcx26HS03A6cUXPfws'
    },
    userID: 's5n9-429y-x34n',
    exp: 1688052271
  }
```

want this
```json
  existingUser response:  {
    token: accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzNW45LTQyOXkteDM0biIsImVtYWlsIjoic2luc2FtdXRxQGdtYWlsLmNvbSIsIm5hbWUiOiJ3YXNpbiBrYWV3cGx1bmciLCJpbWFnZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVxX0c5VXBWWkJqRjRjdXgwMnJRbk4xRkkxcS0zV1haQzZoc3NqPXM5Ni1jIiwibWVtYmVyVHlwZSI6Ik1lbWJlciIsImlhdCI6MTY4ODAzMDY3MSwiZXhwIjoxNjg4MDUyMjcxfQ.oPcsiRo-W8RTIq6K32hBy9avE4lVkr-hw9XE_u6cewE'
    refreshToken: refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzNW45LTQyOXkteDM0biIsImlhdCI6MTY4ODAzMDY3MSwiZXhwIjoxNjg4NjM1NDcxfQ.yKUbqFJLNQ0HwHxptkia2OG7eHcx26HS03A6cUXPfws'
    userID: 's5n9-429y-x34n',
    exp: 1688052271
  }
```
