# ExpressAPI Documentation

### Getting Started

Before running the application, make sure to install the required dependencies using `pnpm`

## Run Application 

Start with Express
```bash
pnpm i

pnpm dev
```

## Authentication

This project utilizes `NextAuth` for authentication, allowing users to log in using their email addresses. The following login credentials are available for testing purposes

**Admin Account**
- email: admin123@gmail.com

**User Account**
- email: user123@gmail.com

## Security System

### Authentication Middleware

The application utilizes a token-based authentication system. Two middleware functions are implemented

- `validateToken:` This ensures the validity of the authentication token.
<!-- - `adminAccess:` Grants access to admin functionalities. -->
<!-- - `userAccess:` Grants access to user functionalities. -->

### Request Validation Middleware

limitParams

The `limitParams` function is implemented in middlewares/checkRequest.ts. It serves as a request middleware to limit and validate parameters in incoming requests. This ensures that the API handles requests with appropriate parameters, enhancing security and preventing potential issues.

## Additional Resources

> config/config.ts, utils/Logging.ts, server.ts/mongoose

RESTful API using Node JS, MongoDB & Typescript IN-DEPTH [2022] 
- https://www.youtube.com/watch?v=72_5_YuDCNA&t=661s

## Installation

Initialize the project
```bash
pnpm init 
```

Install Express and related dependencies
```bash
pnpm i @types/node ts-node
pnpm i nodemon 

pnpm i express
pnpm i --save-dev typescript @types/express

pnpm i jsonwebtoken
pnpm i --save-dev @types/jsonwebtoken

pnpm i cors
pnpm i --save-dev @types/cors

# terminal
pnpm i chalk@^4.1.2
```

Install MongoDB 
```bash
pnpm i dotenv mongoose
```

Install AWS SDK and Multer
```bash
pnpm i @aws-sdk/client-s3 
pnpm i multer 
pnpm i --save-dev @types/multer 
```

Install Stripe
```bash
pnpm i stripe
```
